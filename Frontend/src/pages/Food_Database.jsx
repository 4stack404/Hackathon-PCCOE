import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { motion } from 'framer-motion';

const Food_Database = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch recipes from recipes.json
  useEffect(() => {
    fetch('/recipes.json')
      .then(response => response.json())
      .then(data => {
        setRecipes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading recipes:', error);
        setLoading(false);
      });
  }, []);

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Pregnancy Food Database
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Recipe Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {filteredRecipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <motion.div variants={itemVariants}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={recipe.image}
                      alt={recipe.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {recipe.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {recipe.description}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={recipe.prepTime}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<RestaurantIcon />}
                          label={`${recipe.servings} servings`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<LocalDiningIcon />}
                          label={`${recipe.calories} cal`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Nutrition Information */}
                      <Typography variant="subtitle2" gutterBottom>
                        Nutrition per serving:
                      </Typography>
                      <Grid container spacing={1}>
                        {recipe.nutritionInfo && Object.entries(recipe.nutritionInfo)
                          .filter(([key]) => ['protein', 'carbs', 'fat'].includes(key))
                          .map(([key, value]) => (
                            <Grid item xs={4} key={key}>
                              <Box sx={{ 
                                textAlign: 'center',
                                bgcolor: 'background.default',
                                p: 1,
                                borderRadius: 1
                              }}>
                                <Typography variant="body2" fontWeight="bold">
                                  {value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* No Results Message */}
        {filteredRecipes.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No recipes found matching your search.
            </Typography>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default Food_Database; 