const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// ============ PUBLIC ROUTES ============
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Chat API is running',
        version: '2.0.0'
    });
});

// Auth routes
router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);

// ============ PROTECTED ROUTES (Require Authentication) ============

// Profile routes
router.get('/api/auth/profile', authMiddleware, authController.getProfile);
router.post('/api/auth/logout', authMiddleware, authController.logout);
router.post('/api/auth/upload-profile-picture', 
    authMiddleware, 
    upload.single('profilePicture'), 
    authController.updateProfilePicture
);

// User routes
router.get('/api/users', authMiddleware, userController.getAllUsers);
router.get('/api/users/online', authMiddleware, userController.getOnlineUsers);
router.get('/api/users/search', authMiddleware, userController.searchUsers);

// Message routes
router.get('/api/messages/:userId', authMiddleware, messageController.getConversation);
router.post('/api/messages', authMiddleware, messageController.sendMessage);
router.put('/api/messages/:userId/read', authMiddleware, messageController.markAsRead);
router.get('/api/messages/unread/count', authMiddleware, messageController.getUnreadCount);

module.exports = router;
