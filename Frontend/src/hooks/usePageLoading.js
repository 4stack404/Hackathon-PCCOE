import { useEffect, useRef } from 'react';
import { useLoading } from '../contexts/LoadingContext';

/**
 * A custom hook to handle page loading state
 * @param {boolean} isLoading - The loading state
 * @param {string} sourceId - Optional unique identifier for this loading source
 * @param {Array} dependencies - Dependencies to watch for changes (optional)
 */
const usePageLoading = (isLoading, sourceId = null, dependencies = []) => {
  const { addLoadingSource, removeLoadingSource } = useLoading();
  const uniqueSourceId = useRef(sourceId || `page-loading-${Math.random().toString(36).substr(2, 9)}`);
  
  useEffect(() => {
    if (isLoading) {
      addLoadingSource(uniqueSourceId.current);
    } else {
      removeLoadingSource(uniqueSourceId.current);
    }
    
    // Clean up when component unmounts
    return () => {
      removeLoadingSource(uniqueSourceId.current);
    };
  }, [isLoading, addLoadingSource, removeLoadingSource, ...dependencies]);
};

export default usePageLoading;
