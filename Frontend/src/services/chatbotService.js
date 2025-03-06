import axios from 'axios';

const API_URL = 'https://pregnancy-wellness.onrender.com';

export const chatService = {
  // Send a question to the chatbot
  async askQuestion(question, topK = 5) {
    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        question,
        top_k: topK
      });
      return response.data;
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    }
  },

  // Check API health
  async checkHealth() {
    try {
      const response = await axios.get(`${API_URL}/api/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
}; 