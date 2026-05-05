# 🧪 Testing Guide - Chat Application

## Quick Start Testing

### Step 1: Start MongoDB
```bash
# If using Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Or start local MongoDB
mongod
```

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ Server running on port 8000
✅ Socket.io ready for connections
```

---

## 📝 Manual Testing with Postman/Thunder Client

### Test 1: Register User

**Request:**
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "username": "alice",
  "email": "alice@test.com",
  "password": "123456"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef12345",
      "username": "alice",
      "email": "alice@test.com",
      "profilePicture": null,
      "isOnline": false,
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token!** You'll need it for other requests.

---

### Test 2: Login

**Request:**
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "alice@test.com",
  "password": "123456"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Test 3: Get Profile (Protected Route)

**Request:**
```http
GET http://localhost:8000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f1234567890abcdef12345",
      "username": "alice",
      "email": "alice@test.com",
      ...
    }
  }
}
```

---

### Test 4: Upload Profile Picture

**Request:**
```http
POST http://localhost:8000/api/auth/upload-profile-picture
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

profilePicture: [select an image file]
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile picture updated successfully",
  "data": {
    "user": {
      ...
      "profilePicture": "/uploads/65f123...jpg"
    }
  }
}
```

---

### Test 5: Get All Users

**Request:**
```http
GET http://localhost:8000/api/users
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "65f...",
        "username": "bob",
        "email": "bob@test.com",
        "isOnline": false,
        ...
      }
    ]
  }
}
```

---

### Test 6: Send Message

**Request:**
```http
POST http://localhost:8000/api/messages
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "recipient": "65f1234567890abcdef67890",
  "message": "Hello Bob!"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": {
      "_id": "65f...",
      "sender": { ... },
      "recipient": { ... },
      "message": "Hello Bob!",
      "isRead": false,
      "createdAt": "2024-03-15T10:35:00.000Z"
    }
  }
}
```

---

### Test 7: Get Conversation

**Request:**
```http
GET http://localhost:8000/api/messages/65f1234567890abcdef67890
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "65f...",
        "sender": { ... },
        "recipient": { ... },
        "message": "Hello Bob!",
        "isRead": false,
        "createdAt": "2024-03-15T10:35:00.000Z"
      }
    ]
  }
}
```

---

## 🔌 Testing Socket.io

### Using Browser Console

Create an HTML file `test-socket.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Socket.io Test</title>
    <script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>
</head>
<body>
    <h1>Socket.io Test</h1>
    <div id="status">Disconnected</div>
    <div id="messages"></div>

    <script>
        // Replace with your JWT token
        const token = 'YOUR_JWT_TOKEN_HERE';

        const socket = io('http://localhost:8000', {
            auth: { token }
        });

        socket.on('connect', () => {
            document.getElementById('status').textContent = 'Connected!';
            console.log('Connected to server');
        });

        socket.on('user:connected', (data) => {
            console.log('User connected:', data);
        });

        socket.on('users:online', (userIds) => {
            console.log('Online users:', userIds);
        });

        socket.on('message:receive', (message) => {
            console.log('New message:', message);
            const div = document.createElement('div');
            div.textContent = `${message.sender.username}: ${message.message}`;
            document.getElementById('messages').appendChild(div);
        });

        socket.on('message:sent', (message) => {
            console.log('Message sent:', message);
        });

        // Send a test message
        function sendMessage(recipientId, message) {
            socket.emit('message:send', {
                recipientId,
                message
            });
        }

        // Make function available in console
        window.sendMessage = sendMessage;
    </script>
</body>
</html>
```

Open in browser and use console:
```javascript
sendMessage('USER_ID_HERE', 'Hello from browser!');
```

---

## ✅ Validation Testing

### Test Invalid Email
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "username": "test",
  "email": "invalid-email",
  "password": "123456"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Please provide a valid email"
}
```

### Test Short Password
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "username": "test",
  "email": "test@test.com",
  "password": "123"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters"
}
```

### Test Duplicate Username
Register same username twice.

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Username already taken"
}
```

---

## 🔒 Authentication Testing

