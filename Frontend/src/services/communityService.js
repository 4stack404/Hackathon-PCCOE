import api from './api';

export const communityService = {
  // Get all questions
  async getQuestions() {
    try {
      const response = await api.get('/community/questions');
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // Get a single question by ID
  async getQuestion(id) {
    try {
      const response = await api.get(`/community/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  },

  // Create a new question
  async createQuestion(questionData) {
    try {
      const response = await api.post('/community/questions', questionData);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  // Update a question
  async updateQuestion(id, questionData) {
    try {
      const response = await api.put(`/community/questions/${id}`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  // Delete a question
  async deleteQuestion(id) {
    try {
      const response = await api.delete(`/community/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  // Add an answer to a question
  async addAnswer(questionId, answerData) {
    try {
      const response = await api.post(`/community/questions/${questionId}/answers`, answerData);
      return response.data;
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  },

  // Update an answer
  async updateAnswer(questionId, answerId, answerData) {
    try {
      const response = await api.put(`/community/questions/${questionId}/answers/${answerId}`, answerData);
      return response.data;
    } catch (error) {
      console.error('Error updating answer:', error);
      throw error;
    }
  },

  // Delete an answer
  async deleteAnswer(questionId, answerId) {
    try {
      const response = await api.delete(`/community/questions/${questionId}/answers/${answerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting answer:', error);
      throw error;
    }
  },

  // Like a question
  async likeQuestion(questionId) {
    try {
      const response = await api.post(`/community/questions/${questionId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking question:', error);
      throw error;
    }
  },

  // Like an answer
  async likeAnswer(questionId, answerId) {
    try {
      const response = await api.post(`/community/questions/${questionId}/answers/${answerId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking answer:', error);
      throw error;
    }
  },

  // Mark answer as accepted
  async acceptAnswer(questionId, answerId) {
    try {
      const response = await api.put(`/community/questions/${questionId}/answers/${answerId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Error accepting answer:', error);
      throw error;
    }
  }
}; 