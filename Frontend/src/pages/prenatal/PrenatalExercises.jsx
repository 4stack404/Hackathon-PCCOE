import React from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  CardMedia, List, ListItem, ListItemIcon, 
  ListItemText, Button, alpha 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../theme/colors';

const exercises = [
  {
    title: "Walking",
    description: "A gentle 20-30 minute walk daily can improve circulation and boost energy.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3",
    benefits: [
      "Improves cardiovascular health",
      "Reduces back pain",
      "Helps maintain healthy weight gain",
      "Boosts mood and energy levels"
    ]
  },
  {
    title: "Prenatal Yoga",
    description: "Gentle stretching and breathing exercises to prepare for labor.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    benefits: [
      "Increases flexibility",
      "Reduces stress and anxiety",
      "Improves sleep quality",
      "Strengthens core muscles"
    ]
  },
  // Add more exercises...
];

const PrenatalExercises = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/prenatal')}
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

      <Grid container spacing={4}>
        {exercises.map((exercise, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 'none',
                border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
                '&:hover': {
                  boxShadow: `0 8px 24px ${alpha(COLORS.primary, 0.15)}`
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={exercise.image}
                alt={exercise.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    color: COLORS.primary,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600
                  }}
                >
                  {exercise.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 2,
                    color: COLORS.text.secondary,
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  {exercise.description}
                </Typography>
                <List>
                  {exercise.benefits.map((benefit, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PrenatalExercises; 