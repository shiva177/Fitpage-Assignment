const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") })

async function setupDatabase() {
  console.log("=== Database Setup Script ===")

  let connection

  try {
    // Connect to MySQL server
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
    })

    console.log("✅ Connected to MySQL server")

    // Create database
    await connection.execute("CREATE DATABASE IF NOT EXISTS ratings_review_db")
    await connection.execute("USE ratings_review_db")
    console.log("✅ Database created/selected")

    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `)

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        image_url VARCHAR(500),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `)

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS review_tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        review_id INT NOT NULL,
        tag VARCHAR(50) NOT NULL,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
      )
    `)

    console.log("✅ Tables created")

    // Clear existing data
    await connection.execute("DELETE FROM review_tags")
    await connection.execute("DELETE FROM reviews")
    await connection.execute("DELETE FROM products")
    await connection.execute("DELETE FROM users")

    // Insert sample data
    console.log("📝 Inserting sample data...")

    // Insert users (password is 'password123' hashed)
    await connection.execute(`
      INSERT INTO users (username, email, password_hash) VALUES
      ('testuser', 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
      ('johndoe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
      ('janedoe', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
    `)

    // Insert products
    await connection.execute(`
      INSERT INTO products (name, description, price, image_url, category) VALUES
      ('iPhone 15 Pro', 'Latest Apple smartphone with advanced camera system and A17 Pro chip', 999.99, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'Electronics'),
      ('MacBook Air M2', 'Lightweight laptop with M2 chip and all-day battery life', 1199.99, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', 'Electronics'),
      ('AirPods Pro', 'Wireless earbuds with active noise cancellation', 249.99, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'Electronics'),
      ('Nike Air Max', 'Comfortable running shoes with excellent cushioning', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Footwear'),
      ('Samsung Galaxy S24', 'Android smartphone with great camera and performance', 899.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'Electronics')
    `)

    // Insert sample reviews
    await connection.execute(`
      INSERT INTO reviews (user_id, product_id, rating, review_text) VALUES
      (1, 1, 5, 'Amazing phone! The camera quality is outstanding and battery life is excellent.'),
      (2, 1, 4, 'Great phone overall, but quite expensive. Camera is the highlight.'),
      (1, 2, 5, 'Perfect laptop for development work. Fast and reliable.'),
      (3, 3, 5, 'Best earbuds I have used. Noise cancellation is incredible.'),
      (2, 4, 4, 'Very comfortable shoes for running. Good value for money.')
    `)

    // Insert sample tags
    await connection.execute(`
      INSERT INTO review_tags (review_id, tag) VALUES
      (1, 'camera'), (1, 'battery'), (1, 'premium'),
      (2, 'expensive'), (2, 'camera'),
      (3, 'fast'), (3, 'reliable'), (3, 'development'),
      (4, 'noise-cancellation'), (4, 'quality'),
      (5, 'comfortable'), (5, 'value')
    `)

    // Verify data
    const [products] = await connection.execute("SELECT COUNT(*) as count FROM products")
    const [users] = await connection.execute("SELECT COUNT(*) as count FROM users")
    const [reviews] = await connection.execute("SELECT COUNT(*) as count FROM reviews")

    console.log("📊 Database Statistics:")
    console.log(`   Products: ${products[0].count}`)
    console.log(`   Users: ${users[0].count}`)
    console.log(`   Reviews: ${reviews[0].count}`)

    console.log("✅ Database setup completed successfully!")
    console.log("🔑 Test Account: test@example.com / password123")
  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

setupDatabase()
