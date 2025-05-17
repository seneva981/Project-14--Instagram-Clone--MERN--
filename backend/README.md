# Instagram Clone Backend

This is the backend server for the Instagram Clone project, built with Node.js, Express, and MongoDB (Mongoose). It provides RESTful APIs for user registration and lays the foundation for features like posts, comments, messaging, and more.

## Features

- User registration with validation and password hashing
- User login with username or email and password
- User logout with blacklisting the JWT token
- Get user's profile with having a valid JWT token
- User profile updation for different fields
- Get suggested users to follow (suggested users API)
- User can follow another user by username (follow user API)
- MongoDB integration using Mongoose
- Organized project structure (middlewares, controllers, models, routes, utils)
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
   git clone https://github.com/seneva981/Project-14--Instagram-Clone--MERN--.git
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
     JWT_SECRET=your_jwt_secret_here
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloudname
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_KEY_SECRET=your_cloudinary_api_key_secret
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
  README.md                 # Backend Documentation
  package.json              # Project metadata and scripts
  package-lock.json         # Project's node modules detail
  index.js                  # Entry point
  .env.example              # Example environment variables
  controllers/              # Route handler logic
    user.controller.js      # User-related logic
  models/                   # Mongoose schemas
    user.model.js           # User schema
    blacklistToken.model.js # blacklistToken Schema
  routes/                   # Express route definitions
    user.route.js           # User routes
  utils/                    # Utility functions (e.g., database connection)
    db.js                   # MongoDB connection logic
    cloudinary.js           # Cloudinary connection logic
  middlewares/
    isAuthenticated.js      # User authentication
frontend/                   # (Frontend code, not covered yet)
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

### User Login

- `POST /user/login`

  - **Body Parameters:**

    - `email` (string, optional) — User's email address. Required if `username` is not provided.
    - `username` (string, optional) — User's username. Required if `email` is not provided.
    - `password` (string, required) — User's password.

    At least one of `email` or `username` must be provided, along with `password`.

  - **Response:**

    - `200 OK` on successful login
      - Sets a `token` cookie (HTTP-only, secure, 1 day expiry)
      - Returns a JSON object:
        ```json
        {
          "message": "Login successfully",
          "success": true,
          "userCopy": {
            "_id": "<user_id>",
            "username": "<username>",
            "email": "<email>",
            "profilePicture": "<profilePicture>",
            "bio": "<bio>",
            "followers": [ ... ],
            "following": [ ... ],
            "posts": [ ... ]
          }
        }
        ```
      - The `userCopy` object does **not** include the password field for security.
    - `400` if validation fails (missing fields, etc.)
    - `401` if credentials are incorrect or user not found
      - Example error response:
        ```json
        {
          "message": "User not found with this email or username",
          "success": false
        }
        ```

  - **Notes:**
    - The login route accepts either email or username for authentication.
    - On successful login, the JWT token is stored in a cookie (not in the response body).
    - Password is never sent in the response.
    - The cookie is set with `httpOnly`, `secure`, and `sameSite: 'none'` for security.
    - If login fails, a relevant error message is returned.

### User Logout

- `GET /user/logout`
  - **Response:**
    - `200 OK` on successful logout
      - Example response:
        ```json
        {
          "message": "Logout successfully",
          "success": true
        }
        ```
    - The `token` cookie is cleared on the client.
    - If the user is not logged in or the token is missing, the response is still `200 OK` for idempotency.

### Get User

- `GET /getUser/:id`
  - **Protected Route:** Requires a valid JWT token.
  - **Response:**
    - `200 OK` on successful retrieval
      - Example response:
        ```json
        {
          "message": "User found successfully",
          "success": true,
          "userCopy": {
            "_id": "<user_id>",
            "username": "<username>",
            "email": "<email>",
            "profilePicture": "<profilePicture>",
            "bio": "<bio>",
            "followers": [ ... ],
            "following": [ ... ],
            "posts": [ ... ]
          }
        }
        ```
    - `400` if user ID is missing in the params
      - Example error response:
        ```json
        {
          "message": "User id is missing in the params",
          "success": false
        }
        ```
    - `404` if user not found
      - Example error response:
        ```json
        {
          "message": "User not found",
          "success": false
        }
        ```

### Update User

