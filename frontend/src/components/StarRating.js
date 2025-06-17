"use client"

import { useState } from "react"
import { Star } from "lucide-react"

const StarRating = ({ rating = 0, onRatingChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0)
    }
  }

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          className={`star ${star <= (hoverRating || rating) ? "filled" : ""}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: readOnly ? "default" : "pointer",
            fill: star <= (hoverRating || rating) ? "#ffc107" : "none",
            color: star <= (hoverRating || rating) ? "#ffc107" : "#ddd",
          }}
        />
      ))}
    </div>
  )
}

export default StarRating
