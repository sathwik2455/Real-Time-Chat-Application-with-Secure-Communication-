const { Server } = require("socket.io");
const http = require("http");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const Message = require("../models/Message");

let io;
let server;
const onlineUsers = new Map();

function createServer(app) {
    server = http.createServer(app);
    io = new Server(server, {
        cors: {
            origin: JSON.parse(process.env.ALLOWED_ORIGINS),
            credentials: true
        }
    });
    
    setupSocketHandlers();
    startServer();
}

function setupSocketHandlers() {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('No token provided'));
            }

            const decoded = verifyToken(token);
            if (!decoded) {
                return next(new Error('Invalid token'));
            }

            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on("connection", handleConnection);
}

async function handleConnection(socket) {
    const user = socket.user;
    console.log(`${user.username} connected`);

    onlineUsers.set(user._id.toString(), socket.id);

    await User.findByIdAndUpdate(user._id, {
        isOnline: true,
        lastSeen: new Date()
    });

    io.emit("users:online", Array.from(onlineUsers.keys()));

    socket.emit("user:connected", {
        userId: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
    });

    socket.on("message:send", async (data) => {
        try {
            const { recipientId, message } = data;

            if (!recipientId || !message || message.trim().length === 0) {
                socket.emit("error", { message: "Invalid message data" });
                return;
            }

            const newMessage = await Message.create({
                sender: user._id,
                recipient: recipientId,
                message: message.trim()
            });

            await newMessage.populate('sender', 'username profilePicture');
            await newMessage.populate('recipient', 'username profilePicture');

            const messageData = {
                _id: newMessage._id,
                sender: newMessage.sender,
                recipient: newMessage.recipient,
                message: newMessage.message,
                isRead: newMessage.isRead,
                createdAt: newMessage.createdAt
            };

            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("message:receive", messageData);
            }

            socket.emit("message:sent", messageData);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    socket.on("typing:start", (data) => {
        const { recipientId } = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("typing:start", {
                userId: user._id,
                username: user.username
            });
        }
    });

    socket.on("typing:stop", (data) => {
        const { recipientId } = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("typing:stop", {
                userId: user._id
            });
        }
    });

    socket.on("disconnect", async () => {
        console.log(`${user.username} disconnected`);
        onlineUsers.delete(user._id.toString());

        await User.findByIdAndUpdate(user._id, {
            isOnline: false,
            lastSeen: new Date()
        });

        io.emit("users:online", Array.from(onlineUsers.keys()));
    });
}

function startServer() {
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`✅ Socket.io ready`);
    });
}

module.exports = { createServer };
