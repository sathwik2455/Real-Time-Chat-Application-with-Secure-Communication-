# 🚀 Real-Time Chat Application - Setup Guide

A production-ready MERN stack chat application with authentication, file uploads, and real-time messaging.

## ✨ Features Implemented

### Day 15: Password Hashing ✅
- **Bcryptjs** for secure password hashing
- Automatic password hashing before saving to database
- Password comparison for login

### Day 16: JWT Authentication ✅
- **JSON Web Tokens** for secure authentication
- Token generation on login/register
- Protected routes with JWT middleware
- Token verification for Socket.io connections

### Day 17: Environment Variables ✅
- **dotenv** for managing environment variables
- Secure storage of JWT secrets and database URIs
- Separate configs for development/production

### Day 18: Input Validation ✅
- **Joi** for validating user input
- Registration validation (username, email, password)
- Login validation
- Message validation

### Day 19: File Uploads ✅
- **Multer** for handling file uploads
- Profile picture upload functionality
- File size limits (5MB)
- Only image files allowed (jpeg, jpg, png, gif)

### Day 20: CORS & Security Headers ✅
- **CORS** configured for frontend-backend communication
- **Helmet** for security headers
- Credentials support for cookies/auth

### Day 21: Ready for Deployment ✅
- Clean, production-ready code
- No Redis/Kafka dependencies
- MongoDB for all data storage
- Easy to deploy to Render, Vercel, or DigitalOcean

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# SERVER
PORT=8000
NODE_ENV=development

# DATABASE
MONGO_URI=mongodb://127.0.0.1:27017/chat-app-db

# JWT SECRET (Change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# CORS
ALLOWED_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173"]

# FILE UPLOAD
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

**Or use MongoDB Atlas (Cloud):**
- Create account at https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Update `MONGO_URI` in `.env`

### Step 4: Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:8000`

---

## 🔌 API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Upload Profile Picture (Protected)
```http
POST /api/auth/upload-profile-picture
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

profilePicture: [file]
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

### Users

#### Get All Users (Protected)
```http
GET /api/users
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Online Users (Protected)
```http
GET /api/users/online
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Search Users (Protected)
```http
GET /api/users/search?query=john
Authorization: Bearer YOUR_JWT_TOKEN
```

### Messages

#### Get Conversation (Protected)
```http
GET /api/messages/:userId
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Send Message (Protected)
```http
POST /api/messages
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "recipient": "USER_ID",
  "message": "Hello!"
}
```

#### Mark as Read (Protected)
```http
PUT /api/messages/:userId/read
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Unread Count (Protected)
```http
GET /api/messages/unread/count
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔌 Socket.io Events

### Client → Server

#### Connect with Authentication
```javascript
const socket = io('http://localhost:8000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});
```

#### Send Message
```javascript
socket.emit('message:send', {
  recipientId: 'USER_ID',
  message: 'Hello!'
});
```

#### Typing Indicators
```javascript
// Start typing
socket.emit('typing:start', { recipientId: 'USER_ID' });

// Stop typing
socket.emit('typing:stop', { recipientId: 'USER_ID' });
```

### Server → Client

#### User Connected
```javascript
socket.on('user:connected', (data) => {
  console.log('Connected:', data);
  // { userId, username, email, profilePicture }
});
```

#### Online Users
```javascript
socket.on('users:online', (userIds) => {
  console.log('Online users:', userIds);
  // Array of user IDs
});
```

#### Receive Message
```javascript
socket.on('message:receive', (message) => {
  console.log('New message:', message);
  // { _id, sender, recipient, message, isRead, createdAt }
});
```

#### Message Sent Confirmation
```javascript
socket.on('message:sent', (message) => {
  console.log('Message sent:', message);
});
```

#### Typing Indicators
```javascript
socket.on('typing:start', (data) => {
  console.log(`${data.username} is typing...`);
});

socket.on('typing:stop', (data) => {
  console.log(`${data.username} stopped typing`);
});
```

#### Errors
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

---

## 📁 Project Structure

