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
  useTheme,
  alpha,
  Container
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { COLORS } from '../../../theme/colors';
import { motion } from 'framer-motion';

const ExerciseDetails = () => {
  const navigate = useNavigate();
  const { exerciseId, trimester } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/assets/merged_exercises.json');
        const data = await response.json();
        
        // Find the exercise in the specified trimester
        const trimesterData = data.prenatal[trimester];
        if (trimesterData) {
          const foundExercise = trimesterData.exercises.find(
            ex => ex.id.toString() === exerciseId
          );
          
          if (foundExercise) {
            setExercise(foundExercise);
          } else {
            console.error('Exercise not found');
          }
        } else {
          console.error('Trimester data not found');
        }
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (exerciseId && trimester) {
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

  if (!exercise) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography variant="h5">Exercise not found. Please try another exercise.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/care/prenatal/exercises')}
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
                        <Box 
                          sx={{ 
                            width: 30, 
                            height: 30, 
                            borderRadius: '50%', 
                            bgcolor: COLORS.primary,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography variant="body1">{step}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ mb: 4 }} />
                  
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          mb: 2,
                          color: COLORS.primary,
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 600
                        }}
                      >
                        Benefits
                      </Typography>

                      <List>
                        {exercise.benefits.map((benefit, index) => (
                          <ListItem key={index} sx={{ py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircleIcon sx={{ color: COLORS.primary }} />
                            </ListItemIcon>
                            <ListItemText primary={benefit} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          mb: 2,
                          color: COLORS.primary,
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 600
                        }}
                      >
                        Precautions
                      </Typography>

                      <List>
                        {exercise.precautions.map((precaution, index) => (
                          <ListItem key={index} sx={{ py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <WarningIcon sx={{ color: '#FFA500' }} />
                            </ListItemIcon>
                            <ListItemText primary={precaution} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </Grid>

                {exercise.video && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 4 }} />
                    
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
                        src={exercise.video.replace('watch?v=', 'embed/')}
                        title={`${exercise.name} demonstration`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
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

export default ExerciseDetails;
