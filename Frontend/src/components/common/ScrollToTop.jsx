import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to top of the page when route changes
 * This ensures that all pages open from the top when navigating
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of the page when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use 'auto' for immediate scrolling without animation
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;
