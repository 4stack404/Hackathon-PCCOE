import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Button, Grid, CardMedia, Accordion,
  AccordionSummary, AccordionDetails,
  useTheme, alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { COLORS } from '../../../theme/colors';

const prenatalInfo = {
  title: "Understanding Your Pregnancy Journey",
  description: "Learn about the key stages of pregnancy and what to expect during each trimester.",
  mainImage: "https://images.unsplash.com/photo-1584582397920-e5fb6084298d?ixlib=rb-4.0.3",
  trimesters: [
    {
      title: "First Trimester (Weeks 1-12)",
      image: "https://images.unsplash.com/photo-1537365587684-f490102e1225?ixlib=rb-4.0.3",
      highlights: [
        "Early pregnancy symptoms",
        "Important prenatal tests",
        "Dietary changes needed",
        "First ultrasound experience"
      ],
      content: "The first trimester is a time of rapid development for your baby. During this period, all major organs and structures begin to form. You might experience morning sickness, fatigue, and breast tenderness."
    },
    {
      title: "Second Trimester (Weeks 13-26)",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3",
      highlights: [
        "Baby's first movements",
        "Gender revelation possibility",
        "Energy levels improve",
        "Visible pregnancy changes"
      ],
      content: "Often called the 'honeymoon period' of pregnancy, the second trimester usually brings more energy and less morning sickness. Your baby's movements become noticeable, and you'll start showing more."
    },
    {
      title: "Third Trimester (Weeks 27-40)",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3",
      highlights: [
        "Preparing for labor",
        "Baby's position",
        "Hospital bag essentials",
        "Birth plan creation"
      ],
      content: "The final stretch! Your baby is growing rapidly, and you might experience new symptoms like heartburn and backache. This is the time to prepare for labor and delivery."
    }
  ],
  keyMilestones: [
    {
      week: "Week 8",
      milestone: "First heartbeat detectable"
    },
    {
      week: "Week 12",
      milestone: "Complete organ formation"
    },
    {
      week: "Week 20",
      milestone: "Detailed anatomy scan"
    },
    {
      week: "Week 24",
      milestone: "Viable pregnancy point"
    },
    {
      week: "Week 28",
      milestone: "Baby's eyes can open"
    },
    {
      week: "Week 37",
      milestone: "Full-term pregnancy"
    }
  ]
};

const PrenatalInfo = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);

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
        {prenatalInfo.title}
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
        {prenatalInfo.description}
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
          image={prenatalInfo.mainImage}
          alt="Pregnancy Journey"
          sx={{ objectFit: 'cover' }}
        />
      </Card>

      <Grid container spacing={4}>
        {prenatalInfo.trimesters.map((trimester, index) => (
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
                image={trimester.image}
                alt={trimester.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 2,
                    color: COLORS.primary,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600
                  }}
                >
                  {trimester.title}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    mb: 2,
                    color: COLORS.text.secondary,
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  {trimester.content}
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {trimester.highlights.map((highlight, idx) => (
                    <Typography 
                      key={idx}
                      component="li"
                      variant="body2"
                      sx={{ 
                        mb: 1,
                        color: COLORS.text.secondary,
                        fontFamily: "'Poppins', sans-serif"
                      }}
                    >
                      {highlight}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography 
        variant="h4" 
        sx={{ 
          mt: 6,
          mb: 3,
          color: COLORS.primary,
          fontFamily: "'Playfair Display', serif"
        }}
      >
        Key Milestones
      </Typography>

      <Grid container spacing={2}>
        {prenatalInfo.keyMilestones.map((milestone, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: 'none',
                border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
                '&:hover': {
                  borderColor: COLORS.primary,
                  bgcolor: alpha(COLORS.primary, 0.05)
                },
                transition: 'all 0.2s ease'
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6"
                  sx={{ 
                    color: COLORS.primary,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600
                  }}
                >
                  {milestone.week}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: COLORS.text.secondary,
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  {milestone.milestone}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PrenatalInfo; 