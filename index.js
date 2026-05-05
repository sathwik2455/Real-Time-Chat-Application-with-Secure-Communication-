require('dotenv').config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const router = require("./app/routes/route");
const socketServer = require("./app/socket/socket");

// ============ DATABASE CONNECTION ============
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// ============ MIDDLEWARE ============

// Security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: JSON.parse(process.env.ALLOWED_ORIGINS),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============ ROUTES ============
app.use('/', router);

// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============ START SERVER ============
socketServer.createServer(app);
