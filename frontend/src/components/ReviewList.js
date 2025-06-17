import StarRating from "./StarRating"

const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="card">
        <h3>Reviews</h3>
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>Reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <div>
              <div className="review-author">{review.username}</div>
              {review.rating && <StarRating rating={review.rating} readOnly />}
            </div>
            <div className="review-date">{new Date(review.created_at).toLocaleDateString()}</div>
          </div>

          {review.review_text && <div className="review-text">{review.review_text}</div>}

          {review.tags && review.tags.length > 0 && (
            <div className="review-tags">
              {review.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReviewList
