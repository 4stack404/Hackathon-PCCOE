import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';

/**
 * Component that tracks route changes and shows loading animation
 * during navigation between pages
 */
const RouteChangeLoader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addLoadingSource, removeLoadingSource } = useLoading();
  const [prevPath, setPrevPath] = useState('');
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Show loading on initial render - immediately
  useEffect(() => {
    if (isInitialRender) {
      const initialSourceId = `initial-load-${Date.now()}`;
      // Show loading immediately
      addLoadingSource(initialSourceId);
      
      // Hide loading after a delay
      const timer = setTimeout(() => {
        removeLoadingSource(initialSourceId);
        setIsInitialRender(false);
      }, 0);
      
      return () => {
        clearTimeout(timer);
        removeLoadingSource(initialSourceId);
      };
    }
  }, [isInitialRender, addLoadingSource, removeLoadingSource]);
  
  // Show loading on route changes - immediately
  useEffect(() => {
    // If this is a route change or initial navigation
    if (location.pathname !== prevPath || isInitialRender) {
      // Show loading animation with a specific source ID - immediately
      const sourceId = `route-change-${Date.now()}`;
      addLoadingSource(sourceId);
      
      // Store the current path
      setPrevPath(location.pathname);
      
      // Hide loading animation after a short delay
      // This gives the impression of loading even for fast page changes
      const timer = setTimeout(() => {
        removeLoadingSource(sourceId);
      }, 800); // Adjust timing as needed
      
      return () => {
        clearTimeout(timer);
        removeLoadingSource(sourceId); // Ensure cleanup if component unmounts
      };
    }
  }, [location, prevPath, isInitialRender, addLoadingSource, removeLoadingSource]);
  
  // Handle programmatic navigation - immediately
  const originalPush = navigate;
  useEffect(() => {
    // Override navigate to show loading before navigation
    const handleNavigation = (to, options) => {
      // Only show loading if it's a different path
      if (to !== location.pathname) {
        const navSourceId = `navigate-${Date.now()}`;
        // Show loading immediately
        addLoadingSource(navSourceId);
        
        // Remove loading after a delay
        setTimeout(() => {
          removeLoadingSource(navSourceId);
        }, 0);
      }
      
      // Perform the original navigation
      originalPush(to, options);
    };
    
    // Replace the navigate function (for demonstration - this approach has limitations)
    // A more robust approach would be to create a custom navigation hook
    window.customNavigate = handleNavigation;
    
    return () => {
      // Clean up
      delete window.customNavigate;
    };
  }, [navigate, location.pathname, addLoadingSource, removeLoadingSource]);
  
  // This component doesn't render anything
  return null;
};

export default RouteChangeLoader;
