import React, { useContext, useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import usePageLoading from "../hooks/usePageLoading";
import useNavigateWithLoading from "../hooks/useNavigateWithLoading";


const ResetPassword = () => {
  const {backendUrl} = useContext(AppContent);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const navigateWithLoading = useNavigateWithLoading();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(false);

  // Connect to loading system
  usePageLoading(isLoading, 'reset-password-page');

  // Initialize loading state
  useEffect(() => {
    // Simulate loading for a short time to ensure animations work properly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const inputRefs = React.useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeydown = (e, index) => {
    if (e.key === "Backspace" && e.target.value.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
      inputRefs.current[index - 1].value = ""; // Clear previous input
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    
    // Only use the first 6 digits
    const digits = pasteArray.filter(char => /\d/.test(char)).slice(0, 6);
    
    digits.forEach((digit, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = digit;
      }
    });
    
    // If we have 6 digits, focus the last input
    if (digits.length === 6 && inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setProcessingRequest(true);
    setError("");
    
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/forgot-password', {email})
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessingRequest(false);
    }
  }
  
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    setProcessingRequest(true);
    setError("");
    
    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      const otpValue = otpArray.join('');
      
      if (otpValue.length !== 6 || !/^\d+$/.test(otpValue)) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }
      
      setOtp(otpValue);
      setIsOtpSubmitted(true);
    } catch (error) {
      setError("Failed to process OTP. Please try again.");
    } finally {
      setProcessingRequest(false);
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setProcessingRequest(true);
    setError("");
  
    if (!email || !otp || !newPassword) {
      setError("Missing required fields.");
      setProcessingRequest(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setProcessingRequest(false);
      return;
    }
  
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
  
      if (data.success) {
        toast.success(data.message);
        navigateWithLoading("/login");
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessingRequest(false);
    }
  };
  
  const getTitle = () => {
    if (!isEmailSent) return "Reset Your Password";
    if (!isOtpSubmitted) return "Enter Verification Code";
    return "Create New Password";
  };
  
  return (
    <Box 
      sx={{ 
        py: 8, 
        minHeight: 'calc(100vh - 64px - 300px)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            animation: 'fadeIn 0.5s ease-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 4 }}
          >
            {getTitle()}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Email input form */}
          {!isEmailSent && (
            <Box component="form" onSubmit={onSubmitEmail} noValidate>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                Enter your email address and we'll send you a verification code to reset your password.
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={processingRequest}
                sx={{ 
                  py: 1.5,
                  mb: 3,
                  position: 'relative'
                }}
              >
                {processingRequest ? (
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }} 
                  />
                ) : 'Send Verification Code'}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Remember your password?{' '}
                  <RouterLink to="/login" style={{ color: '#5e35b1', fontWeight: 600, textDecoration: 'none' }}>
                    Back to Login
                  </RouterLink>
                </Typography>
              </Box>
            </Box>
          )}

          {/* OTP input form */}
          {!isOtpSubmitted && isEmailSent && (
            <Box component="form" onSubmit={onSubmitOtp} noValidate>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                We've sent a 6-digit verification code to <strong>{email}</strong>. 
                Enter the code below to continue.
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1} 
                justifyContent="center" 
                sx={{ mb: 4 }}
                onPaste={handlePaste}
              >
                {Array(6).fill(0).map((_, index) => (
                  <TextField
                    key={index}
                    inputRef={(e) => (inputRefs.current[index] = e)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }
                    }}
                    sx={{ width: '3rem' }}
                    variant="outlined"
                    required
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeydown(e, index)}
                  />
                ))}
              </Stack>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={processingRequest}
                sx={{ 
                  py: 1.5,
                  mb: 3,
                  position: 'relative'
                }}
              >
                {processingRequest ? (
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }} 
                  />
                ) : 'Verify Code'}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Didn't receive the code?{' '}
                  <Button 
                    variant="text" 
                    color="primary" 
                    size="small"
                    onClick={onSubmitEmail}
                    disabled={processingRequest}
                  >
                    Resend
                  </Button>
                </Typography>
                <Typography variant="body2">
                  <Button 
                    variant="text" 
                    color="primary" 
                    size="small"
                    onClick={() => setIsEmailSent(false)}
                    disabled={processingRequest}
                  >
                    Use a different email
                  </Button>
                </Typography>
              </Box>
            </Box>
          )}

          {/* New password form */}
          {isOtpSubmitted && isEmailSent && (
            <Box component="form" onSubmit={onSubmitNewPassword} noValidate>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                Create a new password for your account. Password must be at least 8 characters long.
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={newPassword.length > 0 && newPassword.length < 8}
                helperText={newPassword.length > 0 && newPassword.length < 8 ? "Password must be at least 8 characters" : ""}
                sx={{ mb: 3 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={processingRequest || newPassword.length < 8}
                sx={{ 
                  py: 1.5,
                  mb: 3,
                  position: 'relative'
                }}
              >
                {processingRequest ? (
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }} 
                  />
                ) : 'Reset Password'}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  <Button 
                    variant="text" 
                    color="primary" 
                    size="small"
                    onClick={() => setIsOtpSubmitted(false)}
                    disabled={processingRequest}
                  >
                    Back to verification
                  </Button>
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
