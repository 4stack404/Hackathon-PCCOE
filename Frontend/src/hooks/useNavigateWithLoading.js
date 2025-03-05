import { useNavigate } from 'react-router-dom';
import { useLoading } from '../contexts/LoadingContext';

/**
 * Custom hook that extends React Router's useNavigate hook to show loading animation
 * during navigation and scroll to top of the page
 * 
 * @param {number} loadingDuration - Duration in ms to show the loading animation (default: 800ms)
 * @returns {Function} - Enhanced navigate function that shows loading animation and scrolls to top
 */
const useNavigateWithLoading = (loadingDuration = 800) => {
  const navigate = useNavigate();
  const { addLoadingSource, removeLoadingSource } = useLoading();
  
  // Enhanced navigate function that shows loading animation and scrolls to top
  const navigateWithLoading = (to, options) => {
    // Create a unique source ID for this navigation
    const sourceId = `navigate-${Date.now()}`;
    
    // Show loading animation immediately
    addLoadingSource(sourceId);
    
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use 'auto' for immediate scrolling without animation
    });
    
    // Perform the actual navigation
    navigate(to, options);
    
    // Hide loading animation after the specified duration
    setTimeout(() => {
      removeLoadingSource(sourceId);
    }, loadingDuration);
  };
  
  return navigateWithLoading;
};

export default useNavigateWithLoading;
