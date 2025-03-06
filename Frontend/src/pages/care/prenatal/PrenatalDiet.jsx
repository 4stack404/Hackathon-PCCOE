import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Button, Grid, CardMedia, Chip,
  List, ListItem, ListItemIcon, ListItemText,
  useTheme, alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { COLORS } from '../../../theme/colors';

const dietaryInfo = [
  {
    category: "Essential Nutrients",
    items: [
      {
        title: "Folic Acid & Folate",
        description: "Critical for preventing birth defects and supporting baby's brain development.",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
        sources: ["Leafy greens", "Fortified cereals", "Legumes", "Citrus fruits"],
        dailyNeeds: "600-800 mcg daily"
      },
      {
        title: "Iron",
        description: "Supports increased blood volume and prevents anemia.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554",
        sources: ["Lean meats", "Spinach", "Beans", "Fortified cereals"],
        dailyNeeds: "27 mg daily"
      },
      {
        title: "Calcium",
        description: "Essential for baby's bone development and maintaining mother's bone health.",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
        sources: ["Dairy products", "Fortified plant milk", "Tofu", "Leafy greens"],
        dailyNeeds: "1000 mg daily"
      },
      {
        title: "Protein",
        description: "Crucial for baby's growth and development.",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435",
        sources: ["Lean meats", "Fish", "Eggs", "Legumes"],
        dailyNeeds: "75-100 g daily"
      }
    ]
  }
];

const foodsToAvoid = [
  {
    category: "Raw or Undercooked",
    items: ["Raw fish/sushi", "Undercooked meat", "Raw eggs", "Unpasteurized dairy"],
    reason: "Risk of harmful bacteria and parasites"
  },
  {
    category: "High Mercury Fish",
    items: ["Shark", "Swordfish", "King mackerel", "Tilefish"],
    reason: "Can harm baby's developing nervous system"
  },
  {
    category: "Unsafe Drinks",
    items: ["Alcohol", "Excessive caffeine", "Unpasteurized juices"],
    reason: "Can affect baby's development"
  }
];

const PrenatalDiet = () => {
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
        Prenatal Nutrition Guide
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
        Essential nutrients and dietary guidelines for a healthy pregnancy
      </Typography>

      {dietaryInfo.map((section, index) => (
        <Box key={index} sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3,
              color: COLORS.primary,
              fontFamily: "'Playfair Display', serif"
            }}
          >
            {section.category}
          </Typography>

          <Grid container spacing={3}>
            {section.items.map((item, idx) => (
              <Grid item xs={12} md={6} key={idx}>
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
                    height="200"
                    image={item.image}
                    alt={item.title}
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
                      {item.title}
                    </Typography>

                    <Chip 
                      label={item.dailyNeeds}
                      icon={<RestaurantIcon />}
                      sx={{ 
                        mb: 2,
                        bgcolor: alpha(COLORS.primary, 0.1),
                        color: COLORS.primary
                      }}
                    />

                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 2,
                        color: COLORS.text.secondary,
                        fontFamily: "'Poppins', sans-serif"
                      }}
                    >
                      {item.description}
                    </Typography>

                    <Typography 
                      variant="subtitle1"
                      sx={{ 
                        mb: 1,
                        color: COLORS.primary,
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600
                      }}
                    >
                      Food Sources:
                    </Typography>

                    <List dense>
                      {item.sources.map((source, sourceIdx) => (
                        <ListItem key={sourceIdx}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={source}
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
      ))}

      <Box sx={{ mt: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3,
            color: COLORS.primary,
            fontFamily: "'Playfair Display', serif"
          }}
        >
          Foods to Avoid
        </Typography>

        <Grid container spacing={3}>
          {foodsToAvoid.map((category, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  bgcolor: alpha(COLORS.primary, 0.05),
                  boxShadow: 'none',
                  border: `1px solid ${alpha(COLORS.primary, 0.1)}`
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      color: COLORS.primary,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <ErrorIcon /> {category.category}
                  </Typography>

                  <List dense>
                    {category.items.map((item, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <ErrorIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item}
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
                    variant="body2" 
                    sx={{ 
                      mt: 2,
                      color: COLORS.text.secondary,
                      fontFamily: "'Poppins', sans-serif",
                      fontStyle: 'italic'
                    }}
                  >
                    {category.reason}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PrenatalDiet; 