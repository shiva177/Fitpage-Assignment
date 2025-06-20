# Ratings and Review System

A complete full-stack web application for product ratings and reviews built with React, Node.js, Express.js, and MySQL.

## Features

### Core Features
- ✅ User authentication (register/login)
- ✅ Product listing with ratings summary
- ✅ Add ratings and/or reviews for products
- ✅ Prevent duplicate ratings per user per product
- ✅ Input validation on all forms
- ✅ Responsive design

### Bonus Features
- ✅ Review statistics
- 🔄 Photo uploads (structure ready)

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Joi Validation

### Frontend
- React 18
- React Router
- Axios
- React Toastify


## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd ratings-review-system
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Install root dependencies
npm install

# Install all dependencies (root, backend, frontend)
npm run install-all
\`\`\`

### 3. Database Setup

#### Start MySQL Server
\`\`\`bash
# On macOS with Homebrew
brew services start mysql

# Or start manually
mysql.server start
\`\`\`

#### Create Database and Tables
\`\`\`bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql

# Or copy and paste the SQL commands from database/schema.sql
\`\`\`

### 4. Backend Configuration

Create `backend/.env` file:
\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ratings_review_db
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# File Upload
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880
\`\`\`

### 5. Start the Application

#### Option 1: Start Both Frontend and Backend Together
\`\`\`bash
npm run dev
\`\`\`

#### Option 2: Start Separately
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
\`\`\`

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products with ratings
- `GET /api/products/:id` - Get single product with ratings

### Reviews
- `POST /api/reviews` - Create new review (requires auth)
- `GET /api/reviews/product/:productId` - Get reviews for product
- `GET /api/reviews/product/:productId/tags` - Get popular tags for product

## Database Schema

### Tables
1. **users** - User accounts
2. **products** - Product catalog
3. **reviews** - User reviews and ratings
4. **review_tags** - Extracted tags from reviews

### Key Relationships
- Users can have many reviews
- Products can have many reviews
- Reviews belong to one user and one product
- Reviews can have multiple tags

## Testing

### Test User Account
- Email: test@example.com
- Password: password123

## Features Implemented

### ✅ Functional Requirements
1. **Rating and Review System**
   - Users can provide ratings (1-5 stars)
   - Users can write text reviews
   - Users can provide both or either

2. **Input Validation**
   - Email format validation
   - Password strength requirements
   - Review text length limits
   - Rating range validation

3. **Duplicate Prevention**
   - Unique constraint on user-product combination
   - Frontend and backend validation

### ✅ Bonus Features
1. **Photo Upload Structure**
   - Database schema supports image arrays

