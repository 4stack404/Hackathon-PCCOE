import axios from 'axios';

// Define multiple API endpoints to try
const API_ENDPOINTS = [
  'https://pregnancy-wellness.onrender.com',
  'https://hm0034-4stack-1.onrender.com', // Fallback to your main API
  'http://localhost:5000' // Local development fallback
];

// Function to try different API endpoints
const tryApiEndpoints = async (apiCall) => {
  let lastError = null;
  
  for (const endpoint of API_ENDPOINTS) {
    try {
      const result = await apiCall(endpoint);
      console.log(`Successfully connected to API endpoint: ${endpoint}`);
      return result;
    } catch (error) {
      console.warn(`Failed to connect to API endpoint: ${endpoint}`, error);
      lastError = error;
    }
  }
  
  // If all endpoints fail, throw the last error
  throw lastError;
};

export const chatService = {
  // Send a question to the chatbot
  async askQuestion(question, topK = 5) {
    return tryApiEndpoints(async (endpoint) => {
      const response = await axios.post(`${endpoint}/api/chat`, {
        question,
        top_k: topK
      });
      return response.data;
    });
  },

  // Check API health
  async checkHealth() {
    return tryApiEndpoints(async (endpoint) => {
      const response = await axios.get(`${endpoint}/api/health`);
      return response.data;
    });
  }
}; 