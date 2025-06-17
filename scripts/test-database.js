// const mysql = require("mysql2/promise")
// const path = require("path")
// require("dotenv").config({ path: path.join(__dirname, "../backend/.env") })

// async function testDatabase() {
//   console.log("=== Database Connection Test ===")

//   try {
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST || "localhost",
//       user: process.env.DB_USER || "root",
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME || "ratings_review_db",
//       port: process.env.DB_PORT || 3306,
//     })

//     console.log("✅ Database connection successful")

//     // Test queries
//     const [products] = await connection.execute("SELECT COUNT(*) as count FROM products")
//     const [users] = await connection.execute("SELECT COUNT(*) as count FROM users")

//     console.log(`📊 Products: ${products[0].count}`)
//     console.log(`👥 Users: ${users[0].count}`)

//     // Test a sample product query
//     const [sampleProducts] = await connection.execute("SELECT id, name, price FROM products LIMIT 3")
//     console.log("\n📦 Sample Products:")
//     sampleProducts.forEach((product) => {
//       console.log(`   ${product.id}: ${product.name} - $${product.price}`)
//     })

//     await connection.end()
//     console.log("\n✅ Database test completed successfully!")
//   } catch (error) {
//     console.error("❌ Database test failed:", error.message)
//     console.error("\n🔧 Troubleshooting:")
//     console.error("1. Make sure MySQL is running")
//     console.error("2. Check your .env file in the backend directory")
//     console.error("3. Verify database credentials")
//     console.error("4. Run: node scripts/setup-database-safe.js")
//   }
// }

// testDatabase()
