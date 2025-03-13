import axios from 'axios';

// Create a separate instance for the external diet plan API
const dietPlanApi = axios.create({
  baseURL: 'https://hm0034-4stack.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Regular API for backend calls
const api = axios.create({
  baseURL:  'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.response?.data?.error?.message || 'Server error',
      errors: error.response?.data?.errors || error.response?.data?.error?.errors
    });
    return Promise.reject(error);
  }
);

/**
 * Diet Plan Service
 * 
 * This service handles operations related to diet plans.
 * A diet plan consists of meals for breakfast, lunch, dinner, and snacks.
 */
export const dietPlanService = {
  /**
   * Get all diet plans for the current user
   * @returns {Promise<Array>} Array of diet plans
   */
  getDietPlans: async () => {
    try {
      const response = await dietPlanApi.get('/diet-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching diet plans:', error);
      throw error;
    }
  },

  /**
   * Get a specific diet plan by ID
   * @param {string} id - The ID of the diet plan
   * @returns {Promise<Object>} The diet plan object
   */
  getDietPlan: async (id) => {
    try {
      const response = await dietPlanApi.get(`/diet-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching diet plan:', error);
      throw error;
    }
  },

  /**
   * Create a new diet plan
   * @param {Object} dietPlanData - The diet plan data
   * @returns {Promise<Object>} The created diet plan
   */
  createDietPlan: async (dietPlanData) => {
    try {
      const response = await dietPlanApi.post('/diet-plans', dietPlanData);
      return response.data;
    } catch (error) {
      console.error('Error creating diet plan:', error);
      throw error;
    }
  },

  /**
   * Update an existing diet plan
   * @param {string} id - The ID of the diet plan to update
   * @param {Object} dietPlanData - The updated diet plan data
   * @returns {Promise<Object>} The updated diet plan
   */
  updateDietPlan: async (id, dietPlanData) => {
    try {
      const response = await dietPlanApi.put(`/diet-plans/${id}`, dietPlanData);
      return response.data;
    } catch (error) {
      console.error('Error updating diet plan:', error);
      throw error;
    }
  },

  /**
   * Delete a diet plan
   * @param {string} id - The ID of the diet plan to delete
   * @returns {Promise<Object>} The response data
   */
  deleteDietPlan: async (id) => {
    try {
      const response = await dietPlanApi.delete(`/diet-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting diet plan:', error);
      throw error;
    }
  },

  /**
   * Get the user's saved diet plan from the database or localStorage
   * @returns {Promise<Object|null>} The saved diet plan or null if not found
   */
  getSavedDietPlan: async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User not logged in, checking localStorage for diet plan');
        // Try to get diet plan from localStorage
        const localDietPlan = localStorage.getItem('dietPlan');
        if (localDietPlan) {
          return JSON.parse(localDietPlan);
        }
        return null;
      }
      
      const response = await api.get('/diet-plans/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved diet plan:', error);
      // Try to get diet plan from localStorage as fallback
      const localDietPlan = localStorage.getItem('dietPlan');
      if (localDietPlan) {
        return JSON.parse(localDietPlan);
      }
      return null;
    }
  },

  /**
   * Save a diet plan to the database or localStorage
   * @param {Object} dietPlanData - The diet plan data to save
   * @param {number} calories - The calculated calories
   * @returns {Promise<Object|null>} The saved diet plan or null if not authenticated
   */
  saveDietPlan: async (dietPlanData, calories = 2000) => {
    try {
      // Always save to localStorage as fallback
      const localDietPlan = {
        diet_plan: dietPlanData,
        calorieGoal: calories,
        name: 'My Diet Plan',
        description: 'Personalized diet plan for pregnancy'
      };
      localStorage.setItem('dietPlan', JSON.stringify(localDietPlan));
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User not logged in, diet plan saved to localStorage only');
        return localDietPlan;
      }
      
      const response = await api.post('/diet-plans', {
        diet_plan: dietPlanData,
        name: 'My Diet Plan',
        description: 'Personalized diet plan for pregnancy',
        calorieGoal: calories
      });
      return response.data;
    } catch (error) {
      console.error('Error saving diet plan:', error);
      // Return the localStorage version as fallback
      return JSON.parse(localStorage.getItem('dietPlan'));
    }
  },

  /**
   * Generate a diet plan based on calorie requirements
   * @param {number} calories - The calorie requirement
   * @returns {Promise<Object>} The generated diet plan
   */
  generateDietPlan: async (calories) => {
    try {
      const response = await dietPlanApi.post('/diet-plan', { calories });
      return response.data;
    } catch (error) {
      console.error('Error generating diet plan:', error);
      throw error;
    }
  },

  /**
   * Calculate calorie requirements based on trimester
   * @param {string} trimester - The pregnancy trimester ('first', 'second', 'third', 'postnatal')
   * @param {Object} userInfo - User information including weight, height, age, activity level
   * @returns {number} The calculated calorie requirement
   */
  calculateCalories: (trimester, userInfo) => {
    // Base calorie calculation using Harris-Benedict equation
    // BMR = 655.1 + (9.563 × weight in kg) + (1.850 × height in cm) - (4.676 × age in years)
    const weight = userInfo.weight || 60; // Default weight in kg
    const height = userInfo.height || 165; // Default height in cm
    const age = userInfo.age || 30; // Default age
    
    // Calculate BMR (Basal Metabolic Rate)
    const bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
    
    // Activity level multiplier
    const activityLevels = {
      sedentary: 1.2, // Little or no exercise
      light: 1.375, // Light exercise 1-3 days/week
      moderate: 1.55, // Moderate exercise 3-5 days/week
      active: 1.725, // Hard exercise 6-7 days/week
      veryActive: 1.9 // Very hard exercise & physical job
    };
    
    const activityLevel = userInfo.activityLevel || 'light';
    const activityMultiplier = activityLevels[activityLevel];
    
    // Calculate maintenance calories
    let maintenanceCalories = bmr * activityMultiplier;
    
    // Adjust based on trimester
    let additionalCalories = 0;
    
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
      case 'postnatal':
        // Additional 330-400 calories for breastfeeding (using 400 to be safe)
        additionalCalories = 400;
        break;
      default:
        additionalCalories = 0;
    }
    
    return Math.round(maintenanceCalories + additionalCalories);
  },

  /**
   * Fetch user's calorie requirements from the API
   * @returns {Promise<Object>} The user's calorie data
   */
  getUserCalories: async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Set up headers with authentication token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      try {
        // Try the direct API endpoint first
        const response = await fetch('https://hm0034-4stack.onrender.com/api/diet-plan', {
          method: 'GET',
          headers,
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json();
          return data;
        }
        
        // If that fails, try the user profile endpoint
        console.log('Direct diet-plan endpoint failed, trying user profile endpoint...');
        const profileResponse = await fetch('https://hm0034-4stack.onrender.com/api/users/profile', {
          method: 'GET',
          headers,
          mode: 'cors'
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          // Extract calories from user profile
          const calories = profileData.calories || 
                          (profileData.healthInfo && profileData.healthInfo.nutrition && 
                           profileData.healthInfo.nutrition.calories) || 
                          2000;
          
          return { calories };
        }
        
        // If all API calls fail, use a fallback calculation
        console.log('All API endpoints failed, using fallback calculation...');
        return getFallbackCalories();
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        // If fetch fails completely, use fallback
        return getFallbackCalories();
      }
    } catch (error) {
      console.error('Error fetching user calories:', error);
      throw error;
    }
  },
  
  /**
   * Update user's calorie requirements
   * @param {number} calories - The new calorie value
   * @returns {Promise<Object>} The updated user data
   */
  updateUserCalories: async (calories) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Set up headers with authentication token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Make the API call to update user calories
      const response = await fetch('https://hm0034-4stack.onrender.com/api/diet-plan', {
        method: 'POST',
        headers,
        body: JSON.stringify({ calories }),
        // Remove credentials to avoid CORS preflight issues
        mode: 'cors'
      });
      
      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }
      
      try {
        const data = await response.json();
        return data;
      } catch {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error updating user calories:', error);
      throw error;
    }
  },

  /**
   * Get a diet plan based on trimester
   * @param {string} trimester - The pregnancy trimester ('first', 'second', 'third', 'postnatal')
   * @param {Object} userInfo - User information including weight, height, age, activity level
   * @returns {Promise<Object>} The generated diet plan
   */
  getDietPlanByTrimester: async (trimester, userInfo) => {
    try {
      // Calculate calories based on trimester and user info
      const calories = dietPlanService.calculateCalories(trimester, userInfo);
      
      // Generate diet plan with calculated calories
      return await dietPlanService.generateDietPlan(calories);
    } catch (error) {
      console.error('Error getting diet plan by trimester:', error);
      throw error;
    }
  }
};

