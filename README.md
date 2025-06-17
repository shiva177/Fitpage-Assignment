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
- ✅ Automatic tag extraction from reviews
- ✅ Popular tags display
- ✅ Review statistics
- 🔄 Photo uploads (structure ready)

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Joi Validation
- Multer (for file uploads)

### Frontend
- React 18
- React Router
- Axios
- React Toastify
- Lucide React (icons)

## Project Structure

\`\`\`
ratings-review-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── reviews.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Navbar.js
│   │   │   ├── ProductList.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── ReviewForm.js
│   │   │   ├── ReviewList.js
│   │   │   └── StarRating.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── database/
│   └── schema.sql
├── package.json
└── README.md
\`\`\`

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

### Sample Data
The database comes pre-populated with:
- 6 sample products
- 1 test user account

## Development Commands

\`\`\`bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Backend development
cd backend && npm run dev

# Frontend development
cd frontend && npm start
\`\`\`

## Production Deployment

### Backend Deployment
1. Set environment variables
2. Install dependencies: `npm install`
3. Start server: `npm start`

### Frontend Deployment
1. Build the app: `npm run build`
2. Serve the build folder

### Database
- Ensure MySQL is running
- Run the schema.sql file
- Update connection credentials

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
1. **Tag Extraction**
   - Automatic keyword extraction from reviews
   - Popular tags display
   - Tag frequency counting

2. **Photo Upload Structure**
   - Database schema supports image arrays
   - Backend multer configuration ready
   - Frontend structure prepared

### ✅ Technical Requirements
1. **Backend**: Node.js + Express.js ✅
2. **Frontend**: React ✅
3. **Database**: MySQL ✅
4. **REST APIs**: Complete CRUD operations ✅

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   \`\`\`bash
   # Check if MySQL is running
   brew services list | grep mysql
   
   # Start MySQL if not running
   brew services start mysql
   
   # Check MySQL credentials
   mysql -u root -p
   \`\`\`

2. **Port Already in Use**
   \`\`\`bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   \`\`\`

3. **Database Schema Issues**
   \`\`\`bash
   # Drop and recreate database
   mysql -u root -p -e "DROP DATABASE IF EXISTS ratings_review_db;"
   mysql -u root -p < database/schema.sql
   \`\`\`

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set in .env
   - Clear localStorage in browser
   - Re-login to get new token

### Environment Variables Check
\`\`\`bash
# Backend .env should contain:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ratings_review_db
JWT_SECRET=your_secret_key
PORT=5000
\`\`\`

## Terminal Setup Commands for macOS

\`\`\`bash
# 1. Install Node.js (if not installed)
brew install node

# 2. Install MySQL (if not installed)
brew install mysql
brew services start mysql

# 3. Secure MySQL installation
mysql_secure_installation

# 4. Clone and setup project
git clone <your-repo-url>
cd ratings-review-system

# 5. Install all dependencies
npm run install-all

# 6. Setup database
mysql -u root -p < database/schema.sql

# 7. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your MySQL password

# 8. Start the application
npm run dev
\`\`\`

## VSCode Extensions Recommended

- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- MySQL (by Jun Han)
- Thunder Client (for API testing)
- Prettier - Code formatter
- ESLint

## API Testing

You can test the API endpoints using Thunder Client in VSCode or any REST client:

### Sample API Calls

1. **Register User**
   \`\`\`
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json
   
   {
     "username": "testuser2",
     "email": "test2@example.com",
     "password": "password123"
   }
   \`\`\`

2. **Login**
   \`\`\`
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "password123"
   }
   \`\`\`

3. **Get Products**
   \`\`\`
   GET http://localhost:5000/api/products
   \`\`\`

4. **Create Review**
   \`\`\`
   POST http://localhost:5000/api/reviews
   Authorization: Bearer YOUR_JWT_TOKEN
   Content-Type: application/json
   
   {
     "product_id": 1,
     "rating": 5,
     "review_text": "Great product! Highly recommended."
   }
   \`\`\`

## Future Enhancements

- [ ] Photo upload functionality
- [ ] Review sorting and filtering
- [ ] User profile pages
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product search functionality
- [ ] Review voting (helpful/not helpful)
- [ ] Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For any issues or questions, please create an issue in the repository or contact the development team.

---

**Happy Coding! 🚀**
