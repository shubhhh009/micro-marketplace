# Micro Marketplace Application

A complete marketplace solution featuring a Node.js backend, a React web application, and a React Native (Expo) mobile application.

## Project Structure

```
micro-marketplace/
├── backend/          # Node.js & Express API
├── web/              # React & Vite Web App
└── mobile/           # React Native & Expo Mobile App
```

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file (one has been provided with defaults):
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/micro-marketplace
   JWT_SECRET=supersecretstring123
   ```
4. Seed the database:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm start
   ```

### 2. Web App Setup
1. Navigate to the web directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Mobile App Setup
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Expo:
   ```bash
   npx expo start
   ```

## API Documentation

### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Login and receive a JWT token.

### Products
- `GET /products`: Fetch products (supports `search`, `page`, `limit` query params).
- `GET /products/:id`: Fetch a single product by ID.
- `POST /products`: Create a product (Auth required).
- `PUT /products/:id`: Update a product (Auth required).
- `DELETE /products/:id`: Delete a product (Auth required).

### Favorites
- `GET /favorites`: Get favorites of the logged-in user.
- `POST /favorites/:productId`: Add a product to favorites.
- `DELETE /favorites/:productId`: Remove a product from favorites.

## Test Credentials
- **Email**: test@test.com
- **Password**: 123456

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt.
- **Web**: React (Vite), Tailwind CSS, Axios, Lucide, Framer Motion.
- **Mobile**: React Native, Expo, React Navigation, Axios.

