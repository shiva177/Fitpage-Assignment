const express = require("express")
const router = express.Router()
const { createReview, getProductReviews, getPopularTags } = require("../controllers/reviewController")
const { authenticateToken } = require("../middleware/auth")
const { validateReview } = require("../middleware/validation")

router.post("/", authenticateToken, validateReview, createReview)
router.get("/product/:productId", getProductReviews)
router.get("/product/:productId/tags", getPopularTags)

module.exports = router
