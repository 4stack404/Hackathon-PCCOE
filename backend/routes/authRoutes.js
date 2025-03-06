import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  sendPasswordResetOTP,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   GET /api/auth/login
// @desc    Provide helpful error for incorrect method
// @access  Public
router.get('/login', (req, res) => {
  res.status(405).json({ message: 'Method not allowed. Use POST for login.' });
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getCurrentUser);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP
// @access  Public
router.post('/forgot-password', sendPasswordResetOTP);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', resetPassword);

// @route   GET /api/auth/debug
// @desc    Debug endpoint to check user existence
// @access  Public
router.get('/debug', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }
    
    const user = await User.findOne({ email }).select('-password');
    
    if (user) {
      res.json({ 
        message: 'User found', 
        userExists: true, 
        userId: user._id,
        name: user.name,
        email: user.email
      });
    } else {
      res.json({ 
        message: 'User not found', 
        userExists: false 
      });
    }
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; 