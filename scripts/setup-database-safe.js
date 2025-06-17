const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") })

async function setupDatabase() {
  console.log("=== Safe Database Setup Script ===")
  console.log("This script will safely reset and populate the database")

  let connection

  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    })

    console.log("✅ Connected to MySQL server")

    // Create database if it doesn't exist
    await connection.execute("CREATE DATABASE IF NOT EXISTS ratings_review_db")
    await connection.execute("USE ratings_review_db")
    console.log("✅ Database selected")

    // Disable foreign key checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0")

    // Create tables
    console.log("📋 Creating tables...")

    const createTables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username)
      )`,
      `CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        image_url VARCHAR(500),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_name (name)
      )`,
      `CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id),
        INDEX idx_product_id (product_id),
        INDEX idx_user_id (user_id),
        INDEX idx_rating (rating),
        INDEX idx_created_at (created_at)
      )`,
      `CREATE TABLE IF NOT EXISTS review_tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        review_id INT NOT NULL,
        tag VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
        INDEX idx_tag (tag),
        INDEX idx_review_id (review_id)
      )`,
    ]

    for (const sql of createTables) {
      await connection.execute(sql)
    }

    console.log("✅ Tables created successfully")

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await connection.execute("DELETE FROM review_tags")
    await connection.execute("DELETE FROM reviews")
    await connection.execute("DELETE FROM products")
    await connection.execute("DELETE FROM users")

    // Reset auto increment
    await connection.execute("ALTER TABLE users AUTO_INCREMENT = 1")
    await connection.execute("ALTER TABLE products AUTO_INCREMENT = 1")
    await connection.execute("ALTER TABLE reviews AUTO_INCREMENT = 1")
    await connection.execute("ALTER TABLE review_tags AUTO_INCREMENT = 1")

    console.log("✅ Data cleared and counters reset")

    // Insert sample data
    console.log("📝 Inserting sample data...")

    // Insert users
    const users = [
      ["testuser", "test@example.com", "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"],
      ["johndoe", "john@example.com", "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"],
      ["janedoe", "jane@example.com", "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"],
    ]

    for (const [username, email, password_hash] of users) {
      await connection.execute("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [
        username,
        email,
        password_hash,
      ])
    }

    console.log("✅ Users inserted")

    // Insert products
    const products = [
      [
        "iPhone 15 Pro",
        "Latest Apple smartphone with advanced camera system, A17 Pro chip, and titanium design. Perfect for photography and gaming.",
        999.99,
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        "Electronics",
      ],
      [
        "MacBook Air M2",
        "Lightweight laptop with M2 chip, 13.6-inch Liquid Retina display, and all-day battery life. Ideal for work and creativity.",
        1199.99,
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
        "Electronics",
      ],
      [
        "AirPods Pro (2nd Gen)",
        "Wireless earbuds with active noise cancellation, spatial audio, and adaptive transparency mode.",
        249.99,
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
        "Electronics",
      ],
      [
        "Nike Air Max 270",
        "Comfortable running shoes with Max Air unit for exceptional cushioning and modern style.",
        129.99,
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        "Footwear",
      ],
      [
        "Samsung Galaxy S24 Ultra",
        "Android smartphone with S Pen, 200MP camera, and AI-powered features for productivity.",
        1199.99,
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        "Electronics",
      ],
    ]

    for (const [name, description, price, image_url, category] of products) {
      await connection.execute(
        "INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)",
        [name, description, price, image_url, category],
      )
    }

    console.log("✅ Products inserted")

    // Insert reviews
    const reviews = [
      [1, 1, 5, "Amazing phone! The camera quality is outstanding and the battery life is excellent."],
      [2, 1, 4, "Great phone overall, but quite expensive. The camera is definitely the highlight."],
      [1, 2, 5, "Perfect laptop for development work. The M2 chip is incredibly fast and the battery lasts all day."],
      [3, 2, 4, "Love the portability and performance. The screen is beautiful and keyboard feels great."],
      [2, 3, 5, "Best earbuds I have ever used. The noise cancellation is incredible and they fit perfectly."],
    ]

    for (const [user_id, product_id, rating, review_text] of reviews) {
      await connection.execute("INSERT INTO reviews (user_id, product_id, rating, review_text) VALUES (?, ?, ?, ?)", [
        user_id,
        product_id,
        rating,
        review_text,
      ])
    }

    console.log("✅ Reviews inserted")

    // Insert tags
    const tags = [
      [1, "camera"],
      [1, "battery"],
      [1, "premium"],
      [2, "expensive"],
      [2, "camera"],
      [3, "fast"],
      [3, "battery"],
      [3, "development"],
      [4, "portable"],
      [4, "screen"],
      [5, "noise-cancellation"],
      [5, "quality"],
    ]

    for (const [review_id, tag] of tags) {
      await connection.execute("INSERT INTO review_tags (review_id, tag) VALUES (?, ?)", [review_id, tag])
    }

    console.log("✅ Tags inserted")

    // Re-enable foreign key checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1")

    // Verify data
    const [products_count] = await connection.execute("SELECT COUNT(*) as count FROM products")
    const [users_count] = await connection.execute("SELECT COUNT(*) as count FROM users")
    const [reviews_count] = await connection.execute("SELECT COUNT(*) as count FROM reviews")
    const [tags_count] = await connection.execute("SELECT COUNT(*) as count FROM review_tags")

    console.log("\n📊 Database Statistics:")
    console.log(`   Products: ${products_count[0].count}`)
    console.log(`   Users: ${users_count[0].count}`)
    console.log(`   Reviews: ${reviews_count[0].count}`)
    console.log(`   Tags: ${tags_count[0].count}`)

    console.log("\n✅ Database setup completed successfully!")
    console.log("\n🔑 Test Account:")
    console.log("   Email: test@example.com")
    console.log("   Password: password123")
  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    console.error("Full error:", error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

setupDatabase()
