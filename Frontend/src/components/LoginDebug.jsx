import { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';

const LoginDebug = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [userExists, setUserExists] = useState(null);
  const [loginResult, setLoginResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkUserExists = async () => {
    setLoading(true);
    setError(null);
    setUserExists(null);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/debug?email=${checkEmail}`);
      setUserExists(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setLoginResult(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });
      
      setLoginResult(response.data);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email
      }));
      
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Login Debug Tool</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Check User Existence</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email to Check"
                type="email"
                value={checkEmail}
                onChange={(e) => setCheckEmail(e.target.value)}
                fullWidth
              />
              
              <Button 
                variant="contained" 
                onClick={checkUserExists}
                disabled={loading || !checkEmail}
              >
                Check User
              </Button>
            </Box>
            
            {userExists && (
              <Box sx={{ mt: 2, p: 2, bgcolor: userExists.userExists ? '#E8F5E9' : '#FFEBEE', borderRadius: 1 }}>
                <Typography variant="subtitle2" color={userExists.userExists ? 'success.main' : 'error'}>
                  {userExists.message}
                </Typography>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {JSON.stringify(userExists, null, 2)}
                </pre>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Test Login</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              
              <Button 
                variant="contained" 
                onClick={handleLogin}
                disabled={loading || !email || !password}
              >
                Test Login
              </Button>
            </Box>
            
            {error && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#FFEBEE', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="error">Error:</Typography>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {typeof error === 'object' ? JSON.stringify(error, null, 2) : error}
                </pre>
              </Box>
            )}
            
            {loginResult && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#E8F5E9', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="success.main">Login Successful:</Typography>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {JSON.stringify(loginResult, null, 2)}
                </pre>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginDebug; 