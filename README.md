# Backend - SecureChats

## Clerk JWT Authentication Implementation

This backend now uses **industry-standard Clerk JWT authentication** instead of custom JWT cookies.

### Changes Made:

#### 1. **New Middleware** (`middleware/clerkAuth.js`)

- **verifyClerkToken()**: Verifies Clerk JWT tokens from Authorization header
- **Uses networkless verification** for better performance and security
- **Extracts user data** from Clerk JWT payload
- **Adds clerkUser** to request object for controllers

#### 2. **Updated Auth Controller** (`controllers/auth.controller.js`)

- ❌ **Removed**: `signup()`, `login()`, `logout()` methods
- ✅ **Updated**: `checkAuth()` to work with Clerk user data
- ✅ **Updated**: `syncClerkUser()` to use Clerk JWT
- ✅ **Updated**: `updateProfile()` to find user by Clerk ID

#### 3. **Updated Message Controller** (`controllers/message.controller.js`)

- ✅ **Updated**: `getUsersForSidebar()` to use Clerk user ID
- ✅ **Updated**: `getMessages()` to find user by Clerk ID
- ✅ **Updated**: `sendMessage()` to use Clerk user as sender

#### 4. **Updated Routes**

- **auth.route.js**: All routes now use `verifyClerkToken` middleware
- **message.route.js**: All routes now use `verifyClerkToken` middleware
- ❌ **Removed**: Old auth endpoints (signup, login, logout)

#### 5. **User Model** (`models/user.model.js`)

- ✅ **Added**: `clerkUserId` field for Clerk user identification
- ✅ **Updated**: Schema to support Clerk authentication

### Environment Variables Required:

```env
CLERK_JWT_KEY=your_clerk_jwt_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
MONGODB_URI=your_mongodb_uri
PORT=3000
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
ENC_KEY=your_32_character_encryption_key
```

### API Endpoints:

#### Authentication

- `GET /api/auth/check` - Verify auth and return user data
- `POST /api/auth/sync-clerk` - Sync Clerk user with database
- `PUT /api/auth/update-profile` - Update user profile

#### Messages

- `GET /api/messages/users` - Get all users for sidebar
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user

### Security Benefits:

- ✅ **Industry Standard**: Uses Clerk's battle-tested JWT verification
- ✅ **Networkless Verification**: No network calls for token verification
- ✅ **No Custom Auth**: Eliminates custom JWT vulnerabilities
- ✅ **Proper Token Verification**: Clerk SDK handles token validation
- ✅ **Secure Headers**: Uses Authorization header instead of cookies
- ✅ **Automatic Token Refresh**: Clerk handles token lifecycle

### Frontend Integration:

The frontend automatically sends Clerk JWT tokens in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

All API calls now use Clerk JWT tokens for authentication! 🎯
