import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Grid, CardMedia, Button, CardActions,
  useTheme, alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../theme/colors';

const prenatalSections = [
  {
    title: "Mum Tip of the Week",
    description: "Stay hydrated! Aim for 8-10 glasses of water daily to support your baby's development and maintain amniotic fluid levels.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3",
    path: "/care/prenatal/weekly-tips"
  },
  {
    title: "Know More about Prenatal",
    description: "Essential information about your pregnancy journey, fetal development, and what to expect each trimester.",
    image: "https://images.unsplash.com/photo-1584582397920-e5fb6084298d?ixlib=rb-4.0.3",
    path: "/care/prenatal/information"
  },
  {
    title: "Exercises",
    description: "Safe and effective exercises to keep you healthy and prepare for delivery.",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-4.0.3",
    path: "/prenatal/exercises"
  },
  {
    title: "Diet Tips",
    description: "Nutritional guidance and meal planning for a healthy pregnancy.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3",
    path: "/care/prenatal/diet"
  },
  {
    title: "Symptoms and Remedies",
    description: "Common pregnancy symptoms and natural ways to find relief.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3",
    path: "/care/prenatal/symptoms"
  },
  {
    title: "Self Care and Comfort",
    description: "Tips for maintaining physical and emotional well-being during pregnancy.",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3",
    path: "/care/prenatal/self-care"
  },
  {
    title: "Labor & Delivery Preparation",
    description: "Everything you need to know to prepare for your big day.",
    image: "https://images.unsplash.com/photo-1535185384036-28bbc8035f28?ixlib=rb-4.0.3",
    path: "/care/prenatal/labor-prep"
  }
];

const PrenatalCare = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        maxWidth: 1400, 
        mx: 'auto',
        bgcolor: COLORS.background,
        minHeight: 'calc(100vh - 140px)', // Adjust based on your header/footer height
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 1,
          color: COLORS.primary,
          fontFamily: "'Playfair Display', serif",
          textAlign: 'center'
        }}
      >
        Prenatal Care
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 4,
          color: COLORS.text.secondary,
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 400
        }}
      >
        Your complete guide to a healthy pregnancy journey
      </Typography>

      <Grid container spacing={3}>
        {prenatalSections.map((section, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 'none',
                border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 24px ${alpha(COLORS.primary, 0.2)}`,
                  '& .MuiCardMedia-root': {
                    transform: 'scale(1.05)'
                  }
                }
              }}
            >
              <Box sx={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  image={section.image}
                  alt={section.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  gutterBottom 
                  variant="h5" 
                  sx={{ 
                    color: COLORS.primary,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600
                  }}
                >
                  {section.title}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: COLORS.text.secondary,
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  {section.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  size="large" 
                  onClick={() => navigate(section.path)}
                  sx={{
                    color: COLORS.primary,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: alpha(COLORS.primary, 0.1)
                    }
                  }}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PrenatalCare; 