import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Avatar,
  IconButton,
  Badge,
  Tabs,
  Tab,
  LinearProgress,
  useTheme,
  Stack,
  Chip,
  alpha,
  Fade,
  Grow,
  Zoom,
  Slide,
  CircularProgress
} from '@mui/material';
import { 
  Notifications, 
  RestaurantMenu, 
  CalendarMonth, 
  ChildCare, 
  TrendingUp,
  FavoriteBorder,
  LocalHospital,
  WaterDrop,
  DirectionsWalk,
  Opacity,
  MoreVert,
  Add as AddIcon,
  NavigateNext,
  Favorite,
  SpaOutlined,
  BabyChangingStation,
  HealthAndSafety,
  Restaurant,
  AssessmentOutlined
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import usePageLoading from '../hooks/usePageLoading';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { appointmentService } from '../services/appointmentService';
import { toast } from 'react-toastify';

dayjs.extend(relativeTime);

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled components with animations
const PulseAvatar = styled(Avatar)`
  animation: ${pulse} 2s infinite ease-in-out;
`;

const FloatingIcon = styled(Box)`
  animation: ${float} 3s infinite ease-in-out;
`;

const ShimmerProgress = styled(LinearProgress)`
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

const fruitSizeComparison = {
  2: { fruit: 'poppy seed', size: '0.016 inch' },
  3: { fruit: 'sesame seed', size: '0.2 inch' },
  4: { fruit: 'khus khus', size: '0.4 inch' },
  5: { fruit: 'til', size: '0.45 inch' },
  6: { fruit: 'dal', size: '0.5 inch' },
  7: { fruit: 'chhola', size: '0.55 inch' },
  8: { fruit: 'rajma', size: '0.63 inch' },
  9: { fruit: 'grape', size: '0.9 inch' },
  10: { fruit: 'olive', size: '1.2 inches' },
  11: { fruit: 'anjeer', size: '1.6 inches' },
  12: { fruit: 'nimbu', size: '2.1 inches' },
  13: { fruit: 'matar', size: '2.9 inches' },
  14: { fruit: 'bada nimbu', size: '3.4 inches' },
  15: { fruit: 'apple', size: '4.0 inches' },
  16: { fruit: 'pear (nashpati)', size: '4.6 inches' },
  17: { fruit: 'ginger knob (adrak)', size: '5.1 inches' },
  18: { fruit: 'capsicum (shimla mirch)', size: '5.6 inches' },
  19: { fruit: 'big tomato (tamatar)', size: '6.0 inches' },
  20: { fruit: 'banana (kela)', size: '6.5 inches' },
  21: { fruit: 'carrot (gajar)', size: '7.2 inches' },
  22: { fruit: 'cucumber (kheera)', size: '7.6 inches' },
  23: { fruit: 'mango', size: '8.0 inches' },
  24: { fruit: 'corn', size: '8.7 inches' },
  25: { fruit: 'rutabaga (shalgam)', size: '9.8 inches' },
  26: { fruit: 'spring onion', size: '13.6 inches' },
  27: { fruit: 'cauliflower', size: '14.2 inches' },
  28: { fruit: 'eggplant (baingan)', size: '14.8 inches' },
  29: { fruit: 'butternut squash (kaddu)', size: '15.2 inches' },
  30: { fruit: 'cabbage', size: '15.7 inches' },
  31: { fruit: 'coconut', size: '16.2 inches' },
  32: { fruit: 'jicama (mishrikand)', size: '16.7 inches' },
  33: { fruit: 'pineapple', size: '17.2 inches' },
  34: { fruit: 'cantaloupe (kharbooja)', size: '17.7 inches' },
  35: { fruit: 'honeydew melon (sarda)', size: '18.3 inches' },
  36: { fruit: 'romaine lettuce (salad patta)', size: '18.9 inches' },
  37: { fruit: 'Swiss chard', size: '19.2 inches' },
  38: { fruit: 'jack fruit (katthal)', size: '19.6 inches' },
  39: { fruit: 'mini-watermelon (tarbooj)', size: '20.0 inches' },
  40: { fruit: 'small pumpkin (kaddu)', size: '20.4 inches' },
  41: { fruit: 'baby', size: '20.8 inches' },
};

function Dashboard() {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [currentDate] = useState(new Date());
  const [loaded, setLoaded] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Use our custom hook to show loading animation
  usePageLoading(!loaded);
  
  // Define custom colors for consistent styling
  const customColors = {
    accentPink: '#FF5A8C',
    mediumPink: '#FFD6E0',
    lightPink: '#FFF0F3',
    darkBlue: '#2D3748',
    lightBlue: '#EDF2F7'
  };
  
  // Calculate current week based on due date
  const calculateCurrentWeek = () => {
    // For testing purposes, let's assume the due date is stored in the user's data
    // In a real app, this should come from your backend
    const dueDate = dayjs(currentUser?.dueDate || dayjs().add(16, 'weeks')); // fallback due date if none set
    const today = dayjs();
    const fullTerm = 40; // weeks
    
    // Calculate the difference in weeks from today to due date
    const weeksUntilDue = dueDate.diff(today, 'week');
    
    // Current week is (40 - weeks remaining)
    const currentWeek = fullTerm - weeksUntilDue;
    
    // Ensure the week is between 1 and 40
    return Math.min(Math.max(1, currentWeek), 40);
  };

  const [currentWeek, setCurrentWeek] = useState(calculateCurrentWeek());
  const dueDate = dayjs().add(40 - currentWeek, 'weeks');
  const [nextAppointment, setNextAppointment] = useState(null);

  // Update current week periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWeek(calculateCurrentWeek());
    }, 1000 * 60 * 60 * 24); // Update once per day

    return () => clearInterval(timer);
  }, []);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1500); // Increased to 1.5 seconds to better see the loading animation
    return () => clearTimeout(timer);
  }, []);

  // Nutrition progress data
  const dailyNutrients = [
    { name: 'Protein', current: 45, target: 75, unit: 'g' },
    { name: 'Calcium', current: 800, target: 1000, unit: 'mg' },
    { name: 'Iron', current: 18, target: 27, unit: 'mg' },
    { name: 'Folate', current: 450, target: 600, unit: 'mcg' },
  ];

  // Weight tracking data
  const weightData = {
    labels: ['Week 20', 'Week 21', 'Week 22', 'Week 23', 'Week 24'],
    datasets: [{
      label: 'Weight (lbs)',
      data: [145, 146, 147, 148, 149],
      borderColor: customColors.accentPink,
      backgroundColor: alpha(customColors.accentPink, 0.2),
      tension: 0.3,
      fill: true,
    }]
  };

  const weightOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        min: 140,
        max: 160,
        ticks: { stepSize: 5 }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  // Fetch upcoming appointments
  const fetchUpcomingAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointments();
      if (response.success) {
        // Filter and sort upcoming appointments
        const upcoming = response.data
          .filter(app => new Date(app.date) >= new Date()) // Filter future appointments
          .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending
        setUpcomingAppointments(upcoming);
        // Set the next appointment (first upcoming)
        setNextAppointment(upcoming.length > 0 ? upcoming[0] : null);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  // Add handlers for updating and deleting appointments
  const handleUpdateAppointment = async (appointmentId, updatedData) => {
    try {
      setLoading(true);
      const response = await appointmentService.updateAppointment(appointmentId, updatedData);
      if (response.success) {
        toast.success('Appointment updated successfully');
        fetchUpcomingAppointments(); // Refresh the appointments list
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      toast.error('Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await appointmentService.deleteAppointment(appointmentId);
      if (response.success) {
        toast.success('Appointment cancelled successfully');
        fetchUpcomingAppointments(); // Refresh the appointments list
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      toast.error('Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      bgcolor: '#FFF5F8',
      minHeight: '100vh',
      pb: 6,
      pt: 2
    }}>
      <Container maxWidth="xl">
        {/* Personalized Header with Baby Icon */}
        <Fade in={loaded} timeout={1000}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 4,
            p: 3,
            borderRadius: 4,
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              transform: 'translateY(-5px)'
            }
          }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom color={customColors.darkBlue}>
              Hi, {currentUser?.name?.split(' ')[0] || 'there'}! 👋
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <PulseAvatar sx={{ 
                bgcolor: customColors.accentPink, 
                width: 70, 
                height: 70,
                color: 'white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                <BabyChangingStation sx={{ fontSize: 40 }} />
              </PulseAvatar>
            </motion.div>
          </Box>
        </Fade>

        <Grid container spacing={3}>
          {/* Pregnancy Progress Card - Redesigned */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} timeout={800}>
              <Card elevation={3} sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                background: 'white',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom color={customColors.darkBlue}>Your Pregnancy Journey</Typography>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip 
                        icon={<Favorite />} 
                        label={`Week ${currentWeek}`} 
                        sx={{ 
                          bgcolor: '#4A90E2', 
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          py: 2
                        }} 
                      />
                    </motion.div>
                  </Box>
                  
                  <Box sx={{ position: 'relative', mb: 3, mt: 4 }}>
                    <ShimmerProgress 
                      variant="determinate" 
                      value={(currentWeek / 40) * 100}
                      sx={{ 
                        height: 16, 
                        borderRadius: 8, 
                        mb: 1,
                        bgcolor: customColors.lightPink,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: customColors.accentPink,
                          transition: 'transform 1.5s ease-in-out'
                        }
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                      {40 - currentWeek} weeks until due date ({dueDate.format('MMMM D, YYYY')})
                    </Typography>
                  </Box>
                  
                  <Zoom in={loaded} timeout={1200}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 3,
                      p: 2,
                      borderRadius: 3,
                      bgcolor: customColors.lightPink,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: customColors.mediumPink,
                      }
                    }}>
                      <FloatingIcon>
                        <Avatar sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: 'white',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                          <motion.img 
                            src={`/assets/baby-size/fruit-week-${Math.floor(currentWeek/4)*4}-Photoroom.png`}
                            alt={fruitSizeComparison[Math.floor(currentWeek/4)*4].fruit}
                            style={{ width: 50, height: 50, objectFit: 'contain' }}
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          />
                        </Avatar>
                      </FloatingIcon>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color={customColors.darkBlue}>
                          Baby is the size of a {fruitSizeComparison[Math.floor(currentWeek/4)*4].fruit}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          ({fruitSizeComparison[Math.floor(currentWeek/4)*4].size})
                        </Typography>
                      </Box>
                    </Box>
                  </Zoom>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Next Appointment Card - Redesigned */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} timeout={1000}>
              <Card elevation={3} sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                background: 'white',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom color={customColors.darkBlue}>Next Appointment</Typography>
                    {nextAppointment && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Chip 
                          icon={<CalendarMonth />} 
                          label={`${dayjs(nextAppointment.date).fromNow()}`}
                          sx={{ 
                            bgcolor: '#4A90E2', 
                            color: 'white',
                            fontWeight: 'bold'
                          }} 
                        />
                      </motion.div>
                    )}
                  </Box>
                  
                  {loading ? (
                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                      <CircularProgress sx={{ color: customColors.accentPink }} />
                    </Box>
                  ) : nextAppointment ? (
                    <Slide direction="up" in={loaded} timeout={1200}>
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        bgcolor: customColors.lightPink,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: customColors.mediumPink,
                          transform: 'scale(1.02)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Avatar sx={{ bgcolor: customColors.accentPink, color: 'white' }}>
                              <LocalHospital />
                            </Avatar>
                          </motion.div>
                          <Box>
                            <Typography variant="h6" fontWeight="bold" color={customColors.darkBlue}>
                              {nextAppointment.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {nextAppointment.doctor?.name || 'Doctor not specified'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Divider />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                            <Typography variant="h4" fontWeight="bold" color={customColors.accentPink}>
                              {dayjs(nextAppointment.date).format('DD')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {dayjs(nextAppointment.date).format('MMM YYYY')}
                            </Typography>
                          </Box>
                          <Divider orientation="vertical" flexItem />
                          <Box>
                            <Typography variant="h5" fontWeight="bold" color={customColors.darkBlue}>
                              {dayjs(nextAppointment.date).format('h:mm A')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {nextAppointment.location?.name || 'Location not specified'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Add action buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            to={`/appointments/edit/${nextAppointment._id}`}
                            sx={{ 
                              flex: 1,
                              borderColor: customColors.accentPink,
                              color: customColors.accentPink,
                              '&:hover': {
                                borderColor: customColors.accentPink,
                                bgcolor: alpha(customColors.accentPink, 0.1)
                              }
                            }}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDeleteAppointment(nextAppointment._id)}
                            sx={{ 
                              flex: 1,
                              borderColor: 'error.main',
                              color: 'error.main',
                              '&:hover': {
                                borderColor: 'error.main',
                                bgcolor: alpha('#ff0000', 0.1)
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </Slide>
                  ) : (
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      bgcolor: customColors.lightPink,
                      textAlign: 'center' 
                    }}>
                      <Typography color="text.secondary">
                        No upcoming appointments
                      </Typography>
                      <Button
                        component={Link}
                        to="/appointments/new"
                        startIcon={<AddIcon />}
                        sx={{ 
                          mt: 2,
                          color: customColors.accentPink,
                          '&:hover': {
                            bgcolor: alpha(customColors.accentPink, 0.1)
                          }
                        }}
                      >
                        Schedule New Appointment
                      </Button>
                    </Box>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="contained" 
                      fullWidth 
                      component={Link}
                      to="/appointments"
                      sx={{ 
                        mt: 2, 
                        bgcolor: customColors.accentPink,
                        color: 'white',
                        borderRadius: 2,
                        py: 1.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: alpha(customColors.accentPink, 0.8),
                          boxShadow: '0 4px 15px rgba(255,90,140,0.4)'
                        }
                      }}
                    >
                      View All Appointments
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Daily Nutrition Panel - Redesigned */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              background: 'white'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Restaurant sx={{ color: '#6B5B95' }} />
                    <Typography variant="h5" fontWeight="bold" color={customColors.darkBlue}>Daily Nutrition</Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<AddIcon />}
                    sx={{ borderColor: '#6B5B95', color: '#6B5B95' }}
                  >
                    Log Meal
                  </Button>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  bgcolor: customColors.lightPink,
                  mb: 3
                }}>
                  <Typography variant="h6" gutterBottom color={customColors.darkBlue}>Calorie Intake</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" fontWeight="bold" color={customColors.darkBlue}>1800 kcal</Typography>
                    <Typography variant="body2" color="text.secondary">Target: 2200 kcal</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(1800/2200) * 100}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      bgcolor: alpha(customColors.accentPink, 0.2),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: customColors.accentPink
                      }
                    }}
                  />
                </Box>
                
                <Grid container spacing={2}>
                  {dailyNutrients.map((nutrient) => (
                    <Grid item xs={6} key={nutrient.name}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        bgcolor: customColors.lightPink,
                        height: '100%'
                      }}>
                        <Typography variant="body1" fontWeight="bold" gutterBottom color={customColors.darkBlue}>
                          {nutrient.name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {nutrient.current}/{nutrient.target} {nutrient.unit}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color={
                            (nutrient.current/nutrient.target) >= 0.8 ? 'success.main' : 'warning.main'
                          }>
                            {Math.round((nutrient.current/nutrient.target) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(nutrient.current/nutrient.target) * 100}
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: alpha(customColors.accentPink, 0.2),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: customColors.accentPink
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Weight Tracking Panel - Redesigned */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              background: 'white'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: '#6B5B95' }} />
                    <Typography variant="h5" fontWeight="bold" color={customColors.darkBlue}>Weight Tracking</Typography>
                  </Box>
                  <Chip 
                    label="Target: 150-165 lbs" 
                    size="small"
                    sx={{ bgcolor: '#E8F4F8', color: '#4A90E2' }}
                  />
                </Box>
                
                <Box sx={{ 
                  height: 220, 
                  p: 2, 
                  borderRadius: 3, 
                  bgcolor: customColors.lightPink,
                  mb: 2
                }}>
                  <Line data={weightData} options={weightOptions} />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      bgcolor: customColors.lightPink,
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" color="text.secondary">Current Weight</Typography>
                      <Typography variant="h5" fontWeight="bold" color={customColors.accentPink}>
                        149 lbs
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      bgcolor: customColors.lightPink,
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" color="text.secondary">Weight Gain</Typography>
                      <Typography variant="h5" fontWeight="bold" color={customColors.accentPink}>
                        +4 lbs
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ 
                    mt: 2, 
                    bgcolor: customColors.accentPink,
                    color: 'white',
                    borderRadius: 2,
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha(customColors.accentPink, 0.8)
                    }
                  }}
                >
                  Log Today's Weight
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Access Cards - Redesigned */}
          <Grid item xs={12}>
            <Fade in={true} timeout={800}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, mt: 1, px: 1 }} color={customColors.darkBlue}>
                Quick Access
              </Typography>
            </Fade>
            <Grid container spacing={2}>
              {[
                { 
                  title: 'Food & Diet', 
                  description: 'Track meals and nutrition', 
                  icon: <RestaurantMenu />, 
                  color: '#6B5B95',
                  link: '/food-diet'
                },
                { 
                  title: 'Appointments', 
                  description: 'Manage appointments and events', 
                  icon: <CalendarMonth />, 
                  color: '#4A90E2',
                  link: '/appointments'
                },
                { 
                  title: 'Prenatal & Postnatal Care', 
                  description: 'Essential care guidance and tips', 
                  icon: <FavoriteBorder />, 
                  color: '#FF6B6B',
                  link: '/care'
                },
                { 
                  title: 'Weekly Progress', 
                  description: 'Track your pregnancy by week', 
                  icon: <RestaurantMenu />, 
                  color: '#56C596',
                  link: '/week/1'
                },
                { 
                  title: 'Report Analysis', 
                  description: 'Review and understand test results', 
                  icon: <AssessmentOutlined />, 
                  color: '#F9A826',
                  link: '/reports'
                }
              ].map((item, index) => (
                <Grid item xs={6} md={4} lg={2.4} key={index}>
                  <Zoom in={true} style={{ transitionDelay: `${index * 150}ms` }}>
                    <Card 
                      component={Link}
                      to={item.link}
                      sx={{ 
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        borderRadius: 4,
                        overflow: 'hidden',
                        height: '100%',
                        background: 'white',
                        '&:hover': { 
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardActionArea sx={{ height: '100%' }}>
                        <CardContent sx={{ 
                          textAlign: 'center',
                          p: 3
                        }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: item.color, 
                              color: 'white',
                              width: 60, 
                              height: 60, 
                              mx: 'auto',
                              mb: 2,
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {item.icon}
                          </Avatar>
                          <Typography variant="h6" fontWeight="bold" gutterBottom color={customColors.darkBlue}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Upcoming Appointments Section - Redesigned */}
          <Grid item xs={12}>
            <Grow in={true} timeout={1000}>
              <Card elevation={3} sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                background: 'white',
                mt: 2
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HealthAndSafety sx={{ color: customColors.accentPink }} />
                      <Typography variant="h5" fontWeight="bold" color={customColors.darkBlue}>Upcoming Appointments</Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      component={Link}
                      to="/appointments/new"
                      sx={{ 
                        bgcolor: customColors.accentPink,
                        color: 'white',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          bgcolor: alpha(customColors.accentPink, 0.9)
                        }
                      }}
                    >
                      Add Appointment
                    </Button>
                  </Box>
                  
                  <Box sx={{ 
                    borderRadius: 3, 
                    overflow: 'hidden',
                    bgcolor: customColors.lightPink,
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
                  }}>
                    {loading ? (
                      <Box sx={{ py: 2 }}>
                        <LinearProgress sx={{ borderRadius: 1 }} />
                      </Box>
                    ) : upcomingAppointments.length > 0 ? (
                      <List>
                        {upcomingAppointments.slice(0, 3).map((appointment, index) => (
                          <React.Fragment key={appointment._id}>
                            {index > 0 && <Divider />}
                            <ListItem>
                              <ListItemIcon>
                                <CalendarMonth sx={{ color: customColors.accentPink }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={appointment.title}
                                secondary={
                                  <>
                                    <Typography variant="body2" component="span">
                                      {new Date(appointment.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      {appointment.doctor.name} - {appointment.location.name}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ py: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          No upcoming appointments
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Fade in={true} timeout={1500}>
                    <Button 
                      fullWidth 
                      component={Link}
                      to="/appointments"
                      sx={{ 
                        mt: 2,
                        color: customColors.accentPink,
                        borderRadius: 2,
                        py: 1.5,
                        bgcolor: customColors.lightPink,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: customColors.mediumPink,
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      View All Appointments
                    </Button>
                  </Fade>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard; 