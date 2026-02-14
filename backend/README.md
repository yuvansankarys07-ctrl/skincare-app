# Skincare Backend

A Node.js backend for a skincare app using Express, MongoDB, and JWT authentication.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/skincare
   JWT_SECRET=your_jwt_secret_here
   ```

3. Start MongoDB locally.

4. Run the server:
   ```
   npm run dev
   ```

## API Endpoints

### Auth
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (auth required)
- PUT /api/products/:id - Update product (auth required)
- DELETE /api/products/:id - Delete product (auth required)