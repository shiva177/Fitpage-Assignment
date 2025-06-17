const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../config/database")

const register = async (req, res) => {
  try {
    console.log("=== Registration Request ===")
    console.log("Request body:", req.body)
    console.log("Headers:", req.headers)

    const { username, email, password } = req.body

1
    if (!username || !email || !password) {
      console.log("Registration failed: Missing fields")
      return res.status(400).json({ error: "All fields are required" })
    }

    if (username.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters long" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" })
    }

    // Check if user exists
    console.log("Checking if user exists...")
    const [existing] = await db.execute("SELECT id, username, email FROM users WHERE email = ? OR username = ?", [
      email,
      username,
    ])

    if (existing.length > 0) {
      console.log("Registration failed: User already exists", existing[0])
      const existingUser = existing[0]
      if (existingUser.email === email) {
        return res.status(400).json({ error: "User with this email already exists" })
      } else {
        return res.status(400).json({ error: "Username is already taken" })
      }
    }

    // Hash password
    console.log("Hashing password...")
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Create user
    console.log("Creating user in database...")
    const [result] = await db.execute("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [
      username,
      email,
      password_hash,
    ])

    console.log("User created with ID:", result.insertId)

    // Generate token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not found in environment variables")
      return res.status(500).json({ error: "Server configuration error" })
    }

    const userData = {
      id: result.insertId,
      username,
      email,
    }

    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "24h" })

    console.log("Registration successful for:", email)

    // Consistent response format
    res.status(201).json({
      message: "User created successfully",
      token,
      user: userData,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

const login = async (req, res) => {
  try {
    console.log("=== Login Request ===")
    console.log("Request body:", { email: req.body.email })

    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    console.log("Looking for user with email:", email)
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      console.log("Login failed: User not found")
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const user = users[0]
    console.log("User found:", { id: user.id, username: user.username, email: user.email })

    // Check password
    console.log("Verifying password...")
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      console.log("Login failed: Invalid password")
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Generate token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not found in environment variables")
      return res.status(500).json({ error: "Server configuration error" })
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
    }

    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "24h" })

    console.log("Login successful for:", email)

    res.json({
      message: "Login successful",
      token,
      user: userData,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

module.exports = { register, login }
