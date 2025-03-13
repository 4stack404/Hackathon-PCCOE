import mongoose from 'mongoose';

// Schema for meal items (breakfast, lunch, dinner)
const mealItemSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  recipe_id: {
    type: Number,
    required: true
  }
}, { _id: false });

// Schema for snack items
const snackItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  }
}, { _id: false });

// Schema for the diet plan content
const dietPlanContentSchema = new mongoose.Schema({
  breakfast: {
    type: [mealItemSchema],
    default: []
  },
  lunch: {
    type: [mealItemSchema],
    default: []
  },
  dinner: {
    type: [mealItemSchema],
    default: []
  },
  snacks: {
    type: [snackItemSchema],
    default: []
  }
}, { _id: false });

// Main diet plan schema
const dietPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  diet_plan: {
    type: dietPlanContentSchema,
    required: true
  },
  calorieGoal: {
    type: Number,
    default: 2000
  }
}, {
  timestamps: true
});

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan; 