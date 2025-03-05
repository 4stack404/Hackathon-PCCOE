import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Avatar, 
  Chip, 
  Divider, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  alpha,
  Fade,
  Grow,
  Zoom,
  Slide
} from '@mui/material';
import { 
  LocalHospital, 
  CalendarMonth, 
  LocationOn, 
  MoreVert, 
  Add as AddIcon, 
  Upload as UploadIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon,
  VideocamOutlined,
  PersonOutlined,
  InsertDriveFile,
  Description,
  HealthAndSafety
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Custom colors
const customColors = {
  accentPink: '#FF5A8C',
  mediumPink: '#FFD6E0',
  lightPink: '#FFF0F3',
  darkBlue: '#2D3748',
  lightBlue: '#EDF2F7'
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    boxShadow: '0px 5px 15px rgba(255, 90, 140, 0.3)',
    transition: { type: 'spring', stiffness: 400 }
  },
  tap: { scale: 0.95 }
};

const Appointments = ({ newAppointment = false }) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Mock data
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'OB/GYN' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Pediatrician' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Maternal-Fetal Medicine' }
  ];

  const mockAppointments = [
    { 
      id: 1, 
      doctor: 'Dr. Sarah Johnson', 
      date: new Date(2023, 6, 15, 10, 30), 
      location: 'Women\'s Health Clinic, Room 302', 
      status: 'upcoming',
      type: 'in-person'
    },
    { 
      id: 2, 
      doctor: 'Dr. Michael Chen', 
      date: new Date(2023, 6, 28, 14, 0), 
      location: 'Virtual Appointment', 
      status: 'upcoming',
      type: 'virtual'
    },
    { 
      id: 3, 
      doctor: 'Dr. Emily Rodriguez', 
      date: new Date(2023, 5, 10, 9, 15), 
      location: 'Memorial Hospital, Floor 5', 
      status: 'completed',
      type: 'in-person'
    },
    { 
      id: 4, 
      doctor: 'Dr. Sarah Johnson', 
      date: new Date(2023, 5, 2, 11, 0), 
      location: 'Women\'s Health Clinic, Room 302', 
      status: 'canceled',
      type: 'in-person'
    }
  ];

  const mockReports = [
    { id: 1, name: 'Blood Test Results', date: new Date(2023, 5, 10), type: 'pdf', size: '1.2 MB' },
    { id: 2, name: 'Ultrasound Scan', date: new Date(2023, 4, 15), type: 'image', size: '3.5 MB' },
    { id: 3, name: 'Glucose Test', date: new Date(2023, 3, 20), type: 'pdf', size: '0.8 MB' }
  ];

  // Health metrics data for charts
  const bloodPressureData = {
    labels: ['Week 12', 'Week 16', 'Week 20', 'Week 24', 'Week 28', 'Week 32'],
    datasets: [
      {
        label: 'Systolic',
        data: [118, 120, 122, 125, 128, 130],
        borderColor: '#FF5A8C',
        backgroundColor: 'rgba(255, 90, 140, 0.2)',
        tension: 0.4
      },
      {
        label: 'Diastolic',
        data: [75, 76, 78, 80, 82, 84],
        borderColor: '#4A90E2',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        tension: 0.4
      }
    ]
  };

  const weightData = {
    labels: ['Week 8', 'Week 12', 'Week 16', 'Week 20', 'Week 24', 'Week 28', 'Week 32'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [58, 59, 61, 63, 65, 67, 69],
        borderColor: '#50C878',
        backgroundColor: 'rgba(80, 200, 120, 0.2)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Metrics Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };

  useEffect(() => {
    // Simulate data loading with a slight delay for animations
    const timer = setTimeout(() => {
      setAppointments(mockAppointments);
      setReports(mockReports);
      setLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Open add appointment dialog if navigated from dashboard with newAppointment prop
  useEffect(() => {
    if (newAppointment) {
      setOpenAddDialog(true);
    }
  }, [newAppointment]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddAppointment = () => {
    const newAppointment = {
      id: appointments.length + 1,
      doctor: doctors.find(d => d.id === parseInt(selectedDoctor))?.name || '',
      date: selectedDate,
      location: appointmentType === 'virtual' ? 'Virtual Appointment' : 'Women\'s Health Clinic',
      status: 'upcoming',
      type: appointmentType
    };
    
    setAppointments([...appointments, newAppointment]);
    setOpenAddDialog(false);
    
    // Reset form
    setSelectedDate(new Date());
    setAppointmentType('in-person');
    setSelectedDoctor('');
    
    // Redirect to /appointments after adding appointment
    navigate('/appointments');
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    // Redirect to /appointments when dialog closes
    if (newAppointment) {
      navigate('/appointments');
    }
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(app => 
      app.id === id ? {...app, status: 'canceled'} : app
    ));
  };

  const handleRescheduleAppointment = (id) => {
    // In a real app, this would open a dialog to reschedule
    alert(`Reschedule appointment ${id}`);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadReport = () => {
    if (selectedFile) {
      const newReport = {
        id: reports.length + 1,
        name: selectedFile.name,
        date: new Date(),
        type: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      };
      
      setReports([newReport, ...reports]);
      setOpenUploadDialog(false);
      setSelectedFile(null);
      
      // Redirect to /appointments after uploading report
      navigate('/appointments');
    }
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    // Redirect to /appointments when dialog closes
    navigate('/appointments');
  };

  const handleDeleteReport = (id) => {
    setReports(reports.filter(report => report.id !== id));
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'upcoming':
        return <Chip 
          label="Upcoming" 
          size="small" 
          sx={{ 
            bgcolor: alpha(customColors.accentPink, 0.1), 
            color: customColors.accentPink,
            fontWeight: 'bold'
          }} 
        />;
      case 'completed':
        return <Chip 
          label="Completed" 
          size="small" 
          sx={{ 
            bgcolor: alpha('#50C878', 0.1), 
            color: '#50C878',
            fontWeight: 'bold'
          }} 
        />;
      case 'canceled':
        return <Chip 
          label="Canceled" 
          size="small" 
          sx={{ 
            bgcolor: alpha('#FF5252', 0.1), 
            color: '#FF5252',
            fontWeight: 'bold'
          }} 
        />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={loaded} timeout={800}>
        <Box component={motion.div} 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
            component={motion.div}
            variants={itemVariants}
          >
            <Typography variant="h4" fontWeight="bold" color={customColors.darkBlue}
              component={motion.h4}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              My Appointments
            </Typography>
            <motion.div 
              variants={buttonVariants}
              whileHover="hover" 
              whileTap="tap"
            >
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                component={Link}
                to="/appointments/new"
                sx={{ 
                  bgcolor: customColors.accentPink, 
                  '&:hover': { bgcolor: alpha(customColors.accentPink, 0.8) },
                  borderRadius: 2,
                  px: 3
                }}
              >
                Add Appointment
              </Button>
            </motion.div>
          </Box>

          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              mb: 3,
              '& .MuiTab-root': { 
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                minWidth: 120
              },
              '& .Mui-selected': { color: customColors.accentPink },
              '& .MuiTabs-indicator': { backgroundColor: customColors.accentPink }
            }}
            component={motion.div}
            variants={itemVariants}
          >
            <Tab label="Appointments" />
            <Tab label="Medical Reports" />
            <Tab label="Health Metrics" />
          </Tabs>

          {/* Appointments Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {appointments
                .sort((a, b) => {
                  // Sort by status (upcoming first) then by date
                  if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
                  if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
                  return new Date(a.date) - new Date(b.date);
                })
                .map((appointment, index) => (
                  <Grid item xs={12} md={6} key={appointment.id}>
                    <Grow in={loaded} timeout={800 + (index * 200)}>
                      <Card elevation={3} sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        bgcolor: appointment.status === 'canceled' ? alpha('#f5f5f5', 0.7) : 'white',
                        '&:hover': {
                          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                          transform: appointment.status !== 'canceled' ? 'translateY(-5px)' : 'none'
                        }
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Avatar sx={{ 
                                  bgcolor: appointment.type === 'virtual' ? alpha('#4A90E2', 0.1) : alpha(customColors.accentPink, 0.1),
                                  color: appointment.type === 'virtual' ? '#4A90E2' : customColors.accentPink
                                }}>
                                  {appointment.type === 'virtual' ? <VideocamOutlined /> : <LocalHospital />}
                                </Avatar>
                              </motion.div>
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {appointment.doctor}
                                </Typography>
                                {getStatusChip(appointment.status)}
                              </Box>
                            </Box>
                            <IconButton size="small">
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </Box>
                          
                          <Zoom in={loaded} timeout={1000 + (index * 200)}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 3, 
                              bgcolor: alpha(customColors.lightPink, 0.5),
                              mb: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: alpha(customColors.lightPink, 0.7),
                                transform: 'scale(1.02)'
                              }
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <motion.div
                                  initial={{ rotate: 0 }}
                                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                                  transition={{ duration: 0.5, delay: 1 + (index * 0.2) }}
                                >
                                  <CalendarMonth color="action" />
                                </motion.div>
                                <Typography variant="body1">
                                  {appointment.date.toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                  {appointment.date.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                  })}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <motion.div
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <LocationOn color="action" />
                                </motion.div>
                                <Typography variant="body1">
                                  {appointment.location}
                                </Typography>
                              </Box>
                            </Box>
                          </Zoom>
                          
                          {appointment.status === 'upcoming' && (
                            <Fade in={loaded} timeout={1200 + (index * 200)}>
                              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    sx={{ 
                                      borderColor: '#FF5252', 
                                      color: '#FF5252',
                                      '&:hover': { borderColor: '#FF5252', bgcolor: alpha('#FF5252', 0.1) }
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    variant="contained" 
                                    size="small"
                                    onClick={() => handleRescheduleAppointment(appointment.id)}
                                    sx={{ 
                                      bgcolor: customColors.accentPink, 
                                      '&:hover': { bgcolor: alpha(customColors.accentPink, 0.8) }
                                    }}
                                  >
                                    Reschedule
                                  </Button>
                                </motion.div>
                              </Box>
                            </Fade>
                          )}
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
            </Grid>
          )}

          {/* Medical Reports Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  component={motion.h6}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Medical Reports & Documents
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<UploadIcon />}
                    onClick={() => setOpenUploadDialog(true)}
                    sx={{ 
                      bgcolor: customColors.accentPink, 
                      '&:hover': { bgcolor: alpha(customColors.accentPink, 0.8) },
                      borderRadius: 2
                    }}
                  >
                    Upload Report
                  </Button>
                </motion.div>
              </Box>

              <Zoom in={loaded} timeout={800}>
                <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                  <List>
                    {reports.map((report, index) => (
                      <React.Fragment key={report.id}>
                        {index > 0 && <Divider component="li" />}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ListItem
                            sx={{ 
                              py: 2,
                              transition: 'all 0.2s ease',
                              '&:hover': { bgcolor: alpha(customColors.lightPink, 0.5) }
                            }}
                          >
                            <ListItemAvatar>
                              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                <Avatar sx={{ 
                                  bgcolor: report.type === 'pdf' ? alpha('#FF5252', 0.1) : alpha('#4A90E2', 0.1),
                                  color: report.type === 'pdf' ? '#FF5252' : '#4A90E2'
                                }}>
                                  {report.type === 'pdf' ? <Description /> : <InsertDriveFile />}
                                </Avatar>
                              </motion.div>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight="bold">
                                  {report.name}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {report.date.toLocaleDateString()}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {report.size}
                                  </Typography>
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <IconButton edge="end" sx={{ mr: 1 }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <IconButton 
                                  edge="end" 
                                  onClick={() => handleDeleteReport(report.id)}
                                  sx={{ color: '#FF5252' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </motion.div>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </motion.div>
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Zoom>
            </Box>
          )}

          {/* Health Metrics Tab */}
          {tabValue === 2 && (
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={800}>
                    <Card elevation={3} sx={{ borderRadius: 4, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <HealthAndSafety sx={{ color: customColors.accentPink, mr: 1 }} />
                        </motion.div>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold"
                          component={motion.h6}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          AI Health Insights
                        </Typography>
                      </Box>
                      <Slide direction="up" in={loaded} timeout={1000}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            bgcolor: alpha(customColors.accentPink, 0.1),
                            borderRadius: 3,
                            mb: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: alpha(customColors.accentPink, 0.2),
                              transform: 'scale(1.02)'
                            }
                          }}
                        >
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <b>Blood Pressure Alert:</b> Your systolic pressure has been trending upward for the last 3 readings.
                          </Typography>
                          <Typography variant="body1">
                            <b>Weight Gain:</b> Your weight gain is within the expected range for week 32.
                          </Typography>
                        </Paper>
                      </Slide>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Fade in={loaded} timeout={1200}>
                            <Box>
                              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                Blood Pressure Trends
                              </Typography>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                              >
                                <Box sx={{ height: 300 }}>
                                  <Line data={bloodPressureData} options={chartOptions} />
                                </Box>
                              </motion.div>
                            </Box>
                          </Fade>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Fade in={loaded} timeout={1400}>
                            <Box>
                              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                Weight Progression
                              </Typography>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                              >
                                <Box sx={{ height: 300 }}>
                                  <Line data={weightData} options={chartOptions} />
                                </Box>
                              </motion.div>
                            </Box>
                          </Fade>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grow>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Fade>

      {/* Add Appointment Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Schedule New Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
              <Select
                labelId="doctor-select-label"
                value={selectedDoctor}
                label="Select Doctor"
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                {doctors.map(doctor => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Appointment Date & Time"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { fullWidth: true, sx: { mb: 3 } } }}
              />
            </LocalizationProvider>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="appointment-type-label">Appointment Type</InputLabel>
              <Select
                labelId="appointment-type-label"
                value={appointmentType}
                label="Appointment Type"
                onChange={(e) => setAppointmentType(e.target.value)}
              >
                <MenuItem value="in-person">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonOutlined sx={{ mr: 1 }} />
                    In-person Visit
                  </Box>
                </MenuItem>
                <MenuItem value="virtual">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <VideocamOutlined sx={{ mr: 1 }} />
                    Virtual Consultation
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={3}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseAddDialog}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained"
              onClick={handleAddAppointment}
              sx={{ 
                bgcolor: customColors.accentPink, 
                '&:hover': { bgcolor: alpha(customColors.accentPink, 0.8) }
              }}
            >
              Schedule Appointment
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

      {/* Upload Report Dialog */}
      <Dialog 
        open={openUploadDialog} 
        onClose={handleCloseUploadDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Upload Medical Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 3, 
                textAlign: 'center',
                mb: 3,
                bgcolor: alpha('#f5f5f5', 0.5),
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: customColors.accentPink,
                  bgcolor: alpha(customColors.lightPink, 0.2)
                }
              }}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
            >
              <input
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                id="report-file-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="report-file-upload">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Select File
                  </Button>
                </motion.div>
              </label>
              <Typography variant="body2" color="text.secondary">
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Supported formats: PDF, JPG, PNG'}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Report Description"
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                defaultValue="lab-result"
                label="Report Type"
              >
                <MenuItem value="lab-result">Lab Result</MenuItem>
                <MenuItem value="ultrasound">Ultrasound</MenuItem>
                <MenuItem value="prescription">Prescription</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseUploadDialog}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained"
              onClick={handleUploadReport}
              disabled={!selectedFile}
              sx={{ 
                bgcolor: customColors.accentPink, 
                '&:hover': { bgcolor: alpha(customColors.accentPink, 0.8) }
              }}
            >
              Upload Report
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments;
