import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Button,
  CircularProgress,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SpaIcon from '@mui/icons-material/Spa';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FadeInSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

const CareDetails = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [careData, setCareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/careData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch care data');
        }
        const data = await response.json();
        
        if (data[type]) {
          setCareData(data[type]);
        } else {
          setError('Invalid care type');
          navigate('/care');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, navigate]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/care')}
        >
          Go Back to Care Selection
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pt: 8, pb: 10 }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          mb: 8
        }}
      >
        <Container maxWidth="lg">
          <FadeInSection>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/care')}
                sx={{ mb: 2 }}
              >
                Back to Care Selection
              </Button>
            </Box>
            <Typography
              variant="h2"
              component="h1"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: theme.palette.primary.main,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {careData.title}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                color: 'text.secondary'
              }}
            >
              {careData.description}
            </Typography>
          </FadeInSection>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        {/* Theory Section */}
        <FadeInSection delay={0.2}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 6, 
              borderRadius: 3,
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: theme.palette.primary.main,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Understanding {careData.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.secondary',
                whiteSpace: 'pre-line'
              }}
            >
              {careData.theory}
            </Typography>
          </Paper>
        </FadeInSection>

        {/* Image Section */}
        <FadeInSection delay={0.3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 6, 
              borderRadius: 3,
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: theme.palette.primary.main,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Recommended Exercises
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.secondary'
              }}
            >
              These exercises are specifically designed to support your {type === 'prenatal' ? 'pregnancy journey' : 'postpartum recovery'}.
              Always consult with your healthcare provider before starting any new exercise routine.
            </Typography>
            <Box 
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                mb: 2
              }}
            >
              <img
                src={careData.exerciseImage}
                alt={`${careData.title} Exercises`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </Box>
          </Paper>
        </FadeInSection>

        {/* Mental Wellness and Baby Care Tips */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FadeInSection delay={0.4}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SpaIcon sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 2 }} />
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      Mental Wellness
                    </Typography>
                  </Box>
                  <List>
                    {careData.mentalWellness.map((tip, index) => (
                      <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleOutlineIcon sx={{ color: theme.palette.secondary.main }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={tip} 
                          primaryTypographyProps={{ 
                            sx: { 
                              fontSize: '1rem',
                              lineHeight: 1.6,
                              color: 'text.secondary'
                            } 
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </FadeInSection>
          </Grid>
          <Grid item xs={12} md={6}>
            <FadeInSection delay={0.5}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <ChildCareIcon sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 2 }} />
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      {type === 'prenatal' ? 'Baby Development' : 'Baby Care'}
                    </Typography>
                  </Box>
                  <List>
                    {careData.babyCare.map((tip, index) => (
                      <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleOutlineIcon sx={{ color: theme.palette.secondary.main }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={tip} 
                          primaryTypographyProps={{ 
                            sx: { 
                              fontSize: '1rem',
                              lineHeight: 1.6,
                              color: 'text.secondary'
                            } 
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </FadeInSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CareDetails;
