"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../config/api"
import StarRating from "./StarRating"

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get("/products")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to fetch products. Please make sure the backend server is running.")
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="card">
          <h2>⚠️ Unable to Load Products</h2>
          <p style={{ color: "#dc3545", marginBottom: "20px" }}>{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary">
            🔄 Retry
          </button>
          <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
            <p>
              <strong>Troubleshooting:</strong>
            </p>
            <ol style={{ textAlign: "left", display: "inline-block" }}>
              <li>
                Make sure backend is running: <code>cd backend && npm run dev</code>
              </li>
              <li>
                Check:{" "}
                <a href="http://localhost:5009/api/health" target="_blank" rel="noopener noreferrer">
                  http://localhost:5009/api/health
                </a>
              </li>
              <li>
                Setup database: <code>node scripts/setup-database.js</code>
              </li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Products ({products.length})</h1>
        <button onClick={fetchProducts} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {products.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <h3>No Products Available</h3>
          <p>Please run the database setup script to add sample products.</p>
          <code>node scripts/setup-database.js</code>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image_url || "/placeholder.svg?height=200&width=300"}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=200&width=300"
                }}
              />
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">${Number.parseFloat(product.price).toFixed(2)}</p>
                <div className="product-rating">
                  <StarRating rating={Number.parseFloat(product.average_rating)} readOnly />
                  <span>({product.review_count} reviews)</span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "15px",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.description}
                </p>
                <Link to={`/product/${product.id}`} className="btn btn-primary">
                  View Details & Reviews
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList
