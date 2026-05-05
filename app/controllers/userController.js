const User = require('../models/User');

// Get all users (for chat list)
exports.getAllUsers = async (req, res) => {
    try {
        // Get all users except current user
        const users = await User.find({
            _id: { $ne: req.user._id }
        }).select('-password').sort({ username: 1 });

        res.status(200).json({
            success: true,
            data: {
                users
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

// Get online users
exports.getOnlineUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user._id },
            isOnline: true
        }).select('-password').sort({ username: 1 });

        res.status(200).json({
            success: true,
            data: {
                users
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

// Search users
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const users = await User.find({
            _id: { $ne: req.user._id },
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('-password').limit(10);

        res.status(200).json({
            success: true,
            data: {
                users
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
