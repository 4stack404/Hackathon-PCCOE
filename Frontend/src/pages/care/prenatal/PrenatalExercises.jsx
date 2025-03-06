import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Button, Grid, CardMedia, Chip,
  List, ListItem, ListItemIcon, ListItemText,
  useTheme, alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import TimerIcon from '@mui/icons-material/Timer';
import { COLORS } from '../../../theme/colors';

const exercises = [
  {
    title: "Pregnancy Walking",
    description: "A gentle daily walk can improve circulation and boost energy levels.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    duration: "20-30 minutes",
    difficulty: "Easy",
    benefits: [
      "Improves cardiovascular health",
      "Reduces back pain",
      "Helps maintain healthy weight gain",
      "Boosts mood and energy levels"
    ],
    precautions: [
      "Wear comfortable shoes",
      "Stay hydrated",
      "Avoid uneven terrain",
      "Listen to your body"
    ]
  },
  {
    title: "Prenatal Yoga",
    description: "Gentle stretching and breathing exercises to prepare for labor.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    duration: "15-45 minutes",
    difficulty: "Moderate",
    benefits: [
      "Increases flexibility",
      "Reduces stress and anxiety",
      "Improves sleep quality",
      "Strengthens core muscles"
    ],
    precautions: [
      "Avoid deep twists",
      "Modified poses after first trimester",
      "No hot yoga",
      "Keep breathing steady"
    ]
  },
  {
    title: "Swimming",
    description: "Low-impact exercise that's gentle on your joints and supports your growing belly.",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635",
    duration: "20-30 minutes",
    difficulty: "Moderate",
    benefits: [
      "Reduces swelling",
      "Supports weight of belly",
      "Improves endurance",
      "Keeps you cool"
    ],
    precautions: [
      "Use handrails for safety",
      "Avoid diving",
      "Choose clean, chlorinated pools",
      "Don't overexert"
    ]
  },
  {
    title: "Pelvic Floor Exercises",
    description: "Essential exercises to strengthen the muscles supporting your uterus.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
    duration: "5-10 minutes",
    difficulty: "Easy",
    benefits: [
      "Prevents incontinence",
      "Prepares for delivery",
      "Supports recovery",
      "Improves bladder control"
    ],
    precautions: [
      "Don't hold breath",
      "Practice regularly",
      "Don't overdo it",
      "Focus on proper technique"
    ]
  }
];

const PrenatalExercises = () => {
  const navigate = useNavigate();

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
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    icon={<TimerIcon />} 
                    label={exercise.duration}
                    sx={{ 
                      bgcolor: alpha(COLORS.primary, 0.1),
                      color: COLORS.primary
                    }}
                  />
                  <Chip 
                    icon={<FitnessCenterIcon />} 
                    label={exercise.difficulty}
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
                  {exercise.title}
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

                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    color: COLORS.primary,
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CheckCircleIcon /> Benefits
                </Typography>

                <List dense>
                  {exercise.benefits.map((benefit, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={benefit}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.9rem'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    mt: 2,
                    color: COLORS.primary,
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <WarningIcon /> Precautions
                </Typography>

                <List dense>
                  {exercise.precautions.map((precaution, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <WarningIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={precaution}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.9rem'
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