### Test Without Token
```http
GET http://localhost:8000/api/auth/profile
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Test Invalid Token
```http
GET http://localhost:8000/api/auth/profile
Authorization: Bearer invalid_token_here
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 📤 File Upload Testing

### Test Valid Image
Upload a .jpg, .jpeg, .png, or .gif file under 5MB.

**Expected:** Success (200)

### Test Invalid File Type
Upload a .pdf or .txt file.

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Only image files are allowed (jpeg, jpg, png, gif)"
}
```

### Test Large File
Upload an image larger than 5MB.

**Expected Response (400):**
```json
{
  "success": false,
  "message": "File too large"
}
```

---

## 🧪 Complete Test Scenario

### Scenario: Two Users Chatting

**Step 1: Register Alice**
```bash
POST /api/auth/register
{
  "username": "alice",
  "email": "alice@test.com",
  "password": "123456"
}
```
Save Alice's token as `TOKEN_ALICE`

**Step 2: Register Bob**
```bash
POST /api/auth/register
{
  "username": "bob",
  "email": "bob@test.com",
  "password": "123456"
}
```
Save Bob's token as `TOKEN_BOB`
Save Bob's user ID as `BOB_ID`

**Step 3: Alice Gets All Users**
```bash
GET /api/users
Authorization: Bearer TOKEN_ALICE
```
Should see Bob in the list

**Step 4: Alice Sends Message to Bob**
```bash
POST /api/messages
Authorization: Bearer TOKEN_ALICE
{
  "recipient": "BOB_ID",
  "message": "Hi Bob!"
}
```

**Step 5: Bob Gets Conversation with Alice**
```bash
GET /api/messages/ALICE_ID
Authorization: Bearer TOKEN_BOB
```
Should see Alice's message

**Step 6: Bob Marks Messages as Read**
```bash
PUT /api/messages/ALICE_ID/read
Authorization: Bearer TOKEN_BOB
```

**Step 7: Bob Sends Reply**
```bash
POST /api/messages
Authorization: Bearer TOKEN_BOB
{
  "recipient": "ALICE_ID",
  "message": "Hello Alice!"
}
```

**Step 8: Alice Gets Updated Conversation**
```bash
GET /api/messages/BOB_ID
Authorization: Bearer TOKEN_ALICE
```
Should see both messages

---

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not, start it
sudo systemctl start mongod

# Or use Docker
docker start mongodb
```

### Issue: "Port 8000 already in use"
**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=3000
```

### Issue: "JWT_SECRET is not defined"
**Solution:**
Make sure `.env` file exists and has:
```
JWT_SECRET=your_secret_key_here
```

### Issue: "Cannot upload file"
**Solution:**
- Check file size (max 5MB)
- Check file type (only images)
- Make sure `uploads/` folder exists
- Check `UPLOAD_PATH` in `.env`

---

## ✅ Checklist

Before saying "My app is working":

- [ ] MongoDB connected successfully
- [ ] Server starts without errors
- [ ] Can register new user
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong password
- [ ] Can get profile with valid token
- [ ] Cannot access protected routes without token
- [ ] Can upload profile picture
- [ ] Can get list of users
- [ ] Can send message
- [ ] Can get conversation history
- [ ] Socket.io connects with JWT token
- [ ] Real-time messages work
- [ ] Online users list updates
- [ ] Validation errors show correct messages

---

## 📊 Expected Database Structure

After testing, check MongoDB:

```bash
mongosh
use chat-app-db
db.users.find().pretty()
db.messages.find().pretty()
```

**Users collection:**
```json
{
  "_id": ObjectId("..."),
  "username": "alice",
  "email": "alice@test.com",
  "password": "$2a$10$...", // Hashed!
  "profilePicture": "/uploads/...",
  "isOnline": true,
  "lastSeen": ISODate("..."),
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

**Messages collection:**
```json
{
  "_id": ObjectId("..."),
  "sender": ObjectId("..."),
  "recipient": ObjectId("..."),
  "message": "Hello!",
  "isRead": false,
  "readAt": null,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

---

**Happy Testing! 🎉**
