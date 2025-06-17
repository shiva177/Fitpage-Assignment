"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import StarRating from "./StarRating"

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!rating && !reviewText.trim()) {
      newErrors.general = "Please provide either a rating or a review text"
    }

    if (reviewText.trim() && reviewText.trim().length < 10) {
      newErrors.reviewText = "Review text must be at least 10 characters long"
    }

    if (reviewText.trim() && reviewText.trim().length > 1000) {
      newErrors.reviewText = "Review text must be less than 1000 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const reviewData = {
        product_id: Number.parseInt(productId),
        rating: rating || null,
        review_text: reviewText.trim() || null,
      }

      await axios.post("/api/reviews", reviewData)
      onReviewSubmitted()
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to submit review"
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && <div className="error">{errors.general}</div>}

      <div className="form-group">
        <label>Rating (optional)</label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div className="form-group">
        <label htmlFor="reviewText">Review (optional)</label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience with this product..."
          rows="4"
        />
        {errors.reviewText && <div className="error">{errors.reviewText}</div>}
        <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>{reviewText.length}/1000 characters</div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  )
}

export default ReviewForm