```
chat-app/
├── app/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── userController.js      # User management
│   │   └── messageController.js   # Message handling
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication middleware
│   │   └── upload.js              # Multer file upload config
│   ├── models/
│   │   ├── User.js                # User schema with bcrypt
│   │   └── Message.js             # Message schema
│   ├── routes/
│   │   └── route.js               # API routes
│   ├── socket/
│   │   └── socket.js              # Socket.io logic
│   ├── utils/
│   │   └── jwt.js                 # JWT utilities
│   └── validators/
│       └── authValidator.js       # Joi validation schemas
├── uploads/                        # Uploaded files
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
├── index.js                       # Main server file
├── package.json                   # Dependencies
└── README.md                      # Documentation
```

---

## 🧪 Testing the API

### Using Postman

1. **Register a user**
   - POST `http://localhost:8000/api/auth/register`
   - Body: `{ "username": "alice", "email": "alice@test.com", "password": "123456" }`
   - Copy the `token` from response

2. **Login**
   - POST `http://localhost:8000/api/auth/login`
   - Body: `{ "email": "alice@test.com", "password": "123456" }`

3. **Get profile**
   - GET `http://localhost:8000/api/auth/profile`
   - Headers: `Authorization: Bearer YOUR_TOKEN`

4. **Upload profile picture**
   - POST `http://localhost:8000/api/auth/upload-profile-picture`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body: form-data, key: `profilePicture`, value: [select image file]

5. **Get all users**
   - GET `http://localhost:8000/api/users`
   - Headers: `Authorization: Bearer YOUR_TOKEN`

---

## 🚀 Deployment

### Deploy to Render

1. Create account on [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables from `.env`
6. Deploy!

### Deploy to Railway

1. Create account on [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy automatically

### Deploy to DigitalOcean

1. Create Droplet (Ubuntu)
2. SSH into server
3. Install Node.js and MongoDB
4. Clone repository
5. Install dependencies
6. Setup PM2 for process management
7. Configure Nginx as reverse proxy

---

## 🔒 Security Best Practices

✅ Passwords hashed with bcrypt (10 salt rounds)
✅ JWT tokens for authentication
✅ Environment variables for secrets
✅ Input validation with Joi
✅ Helmet for security headers
✅ CORS properly configured
✅ File upload restrictions (size, type)
✅ MongoDB injection prevention (Mongoose)

---

## 📝 Interview Topics Covered

1. ✅ **Password Hashing** - Bcryptjs, salt rounds, pre-save hooks
2. ✅ **JWT Authentication** - Token generation, verification, middleware
3. ✅ **Environment Variables** - dotenv, security, configuration
4. ✅ **Input Validation** - Joi schemas, error messages
5. ✅ **File Uploads** - Multer, storage, file filters
6. ✅ **CORS & Security** - Cross-origin requests, Helmet headers
7. ✅ **REST API Design** - CRUD operations, status codes
8. ✅ **Socket.io** - Real-time communication, authentication
9. ✅ **MongoDB** - Schemas, models, queries, indexing
10. ✅ **Express Middleware** - Authentication, error handling

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
sudo systemctl start mongod
```

### JWT Token Invalid
```
Error: Invalid or expired token
```
**Solution:** Make sure you're sending token in header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### File Upload Error
```
Error: File too large
```
**Solution:** Check `MAX_FILE_SIZE` in `.env` (default 5MB)

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Add your frontend URL to `ALLOWED_ORIGINS` in `.env`

---

## 📚 Learn More

- [Express.js Documentation](https://expressjs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [Joi Validation](https://joi.dev/)
- [Multer Documentation](https://github.com/expressjs/multer)

---

## 🎯 Next Steps

- [ ] Add group chat functionality
- [ ] Implement message reactions
- [ ] Add voice/video calling
- [ ] Create React/Vue frontend
- [ ] Add email verification
- [ ] Implement forgot password
- [ ] Add message search
- [ ] Deploy to production

---

## 📄 License

MIT License - feel free to use this project for learning and interviews!

---

**Happy Coding! 🚀**
