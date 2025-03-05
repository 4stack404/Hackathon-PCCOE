import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Favorite as FavoriteIcon,
  ArrowBack as ArrowBackIcon,
  Timer as TimerIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function HealthyRecipes() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularRecipes = [
    {
      title: "Pregnancy Power Smoothie",
      image: "/assets/blueberry-smoothie.webp",
      description: "Packed with folate, protein, and calcium - perfect for morning sickness!",
      prepTime: "5 mins",
      category: "Breakfast",
      nutrients: ["Folate", "Protein", "Calcium"],
      ingredients: [
        "1 banana",
        "1 cup spinach",
        "1 cup milk or plant-based alternative",
        "1 tbsp nut butter",
        "1 tbsp chia seeds",
        "½ cup frozen berries"
      ]
    },
    {
      title: "Iron-Rich Lentil Soup",
      image: "/assets/lentil-soup.jpg",
      description: "A hearty soup to boost your iron levels during pregnancy.",
      prepTime: "30 mins",
      category: "Lunch",
      nutrients: ["Iron", "Protein", "Fiber"],
      ingredients: [
        "1 cup red lentils",
        "1 onion, diced",
        "2 carrots, diced",
        "2 celery stalks, diced",
        "4 cups vegetable broth",
        "2 tbsp olive oil",
        "2 cloves garlic, minced",
        "1 tsp cumin"
      ]
    },
    {
      title: "Calcium-Boosting Chia Pudding",
      image: "/assets/chia-pudding.jpg",
      description: "Make ahead for a nutritious breakfast or snack.",
      prepTime: "10 mins + 4 hrs setting",
      category: "Breakfast",
      nutrients: ["Calcium", "Omega-3", "Fiber"],
      ingredients: [
        "¼ cup chia seeds",
        "1 cup milk or plant-based alternative",
        "1 tbsp honey or maple syrup",
        "½ tsp vanilla extract",
        "Fresh fruits for topping"
      ]
    }
  ];

  return (
    <Box sx={{ py: 6, bgcolor: '#FFF5F8', minHeight: '100vh' }}>
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
          Pregnancy-Friendly Recipes
        </Typography>

        <Box sx={{ mb: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 600,
              mx: 'auto',
              display: 'block',
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'white'
              }
            }}
          />
        </Box>

        <Grid container spacing={4}>
          {popularRecipes.map((recipe, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={recipe.image}
                  alt={recipe.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600, color: '#2D3748' }}>
                      {recipe.title}
                    </Typography>
                    <IconButton size="small">
                      <FavoriteIcon sx={{ color: '#FF5A8C' }} />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<TimerIcon />} 
                      label={recipe.prepTime} 
                      size="small" 
                      sx={{ bgcolor: '#FFF0F3' }}
                    />
                    <Chip 
                      icon={<RestaurantIcon />} 
                      label={recipe.category} 
                      size="small"
                      sx={{ bgcolor: '#FFF0F3' }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {recipe.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Key Nutrients:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {recipe.nutrients.map((nutrient, idx) => (
                        <Chip 
                          key={idx}
                          label={nutrient}
                          size="small"
                          sx={{ 
                            bgcolor: '#FF5A8C',
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Ingredients:
                  </Typography>
                  <List dense>
                    {recipe.ingredients.map((ingredient, idx) => (
                      <ListItem key={idx} sx={{ py: 0.3 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleOutlineIcon fontSize="small" sx={{ color: '#FF5A8C' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={ingredient} 
                          primaryTypographyProps={{ 
                            variant: 'body2'
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
      </Container>
    </Box>
  );
}

export default HealthyRecipes; 