import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemText,
  Button,
  Chip,
  Divider 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

const RecipeDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  
  // Get the recipe ID from either 'id' or 'recipeId' parameter
  const recipeId = params.id || params.recipeId;

  useEffect(() => {
    // Fetch recipe details
    fetch('/recipes.json')
      .then(response => response.json())
      .then(data => {
        const foundRecipe = Array.isArray(data) 
          ? data.find(r => r.id === parseInt(recipeId))
          : data.recipes.find(r => r.id === parseInt(recipeId));
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          console.error(`Recipe with ID ${recipeId} not found`);
        }
      })
      .catch(error => console.error('Error loading recipe:', error));
  }, [recipeId]);

  const handleBack = () => {
    // Check the previous page to determine where to navigate back to
    const referrer = document.referrer;
    if (referrer.includes('prenatal') || referrer.includes('postnatal')) {
      navigate(-1); // Go back to the previous page
    } else {
      navigate('/healthy-recipes'); // Default to healthy recipes
    }
  };

  if (!recipe) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Recipes
      </Button>

      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={recipe.image}
            alt={recipe.title}
            sx={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
            }}
          />
        </Box>

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            {recipe.title}
          </Typography>

          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={<AccessTimeIcon />} 
              label={`Prep: ${recipe.prepTime}`}
            />
            <Chip 
              icon={<AccessTimeIcon />} 
              label={`Cook: ${recipe.cookTime}`}
            />
            <Chip 
              icon={<RestaurantIcon />} 
              label={`Servings: ${recipe.servings}`}
            />
            <Chip 
              icon={<LocalDiningIcon />} 
              label={`${recipe.calories} calories`}
            />
          </Box>

          <Typography variant="body1" sx={{ mb: 4 }}>
            {recipe.description}
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <List>
                {recipe.instructions.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`Step ${index + 1}`} 
                      secondary={step}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Nutrition Facts
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(recipe.nutritionInfo).map(([key, value]) => (
                <Grid item xs={6} sm={3} key={key}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">{value}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RecipeDetail; 