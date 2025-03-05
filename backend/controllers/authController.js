import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';


const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    console.log(`Login attempt for email: ${email}`);
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User not found with email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password (user not found)' });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    console.log(`Password match result: ${isMatch}`);
    
    if (isMatch) {
      // Generate token
      const token = generateToken(user._id);
      console.log(`Token generated for user: ${user._id}`);
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token
      });
    } else {
      console.log(`Password mismatch for user: ${email}`);
      res.status(401).json({ message: 'Invalid email or password (password mismatch)' });
    }
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // Include other user fields as needed
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        profilePicture: user.profilePicture,
        pregnancyDetails: user.pregnancyDetails,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { registerUser, loginUser, getCurrentUser };
