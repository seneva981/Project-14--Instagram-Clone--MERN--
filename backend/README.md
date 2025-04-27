# Instagram Clone Backend

This is the backend server for the Instagram Clone project, built with Node.js, Express, and MongoDB (Mongoose). It provides RESTful APIs for user registration and lays the foundation for features like posts, comments, messaging, and more.

## Features
- User registration with validation and password hashing
- MongoDB integration using Mongoose
- Organized project structure (controllers, models, routes, utils)
- Environment variable support with dotenv
- CORS and cookie parsing middleware
- Modular and scalable codebase

## Getting Started

### Prerequisites
- Node.js (v18 or above recommended)
- npm
- MongoDB instance (local or cloud)

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Project 14 (Instagram Clone [MERN])/backend"
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update the values:
     ```env
     PORT=4000
     MONGO_URI=your_mongodb_connection_uri_here
     ```
4. **Start the server:**
   ```bash
   npm run dev
   # or
   nodemon index.js
   ```

## Project Structure
```
backend/
  index.js                  # Entry point
  package.json              # Project metadata and scripts
  .env.example              # Example environment variables
  controllers/              # Route handler logic
    user.controller.js      # User-related logic
  models/                   # Mongoose schemas
    user.model.js           # User schema
    post.model.js           # Post schema
    comment.model.js        # Comment schema
    conversation.model.js   # Conversation schema
    message.model.js        # Message schema
  routes/                   # Express route definitions
    user.route.js           # User routes
  utils/                    # Utility functions (e.g., database connection)
    db.js                   # MongoDB connection logic
frontend/                   # (Frontend code, not covered here)
```

## API Endpoints

### Test Endpoint
- `GET /`  
  Returns a welcome message to verify the server is running.

### User Registration
- `POST /user/register`
  - **Body Parameters:**
    - `username` (string, required)
    - `email` (string, required)
    - `password` (string, required)
  - **Response:**
    - `201 Created` on success
    - `400` or `401` with error message on failure

## Environment Variables
- `PORT`: Port number for the server (default: 4000)
- `MONGO_URI`: MongoDB connection string

## Development Notes
- The backend uses ES module syntax (`import/export`).
- For development, use `nodemon` for automatic server restarts.
- All sensitive configuration should be placed in the `.env` file (never commit your real `.env` to version control).
- The codebase is structured for scalability, with separate folders for models, controllers, routes, and utilities.

## Example .env File
```
PORT=4000
MONGO_URI=your_mongodb_connection_uri_here
```

## License
This project is for educational purposes. Feel free to use and modify it for your own learning or projects.

---

Feel free to contribute or open issues for improvements!
