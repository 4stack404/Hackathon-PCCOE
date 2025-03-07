import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Divider
} from '@mui/material';
import usePageLoading from '../hooks/usePageLoading';
import { useLoading } from '../contexts/LoadingContext';
import useNavigateWithLoading from '../hooks/useNavigateWithLoading';

const LoadingExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addLoadingSource, removeLoadingSource } = useLoading();
  const navigateWithLoading = useNavigateWithLoading();
  
  // Use the usePageLoading hook to connect our local state to the global loading state
  usePageLoading(isLoading, 'loading-example-page');
  
  // Simulate loading for 3 seconds when button is clicked
  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };
  
  // Manually control loading state with direct context access
  const handleManualLoading = () => {
    // Add a loading source with a unique ID
    const sourceId = 'manual-loading-example';
    addLoadingSource(sourceId);
    
    // Remove it after 3 seconds
    setTimeout(() => {
      removeLoadingSource(sourceId);
    }, 3000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Loading Animation Example
        </Typography>
        
        <Typography variant="body1" paragraph>
          This page demonstrates how to use the heart-shaped loading animation in your components.
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Basic Usage with usePageLoading Hook
          </Typography>
          
          <Typography variant="body1" paragraph>
            The simplest way to use the loading animation is with the usePageLoading hook.
            Just connect your component's loading state to the hook.
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSimulateLoading}
            disabled={isLoading}
            sx={{ mr: 2 }}
          >
            {isLoading ? 'Loading...' : 'Simulate Loading (3s)'}
          </Button>
          
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            This button triggers a local state change which is connected to the global loading state via usePageLoading.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Advanced Usage with LoadingContext
          </Typography>
          
          <Typography variant="body1" paragraph>
            For more control, you can directly use the LoadingContext to manage loading sources.
          </Typography>
          
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleManualLoading}
            sx={{ mr: 2 }}
          >
            Manual Loading (3s)
          </Button>
          
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            This button directly adds and removes a loading source using the LoadingContext.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Page Transitions
          </Typography>
          
          <Typography variant="body1" paragraph>
            The loading animation automatically shows during page transitions.
            Click any of these links to see it in action:
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item>
              <Button component={Link} to="/" variant="outlined">
                Home Page
              </Button>
            </Grid>
            <Grid item>
              <Button component={Link} to="/dashboard" variant="outlined">
                Dashboard
              </Button>
            </Grid>
            <Grid item>
              <Button component={Link} to="/about" variant="outlined">
                About
              </Button>
            </Grid>
          </Grid>
          
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            These links use React Router's Link component which triggers the RouteChangeLoader.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Programmatic Navigation with Loading
          </Typography>
          
          <Typography variant="body1" paragraph>
            Use the useNavigateWithLoading hook for programmatic navigation with loading animation:
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigateWithLoading('/')}
              >
                Navigate to Home
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigateWithLoading('/dashboard')}
              >
                Navigate to Dashboard
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigateWithLoading('/about')}
              >
                Navigate to About
              </Button>
            </Grid>
          </Grid>
          
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            These buttons use our custom useNavigateWithLoading hook that ensures the loading animation is shown.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoadingExample;
