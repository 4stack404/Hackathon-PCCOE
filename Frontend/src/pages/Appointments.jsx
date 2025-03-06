import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  Slide,
  CircularProgress,
  ListItemIcon,
  LinearProgress
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
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

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
  const { id } = useParams(); // Get the appointment ID from URL params
  const { currentUser } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentType, setAppointmentType] = useState('checkup');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [location, setLocation] = useState({
    name: '',
    address: ''
  });
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Doctors data
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'OB/GYN' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Pediatrician' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Maternal-Fetal Medicine' }
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

  // Effect to handle edit mode
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadAppointmentForEdit(id);
    }
  }, [id]);

  // Load appointment data for editing
  const loadAppointmentForEdit = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointment(appointmentId);
      if (response.success) {
        const appointment = response.data;
        setAppointmentTitle(appointment.title);
        setSelectedDate(new Date(appointment.date));
        setAppointmentType(appointment.type);
        setSelectedDoctor(appointment.doctor.name);
        setLocation({
          name: appointment.location.name,
          address: appointment.location.address
        });
        setAppointmentNotes(appointment.notes || '');
        setOpenAddDialog(true);
      } else {
        toast.error('Failed to load appointment details');
        navigate('/appointments');
      }
    } catch (error) {
      console.error('Failed to load appointment:', error);
      toast.error('Failed to load appointment details');
      navigate('/appointments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments with auth check
  const fetchAppointments = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await appointmentService.getAppointments();
      console.log('Fetched appointments:', response); // Debug log
      if (response.success) {
        setAppointments(response.data);
        console.log('Appointments state:', response.data); // Debug log
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchAppointments();
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

  // Update the handleAddAppointment function to handle both create and edit
  const handleAddAppointment = async () => {
    try {
      setLoading(true);
      
      const selectedDoctorInfo = doctors.find(d => d.name === selectedDoctor);
      
      const appointmentData = {
        title: appointmentTitle,
        date: selectedDate.toISOString(),
        type: appointmentType,
        doctor: selectedDoctorInfo ? {
          name: selectedDoctorInfo.name,
          specialty: selectedDoctorInfo.specialty
        } : null,
        location: {
          name: location.name || '',
          address: location.address || ''
        },
        notes: appointmentNotes,
        status: 'scheduled'
      };

      let response;
      if (isEditing) {
        response = await appointmentService.updateAppointment(id, appointmentData);
        if (response.success) {
          toast.success('Appointment updated successfully');
          setAppointments(prev => prev.map(app => 
            app._id === id ? { ...app, ...response.data } : app
          ));
        }
      } else {
        response = await appointmentService.createAppointment(appointmentData);
        if (response.success) {
          toast.success('Appointment created successfully');
          setAppointments(prev => [...prev, response.data]);
        }
      }

      handleCloseAddDialog();
      fetchAppointments();
    } catch (error) {
      console.error('Failed to save appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedDate(new Date());
    setAppointmentType('checkup');
    setSelectedDoctor('');
    setAppointmentTitle('');
    setAppointmentNotes('');
    setLocation({ name: '', address: '' });
    setIsEditing(false);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        setLoading(true);
        const response = await appointmentService.deleteAppointment(appointmentId);
        if (response.success) {
          toast.success('Appointment cancelled successfully');
          // Remove the appointment from the local state
          setAppointments(prev => prev.filter(app => app._id !== appointmentId));
        } else {
          throw new Error('Failed to cancel appointment');
        }
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
        toast.error(error.response?.data?.message || 'Failed to cancel appointment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should not exceed 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadReport = async () => {
    if (selectedFile) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        // Add report to the list after successful upload
        const newReport = {
          id: Date.now(),
          name: selectedFile.name,
          date: new Date(),
          type: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        };
        
        setReports(prev => [newReport, ...prev]);
        setOpenUploadDialog(false);
        setSelectedFile(null);
        toast.success('Report uploaded successfully');
        
      } catch (error) {
        console.error('Failed to upload report:', error);
        toast.error('Failed to upload report');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setSelectedFile(null);
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        setLoading(true);
        setReports(prev => prev.filter(report => report.id !== id));
        toast.success('Report deleted successfully');
      } catch (error) {
        console.error('Failed to delete report:', error);
        toast.error('Failed to delete report');
      } finally {
        setLoading(false);
      }
    }
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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid date';
      }
      return date;
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date(); // Return current date as fallback
    }
  };

  // Update the appointment card rendering to handle status better
  const isActiveAppointment = (status) => {
    return status !== 'canceled' && status !== 'completed';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress sx={{ color: customColors.accentPink }} />
        </Box>
      ) : (
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
                    <Grid item xs={12} md={6} key={appointment._id}>
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
                                    {appointment.doctor.name}
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
                                    {formatDate(appointment.date).toLocaleDateString('en-US', { 
                                      weekday: 'long',
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                    {formatDate(appointment.date).toLocaleTimeString('en-US', { 
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
                                    {appointment.location.name}
                                  </Typography>
                                </Box>
                              </Box>
                            </Zoom>
                            
                            {/* Show buttons for all appointments that are not canceled or completed */}
                            {isActiveAppointment(appointment.status) && (
                              <Fade in={loaded} timeout={1200 + (index * 200)}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  gap: 2,
                                  mt: 2,
                                  justifyContent: 'flex-end'
                                }}>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      variant="outlined"
                                      onClick={() => navigate(`/appointments/edit/${appointment._id}`)}
                                      sx={{ 
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
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      variant="outlined"
                                      onClick={() => handleCancelAppointment(appointment._id)}
                                      sx={{ 
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
      )}

      {/* Add Appointment Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          pt: 3,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <LocalHospital sx={{ color: customColors.accentPink }} />
          <Typography variant="h5" component="span" fontWeight="bold">
            {isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              required
              label="Appointment Title"
              value={appointmentTitle}
              onChange={(e) => setAppointmentTitle(e.target.value)}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
              <Select
                labelId="doctor-select-label"
                value={selectedDoctor}
                label="Select Doctor"
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                {doctors.map(doctor => (
                  <MenuItem key={doctor.id} value={doctor.name}>
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
                slotProps={{ textField: { fullWidth: true, sx: { mb: 3 }, required: true } }}
              />
            </LocalizationProvider>

            <FormControl fullWidth required sx={{ mb: 3 }}>
              <InputLabel id="appointment-type-label">Appointment Type</InputLabel>
              <Select
                labelId="appointment-type-label"
                value={appointmentType}
                label="Appointment Type"
                onChange={(e) => setAppointmentType(e.target.value)}
              >
                <MenuItem value="checkup">Regular Checkup</MenuItem>
                <MenuItem value="ultrasound">Ultrasound</MenuItem>
                <MenuItem value="test">Medical Test</MenuItem>
                <MenuItem value="consultation">Consultation</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Location Name"
              value={location.name}
              onChange={(e) => setLocation(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Location Address"
              value={location.address}
              onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={3}
              variant="outlined"
              value={appointmentNotes}
              onChange={(e) => setAppointmentNotes(e.target.value)}
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
              disabled={!appointmentTitle || !selectedDate || !appointmentType}
              sx={{ 
                bgcolor: customColors.accentPink, 
                '&:hover': { bgcolor: alpha(customColors.accentPink, 0.8) }
              }}
            >
              {isEditing ? 'Update Appointment' : 'Schedule Appointment'}
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
