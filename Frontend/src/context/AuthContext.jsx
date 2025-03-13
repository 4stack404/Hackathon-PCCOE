import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await authAPI.getCurrentUser();
        if (response.data?.success) {
          setCurrentUser(response.data.data);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 