-- Create database
CREATE DATABASE IF NOT EXISTS ratings_review_db;
USE ratings_review_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
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
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
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
);

-- Review tags table (for bonus feature)
CREATE TABLE IF NOT EXISTS review_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    INDEX idx_tag (tag),
    INDEX idx_review_id (review_id)
);

-- Clear existing data and insert fresh sample data
DELETE FROM review_tags;
DELETE FROM reviews;
DELETE FROM products;
DELETE FROM users;

-- Reset auto increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE reviews AUTO_INCREMENT = 1;
ALTER TABLE review_tags AUTO_INCREMENT = 1;

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category) VALUES
('iPhone 15 Pro', 'Latest Apple smartphone with advanced camera system, A17 Pro chip, and titanium design. Perfect for photography and gaming.', 999.99, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'Electronics'),
('MacBook Air M2', 'Lightweight laptop with M2 chip, 13.6-inch Liquid Retina display, and all-day battery life. Ideal for work and creativity.', 1199.99, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', 'Electronics'),
('AirPods Pro (2nd Gen)', 'Wireless earbuds with active noise cancellation, spatial audio, and adaptive transparency mode.', 249.99, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'Electronics'),
('Nike Air Max 270', 'Comfortable running shoes with Max Air unit for exceptional cushioning and modern style.', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Footwear'),
('Samsung Galaxy S24 Ultra', 'Android smartphone with S Pen, 200MP camera, and AI-powered features for productivity.', 1199.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'Electronics'),
('Sony WH-1000XM5', 'Premium noise-canceling headphones with 30-hour battery life and crystal-clear call quality.', 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'Electronics'),
('Dell XPS 13', 'Ultra-portable laptop with InfinityEdge display, Intel Core processors, and premium build quality.', 899.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 'Electronics'),
('Adidas Ultraboost 22', 'High-performance running shoes with responsive Boost midsole and Primeknit upper.', 189.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 'Footwear'),
('iPad Pro 12.9"', 'Powerful tablet with M2 chip, Liquid Retina XDR display, and support for Apple Pencil.', 1099.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 'Electronics'),
('Canon EOS R5', 'Professional mirrorless camera with 45MP sensor, 8K video recording, and advanced autofocus.', 3899.99, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400', 'Electronics');

-- Insert sample user
INSERT INTO users (username, email, password_hash) VALUES
('testuser', 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('johndoe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('janedoe', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, rating, review_text) VALUES
(1, 1, 5, 'Amazing phone! The camera quality is outstanding and the battery life is excellent. The titanium build feels premium.'),
(2, 1, 4, 'Great phone overall, but quite expensive. The camera is definitely the highlight.'),
(1, 2, 5, 'Perfect laptop for development work. The M2 chip is incredibly fast and the battery lasts all day.'),
(3, 2, 4, 'Love the portability and performance. The screen is beautiful and keyboard feels great.'),
(2, 3, 5, 'Best earbuds I have ever used. The noise cancellation is incredible and they fit perfectly.'),
(1, 4, 4, 'Very comfortable shoes for running. Good cushioning and stylish design.'),
(3, 5, 5, 'The S Pen functionality is amazing for productivity. Camera quality rivals professional cameras.'),
(2, 6, 5, 'Exceptional sound quality and noise cancellation. Worth every penny for music lovers.');

-- Insert sample tags
INSERT INTO review_tags (review_id, tag) VALUES
(1, 'camera'), (1, 'battery'), (1, 'premium'), (1, 'quality'),
(2, 'expensive'), (2, 'camera'), (2, 'performance'),
(3, 'fast'), (3, 'battery'), (3, 'development'), (3, 'performance'),
(4, 'portable'), (4, 'screen'), (4, 'keyboard'), (4, 'design'),
(5, 'noise-cancellation'), (5, 'fit'), (5, 'quality'),
(6, 'comfortable'), (6, 'running'), (6, 'cushioning'), (6, 'style'),
(7, 'productivity'), (7, 's-pen'), (7, 'camera'), (7, 'professional'),
(8, 'sound-quality'), (8, 'noise-cancellation'), (8, 'music'), (8, 'value');

-- Verify data insertion
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Reviews' as table_name, COUNT(*) as count FROM reviews
UNION ALL
SELECT 'Review Tags' as table_name, COUNT(*) as count FROM review_tags;
