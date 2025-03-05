import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Button,
  Divider
} from '@mui/material';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  RestaurantMenu as RestaurantIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function DietPlanning() {
  const dietTips = [
    "Increase your caloric intake by about 300-500 calories per day during pregnancy",
    "Focus on nutrient-dense foods rather than empty calories",
    "Aim for 70-100 grams of protein daily to support your baby's growth",
    "Include foods rich in folate, iron, calcium, and omega-3 fatty acids",
    "Stay hydrated by drinking at least 8-10 glasses of water daily",
    "Limit caffeine to less than 200mg per day (about one 12oz cup of coffee)"
  ];

  const mealPlanSample = [
    {
      meal: "Breakfast",
      options: [
        "Greek yogurt with berries and granola",
        "Whole grain toast with avocado and a boiled egg",
        "Spinach and cheese omelet with whole grain toast"
      ]
    },
    {
      meal: "Lunch",
      options: [
        "Quinoa salad with chickpeas, vegetables, and feta cheese",
        "Whole grain wrap with hummus, vegetables, and grilled chicken",
        "Lentil soup with a side salad and whole grain bread"
      ]
    },
    {
      meal: "Dinner",
      options: [
        "Grilled salmon with sweet potato and steamed broccoli",
        "Whole grain pasta with tomato sauce, vegetables, and lean ground turkey",
        "Stir-fried tofu with brown rice and mixed vegetables"
      ]
    },
    {
      meal: "Snacks",
      options: [
        "Apple slices with almond butter",
        "Carrot sticks with hummus",
        "A handful of nuts and dried fruits",
        "Whole grain crackers with cheese"
      ]
    }
  ];

  return (
    <Box sx={{ 
      bgcolor: '#FFF5F8',
      minHeight: '100vh',
      pb: 6,
      pt: 2
    }}>
      <Container maxWidth="lg">
        <Button
          component={RouterLink}
          to="/diet"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4 }}
        >
          Back to Diet Hub
        </Button>

        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: '#2D3748'
          }}
        >
          Pregnancy Diet Planning
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h5" sx={{ mb: 3, color: '#FF5A8C', fontWeight: 600 }}>
                Key Nutrition Guidelines
              </Typography>
              <List>
                {dietTips.map((tip, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h5" sx={{ mb: 3, color: '#FF5A8C', fontWeight: 600 }}>
                Foods to Avoid
              </Typography>
              <List>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                  </ListItemIcon>
                  <ListItemText primary="Raw or undercooked meat, poultry, fish, and eggs" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                  </ListItemIcon>
                  <ListItemText primary="Unpasteurized dairy products and juices" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                  </ListItemIcon>
                  <ListItemText primary="High-mercury fish (shark, swordfish, king mackerel, tilefish)" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                  </ListItemIcon>
                  <ListItemText primary="Raw sprouts and unwashed produce" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                  </ListItemIcon>
                  <ListItemText primary="Excessive caffeine (limit to 200mg per day)" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4" sx={{ my: 4, color: '#2D3748', fontWeight: 600 }}>
              Sample Meal Plan
            </Typography>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Grid container spacing={3}>
                {mealPlanSample.map((mealTime, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: index % 2 === 0 ? '#FFF0F3' : 'white', 
                      height: '100%',
                      borderRadius: 2,
                      border: '1px solid #FFD6E0'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#FF5A8C', fontWeight: 600 }}>
                        {mealTime.meal}
                      </Typography>
                      <List dense>
                        {mealTime.options.map((option, optIndex) => (
                          <ListItem key={optIndex} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <RestaurantIcon fontSize="small" sx={{ color: '#FF5A8C' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={option} 
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                sx: { fontWeight: 500 }
                              }} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default DietPlanning; 