import { useState, useCallback } from 'react';

/**
 * Custom hook for making API calls with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - { data, loading, error, execute }
 */
const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFunction(...params);
      setData(response.data);
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong';
      setError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
};

export default useApi; 