import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  alpha,
  Fade,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardHeader
} from '@mui/material';
import {
  Edit,
  Save,
  Person,
  Notifications,
  Settings,
  Favorite,
  DirectionsRun,
  MonitorWeight,
  Height,
  Cake,
  Phone,
  Email,
  Home,
  CloudUpload,
  Refresh
} from '@mui/icons-material';

// Custom colors to match Dashboard.jsx
const customColors = {
  darkBlue: '#2A3F54',
  accentPink: '#FF5C8D',
  lightPink: '#FFF0F5',
  lightBlue: '#E3F2FD',
  lightGreen: '#E8F5E9',
  darkGreen: '#4CAF50',
  darkPink: '#D32F2F'
};

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Profile() {
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  
  // State for user data
  const [userData, setUserData] = useState(null);
  
  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  // Function to fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile data');
      }
      
      const data = await response.json();
      console.log('Fetched user data:', data); // Debug: Log fetched data
      
      if (data.success) {
        setUserData(data.data);
      } else {
        setUserData(data); // Fallback for different API response structure
      }
      
      setLoaded(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties (e.g., pregnancyDetails.dueDate)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData(prevData => ({
        ...prevData,
        [parent]: {
          ...(prevData?.[parent] || {}),
          [child]: value
        }
      }));
    } else {
      setUserData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
    console.log(`Updated ${name} to:`, value); // Debug logging
  };

  const handleNotificationChange = (type) => (e) => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [type]: e.target.checked
      }
    });
  };

  const handlePreferenceChange = (type) => (e) => {
    setUserData({
      ...userData,
      preferences: {
        ...userData.preferences,
        [type]: e.target.value
      }
    });
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      console.log('Sending data to API:', userData); // Debug: Log data being sent
      
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      console.log('Update response:', data); // Debug: Log response
      
      // Refresh user data after successful update
      await fetchUserProfile();
      
      setSuccess(true);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  // Show loading state
  if (loading && !userData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)', 
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6">Loading profile data...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error && !userData) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Error Loading Profile
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchUserProfile}
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#F8F9FA', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="lg">
        <Fade in={loaded} timeout={800}>
          <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            {/* Profile Header */}
            <Box 
              sx={{ 
                p: 4, 
                bgcolor: customColors.darkBlue, 
                color: 'white',
                position: 'relative'
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar
                    src={userData?.profilePicture}
                    alt={userData?.name}
                    sx={{ 
                      width: 100, 
                      height: 100,
                      border: `4px solid ${customColors.lightPink}`
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    fontWeight="bold"
                    sx={{ mb: 0.5 }}
                  >
                    {userData?.name || 'User'}
                  </Typography>
                  <Typography variant="body1">
                    {userData?.email || 'Email not available'}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant={editing ? "contained" : "outlined"}
                    color="inherit"
                    startIcon={editing ? <Save /> : <Edit />}
                    onClick={editing ? handleSubmit : handleEditToggle}
                    disabled={loading}
                    sx={{ 
                      borderColor: 'white',
                      bgcolor: editing ? customColors.accentPink : 'transparent',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: editing ? alpha(customColors.accentPink, 0.8) : 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (editing ? 'Save Changes' : 'Edit Profile')}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Tabs Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="profile tabs"
                centered
                sx={{ 
                  '& .MuiTab-root': { 
                    fontWeight: 'medium',
                    transition: 'all 0.3s ease',
                  },
                  '& .Mui-selected': {
                    color: customColors.accentPink,
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: customColors.accentPink,
                    height: 3,
                    borderRadius: 1.5
                  }
                }}
              >
                <Tab label="Personal Information" icon={<Person />} iconPosition="start" />
                <Tab label="Health" icon={<Favorite />} iconPosition="start" />
                <Tab label="Preferences" icon={<Settings />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Personal Information Tab */}
            <TabPanel value={tabValue} index={0}>
              <Container maxWidth="md">
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Fade in={true} timeout={800}>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={userData?.name || ''}
                          onChange={handleInputChange}
                          disabled={!editing}
                          required
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={userData?.email || ''}
                          onChange={handleInputChange}
                          disabled={!editing}
                          required
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={userData?.phone || ''}
                          onChange={handleInputChange}
                          disabled={!editing}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Age"
                          name="age"
                          type="number"
                          value={userData?.age || ''}
                          onChange={handleInputChange}
                          disabled={!editing}
                          required
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Gender"
                          name="gender"
                          value={userData?.gender || 'female'}
                          onChange={handleInputChange}
                          disabled={!editing}
                          select
                          SelectProps={{
                            native: false,
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={userData?.address || ''}
                          onChange={handleInputChange}
                          disabled={!editing}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          name="bio"
                          value={userData?.bio || ''}
                          onChange={handleInputChange}
                          disabled={!editing}
                          multiline
                          rows={4}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>
                      {editing && (
                        <Grid item xs={12}>
                          <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            sx={{ 
                              mt: 2,
                              borderRadius: 2,
                              borderColor: customColors.accentPink,
                              color: customColors.accentPink,
                              '&:hover': {
                                borderColor: customColors.accentPink,
                                bgcolor: alpha(customColors.accentPink, 0.1)
                              }
                            }}
                          >
                            Upload Profile Picture
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Fade>
              </Container>
            </TabPanel>

            {/* Health Tab */}
            <TabPanel value={tabValue} index={1}>
              <Container maxWidth="md">
                <Fade in={true} timeout={800}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card elevation={2} sx={{ height: '100%', borderRadius: 3 }}>
                        <CardHeader 
                          title="Body Measurements" 
                          sx={{ bgcolor: customColors.lightBlue, color: 'primary.main' }}
                        />
                        <CardContent>
                          <List>
                            <ListItem>
                              <ListItemIcon>
                                <Height color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Height" 
                                secondary={`${userData?.height || '0'} cm`} 
                              />
                              {editing && (
                                <TextField
                                  size="small"
                                  label="Height (cm)"
                                  name="height"
                                  type="number"
                                  value={userData?.height || ''}
                                  onChange={handleInputChange}
                                  variant="outlined"
                                  sx={{ width: 120 }}
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <MonitorWeight color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Weight" 
                                secondary={`${userData?.weight || '0'} kg`} 
                              />
                              {editing && (
                                <TextField
                                  size="small"
                                  label="Weight (kg)"
                                  name="weight"
                                  type="number"
                                  value={userData?.weight || ''}
                                  onChange={handleInputChange}
                                  variant="outlined"
                                  sx={{ width: 120 }}
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <DirectionsRun color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="BMR" 
                                secondary={`${userData?.bmr || '0'} kcal/day`} 
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card elevation={2} sx={{ height: '100%', borderRadius: 3 }}>
                        <CardHeader 
                          title="Nutrition Information" 
                          sx={{ bgcolor: customColors.lightGreen, color: customColors.darkGreen }}
                        />
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            Daily Calorie Needs: {userData?.calories || '0'} kcal
                          </Typography>
                          
                          <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                            Protein: {userData?.protein || '0'}g 
                            {userData?.calories && userData?.protein ? ` (${Math.round((userData.protein * 4 / userData.calories) * 100)}%)` : ''}
                          </Typography>
                          
                          <Typography variant="body2" gutterBottom>
                            Carbohydrates: {userData?.carbohydrates || '0'}g
                            {userData?.calories && userData?.carbohydrates ? ` (${Math.round((userData.carbohydrates * 4 / userData.calories) * 100)}%)` : ''}
                          </Typography>
                          
                          <Typography variant="body2" gutterBottom>
                            Fats: {userData?.fats || '0'}g
                            {userData?.calories && userData?.fats ? ` (${Math.round((userData.fats * 9 / userData.calories) * 100)}%)` : ''}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Card elevation={2} sx={{ borderRadius: 3 }}>
                        <CardHeader 
                          title="Pregnancy Details" 
                          sx={{ bgcolor: customColors.lightPink, color: customColors.darkPink }}
                        />
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                              <Typography variant="subtitle1" gutterBottom>
                                Due Date
                              </Typography>
                              <Typography variant="body1">
                                {userData?.pregnancyDetails?.dueDate 
                                  ? new Date(userData.pregnancyDetails.dueDate).toLocaleDateString() 
                                  : 'Not set'}
                              </Typography>
                              {editing && (
                                <TextField
                                  fullWidth
                                  label="Due Date"
                                  name="pregnancyDetails.dueDate"
                                  type="date"
                                  value={userData?.pregnancyDetails?.dueDate 
                                    ? new Date(userData.pregnancyDetails.dueDate).toISOString().split('T')[0]
                                    : ''}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setUserData(prevData => ({
                                      ...prevData,
                                      pregnancyDetails: {
                                        ...(prevData?.pregnancyDetails || {}),
                                        dueDate: value
                                      }
                                    }));
                                    console.log('Updated dueDate to:', value);
                                  }}
                                  variant="outlined"
                                  sx={{ mt: 1 }}
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="subtitle1" gutterBottom>
                                Trimester
                              </Typography>
                              <Chip 
                                label={`${userData?.pregnancyDetails?.trimester || 1}${userData?.pregnancyDetails?.trimester === 1 ? 'st' : userData?.pregnancyDetails?.trimester === 2 ? 'nd' : 'rd'} Trimester`}
                                color="primary"
                                sx={{ fontWeight: 'bold' }}
                              />
                              {editing && (
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                  <InputLabel>Trimester</InputLabel>
                                  <Select
                                    name="pregnancyDetails.trimester"
                                    value={userData?.pregnancyDetails?.trimester || 1}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value, 10);
                                      setUserData(prevData => ({
                                        ...prevData,
                                        pregnancyDetails: {
                                          ...(prevData?.pregnancyDetails || {}),
                                          trimester: value
                                        }
                                      }));
                                      console.log('Updated trimester to:', value);
                                    }}
                                    label="Trimester"
                                  >
                                    <MenuItem value={1}>1st Trimester</MenuItem>
                                    <MenuItem value={2}>2nd Trimester</MenuItem>
                                    <MenuItem value={3}>3rd Trimester</MenuItem>
                                  </Select>
                                </FormControl>
                              )}
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="subtitle1" gutterBottom>
                                First Pregnancy
                              </Typography>
                              <Typography variant="body1">
                                {userData?.pregnancyDetails?.firstPregnancy ? 'Yes' : 'No'}
                              </Typography>
                              {editing && (
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                  <InputLabel>First Pregnancy</InputLabel>
                                  <Select
                                    name="pregnancyDetails.firstPregnancy"
                                    value={userData?.pregnancyDetails?.firstPregnancy === true || userData?.pregnancyDetails?.firstPregnancy === "true" ? true : false}
                                    onChange={(e) => {
                                      const value = e.target.value === 'true' || e.target.value === true;
                                      setUserData(prevData => ({
                                        ...prevData,
                                        pregnancyDetails: {
                                          ...(prevData?.pregnancyDetails || {}),
                                          firstPregnancy: value
                                        }
                                      }));
                                      console.log('Updated firstPregnancy to:', value);
                                    }}
                                    label="First Pregnancy"
                                  >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                  </Select>
                                </FormControl>
                              )}
                            </Grid>
                          </Grid>
                          
                          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                            Medical Conditions
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {userData?.healthInfo?.medicalConditions?.length > 0 ? (
                              userData.healthInfo.medicalConditions.map((condition, index) => (
                                <Chip 
                                  key={index}
                                  label={condition === 'none' ? 'None' : condition}
                                  color="primary"
                                  variant="outlined"
                                  sx={{ m: 0.5 }}
                                />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No medical conditions specified
                              </Typography>
                            )}
                          </Box>
                          
                          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                            Joint Pain
                          </Typography>
                          {userData?.healthInfo?.hasJointPain ? (
                            <Box>
                              <Chip 
                                label={userData.healthInfo.jointPainType || 'Joint Pain'}
                                color="error"
                                sx={{ m: 0.5 }}
                              />
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No joint pain
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Fade>
              </Container>
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel value={tabValue} index={2}>
              <Container maxWidth="md">
                <Fade in={true} timeout={800}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color={customColors.darkBlue}>
                        Notification Settings
                      </Typography>
                      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: alpha(customColors.accentPink, 0.2), color: customColors.accentPink }}>
                                <Email />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText 
                              primary={<Typography fontWeight="medium">Email Notifications</Typography>} 
                              secondary="Receive updates and reminders via email" 
                            />
                            <Switch
                              edge="end"
                              checked={userData?.notifications?.email || false}
                              onChange={handleNotificationChange('email')}
                              disabled={!editing}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: customColors.accentPink,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: customColors.accentPink,
                                },
                              }}
                            />
                          </ListItem>
                          <Divider />
                          <ListItem>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: alpha(customColors.accentPink, 0.2), color: customColors.accentPink }}>
                                <Notifications />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText 
                              primary={<Typography fontWeight="medium">SMS Notifications</Typography>} 
                              secondary="Receive text messages for important updates" 
                            />
                            <Switch
                              edge="end"
                              checked={userData?.notifications?.sms || false}
                              onChange={handleNotificationChange('sms')}
                              disabled={!editing}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: customColors.accentPink,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: customColors.accentPink,
                                },
                              }}
                            />
                          </ListItem>
                          <Divider />
                          <ListItem>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: alpha(customColors.accentPink, 0.2), color: customColors.accentPink }}>
                                <Notifications />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText 
                              primary={<Typography fontWeight="medium">Push Notifications</Typography>} 
                              secondary="Receive push notifications on your device" 
                            />
                            <Switch
                              edge="end"
                              checked={userData?.notifications?.push || false}
                              onChange={handleNotificationChange('push')}
                              disabled={!editing}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: customColors.accentPink,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: customColors.accentPink,
                                },
                              }}
                            />
                          </ListItem>
                        </List>
                      </Paper>

                      <Typography variant="h6" fontWeight="bold" gutterBottom color={customColors.darkBlue}>
                        Notification Preference
                      </Typography>
                      <FormControl fullWidth disabled={!editing} sx={{ mb: 4 }}>
                        <InputLabel>Preferred Notification Method</InputLabel>
                        <Select
                          value={userData?.notificationPreference || 'email'}
                          onChange={handleInputChange}
                          name="notificationPreference"
                          label="Preferred Notification Method"
                        >
                          <MenuItem value="email">Email Only</MenuItem>
                          <MenuItem value="sms">SMS Only</MenuItem>
                          <MenuItem value="both">Both Email and SMS</MenuItem>
                        </Select>
                      </FormControl>

                      <Typography variant="h6" fontWeight="bold" gutterBottom color={customColors.darkBlue}>
                        Application Preferences
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth disabled={!editing}>
                            <InputLabel>Language</InputLabel>
                            <Select
                              value={userData?.preferences?.language || 'English'}
                              onChange={handlePreferenceChange('language')}
                              label="Language"
                            >
                              <MenuItem value="English">English</MenuItem>
                              <MenuItem value="Hindi">Hindi</MenuItem>
                              <MenuItem value="Spanish">Spanish</MenuItem>
                              <MenuItem value="French">French</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth disabled={!editing}>
                            <InputLabel>Theme</InputLabel>
                            <Select
                              value={userData?.preferences?.theme || 'Light'}
                              onChange={handlePreferenceChange('theme')}
                              label="Theme"
                            >
                              <MenuItem value="Light">Light</MenuItem>
                              <MenuItem value="Dark">Dark</MenuItem>
                              <MenuItem value="System">System Default</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth disabled={!editing}>
                            <InputLabel>Units</InputLabel>
                            <Select
                              value={userData?.preferences?.units || 'Metric'}
                              onChange={handlePreferenceChange('units')}
                              label="Units"
                            >
                              <MenuItem value="Metric">Metric (cm, kg)</MenuItem>
                              <MenuItem value="Imperial">Imperial (in, lb)</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth disabled={!editing}>
                            <InputLabel>Diet Type</InputLabel>
                            <Select
                              value={userData?.dietType || 'vegetarian'}
                              onChange={handleInputChange}
                              name="dietType"
                              label="Diet Type"
                            >
                              <MenuItem value="vegetarian">Vegetarian</MenuItem>
                              <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    
                    {editing && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button 
                            onClick={handleSubmit} 
                            variant="contained" 
                            color="primary"
                            disabled={loading}
                            startIcon={<Save />}
                          >
                            Save Preferences
                          </Button>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Fade>
              </Container>
            </TabPanel>
          </Paper>
        </Fade>

        {/* Snackbar for notifications */}
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            sx={{ width: '100%', borderRadius: 2 }}
          >
            Profile updated successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Profile;