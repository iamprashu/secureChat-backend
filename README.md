# SecureChats Backend

A secure real-time chat application backend built with Node.js, Express, MongoDB, and Clerk authentication.

## Features

- 🔐 **Clerk JWT Authentication** - Industry-standard authentication
- 💬 **Real-time Messaging** - Socket.io powered chat
- 🖼️ **Image Upload** - Cloudinary integration for media sharing
- 🔒 **Message Encryption** - Secure message storage
- 👥 **User Management** - Profile management and user sync
- 🚀 **RESTful API** - Clean API endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Real-time**: Socket.io
- **File Storage**: Cloudinary
- **Security**: JWT, bcrypt, encryption

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Clerk Authentication
CLERK_JWT_KEY=sk_test_Kind..............
CLERK_SECRET_KEY=sk_test_SameKind.......

# Cloudinary Configuration
CLOUDINARY_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
CLOUDINARY_API_SECRET=XXXXXXXXXXXXXXXXXXXXXX
CLOUDINARY_CLOUD_NAME=XXXXXXXXXXXXXXXX

# Security
ENC_KEY=XXXXXXXXXXXXXXXXX
JWT_SECRET=XXXXXXXXXXXXXXXX

# Database
MONGODB_URI=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Server
PORT=Default is 3000
```

### 3. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/check` | Verify authentication and return user data |
| POST | `/sync-clerk` | Sync Clerk user with database |
| PUT | `/update-profile` | Update user profile information |

### Message Routes (`/api/messages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users for sidebar |
| GET | `/:id` | Get message history with specific user |
| POST | `/send/:id` | Send message to specific user |

## Authentication Flow

1. **Frontend Login**: User authenticates via Clerk
2. **JWT Token**: Clerk provides JWT token to frontend
3. **API Requests**: Frontend sends token in Authorization header
4. **Token Verification**: Backend verifies token using Clerk SDK
5. **User Sync**: User data synced with local database

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, etc.)
├── models/         # MongoDB schemas
├── routes/         # API route definitions
├── lib/            # Utility functions
├── seeds/          # Database seeders
└── index.js        # Application entry point
```

## Security Features

- ✅ **JWT Verification**: Clerk SDK handles token validation
- ✅ **Message Encryption**: Messages encrypted before storage
- ✅ **CORS Protection**: Configured for secure cross-origin requests
- ✅ **Input Validation**: Request data validation and sanitization
- ✅ **Secure Headers**: Authorization header for token transmission

## Development

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Clerk account
- Cloudinary account

### Scripts

```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
```

### Environment Variables Explained

- **CLERK_JWT_KEY**: Your Clerk JWT verification key
- **CLERK_SECRET_KEY**: Your Clerk secret key for API calls
- **CLOUDINARY_***: Cloudinary credentials for image uploads
- **ENC_KEY**: 32-character key for message encryption
- **JWT_SECRET**: Secret for additional JWT operations
- **MONGODB_URI**: MongoDB connection string
- **PORT**: Server port (default: 3000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