- `PUT /user/updateUser`
  - **Protected Route:** Requires a valid JWT token.
  - **Consumes:** `multipart/form-data` (for profile picture upload)
  - **Body/Form Data Parameters:**
    - `username` (string, optional): New username for the user.
    - `password` (string, optional): New password (will be hashed before saving).
    - `bio` (string, optional): New bio for the user.
    - `profilePicture` (file, optional): New profile picture file to upload (handled by multer and stored on Cloudinary).
  - **Behavior:**
    - Only the fields provided in the request will be updated.
    - If a new profile picture is uploaded, it will be stored on Cloudinary and the user's `profilePicture` field will be updated with the new URL.
    - If a new password is provided, it will be hashed before saving.
    - The route uses two middlewares: `isAuthenticated` (for authentication) and `multer` (for file upload).
  - **Response:**
    - `200 OK` on successful update
      - Example response:
        ```json
        {
          "updateUser": {
            "_id": "<user_id>",
            "username": "<username>",
            "email": "<email>",
            "profilePicture": "<profilePicture>",
            "bio": "<bio>",
            "followers": [ ... ],
            "following": [ ... ],
            "posts": [ ... ],
            ...
          },
          "message": "User updated successfully",
          "success": true
        }
        ```
    - `400` if the request is invalid (e.g., missing required fields for your business logic)
      - Example error response:
        ```json
        {
          "message": "Invalid request",
          "success": false
        }
        ```
    - `401` if the user is not authenticated or the token is invalid/expired
      - Example error response:
        ```json
        {
          "message": "Unauthorized because token is missing or invalid",
          "success": false
        }
        ```
  - **Notes:**
    - You can update any combination of `username`, `password`, `bio`, and `profilePicture` in a single request.
    - If no fields are provided, the user document will remain unchanged.
    - The route expects the JWT token to be present for authentication.
    - The `profilePicture` field should be sent as a file in the form data (not as a string).
    - The password is always hashed before being saved to the database.
    - The response includes the updated user object (excluding the password).

### Get Suggested Users

- `GET /user/getSuggestedUsers`
  - **Protected Route:** Requires a valid JWT token.
  - **Query Parameters:**
    - `limit` (number, optional): Number of suggested users to return (default: 5)
  - **Response:**
    - `200 OK` on success
      - Example response:
        ```json
        {
          "message": "Suggested users found successfully",
          "success": true,
          "suggestedUsers": [
            {
              "_id": "<user_id>",
              "username": "<username>",
              "profilePicture": "<profilePicture>",
              "bio": "<bio>"
            },
            ...
          ]
        }
        ```
    - `404` if the authenticated user is not found
      - Example error response:
        ```json
        {
          "message": "User not found",
          "success": false
        }
        ```
    - `401` if the user is not authenticated or the token is invalid/expired
      - Example error response:
        ```json
        {
          "message": "Unauthorized because token is missing or invalid",
          "success": false
        }
        ```
  - **Behavior:**
    - Returns a list of users that the current user does **not** already follow and does **not** include the current user.
    - The number of users returned can be controlled with the `limit` query parameter (default is 5).
    - Only selected fields (`_id`, `username`, `profilePicture`, `bio`) are returned for each suggested user.
    - If the authenticated user is not found in the database, a 404 error is returned.
    - If the request is not authenticated, a 401 error is returned.
    - On server error, a 500 error is returned.
  - **Notes:**
    - This route is useful for suggesting new users to follow, similar to Instagram's "Suggested for you" feature.
    - The route expects the JWT token to be present for authentication.
    - The response does not include sensitive fields like password.

### Follow User

- `PUT /user/followUser/:username`
  - **Protected Route:** Requires a valid JWT token.
  - **Path Parameter:**
    - `username` (string, required): The username of the user to follow.
  - **Behavior:**
    - The authenticated user (from JWT) will follow the user specified by `:username`.
    - If the user is already being followed, a 400 error is returned.
    - Both users' follower/following lists are updated accordingly.
    - The route uses the `isAuthenticated` middleware for authentication.
  - **Response:**
    - `200 OK` on successful follow
      - Example response:
        ```json
        {
          "message": "User followed successfully",
          "success": true
        }
        ```
    - `400` if the username is missing in the params or the user is already being followed
      - Example error response:
        ```json
        {
          "message": "Username is missing in the params",
          "success": false
        }
        ```
        or
        ```json
        {
          "message": "You are already following this user",
          "success": false
        }
        ```
    - `404` if the user to follow or the logged-in user is not found
      - Example error response:
        ```json
        {
          "message": "User not found",
          "success": false
        }
        ```
        or
        ```json
        {
          "message": "Logged in user not found",
          "success": false
        }
        ```
    - `401` if the user is not authenticated or the token is invalid/expired
      - Example error response:
        ```json
        {
          "message": "Unauthorized because token is missing or invalid",
          "success": false
        }
        ```
  - **Notes:**
    - This route allows the authenticated user to follow another user by their username.
    - The route expects the JWT token to be present for authentication.
    - The response does not include sensitive fields like password.
    - Both users' follower/following lists are updated atomically.

## Environment Variables

- `PORT`: Port number for the server (default: 4000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_KEY_SECRET`: Cloudinary API secret key

## Development Notes

- The backend uses ES module syntax (`import/export`).
- For development, use `nodemon` for automatic server restarts.
- All sensitive configuration should be placed in the `.env` file (never commit your real `.env` to version control).
- The codebase is structured for scalability, with separate folders for middlewares, models, controllers, routes, and utilities.

## Example .env File

```
PORT=4000
MONGO_URI=your_mongodb_connection_uri_here
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloudname_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_KEY_SECRET=your_cloudinary_api_key_secret_here
```

## License

This project is for educational purposes. Feel free to use and modify it for your own learning or projects.

---

Feel free to contribute or open issues for improvements!
