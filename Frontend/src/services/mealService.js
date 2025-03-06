import api from './api';

export const mealService = {
  // Get all meals or meals for a specific date
  getMeals: async (date = null) => {
    try {
      const url = date ? `/meals?date=${date}` : '/meals';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw error;
    }
  },

  // Get a single meal
  getMeal: async (id) => {
    try {
      const response = await api.get(`/meals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meal:', error);
      throw error;
    }
  },

  // Create a new meal
  createMeal: async (mealData) => {
    try {
      const response = await api.post('/meals', {
        ...mealData,
        date: mealData.date || new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  },

  // Update an existing meal
  updateMeal: async (id, mealData) => {
    try {
      const response = await api.put(`/meals/${id}`, mealData);
      return response.data;
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  },

  // Delete a meal
  deleteMeal: async (id) => {
    try {
      const response = await api.delete(`/meals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }
};

