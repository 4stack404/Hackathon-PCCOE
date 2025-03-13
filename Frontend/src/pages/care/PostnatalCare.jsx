import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Grid, CardMedia, Button, CardActions,
  useTheme, alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../theme/colors';

const postnatalSections = [
  {
    title: "Recovery Tips",
    description: "Essential advice for physical and emotional recovery after childbirth.",
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?ixlib=rb-4.0.3",
    path: "/care/postnatal/recovery-tips"
  },
  {
    title: "Postnatal Exercises",
    description: "Safe and effective exercises to help your body recover after pregnancy and childbirth.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3",
    path: "/care/postnatal/exercises"
  },
  {
    title: "Breastfeeding Guide",
    description: "Tips, techniques, and support for successful breastfeeding.",
    image: "https://images.unsplash.com/photo-1590612815525-2e16dc44d232?ixlib=rb-4.0.3",
    path: "/care/postnatal/breastfeeding"
  },
  {
    title: "Postpartum Nutrition",
    description: "Dietary recommendations to support healing, energy levels, and breastfeeding.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3",
    path: "/care/postnatal/nutrition"
  },
  {
    title: "Baby Care Basics",
    description: "Essential information for caring for your newborn in the first weeks and months.",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3",
    path: "/care/postnatal/baby-care"
  },
  {
    title: "Emotional Wellbeing",
    description: "Support for the emotional changes and challenges of the postpartum period.",
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3",
    path: "/care/postnatal/emotional-wellbeing"
  },
  {
    title: "Sleep Strategies",
    description: "Tips for managing sleep for both you and your baby during the early months.",
    image: "https://images.unsplash.com/photo-1621976360623-004223992275?ixlib=rb-4.0.3",
    path: "/care/postnatal/sleep"
  }
];

const PostnatalCare = () => {
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
        Postnatal Care
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
        Supporting your journey through the fourth trimester and beyond
      </Typography>

      <Grid container spacing={3}>
        {postnatalSections.map((section, index) => (
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

export default PostnatalCare;
