import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import LoadingHeart from '../components/common/LoadingHeart';

// Create the loading context
const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  addLoadingSource: () => {},
  removeLoadingSource: () => {},
});

// Create a provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingSources = useRef(new Set());
  
  // Set loading state directly (for simple cases)
  const setLoading = (loading) => {
    if (loading) {
      // Add a generic source
      addLoadingSource('generic');
    } else {
      // Remove the generic source
      removeLoadingSource('generic');
    }
  };
  
  // Add a loading source
  const addLoadingSource = (sourceId) => {
    loadingSources.current.add(sourceId);
    updateLoadingState();
  };
  
  // Remove a loading source
  const removeLoadingSource = (sourceId) => {
    loadingSources.current.delete(sourceId);
    updateLoadingState();
  };
  
  // Update the loading state based on active sources
  const updateLoadingState = () => {
    setIsLoading(loadingSources.current.size > 0);
  };
  
  // Clean up any lingering loading sources on unmount
  useEffect(() => {
    return () => {
      loadingSources.current.clear();
      setIsLoading(false);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      setLoading, 
      addLoadingSource, 
      removeLoadingSource 
    }}>
      {children}
      {isLoading && <LoadingHeart />}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
