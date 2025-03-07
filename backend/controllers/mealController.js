import Meal from '../models/mealModel.js';
import { wrapResponse } from '../utils/responseWrapper.js';

// @desc    Get all meals
// @route   GET /api/meals
// @access  Private
export const getMeals = async (req, res) => {
  try {
    const { date } = req.query;
    let query = { user: req.user.id };

    // Add date filter if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const meals = await Meal.find(query).sort({ date: -1 });
    res.json(wrapResponse(true, meals));
  } catch (error) {
    console.error('Error getting meals:', error);
    res.status(500).json(wrapResponse(false, null, 'Server error'));
  }
};

// @desc    Get single meal
// @route   GET /api/meals/:id
// @access  Private
export const getMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json(wrapResponse(false, null, 'Meal not found'));
    }

    // Make sure user owns meal
    if (meal.user.toString() !== req.user.id.toString()) {
      return res.status(401).json(wrapResponse(false, null, 'Not authorized'));
    }

    res.json(wrapResponse(true, meal));
  } catch (error) {
    console.error('Error getting meal:', error);
    res.status(500).json(wrapResponse(false, null, 'Server error'));
  }
};

// @desc    Create new meal
// @route   POST /api/meals
// @access  Private
export const createMeal = async (req, res) => {
  try {
    const { name, type, calories, protein, carbs, fat, notes, date } = req.body;

    // Validate required fields
    if (!name || !type || calories === undefined) {
      return res.status(400).json(wrapResponse(false, null, 'Please provide all required fields'));
    }

    // Validate meal type
    if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(type)) {
      return res.status(400).json(wrapResponse(false, null, 'Invalid meal type'));
    }

    // Create meal with validated data
    const meal = await Meal.create({
      user: req.user.id,
      name,
      type,
      calories: Number(calories),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fat: Number(fat || 0),
      notes: notes || '',
      date: date || new Date()
    });

    res.status(201).json(wrapResponse(true, meal));
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json(wrapResponse(false, null, 'Server error'));
  }
};

// @desc    Update meal
// @route   PUT /api/meals/:id
// @access  Private
export const updateMeal = async (req, res) => {
  try {
    const { name, type, calories, protein, carbs, fat, notes, date } = req.body;

    // Validate required fields
    if (!name || !type || calories === undefined) {
      return res.status(400).json(wrapResponse(false, null, 'Please provide all required fields'));
    }

    // Validate meal type
    if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(type)) {
      return res.status(400).json(wrapResponse(false, null, 'Invalid meal type'));
    }

    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json(wrapResponse(false, null, 'Meal not found'));
    }

    // Make sure user owns meal
    if (meal.user.toString() !== req.user.id.toString()) {
      return res.status(401).json(wrapResponse(false, null, 'Not authorized'));
    }

    // Update meal with validated data
    meal = await Meal.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        calories: Number(calories),
        protein: Number(protein || 0),
        carbs: Number(carbs || 0),
        fat: Number(fat || 0),
        notes: notes || '',
        date: date || meal.date
      },
      { new: true, runValidators: true }
    );

    res.json(wrapResponse(true, meal));
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json(wrapResponse(false, null, 'Server error'));
  }
};

// @desc    Delete meal
// @route   DELETE /api/meals/:id
// @access  Private
export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json(wrapResponse(false, null, 'Meal not found'));
    }

    // Make sure user owns meal
    if (meal.user.toString() !== req.user.id.toString()) {
      return res.status(401).json(wrapResponse(false, null, 'Not authorized'));
    }

    await meal.deleteOne();

    res.json(wrapResponse(true, null, 'Meal removed'));
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json(wrapResponse(false, null, 'Server error'));
  }
};