import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Button, Grid, CardMedia,
  List, ListItem, ListItemIcon, ListItemText,
  useTheme, alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpaIcon from '@mui/icons-material/Spa';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { COLORS } from '../../../theme/colors';

const selfCareCategories = [
  {
    title: "Physical Comfort",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c",
    tips: [
      {
        heading: "Pregnancy Massage",
        details: "Get regular prenatal massages to relieve muscle tension and improve circulation",
        icon: SpaIcon
      },
      {
        heading: "Comfortable Clothing",
        details: "Invest in breathable, stretchy maternity clothes that grow with you",
        icon: SpaIcon
      },
      {
        heading: "Rest Periods",
        details: "Take short breaks throughout the day to put your feet up",
        icon: SpaIcon
      },
      {
        heading: "Sleep Position",
        details: "Use pregnancy pillows for better sleep comfort",
        icon: SpaIcon
      }
    ]
  },
  {
    title: "Emotional Wellbeing",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    tips: [
      {
        heading: "Meditation",
        details: "Practice daily mindfulness or meditation for stress relief",
        icon: FavoriteIcon
      },
      {
        heading: "Support Groups",
        details: "Join pregnancy support groups to share experiences",
        icon: FavoriteIcon
      },
      {
        heading: "Journal Writing",
        details: "Document your pregnancy journey and feelings",
        icon: FavoriteIcon
      },
      {
        heading: "Positive Affirmations",
        details: "Practice daily positive self-talk and affirmations",
        icon: FavoriteIcon
      }
    ]
  },
  {
    title: "Skincare & Beauty",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
    tips: [
      {
        heading: "Moisturizing",
        details: "Keep skin hydrated to prevent stretch marks and itching",
        icon: SpaIcon
      },
      {
        heading: "Safe Products",
        details: "Use pregnancy-safe skincare products",
        icon: SpaIcon
      },
      {
        heading: "Gentle Exercise",
        details: "Practice pregnancy-safe yoga or stretching",
        icon: SpaIcon
      },
      {
        heading: "Hydration",
        details: "Drink plenty of water throughout the day",
        icon: SpaIcon
      }
    ]
  },
  {
    title: "Daily Routines",
    image: "https://images.unsplash.com/photo-1511795409834-432f7b1728b2",
    tips: [
      {
        heading: "Morning Ritual",
        details: "Start your day with gentle stretching and deep breathing",
        icon: SpaIcon
      },
      {
        heading: "Healthy Meals",
        details: "Plan and prepare nutritious meals ahead of time",
        icon: SpaIcon
      },
      {
        heading: "Evening Relaxation",
        details: "Create a calming bedtime routine",
        icon: SpaIcon
      },
      {
        heading: "Social Connection",
        details: "Stay connected with friends and family",
        icon: FavoriteIcon
      }
    ]
  }
];

const PrenatalSelfCare = () => {
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
        Self Care & Comfort
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
        Taking care of yourself during pregnancy
      </Typography>

      <Grid container spacing={4}>
        {selfCareCategories.map((category, index) => (
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
                image={category.image}
                alt={category.title}
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
                  {category.title}
                </Typography>

                <List>
                  {category.tips.map((tip, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <tip.icon sx={{ color: COLORS.primary }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={tip.heading}
                        secondary={tip.details}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                            color: COLORS.text.primary
                          },
                          '& .MuiListItemText-secondary': {
                            fontFamily: "'Poppins', sans-serif",
                            color: COLORS.text.secondary
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

export default PrenatalSelfCare; 