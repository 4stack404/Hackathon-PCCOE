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
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  alpha,
  Fade,
  Zoom,
  Card,
  CardContent,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Edit,
  Save,
  Person,
  Notifications,
  Security,
  Language,
  CloudUpload,
  CalendarMonth,
  LocalHospital,
  Restaurant,
  NavigateNext,
  Add
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { appointmentService } from '../services/appointmentService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// Custom colors to match Dashboard.jsx
const customColors = {
  darkBlue: '#2A3F54',
  accentPink: '#FF5C8D',
  lightPink: '#FFF0F5'
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
  const { currentUser, login } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  const [userData, setUserData] = useState({
    name: currentUser?.name || 'Demo User',
    email: currentUser?.email || 'demo@example.com',
    phone: currentUser?.phone || '+1 (555) 123-4567',
    dateOfBirth: currentUser?.dateOfBirth || '1990-01-01',
    gender: currentUser?.gender || 'female',
    address: currentUser?.address || '123 Main St, Anytown, USA',
    bio: currentUser?.bio || 'Expecting mother excited about my pregnancy journey!',
    profilePicture: currentUser?.profilePicture || null,
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    preferences: {
      language: 'English',
      theme: 'Light',
      units: 'Imperial'
    }
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
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
    // In a real app, you would upload this to a server
    // For demo, we'll just store the file object
    setUserData({
      ...userData,
      profilePicture: URL.createObjectURL(event.currentTarget.files[0])
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // In a real app, you would send this data to an API
    // For demo, we'll simulate a successful update after a delay
    setTimeout(() => {
      try {
        login({
          ...userData
        });
        setSuccess(true);
        setEditing(false);
        setLoading(false);
      } catch (err) {
        setError('Failed to update profile. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  // Mock activity data
  const activities = [
    { 
      id: 1, 
      type: 'appointment', 
      title: 'Doctor Appointment', 
      date: '2023-06-15', 
      icon: <LocalHospital color="primary" /> 
    },
    { 
      id: 2, 
      type: 'diet', 
      title: 'Updated Nutrition Plan', 
      date: '2023-06-10', 
      icon: <Restaurant color="secondary" /> 
    },
    { 
      id: 3, 
      type: 'milestone', 
      title: 'Second Trimester Begins', 
      date: '2023-06-01', 
      icon: <CalendarMonth color="success" /> 
    },
  ];

  return (
    <Box sx={{ py: 6, bgcolor: '#F8F9FA', minHeight: 'calc(100vh - 64px - 300px)' }}>
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
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Avatar
                      src={userData.profilePicture}
                      alt={userData.name}
                      sx={{ 
                        width: 100, 
                        height: 100,
                        border: `4px solid ${customColors.lightPink}`
                      }}
                    />
                  </motion.div>
                </Grid>
                <Grid item xs>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    fontWeight="bold"
                    sx={{ mb: 0.5 }}
                  >
                    {userData.name}
                  </Typography>
                  <Typography variant="body1">
                    {userData.email}
                  </Typography>
                </Grid>
                <Grid item>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                  </motion.div>
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
                <Tab label="Activity History" icon={<CalendarMonth />} iconPosition="start" />
                <Tab label="Preferences" icon={<Language />} iconPosition="start" />
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
                          value={userData.name}
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
                          value={userData.email}
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
                          value={userData.phone}
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
                          label="Date of Birth"
                          name="dateOfBirth"
                          type="date"
                          value={userData.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={!editing}
                          InputLabelProps={{
                            shrink: true,
                          }}
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
                          value={userData.gender}
                          onChange={handleInputChange}
                          disabled={!editing}
                          select
                          SelectProps={{
                            native: true,
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={userData.address}
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
                          value={userData.bio}
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
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                          </motion.div>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Fade>
              </Container>
            </TabPanel>

            {/* Activity History Tab */}
            <TabPanel value={tabValue} index={1}>
              <Container maxWidth="md">
                <Fade in={true} timeout={800}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color={customColors.darkBlue}>
                      Recent Activity
                    </Typography>
                    <List>
                      {activities.map((activity, index) => (
                        <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }} key={activity.id}>
                          <ListItem 
                            sx={{ 
                              mb: 2, 
                              bgcolor: 'background.paper', 
                              borderRadius: 3,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: alpha(customColors.accentPink, 0.2), color: customColors.accentPink }}>
                                {activity.icon}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText 
                              primary={<Typography fontWeight="medium">{activity.title}</Typography>} 
                              secondary={new Date(activity.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })} 
                            />
                          </ListItem>
                        </Zoom>
                      ))}
                    </List>
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outlined" 
                          sx={{ 
                            borderRadius: 2,
                            borderColor: customColors.accentPink,
                            color: customColors.accentPink,
                            px: 3,
                            py: 1,
                            '&:hover': {
                              borderColor: customColors.accentPink,
                              bgcolor: alpha(customColors.accentPink, 0.1)
                            }
                          }}
                        >
                          View All Activity
                        </Button>
                      </motion.div>
                    </Box>
                  </Box>
                </Fade>
              </Container>
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel value={tabValue} index={2}>
              <Container maxWidth="md">
                <Fade in={true} timeout={800}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color={customColors.darkBlue}>
                      Notification Settings
                    </Typography>
                    <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: alpha(customColors.accentPink, 0.2), color: customColors.accentPink }}>
                              <Notifications />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText 
                            primary={<Typography fontWeight="medium">Email Notifications</Typography>} 
                            secondary="Receive updates and reminders via email" 
                          />
                          <Switch
                            edge="end"
                            checked={userData.notifications.email}
                            onChange={handleNotificationChange('email')}
                            disabled={!editing}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: customColors.accentPink,
                                '&:hover': {
                                  backgroundColor: alpha(customColors.accentPink, 0.1),
                                },
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
                            secondary="Receive notifications on your device" 
                          />
                          <Switch
                            edge="end"
                            checked={userData.notifications.push}
                            onChange={handleNotificationChange('push')}
                            disabled={!editing}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: customColors.accentPink,
                                '&:hover': {
                                  backgroundColor: alpha(customColors.accentPink, 0.1),
                                },
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
                            checked={userData.notifications.sms}
                            onChange={handleNotificationChange('sms')}
                            disabled={!editing}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: customColors.accentPink,
                                '&:hover': {
                                  backgroundColor: alpha(customColors.accentPink, 0.1),
                                },
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
                      Application Preferences
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Language"
                          name="language"
                          value={userData.preferences.language}
                          onChange={handlePreferenceChange('language')}
                          disabled={!editing}
                          select
                          SelectProps={{
                            native: true,
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Theme"
                          name="theme"
                          value={userData.preferences.theme}
                          onChange={handlePreferenceChange('theme')}
                          disabled={!editing}
                          select
                          SelectProps={{
                            native: true,
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <option value="Light">Light</option>
                          <option value="Dark">Dark</option>
                          <option value="System">System Default</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Units"
                          name="units"
                          value={userData.preferences.units}
                          onChange={handlePreferenceChange('units')}
                          disabled={!editing}
                          select
                          SelectProps={{
                            native: true,
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <option value="Imperial">Imperial (lbs, in)</option>
                          <option value="Metric">Metric (kg, cm)</option>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              </Container>
            </TabPanel>
          </Paper>
        </Fade>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            sx={{ 
              width: '100%',
              borderRadius: 2
            }}
          >
            Profile updated successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Profile;