const db = require("../config/database")

const getAllProducts = async (req, res) => {
  try {
    console.log("=== Fetching all products ===")

    // First, let's check if products table has data
    const [productCount] = await db.execute("SELECT COUNT(*) as count FROM products")
    console.log("Products in database:", productCount[0].count)

    if (productCount[0].count === 0) {
      console.log("No products found in database")
      return res.json([])
    }

    // Get products with ratings
    const [products] = await db.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id, p.name, p.description, p.price, p.image_url, p.category, p.created_at
      ORDER BY p.created_at DESC
    `)

    console.log(`Found ${products.length} products`)

    // Format the response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number.parseFloat(product.price),
      image_url: product.image_url,
      category: product.category,
      created_at: product.created_at,
      average_rating: Number.parseFloat(product.average_rating),
      review_count: Number.parseInt(product.review_count),
    }))

    console.log("Sending products:", formattedProducts.length)
    res.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`=== Fetching product ${id} ===`)

    // Validate ID
    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({ error: "Invalid product ID" })
    }

    const [products] = await db.execute(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id, p.name, p.description, p.price, p.image_url, p.category, p.created_at
    `,
      [id],
    )

    if (products.length === 0) {
      console.log(`Product ${id} not found`)
      return res.status(404).json({ error: "Product not found" })
    }

    const product = {
      id: products[0].id,
      name: products[0].name,
      description: products[0].description,
      price: Number.parseFloat(products[0].price),
      image_url: products[0].image_url,
      category: products[0].category,
      created_at: products[0].created_at,
      average_rating: Number.parseFloat(products[0].average_rating),
      review_count: Number.parseInt(products[0].review_count),
    }

    console.log("Sending product:", product)
    res.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
}
