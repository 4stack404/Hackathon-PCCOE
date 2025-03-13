import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Button, Grid, CardMedia, Chip,
  List, ListItem, ListItemIcon, ListItemText,
  alpha, Tabs, Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import TimerIcon from '@mui/icons-material/Timer';
import { COLORS } from '../../theme/colors';
import { motion } from 'framer-motion';

const PrenatalExercises = () => {
  const navigate = useNavigate();
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trimester, setTrimester] = useState('1');
  const [filteredExercises, setFilteredExercises] = useState([]);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/assets/merged_exercises.json');
        const data = await response.json();
        
        // Extract all exercises from all trimesters
        const exercises = [];
        if (data.prenatal_exercises) {
          Object.keys(data.prenatal_exercises).forEach(trimesterKey => {
            if (data.prenatal_exercises[trimesterKey] && data.prenatal_exercises[trimesterKey].exercises) {
              data.prenatal_exercises[trimesterKey].exercises.forEach(exercise => {
                exercises.push({
                  ...exercise,
                  trimesterNum: trimesterKey
                });
              });
            }
          });
        }
        
        setAllExercises(exercises);
        filterExercisesByTrimester(exercises, trimester);
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, []);

  const filterExercisesByTrimester = (exercises, selectedTrimester) => {
    if (selectedTrimester === 'all') {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(exercises.filter(exercise => exercise.trimesterNum === selectedTrimester));
    }
  };

  const handleTrimesterChange = (event, newValue) => {
    setTrimester(newValue);
    filterExercisesByTrimester(allExercises, newValue);
  };

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
        onClick={() => navigate('/care/prenatal')}
        sx={{ mb: 3, color: COLORS.primary }}
      >
        Back to Prenatal Care
      </Button>

      <Typography 
        variant="h3" 
        sx={{ 
          mb: 1,
          color: COLORS.primary,
          fontFamily: "'Playfair Display', serif"
        }}
      >
        Safe Pregnancy Exercises
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
        Stay active and healthy with these pregnancy-safe exercises
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={trimester} 
          onChange={handleTrimesterChange}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              color: alpha(COLORS.primary, 0.7),
              '&.Mui-selected': {
                color: COLORS.primary
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.primary
            }
          }}
        >
          <Tab label="First Trimester" value="1" />
          <Tab label="Second Trimester" value="2" />
          <Tab label="Third Trimester" value="3" />
          <Tab label="All Exercises" value="all" />
        </Tabs>
      </Box>

      <Grid container spacing={4}>
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise, index) => (
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
                      image={exercise.image || `https://source.unsplash.com/random/?pregnancy,${exercise.name.toLowerCase()},exercise`}
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
                      <Chip 
                        label={`Trimester ${exercise.trimesterNum}`}
                        size="small"
                        sx={{ 
                          bgcolor: alpha(COLORS.primary, 0.1),
                          color: COLORS.primary
                        }}
                      />
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
                      onClick={() => navigate(`/care/prenatal/exercises/${exercise.trimesterNum}/${exercise.id}`)}
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
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h5" color="text.secondary">
                No exercises found for this trimester
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PrenatalExercises;