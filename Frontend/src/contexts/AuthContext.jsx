import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token and get current user data
          const response = await authAPI.getCurrentUser();
          if (response.data) {
            setCurrentUser(response.data.data);
            // Update stored user data with latest from server
            localStorage.setItem('user', JSON.stringify(response.data.data));
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { data, success } = response.data;
      
      if (success && data) {
        // Store token and complete user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        // Set current user with complete data
        setCurrentUser(data);
        
        return { success: true };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setError(null);
      // Transform the userData to match the backend schema
      const transformedData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        height: Number(userData.height),
        weight: Number(userData.weight),
        pregnancyDetails: {
          dueDate: userData.pregnancyDetails.dueDate,
          firstPregnancy: userData.pregnancyDetails.firstPregnancy,
          medicalConditions: userData.pregnancyDetails.medicalConditions || []
        },
        dietType: userData.dietType,
        notificationPreference: userData.notificationPreference,
        healthInfo: {
          medicalConditions: userData.healthInfo?.medicalConditions || []
        },
        notifications: {
          email: userData.notifications?.email || false,
          sms: userData.notifications?.sms || false,
          push: true
        },
        preferences: {
          dietaryRestrictions: [userData.dietType],
          notificationSettings: {
            email: userData.notifications?.email || false,
            push: true
          },
          language: 'English',
          theme: 'Light',
          units: 'Imperial'
        }
      };

      console.log('Sending registration data:', transformedData);

      const response = await authAPI.register(transformedData);
      const { data, success } = response.data;
      
      if (success && data) {
        // Store token and complete user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        // Set current user with complete data
        setCurrentUser(data);
        
        return { success: true };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Update user function
  const updateUser = (userData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...userData
    }));
    localStorage.setItem('user', JSON.stringify({
      ...currentUser,
      ...userData
    }));
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUser,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 