/**
 * Diet Plan Model Structure
 * 
 * This is the expected structure for a diet plan object
 */
export const DietPlanModel = {
  id: '',
  userId: '',
  name: '',
  description: '',
  createdAt: '',
  updatedAt: '',
  diet_plan: {
    breakfast: [
      {
        comment: '',
        recipe_id: 0
      }
    ],
    lunch: [
      {
        comment: '',
        recipe_id: 0
      }
    ],
    dinner: [
      {
        comment: '',
        recipe_id: 0
      }
    ],
    snacks: [
      {
        name: '',
        description: '',
        calories: 0
      }
    ]
  }
};

/**
 * Create an empty diet plan object
 * @returns {Object} An empty diet plan object
 */
export const createEmptyDietPlan = () => {
  return {
    name: '',
    description: '',
    diet_plan: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    }
  };
};

/**
 * Create a meal item for breakfast, lunch, or dinner
 * @param {number} recipe_id - The ID of the recipe
 * @param {string} comment - A comment about the meal
 * @returns {Object} A meal item object
 */
export const createMealItem = (recipe_id, comment = '') => {
  return {
    recipe_id,
    comment
  };
};

/**
 * Create a snack item
 * @param {string} name - The name of the snack
 * @param {string} description - A description of the snack
 * @param {number} calories - The calorie count of the snack
 * @returns {Object} A snack item object
 */
export const createSnackItem = (name, description = '', calories = 0) => {
  return {
    name,
    description,
    calories
  };
};

/**
 * Fallback function to calculate calories when API is unavailable
 * @returns {Promise<Object>} The calculated calorie data
 */
const getFallbackCalories = () => {
  // Default values
  const calories = 2000;
  
  console.log('Using fallback calorie calculation:', calories);
  return Promise.resolve({ calories, source: 'fallback' });
};

/**
 * Helper function to extract error message from response
 * @param {Response} response - The fetch response object
 * @returns {Promise<string>} The error message
 */
const getErrorMessage = async (response) => {
  let errorMessage = `Server error: ${response.status} ${response.statusText}`;
  try {
    const errorData = await response.json();
    if (errorData && errorData.message) {
      errorMessage = errorData.message;
    }
  } catch {
    // Ignore JSON parsing error and use default error message
  }
  return errorMessage;
};

export default dietPlanService; 