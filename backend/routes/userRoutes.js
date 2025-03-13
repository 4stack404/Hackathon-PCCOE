import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  logWeight,
  getWeightHistory,
  getNutritionData
} from '../controllers/userController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUser);

router.route('/weight')
  .get(getWeightHistory)
  .post(logWeight);

// Nutrition data route
router.get('/nutrition', getNutritionData);

export default router; 