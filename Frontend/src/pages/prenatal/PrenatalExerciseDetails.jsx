import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  Container,
  Chip
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import InventoryIcon from '@mui/icons-material/Inventory';
import { COLORS } from '../../theme/colors';
import { motion } from 'framer-motion';

const PrenatalExerciseDetails = () => {
  const navigate = useNavigate();
  const { exerciseId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const trimester = searchParams.get('trimester') || '1';
  
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/assets/merged_exercises.json');
        if (!response.ok) {
          throw new Error('Failed to fetch exercise data');
        }
        
        const data = await response.json();
        
        // Find the exercise in the prenatal exercises for the specific trimester
        if (data.prenatal_exercises && data.prenatal_exercises[trimester]) {
          const foundExercise = data.prenatal_exercises[trimester].exercises.find(
            ex => ex.id.toString() === exerciseId
          );
          
          if (foundExercise) {
            setExercise(foundExercise);
          } else {
            setError('Exercise not found');
          }
        } else {
          setError('Trimester data not found');
        }
      } catch (err) {
        console.error('Error fetching exercise data:', err);
        setError('Failed to load exercise details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (exerciseId) {
      fetchExerciseData();
    }
  }, [exerciseId, trimester]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography variant="h5">Loading exercise details...</Typography>
      </Box>
    );
  }

  if (error || !exercise) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5">{error || 'Exercise not found. Please try another exercise.'}</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/prenatal/exercises')}
          sx={{ bgcolor: COLORS.primary }}
        >
          Back to Exercises
        </Button>
      </Box>
    );
  }

  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) {
      return url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be')) {
      const videoId = url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/prenatal/exercises')}
          sx={{ mb: 3, color: COLORS.primary }}
        >
          Back to Exercises
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card 
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
              border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
              mb: 4,
              mx: 'auto',
              maxWidth: '900px'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 2,
                  color: COLORS.primary,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600
                }}
              >
                {exercise.name}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {exercise.trimester && (
                  <Chip 
                    label={`${exercise.trimester} Trimester`}
                    size="small"
                    sx={{ 
                      bgcolor: alpha(COLORS.primary, 0.1),
                      color: COLORS.primary
                    }}
                  />
                )}
                {exercise.duration && (
                  <Chip 
                    icon={<TimerIcon />} 
                    label={exercise.duration}
                    size="small"
                    sx={{ 
                      bgcolor: alpha(COLORS.primary, 0.1),
                      color: COLORS.primary
                    }}
                  />
                )}
                {exercise.difficulty && (
                  <Chip 
                    icon={<FitnessCenterIcon />} 
                    label={exercise.difficulty}
                    size="small"
                    sx={{ 
                      bgcolor: alpha(COLORS.primary, 0.1),
                      color: COLORS.primary
                    }}
                  />
                )}
              </Box>

              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  color: COLORS.text.secondary,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400
                }}
              >
                {exercise.description}
              </Typography>

              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={4}>
                {exercise.video && (
                  <Grid item xs={12}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3,
                        color: COLORS.primary,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600
                      }}
                    >
                      Video Demonstration
                    </Typography>
                    
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '56.25%', // 16:9 aspect ratio
                        width: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 4,
                        '& iframe': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }
                      }}
                    >
                      <iframe
                        src={getEmbedUrl(exercise.video)}
                        title={`${exercise.name} demonstration`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </Box>
                    <Divider sx={{ mb: 4 }} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3,
                      color: COLORS.primary,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600
                    }}
                  >
                    How to Perform
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    {exercise.steps.map((step, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(COLORS.primary, 0.05),
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            minWidth: '24px',
                            mr: 2,
                            color: COLORS.primary
                          }}
                        >
                          {index + 1}.
                        </Typography>
                        <Typography variant="body1">
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ mb: 4 }} />
                </Grid>

                {exercise.equipment && exercise.equipment.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3,
                        color: COLORS.primary,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600
                      }}
                    >
                      Equipment Needed
                    </Typography>
                    <List>
                      {exercise.equipment.map((item, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon>
                            <InventoryIcon sx={{ color: COLORS.primary }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: "'Poppins', sans-serif"
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}

                {exercise.benefits && exercise.benefits.length > 0 && (
                  <Grid item xs={12} md={exercise.equipment && exercise.equipment.length > 0 ? 6 : 12}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3,
                        color: COLORS.primary,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600
                      }}
                    >
                      Benefits
                    </Typography>
                    <List>
                      {exercise.benefits.map((benefit, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: COLORS.primary }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={benefit}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: "'Poppins', sans-serif"
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ mb: 4 }} />
                </Grid>

                {exercise.precautions && exercise.precautions.length > 0 && (
                  <Grid item xs={12}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3,
                        color: COLORS.primary,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600
                      }}
                    >
                      Precautions
                    </Typography>
                    <Box sx={{ mb: 4, p: 3, borderRadius: 2, bgcolor: alpha('#FFC107', 0.1), border: '1px solid #FFC107' }}>
                      <List>
                        {exercise.precautions.map((precaution, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 1 }}>
                            <ListItemIcon>
                              <WarningIcon sx={{ color: '#FFC107' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={precaution}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontFamily: "'Poppins', sans-serif"
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default PrenatalExerciseDetails;
