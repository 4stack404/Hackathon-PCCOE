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
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
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
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Create a new meal
  createMeal: async (mealData) => {
    try {
      console.log('Creating meal with data:', mealData);
      const response = await api.post('/meals', {
        ...mealData,
        date: mealData.date || new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating meal:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Update an existing meal
  updateMeal: async (id, mealData) => {
    try {
      console.log('Updating meal with ID:', id, 'and data:', mealData);
      const response = await api.put(`/meals/${id}`, mealData);
      return response.data;
    } catch (error) {
      console.error('Error updating meal:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Delete a meal
  deleteMeal: async (id) => {
    try {
      console.log('Deleting meal with ID:', id);
      const response = await api.delete(`/meals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting meal:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  }
};

