import DietPlan from '../models/dietPlanModel.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Get all diet plans for the current user
 * @route   GET /api/diet-plans
 * @access  Private
 */
const getDietPlans = asyncHandler(async (req, res) => {
  const dietPlans = await DietPlan.find({ user: req.user._id });
  res.json(dietPlans);
});

/**
 * @desc    Get the most recent diet plan for the current user
 * @route   GET /api/diet-plans/user
 * @access  Private
 */
const getUserDietPlan = asyncHandler(async (req, res) => {
  // Find the most recent diet plan for the user
  const dietPlan = await DietPlan.findOne({ user: req.user._id })
    .sort({ createdAt: -1 });

  if (dietPlan) {
    res.json(dietPlan);
  } else {
    res.status(404);
    throw new Error('No diet plan found for this user');
  }
});

/**
 * @desc    Create a new diet plan
 * @route   POST /api/diet-plans
 * @access  Private
 */
const createDietPlan = asyncHandler(async (req, res) => {
  const { name, description, diet_plan, calorieGoal } = req.body;

  // Check if required fields are provided
  if (!diet_plan) {
    res.status(400);
    throw new Error('Diet plan data is required');
  }

  // Create a new diet plan
  const dietPlan = new DietPlan({
    user: req.user._id,
    name: name || 'My Diet Plan',
    description: description || 'Personalized diet plan for pregnancy',
    diet_plan,
    calorieGoal: calorieGoal || 2000
  });

  const createdDietPlan = await dietPlan.save();
  res.status(201).json(createdDietPlan);
});

/**
 * @desc    Update an existing diet plan
 * @route   PUT /api/diet-plans/:id
 * @access  Private
 */
const updateDietPlan = asyncHandler(async (req, res) => {
  const { name, description, diet_plan, calorieGoal } = req.body;

  const dietPlan = await DietPlan.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (dietPlan) {
    dietPlan.name = name || dietPlan.name;
    dietPlan.description = description || dietPlan.description;
    dietPlan.diet_plan = diet_plan || dietPlan.diet_plan;
    dietPlan.calorieGoal = calorieGoal || dietPlan.calorieGoal;

    const updatedDietPlan = await dietPlan.save();
    res.json(updatedDietPlan);
  } else {
    res.status(404);
    throw new Error('Diet plan not found');
  }
});

/**
 * @desc    Delete a diet plan
 * @route   DELETE /api/diet-plans/:id
 * @access  Private
 */
const deleteDietPlan = asyncHandler(async (req, res) => {
  const dietPlan = await DietPlan.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (dietPlan) {
    await dietPlan.deleteOne();
    res.json({ message: 'Diet plan removed' });
  } else {
    res.status(404);
    throw new Error('Diet plan not found');
  }
});

/**
 * @desc    Get the active diet plan for the current user
 * @route   GET /api/diet-plans/active
 * @access  Private
 */
const getActiveDietPlan = asyncHandler(async (req, res) => {
  const now = new Date();
  
  const activeDietPlan = await DietPlan.findOne({
    user: req.user._id,
    isActive: true,
    startDate: { $lte: now },
    $or: [
      { endDate: { $gte: now } },
      { endDate: null }
    ]
  });

  if (activeDietPlan) {
    res.json(activeDietPlan);
  } else {
    res.status(404);
    throw new Error('No active diet plan found');
  }
});

/**
 * @desc    Generate a diet plan based on user preferences
 * @route   POST /api/diet-plans/generate
 * @access  Private
 */
