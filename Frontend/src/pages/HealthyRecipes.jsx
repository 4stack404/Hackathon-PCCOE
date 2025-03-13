import React, { useState, useMemo, useEffect } from 'react';
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
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Favorite as FavoriteIcon,
  ArrowBack as ArrowBackIcon,
  Timer as TimerIcon,
  Restaurant as RestaurantIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { COLORS } from '../theme/colors';
import RecipeCard from '../components/RecipeCard';

// Add animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const headerVariants = {
  initial: { y: -20, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const searchVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const chipVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  }
};

const cardVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  hover: { 
    y: -10,
    scale: 1.02,
    transition: { duration: 0.3 },
    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)"
  }
};

const dialogVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const RecipeDialog = ({ recipe, open, onClose }) => {
  if (!recipe) return null;

  // Provide default values for nutritionFacts
  const nutritionFacts = recipe.nutritionFacts || {
    calories: '0',
    protein: '0g',
    carbs: '0g',
    fat: '0g'
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {recipe.title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          <Box
            component="img"
            src={recipe.image}
            alt={recipe.title}
            sx={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: 1,
              mb: 2
            }}
          />

          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<AccessTimeIcon />} 
              label={`Prep: ${recipe.prepTime}`}
              size="small"
            />
            <Chip 
              icon={<AccessTimeIcon />} 
              label={`Cook: ${recipe.cookTime}`}
              size="small"
            />
            <Chip 
              icon={<RestaurantIcon />} 
              label={`Servings: ${recipe.servings}`}
              size="small"
            />
            <Chip 
              icon={<LocalDiningIcon />} 
              label={`${recipe.calories} calories`}
              size="small"
            />
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {recipe.description}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Ingredients
              </Typography>
              <List dense>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Instructions
              </Typography>
              <List dense>
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

          {recipe.nutritionFacts && Object.keys(nutritionFacts).length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Nutrition Facts
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(nutritionFacts).map(([key, value]) => (
                  <Grid item xs={6} sm={3} key={key}>
                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="body1">{value}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const HealthyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch recipes from the JSON file
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/recipes.json');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    // Update URL when component mounts
    navigate('/healthy-recipes', { replace: true });
  }, [navigate]);

  useEffect(() => {
    // Check URL for recipe ID on mount and when URL changes
    const pathParts = location.pathname.split('/');
    const recipeId = pathParts[pathParts.length - 1];
    if (recipeId && recipeId !== 'healthy-recipes') {
      const recipe = recipes.find(r => r.id === parseInt(recipeId));
      if (recipe) {
        setSelectedRecipe(recipe);
      }
    }
  }, [location.pathname, recipes]);

  // Filter recipes based on search query and category
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || recipe.category.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchTerm, selectedCategory]);

  // Categories for filtering
  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Snack', value: 'snack' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'High Protein', value: 'high-protein' }
  ];

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    navigate(`/healthy-recipes/${recipe.id}`);
  };

  const handleCloseDialog = () => {
    setSelectedRecipe(null);
    navigate('/healthy-recipes');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <Box sx={{ bgcolor: '#FFF5F8', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Button
            component={RouterLink}
            to="/diet"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4 }}
          >
            Back to Diet Hub
          </Button>

          {/* Animated Header */}
          <motion.div variants={headerVariants}>
            <Typography 
              variant="h3" 
              sx={{ 
                mb: 4,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FF92B4 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textAlign: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 100,
                  height: 4,
                  background: `linear-gradient(90deg, ${COLORS.primary}, #FF92B4)`,
                  borderRadius: 2
                }
              }}
            >
              Healthy Recipes
            </Typography>
          </motion.div>

          {/* Animated Search Section */}
          <motion.div variants={searchVariants}>
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Animated Category Chips */}
              <Box sx={{ 
                mt: 3, 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {categories.map((category, index) => (
                  <motion.div
                    key={category.value}
                    variants={chipVariants}
                    custom={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      label={category.label}
                      onClick={() => setSelectedCategory(category.value)}
                      sx={{
                        bgcolor: selectedCategory === category.value ? COLORS.primary : 'white',
                        color: selectedCategory === category.value ? 'white' : 'text.primary',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: selectedCategory === category.value ? COLORS.primary : '#f5f5f5',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* Animated Recipe Grid */}
          <AnimatePresence>
            <Grid container spacing={3}>
              {loading ? (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', gap: 2 }}>
                    <CircularProgress size={60} thickness={4} sx={{ color: COLORS.primary }} />
                    <Typography variant="h6" color="text.secondary">Loading delicious recipes...</Typography>
                  </Box>
                </Grid>
              ) : (
                filteredRecipes.map((recipe, index) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      custom={index}
                      layout
                    >
                      <RecipeCard 
                        recipe={recipe} 
                        onClick={handleRecipeClick}
                      />
                    </motion.div>
                  </Grid>
                ))
              )}
            </Grid>
          </AnimatePresence>

          {/* Animated Recipe Detail Dialog */}
          <RecipeDialog
            recipe={selectedRecipe}
            open={!!selectedRecipe}
            onClose={handleCloseDialog}
          />
        </Container>
      </Box>
    </motion.div>
  );
}

export default HealthyRecipes; 