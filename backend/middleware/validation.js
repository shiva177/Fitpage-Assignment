const Joi = require("joi")

const validateReview = (req, res, next) => {
  const schema = Joi.object({
    product_id: Joi.number().integer().positive().required(),
    rating: Joi.number().integer().min(1).max(5),
    review_text: Joi.string().min(1).max(1000),
    images: Joi.array().items(Joi.string()),
  }).or("rating", "review_text")

  const { error } = schema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })

  const { error } = schema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

module.exports = { validateReview, validateUser }
