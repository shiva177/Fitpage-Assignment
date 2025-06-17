const db = require("../config/database")

const createReview = async (req, res) => {
  try {
    const { product_id, rating, review_text, images } = req.body
    const user_id = req.user.id

    // Check if user already reviewed this product
    const [existing] = await db.execute("SELECT id FROM reviews WHERE user_id = ? AND product_id = ?", [
      user_id,
      product_id,
    ])

    if (existing.length > 0) {
      return res.status(400).json({ error: "You have already reviewed this product" })
    }

    let imagesJson = "[]"
    if (images && Array.isArray(images)) {
      imagesJson = JSON.stringify(images)
    }

    // Insert review
    const [result] = await db.execute(
      "INSERT INTO reviews (user_id, product_id, rating, review_text, images) VALUES (?, ?, ?, ?, ?)",
      [user_id, product_id, rating || null, review_text || null, imagesJson],
    )

    if (review_text) {
      const tags = extractTags(review_text)
      for (const tag of tags) {
        await db.execute("INSERT INTO review_tags (review_id, tag) VALUES (?, ?)", [result.insertId, tag])
      }
    }

    res.status(201).json({ message: "Review created successfully", id: result.insertId })
  } catch (error) {
    console.error("Error creating review:", error)
    res.status(500).json({ error: "Internal server error", details: error.message })
  }
}

const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId

    console.log("Fetching reviews for product:", productId)

    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ error: "Invalid product ID" })
    }

    const [productCheck] = await db.execute("SELECT id FROM products WHERE id = ?", [productId])

    if (productCheck.length === 0) {
      return res.status(404).json({ error: "Product not found" })
    }

    const [reviews] = await db.execute(
      `
      SELECT 
        r.id,
        r.rating,
        r.review_text,
        r.images,
        r.created_at,
        u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `,
      [productId],
    )

    console.log("Found reviews:", reviews.length)

    const reviewsWithTags = []
    for (const review of reviews) {
  
      let parsedImages = []
      if (review.images) {
        try {
          if (Array.isArray(review.images)) {
            parsedImages = review.images
          } else if (typeof review.images === "string") {
          
            parsedImages = JSON.parse(review.images)
          }
        } catch (jsonError) {
          console.error("Error parsing images JSON for review", review.id, ":", jsonError.message)
          console.error("Raw images data:", review.images)
          parsedImages = [] 
        }
      }

      const [tags] = await db.execute("SELECT tag FROM review_tags WHERE review_id = ?", [review.id])

      reviewsWithTags.push({
        id: review.id,
        rating: review.rating,
        review_text: review.review_text,
        created_at: review.created_at,
        username: review.username,
        images: parsedImages,
        tags: tags.map((t) => t.tag),
      })
    }

    res.json(reviewsWithTags)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

const getPopularTags = async (req, res) => {
  try {
    const productId = req.params.productId

    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ error: "Invalid product ID" })
    }

    const [tags] = await db.execute(
      `
      SELECT rt.tag, COUNT(*) as count
      FROM review_tags rt
      JOIN reviews r ON rt.review_id = r.id
      WHERE r.product_id = ?
      GROUP BY rt.tag
      ORDER BY count DESC
    `,
      [productId],
    )
    const topTags = tags.slice(0, 10)

    res.json(topTags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    res.status(500).json({ error: "Internal server error", details: error.message })
  }
}

const extractTags = (text) => {
  if (!text || typeof text !== "string") return []

  const commonWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
  ]

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.includes(word))

  const wordCount = {}
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })

  return Object.keys(wordCount)
    .filter((word) => wordCount[word] >= 1)
    .slice(0, 5)
}

module.exports = {
  createReview,
  getProductReviews,
  getPopularTags,
}
