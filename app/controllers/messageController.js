const Message = require('../models/Message');
const { messageSchema } = require('../validators/authValidator');

// Get conversation between two users
exports.getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        // Get messages between current user and specified user
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId }
            ]
        })
        .populate('sender', 'username profilePicture')
        .populate('recipient', 'username profilePicture')
        .sort({ createdAt: 1 })
        .limit(100); // Last 100 messages

        res.status(200).json({
            success: true,
            data: {
                messages
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Send message (REST API - backup for Socket.io)
exports.sendMessage = async (req, res) => {
    try {
        // Validate input
        const { error } = messageSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { recipient, message } = req.body;

        // Create message
        const newMessage = await Message.create({
            sender: req.user._id,
            recipient,
            message
        });

        // Populate sender and recipient info
        await newMessage.populate('sender', 'username profilePicture');
        await newMessage.populate('recipient', 'username profilePicture');

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: {
                message: newMessage
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
    try {
        const { userId } = req.params;

        // Mark all messages from userId to current user as read
        await Message.updateMany(
            {
                sender: userId,
                recipient: req.user._id,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({
            recipient: req.user._id,
            isRead: false
        });

        res.status(200).json({
            success: true,
            data: {
                unreadCount: count
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
