import express from 'express';
import {
  getDietPlans,
  getUserDietPlan,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
  getActiveDietPlan,
  generateDietPlan,
  getUserCalories,
  updateUserCalories
} from '../controllers/dietPlanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all diet plans and create a new diet plan
router.route('/')
  .get(protect, getDietPlans)
  .post(protect, createDietPlan);

// Get the most recent diet plan for the current user
router.route('/user')
  .get(protect, getUserDietPlan);

// Get and update user calories
router.route('/diet-plan')
  .get(protect, getUserCalories)
  .post(protect, updateUserCalories);

// Get, update, and delete a specific diet plan
router.route('/:id')
  .put(protect, updateDietPlan)
  .delete(protect, deleteDietPlan);

export default router; 