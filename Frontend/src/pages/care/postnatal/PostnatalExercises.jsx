import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Button, Grid, CardMedia, Chip,
  useTheme, alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import { COLORS } from '../../../theme/colors';
import { motion } from 'framer-motion';

const PostnatalExercises = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/assets/merged_exercises.json');
        const data = await response.json();
        setExercises(data.postnatal_exercises);
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography variant="h5">Loading exercises...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/care/postnatal')}
        sx={{ mb: 3, color: COLORS.primary }}
      >
        Back to Postnatal Care
      </Button>

      <Typography 
        variant="h3" 
        sx={{ 
          mb: 1,
          color: COLORS.primary,
          fontFamily: "'Playfair Display', serif"
        }}
      >
        Postnatal Recovery Exercises
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
        Safe and effective exercises to support your postpartum recovery
      </Typography>

      <Grid container spacing={4}>
        {exercises && exercises.map((exercise, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 'none',
                  border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha(COLORS.primary, 0.15)}`,
                    transform: 'translateY(-8px)'
                  },
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={exercise.image || `https://source.unsplash.com/random/?postpartum,${exercise.name.toLowerCase()},exercise`}
                    alt={exercise.name}
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      color: COLORS.primary,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600
                    }}
                  >
                    {exercise.name}
                  </Typography>

                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3,
                      color: COLORS.text.secondary,
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {exercise.description}
                  </Typography>

                  <Button 
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/care/postnatal/exercises/${exercise.id}`)}
                    sx={{ 
                      mt: 'auto',
                      bgcolor: COLORS.primary,
                      color: 'white',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: alpha(COLORS.primary, 0.9)
                      }
                    }}
                  >
                    View Exercise Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostnatalExercises;
