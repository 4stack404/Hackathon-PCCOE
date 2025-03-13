import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import transporter from '../config/nodemailer.js';
import {
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplate.js";


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body); // Add debug log

    const { 
      name, 
      email, 
      password,
      phone,
      height,
      weight,
      pregnancyDetails,
      dietType,
      notificationPreference,
      healthInfo,
      notifications,
      preferences,
      age,
      bmr,
      calories
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !height || !weight || !dietType || !notificationPreference || !pregnancyDetails?.dueDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          height: !height ? 'Height is required' : null,
          weight: !weight ? 'Weight is required' : null,
          dietType: !dietType ? 'Diet type is required' : null,
          notificationPreference: !notificationPreference ? 'Notification preference is required' : null,
          'pregnancyDetails.dueDate': !pregnancyDetails?.dueDate ? 'Due date is required' : null
        }
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Ensure age is set
    const userAge = age || 25; // Default to 25 if not provided
    
    // Create user with all details
    const userData = {
      name,
      email,
      password,
      phone: phone || '',
      height: Number(height),
      weight: Number(weight),
      age: userAge,
      bmr,
      calories,
      pregnancyDetails: {
        ...pregnancyDetails,
        dueDate: new Date(pregnancyDetails.dueDate),
        firstPregnancy: pregnancyDetails.firstPregnancy === 'yes',
        medicalConditions: pregnancyDetails.medicalConditions || []
      },
      dietType,
      notificationPreference,
      healthInfo: {
        ...healthInfo,
        age: userAge
      },
      notifications: notifications || {
        email: true,
        push: true,
        sms: false
      },
      preferences: preferences || {
        dietaryRestrictions: [],
        notificationSettings: {
          email: true,
          push: true
        },
        language: 'English',
        theme: 'Light',
        units: 'Imperial'
      },
      weightHistory: [{
        weight: Number(weight),
        date: new Date()
      }]
    };

    console.log('Creating user with data:', userData); // Add debug log

    const user = await User.create(userData);

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      try {
        // Send welcome email
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: email,
          subject: "Welcome to Pregnancy App",
          html: WELCOME_EMAIL_TEMPLATE
            .replace("{{name}}", name)
            .replace("{{welcome_link}}", process.env.FRONTEND_URL)
            .replace("{{email}}", email)
            .replace("{{password}}", password)
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Welcome email error:', emailError);
        // Continue with registration even if email fails
      }

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          height: user.height,
          weight: user.weight,
          pregnancyDetails: user.pregnancyDetails,
          healthInfo: user.healthInfo,
          notifications: user.notifications,
          preferences: user.preferences,
          dietType: user.dietType,
          notificationPreference: user.notificationPreference,
          token
        },
        message: 'Registration successful'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid user data' 
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    // Send more detailed error information
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed',
      error: {
        message: error.message,
        errors: error.errors ? Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {}) : undefined
      }
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both email and password' 
      });
    }

    console.log(`Login attempt for email: ${email}`);
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`User not found with email: ${email}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    console.log(`Password match result: ${isMatch}`);
    
    if (isMatch) {
      // Generate token
      const token = generateToken(user._id);
      console.log(`Token generated for user: ${user._id}`);
      
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          height: user.height,
          weight: user.weight,
          pregnancyDetails: user.pregnancyDetails,
          healthInfo: user.healthInfo,
          notifications: user.notifications,
          preferences: user.preferences,
          token
        }
      });
    } else {
      console.log(`Password mismatch for user: ${email}`);
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          height: user.height,
          weight: user.weight,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          profilePicture: user.profilePicture,
          pregnancyDetails: user.pregnancyDetails,
          healthInfo: user.healthInfo,
          notifications: user.notifications,
          preferences: user.preferences,
          dietType: user.dietType,
          notificationPreference: user.notificationPreference,
          weightHistory: user.weightHistory,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Send password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save OTP to user document
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset your Pregnancy App password",
      html: PASSWORD_RESET_TEMPLATE
        .replace("{{otp}}", otp)
        .replace("{{email}}", user.email)
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Password reset OTP sent to your email"
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate OTP
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    // Update password
    user.password = newPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = null;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
