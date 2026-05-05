# 💬 Real-Time Chat Application - MERN Stack

A production-ready real-time chat application built with MongoDB, Express, React, Node.js, and Socket.io, featuring JWT authentication, password hashing, input validation, file uploads, and security best practices.

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ **Password Hashing** with Bcryptjs (10 salt rounds)
- ✅ **JWT Authentication** for secure user sessions
- ✅ **Protected Routes** with authentication middleware
- ✅ **Input Validation** using Joi schemas
- ✅ **Security Headers** with Helmet
- ✅ **CORS Configuration** for safe cross-origin requests

### 💬 Real-Time Messaging
- ✅ **Socket.io** for instant bidirectional communication
- ✅ **Online/Offline Status** tracking
- ✅ **Typing Indicators** to show when someone is typing
- ✅ **Message History** stored in MongoDB
- ✅ **Read Receipts** for message tracking

### 📤 File Management
- ✅ **Profile Picture Upload** with Multer
- ✅ **File Size Limits** (5MB max)
- ✅ **File Type Validation** (images only)
- ✅ **Secure File Storage** with unique filenames

### 🎯 Additional Features
- ✅ User search functionality
- ✅ Unread message count
- ✅ Last seen timestamp
- ✅ RESTful API design
- ✅ MongoDB indexing for performance

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Scalable-Chat-App

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create .env file (see .env.example)

# 4. Start MongoDB
# Local: mongod
# Or Docker: docker run -d -p 27017:27017 mongo

# 5. Start the server
npm start
```

Server will run on `http://localhost:8000`

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions with API documentation
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - How to test all features manually
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical overview and interview prep

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register              Register new user
POST   /api/auth/login                 Login user
GET    /api/auth/profile               Get current user (protected)
POST   /api/auth/logout                Logout user (protected)
POST   /api/auth/upload-profile-picture Upload profile pic (protected)
```

### Users
```
GET    /api/users                      Get all users (protected)
GET    /api/users/online               Get online users (protected)
GET    /api/users/search?query=john    Search users (protected)
```

### Messages
```
GET    /api/messages/:userId           Get conversation (protected)
POST   /api/messages                   Send message (protected)
PUT    /api/messages/:userId/read      Mark as read (protected)
GET    /api/messages/unread/count      Get unread count (protected)
```

---

## 🔌 Socket.io Events

### Client → Server
```javascript
socket.emit('message:send', { recipientId, message });
socket.emit('typing:start', { recipientId });
socket.emit('typing:stop', { recipientId });
```

### Server → Client
```javascript
socket.on('user:connected', (data) => { ... });
socket.on('users:online', (userIds) => { ... });
socket.on('message:receive', (message) => { ... });
socket.on('message:sent', (message) => { ... });
socket.on('typing:start', (data) => { ... });
socket.on('typing:stop', (data) => { ... });
```

---

## 📁 Project Structure

```
chat-app/
├── app/
│   ├── controllers/          Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── messageController.js
│   ├── middleware/           Auth & Upload
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/               Mongoose models
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/               API routes
│   │   └── route.js
│   ├── socket/               Socket.io logic
│   │   └── socket.js
│   ├── utils/                Helper functions
│   │   └── jwt.js
│   └── validators/           Joi schemas
│       └── authValidator.js
├── uploads/                  Uploaded files
├── .env                      Environment variables
├── .gitignore               Git ignore file
├── index.js                 Main server file
└── package.json             Dependencies
```

---

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - Real-time communication

### Security & Validation
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **joi** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### File Handling
- **multer** - File upload middleware

---

## 🧪 Testing

### Manual Testing with Postman

1. **Register a user**
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "username": "alice",
  "email": "alice@test.com",
  "password": "123456"
}
```

2. **Login**
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "alice@test.com",
  "password": "123456"
}
```

3. **Get Profile** (use token from login)
```http
GET http://localhost:8000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for complete testing instructions.

---

## 🔒 Security Features

1. **Password Hashing** - Bcrypt with 10 salt rounds
2. **JWT Tokens** - 7-day expiration
3. **Input Validation** - Joi schemas for all inputs
4. **File Upload Security** - Size limits, type validation
5. **CORS** - Whitelist allowed origins
6. **Helmet** - 11 security headers
7. **MongoDB Injection Prevention** - Mongoose sanitization

---

## 🚀 Deployment

### Deploy to Render
1. Create account on [Render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

### Deploy to Railway
1. Create account on [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Auto-deploy on push

---

## 📝 Environment Variables

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/chat-app-db

# JWT Secret
JWT_SECRET=your_super_secret_key_change_this

# CORS
ALLOWED_ORIGINS=["http://localhost:5173"]

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

---

## 🎯 Interview Topics Covered

1. ✅ Password Hashing (Bcrypt)
2. ✅ JWT Authentication
3. ✅ Environment Variables (dotenv)
4. ✅ Input Validation (Joi)
5. ✅ File Uploads (Multer)
6. ✅ CORS & Security Headers (Helmet)
7. ✅ REST API Design
8. ✅ Socket.io Real-time Communication
9. ✅ MongoDB & Mongoose
10. ✅ Express Middleware
11. ✅ Error Handling
12. ✅ Authentication Middleware
13. ✅ MVC Architecture
14. ✅ Database Indexing
15. ✅ Production Deployment

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=3000
```

### JWT Token Invalid
Make sure you're sending token in header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📚 Learn More

- [Express.js Docs](https://expressjs.com/)
- [Socket.io Docs](https://socket.io/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [Joi Validation](https://joi.dev/)

---

## 📄 License

MIT License - Free to use for learning and interviews!

---

## 👨‍💻 Author

Built as a learning project to demonstrate modern backend development practices.

---

## 🎉 What's Next?

- [ ] Add email verification
- [ ] Implement forgot password
- [ ] Create React frontend
- [ ] Add group chat
- [ ] Implement message reactions
- [ ] Add voice/video calling
- [ ] Deploy to production

---

**Happy Coding! 🚀**

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