const generateDietPlan = asyncHandler(async (req, res) => {
  const {
    calorieGoal,
    pregnancyStage,
    dietaryRestrictions,
    allergies,
    preferredCuisines
  } = req.body;

  // This would typically involve more complex logic, possibly calling an external API
  // or using a recommendation algorithm. For now, we'll create a simple template.
  
  const dietPlanTemplate = {
    name: `${pregnancyStage || 'Custom'} Diet Plan`,
    description: `Auto-generated diet plan with a calorie goal of ${calorieGoal || 'unspecified'}.`,
    diet_plan: {
      breakfast: [
        {
          comment: "A nutrient-dense breakfast option suitable for your dietary needs.",
          recipe_id: 9
        },
        {
          comment: "A fiber-rich breakfast option to start your day.",
          recipe_id: 10
        }
      ],
      lunch: [
        {
          comment: "A balanced lunch option with protein and vegetables.",
          recipe_id: 1
        },
        {
          comment: "A nutritious lunch that provides sustained energy.",
          recipe_id: 3
        }
      ],
      dinner: [
        {
          comment: "A well-balanced dinner with lean protein and complex carbs.",
          recipe_id: 2
        },
        {
          comment: "A nutritious dinner option rich in essential nutrients.",
          recipe_id: 11
        }
      ],
      snacks: [
        {
          name: "Fresh Fruit Mix",
          description: "A mix of seasonal fruits for a natural energy boost.",
          calories: 60
        },
        {
          name: "Greek Yogurt with Honey",
          description: "Protein-rich snack to keep you satisfied between meals.",
          calories: 120
        }
      ]
    },
    startDate: new Date(),
    calorieGoal: calorieGoal || 2000,
    pregnancyStage: pregnancyStage || 'not_applicable',
    tags: [...(dietaryRestrictions || []), ...(preferredCuisines || [])]
  };

  // Create the diet plan in the database
  const dietPlan = new DietPlan({
    user: req.user._id,
    ...dietPlanTemplate
  });

  const createdDietPlan = await dietPlan.save();
  res.status(201).json(createdDietPlan);
});

/**
 * @desc    Get user's calorie requirements
 * @route   GET /api/diet-plans/diet-plan
 * @access  Private
 */
const getUserCalories = asyncHandler(async (req, res) => {
  // Get the user from the request (set by the auth middleware)
  const user = req.user;
  
  // Check if the user has a healthInfo object with calories
  if (user.healthInfo && user.healthInfo.calories) {
    res.json({ calories: user.healthInfo.calories });
  } else {
    // If no calories are set, calculate based on user data
    let calories = 2000; // Default value
    
    if (user.healthInfo) {
      // Calculate BMR using Harris-Benedict equation for women
      // BMR = 655.1 + (9.563 × weight in kg) + (1.850 × height in cm) - (4.676 × age in years)
      const weight = user.healthInfo.weight || 60; // Default weight in kg
      const height = user.healthInfo.height || 165; // Default height in cm
      const age = user.healthInfo.age || 30; // Default age
      
      // Calculate BMR
      const bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
      
      // Activity level multiplier
      const activityLevels = {
        sedentary: 1.2, // Little or no exercise
        light: 1.375, // Light exercise 1-3 days/week
        moderate: 1.55, // Moderate exercise 3-5 days/week
        active: 1.725, // Hard exercise 6-7 days/week
        veryActive: 1.9 // Very hard exercise & physical job
      };
      
      const activityLevel = user.healthInfo.activityLevel || 'light';
      const activityMultiplier = activityLevels[activityLevel];
      
      // Calculate maintenance calories
      let maintenanceCalories = bmr * activityMultiplier;
      
      // Adjust based on pregnancy stage if applicable
      let additionalCalories = 0;
      
      if (user.healthInfo.isPregnant) {
        const trimester = user.healthInfo.trimester || 'first';
        
        switch(trimester) {
          case 'first':
            // No additional calories needed in first trimester
            additionalCalories = 0;
            break;
          case 'second':
            // Additional 340 calories per day in second trimester
            additionalCalories = 340;
            break;
          case 'third':
            // Additional 450 calories per day in third trimester
            additionalCalories = 450;
            break;
          default:
            additionalCalories = 0;
        }
      }
      
      calories = Math.round(maintenanceCalories + additionalCalories);
    }
    
    res.json({ calories });
  }
});

/**
 * @desc    Update user's calorie requirements
 * @route   POST /api/diet-plans/diet-plan
 * @access  Private
 */
const updateUserCalories = asyncHandler(async (req, res) => {
  const { calories } = req.body;
  
  // Validate input
  if (!calories || isNaN(calories) || calories <= 0) {
    res.status(400);
    throw new Error('Please provide a valid calorie value');
  }
  
  // Get the user from the request (set by the auth middleware)
  const user = req.user;
  
  // Update the user's healthInfo with the new calories
  if (!user.healthInfo) {
    user.healthInfo = {};
  }
  
  user.healthInfo.calories = calories;
  
  // Save the updated user
  await user.save();
  
  res.json({ calories: user.healthInfo.calories });
});

export {
  getDietPlans,
  getUserDietPlan,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
  getActiveDietPlan,
  generateDietPlan,
  getUserCalories,
  updateUserCalories
}; 