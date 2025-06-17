"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../config/api"
import StarRating from "./StarRating"
import ReviewForm from "./ReviewForm"
import ReviewList from "./ReviewList"
import { useAuth } from "../context/AuthContext"

const ProductDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    fetchProduct()
    fetchReviews()
    fetchTags()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      toast.error("Failed to fetch product details")
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/product/${id}`)
      setReviews(response.data)
    } catch (error) {
      toast.error("Failed to fetch reviews")
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await api.get(`/reviews/product/${id}/tags`)
      setTags(response.data)
    } catch (error) {
      console.error("Failed to fetch tags")
    }
  }

  const handleReviewSubmitted = () => {
    setShowReviewForm(false)
    fetchProduct()
    fetchReviews()
    fetchTags()
    toast.success("Review submitted successfully!")
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return <div className="error">Product not found</div>
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          <img
            src={product.image_url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            style={{ width: "300px", height: "300px", objectFit: "cover", borderRadius: "8px" }}
          />
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h1>{product.name}</h1>
            <p className="product-price">${Number.parseFloat(product.price).toFixed(2)}</p>
            <div className="product-rating" style={{ marginBottom: "15px" }}>
              <StarRating rating={Number.parseFloat(product.average_rating)} readOnly />
              <span>({product.review_count} reviews)</span>
            </div>
            <p style={{ marginBottom: "20px" }}>{product.description}</p>

            {tags.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4>Popular Tags:</h4>
                <div className="review-tags">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag.tag} ({tag.count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user ? (
              <button onClick={() => setShowReviewForm(true)} className="btn btn-primary">
                Write a Review
              </button>
            ) : (
              <p>
                Please <a href="/login">login</a> to write a review.
              </p>
            )}
          </div>
        </div>
      </div>

      {showReviewForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Write a Review</h3>
              <button onClick={() => setShowReviewForm(false)} className="close-btn">
                ×
              </button>
            </div>
            <ReviewForm productId={id} onReviewSubmitted={handleReviewSubmitted} />
          </div>
        </div>
      )}

      <ReviewList reviews={reviews} />
    </div>
  )
}

export default ProductDetail
