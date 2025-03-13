import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

// Using named function for better HMR compatibility
export function useAuth() {
  return useContext(AuthContext);
}

// This is a guess at what your signup function might look like
const signup = async (userData) => {
  try {
    // Log the userData before sending to the API
    console.log('userData in signup function:', userData);
    
    // Make sure age is included in the request
    if (!userData.age) {
      console.error('Age is missing in userData');
      return { success: false, error: 'Age is required' };
    }
    
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    if (response.data.success) {
      // Handle successful signup
      setUser(response.data.data);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      return { success: true };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'An error occurred during signup' 
    };
  }
}; 