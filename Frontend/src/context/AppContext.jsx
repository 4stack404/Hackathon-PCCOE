import React, { createContext } from 'react';

// Create the app context
export const AppContent = createContext({
  backendUrl: import.meta.env.VITE_BACKEND_URL
});

// Create a provider component
export const AppProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    backendUrl
  };

  return (
    <AppContent.Provider value={value}>
      {children}
    </AppContent.Provider>
  );
};
