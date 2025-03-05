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
          setCurrentUser(response.data);
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
      const userData = response.data;
      
      // Store token and user data
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify({
        _id: userData._id,
        name: userData.name,
        email: userData.email
      }));
      
      setCurrentUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email
      });
      
      return { success: true };
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
      const response = await authAPI.register(userData);
      const user = response.data;
      
      // Store token and user data
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email
      }));
      
      setCurrentUser({
        _id: user._id,
        name: user.name,
        email: user.email
      });
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg || 
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

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 