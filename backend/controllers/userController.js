import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.gender = req.body.gender || user.gender;
      user.address = req.body.address || user.address;
      user.bio = req.body.bio || user.bio;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      
      if (req.body.pregnancyDetails) {
        user.pregnancyDetails = {
          ...user.pregnancyDetails,
          ...req.body.pregnancyDetails
        };
      }
      
      if (req.body.notifications) {
        user.notifications = {
          ...user.notifications,
          ...req.body.notifications
        };
      }
      
      if (req.body.preferences) {
        user.preferences = {
          ...user.preferences,
          ...req.body.preferences
        };
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        address: updatedUser.address,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        pregnancyDetails: updatedUser.pregnancyDetails,
        notifications: updatedUser.notifications,
        preferences: updatedUser.preferences
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Log user weight
// @route   POST /api/users/weight
// @access  Private
export const logWeight = async (req, res) => {
  try {
    const { weight } = req.body;

    if (!weight || isNaN(weight)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid weight value'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add new weight entry
    const weightEntry = {
      weight: Number(weight),
      date: new Date()
    };

    // Initialize weightHistory array if it doesn't exist
    if (!user.weightHistory) {
      user.weightHistory = [];
    }

    // Add new weight entry to history
    user.weightHistory.push(weightEntry);

    // Update current weight
    user.weight = Number(weight);

    await user.save();

    res.json({
      success: true,
      data: {
        currentWeight: user.weight,
        weightHistory: user.weightHistory
      }
    });
  } catch (error) {
    console.error('Error in logWeight:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging weight',
      error: error.message
    });
  }
};

// @desc    Get user weight history
// @route   GET /api/users/weight
// @access  Private
export const getWeightHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        currentWeight: user.weight,
        weightHistory: user.weightHistory || []
      }
    });
  } catch (error) {
    console.error('Error in getWeightHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weight history',
      error: error.message
    });
  }
};

/**
 * @desc    Get user's nutrition data
 * @route   GET /api/users/nutrition
 * @access  Private
 */
const getNutritionData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Construct nutrition data from user model
  const nutritionData = {
    calories: user.calories || null,
    protein: user.protein || null,
    carbohydrates: user.carbohydrates || null,
    fats: user.fats || null
  };

  // Check if we have nutrition data in healthInfo
  if (user.healthInfo && user.healthInfo.nutrition) {
    const healthInfoNutrition = user.healthInfo.nutrition;
    nutritionData.calories = healthInfoNutrition.calories || nutritionData.calories;
    nutritionData.protein = healthInfoNutrition.protein || nutritionData.protein;
    nutritionData.carbohydrates = healthInfoNutrition.carbohydrates || nutritionData.carbohydrates;
    nutritionData.fats = healthInfoNutrition.fats || nutritionData.fats;
  }

  // Calculate BMR if not available
  if (!nutritionData.calories) {
    // BMR = 655.1 + (9.563 × weight in kg) + (1.850 × height in cm) - (4.676 × age in years)
    const bmr = 655.1 + (9.563 * user.weight) + (1.850 * user.height) - (4.676 * user.age);
    
    // Assume light activity level (1.375) if not specified
    const activityMultiplier = 1.375;
    
    // Calculate maintenance calories
    let maintenanceCalories = bmr * activityMultiplier;
    
    // Adjust based on trimester if pregnancy details are available
    let additionalCalories = 0;
    if (user.pregnancyDetails && user.pregnancyDetails.trimester) {
      switch(user.pregnancyDetails.trimester) {
        case 1:
          // No additional calories needed in first trimester
          additionalCalories = 0;
          break;
        case 2:
          // Add 340 calories in second trimester
          additionalCalories = 340;
          break;
        case 3:
          // Add 450 calories in third trimester
          additionalCalories = 450;
          break;
        default:
          additionalCalories = 0;
      }
    }
    
    // Calculate total calories
    nutritionData.calories = Math.round(maintenanceCalories + additionalCalories);
    
    // Calculate macros if not available
    if (!nutritionData.protein) {
      nutritionData.protein = Math.round((nutritionData.calories * 0.15) / 4); // 15% of calories from protein
    }
    if (!nutritionData.fats) {
      nutritionData.fats = Math.round((nutritionData.calories * 0.3) / 9); // 30% of calories from fat
    }
    if (!nutritionData.carbohydrates) {
      nutritionData.carbohydrates = Math.round((nutritionData.calories * 0.55) / 4); // 55% of calories from carbs
    }
  }

  res.json(nutritionData);
});

export { getUserProfile, updateUserProfile, deleteUser, getNutritionData };
