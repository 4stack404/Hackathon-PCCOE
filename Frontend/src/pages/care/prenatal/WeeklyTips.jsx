import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Button, Grid, CardMedia,
  useTheme, alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { COLORS } from '../../../theme/colors';

const weeklyTip = {
  title: "Week 20: Baby's Movement",
  mainTip: "You might start feeling your baby's movements more distinctly now!",
  image: "https://images.unsplash.com/photo-1584582397920-e5fb6084298d?ixlib=rb-4.0.3",
  tips: [
    {
      title: "What to Expect",
      content: "Baby's movements might feel like butterflies, bubbles, or light taps.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
    },
    {
      title: "Tracking Movements",
      content: "Start paying attention to your baby's active times during the day.",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4"
    },
    {
      title: "Self-Care Focus",
      content: "Get plenty of rest and stay hydrated to support your growing baby.",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c"
    }
  ]
};

const WeeklyTips = () => {
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
        {weeklyTip.title}
      </Typography>

      <Card 
        sx={{ 
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 'none',
          border: `1px solid ${alpha(COLORS.primary, 0.1)}`
        }}
      >
        <CardMedia
          component="img"
          height="400"
          image={weeklyTip.image}
          alt={weeklyTip.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2,
              color: COLORS.text.primary,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600
            }}
          >
            {weeklyTip.mainTip}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {weeklyTip.tips.map((tip, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 'none',
                border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 24px ${alpha(COLORS.primary, 0.2)}`
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={tip.image}
                alt={tip.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    color: COLORS.primary,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600
                  }}
                >
                  {tip.title}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: COLORS.text.secondary,
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  {tip.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WeeklyTips; 