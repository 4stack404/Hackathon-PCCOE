import React, { useState, useMemo } from 'react';
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
  DialogActions
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
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { COLORS } from '../theme/colors';

// Recipe database
const recipes = [
  {
    id: 1,
    title: "Quinoa Buddha Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    calories: 450,
    prepTime: "25 mins",
    servings: 2,
    category: ["lunch", "dinner", "vegetarian"],
    ingredients: [
      "1 cup quinoa",
      "1 sweet potato, cubed",
      "1 cup chickpeas",
      "2 cups kale",
      "1 avocado",
      "2 tbsp olive oil",
      "Lemon juice",
      "Salt and pepper"
    ],
    instructions: [
      "Cook quinoa according to package instructions",
      "Roast sweet potato and chickpeas with olive oil",
      "Massage kale with lemon juice and olive oil",
      "Assemble bowl with quinoa base",
      "Top with roasted vegetables and sliced avocado"
    ],
    nutritionInfo: {
      protein: "15g",
      carbs: "58g",
      fat: "22g",
      fiber: "12g"
    }
  },
  {
    id: 2,
    title: "Greek Yogurt Parfait",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1887&auto=format&fit=crop",
    calories: 320,
    prepTime: "10 mins",
    servings: 1,
    category: ["breakfast", "snack", "vegetarian"],
    ingredients: [
      "1 cup Greek yogurt",
      "1/2 cup mixed berries",
      "1/4 cup granola",
      "1 tbsp honey",
      "Mint leaves for garnish"
    ],
    instructions: [
      "Layer Greek yogurt in a glass",
      "Add mixed berries",
      "Top with granola",
      "Drizzle with honey",
      "Garnish with mint leaves"
    ],
    nutritionInfo: {
      protein: "20g",
      carbs: "42g",
      fat: "8g",
      fiber: "6g"
    }
  },
  {
    id: 3,
    title: "Grilled Chicken Salad",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
    calories: 380,
    prepTime: "20 mins",
    servings: 2,
    category: ["lunch", "dinner", "high-protein"],
    ingredients: [
      "2 chicken breasts",
      "Mixed greens",
      "Cherry tomatoes",
      "Cucumber",
      "Balsamic vinaigrette"
    ],
    instructions: [
      "Grill chicken breasts",
      "Chop vegetables",
      "Assemble salad",
      "Add dressing"
    ],
    nutritionInfo: {
      protein: "35g",
      carbs: "12g",
      fat: "18g",
      fiber: "5g"
    }
  },
  {
    id: 4,
    title: "Salmon with Roasted Vegetables",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1887&auto=format&fit=crop",
    calories: 420,
    prepTime: "30 mins",
    servings: 2,
    category: ["dinner", "high-protein", "low-carb"],
    ingredients: [
      "2 salmon fillets",
      "2 cups broccoli",
      "1 red bell pepper",
      "1 zucchini",
      "2 tbsp olive oil",
      "Lemon",
      "Herbs and spices"
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Season salmon with herbs",
      "Chop vegetables and toss with oil",
      "Roast vegetables for 15 minutes",
      "Add salmon and cook for 12-15 minutes"
    ],
    nutritionInfo: {
      protein: "38g",
      carbs: "15g",
      fat: "25g",
      fiber: "5g"
    }
  },
  {
    id: 5,
    title: "Overnight Oats",
    image: "https://www.livveganstrong.com/wp-content/uploads/2022/10/overnight-oats-with-almond-milk-4.jpg",
    calories: 350,
    prepTime: "5 mins + overnight",
    servings: 1,
    category: ["breakfast", "vegetarian"],
    ingredients: [
      "1/2 cup rolled oats",
      "1/2 cup almond milk",
      "1/4 cup Greek yogurt",
      "1 tbsp chia seeds",
      "1 banana",
      "1 tbsp honey",
      "Cinnamon"
    ],
    instructions: [
      "Mix oats, milk, yogurt, and chia seeds",
      "Add honey and cinnamon",
      "Refrigerate overnight",
      "Top with sliced banana before serving"
    ],
    nutritionInfo: {
      protein: "15g",
      carbs: "56g",
      fat: "9g",
      fiber: "8g"
    }
  },
  {
    id: 6,
    title: "Mediterranean Chickpea Salad",
    image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?q=80&w=1770&auto=format&fit=crop",
    calories: 310,
    prepTime: "15 mins",
    servings: 4,
    category: ["lunch", "vegetarian", "vegan"],
    ingredients: [
      "2 cans chickpeas",
      "1 cucumber",
      "Cherry tomatoes",
      "Red onion",
      "Feta cheese",
      "Olive oil",
      "Lemon juice",
      "Fresh herbs"
    ],
    instructions: [
      "Drain and rinse chickpeas",
      "Chop vegetables",
      "Mix with olive oil and lemon juice",
      "Add crumbled feta and herbs"
    ],
    nutritionInfo: {
      protein: "12g",
      carbs: "35g",
      fat: "15g",
      fiber: "10g"
    }
  },
  {
    id: 7,
    title: "Turkey and Avocado Wrap",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=1770&auto=format&fit=crop",
    calories: 340,
    prepTime: "10 mins",
    servings: 1,
    category: ["lunch", "high-protein"],
    ingredients: [
      "Whole wheat wrap",
      "4 slices turkey breast",
      "1/2 avocado",
      "Lettuce",
      "Tomato",
      "Greek yogurt spread"
    ],
    instructions: [
      "Spread Greek yogurt on wrap",
      "Layer turkey, avocado, and vegetables",
      "Roll tightly",
      "Cut diagonally"
    ],
    nutritionInfo: {
      protein: "25g",
      carbs: "28g",
      fat: "16g",
      fiber: "8g"
    }
  },
  {
    id: 8,
    title: "Protein Smoothie Bowl",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=1898&auto=format&fit=crop",
    calories: 380,
    prepTime: "10 mins",
    servings: 1,
    category: ["breakfast", "snack", "high-protein"],
    ingredients: [
      "1 scoop protein powder",
      "1 frozen banana",
      "1 cup mixed berries",
      "1 cup almond milk",
      "Granola",
      "Chia seeds",
      "Coconut flakes"
    ],
    instructions: [
      "Blend protein powder, banana, berries, and milk",
      "Pour into bowl",
      "Top with granola, chia seeds, and coconut",
      "Add fresh fruit for garnish"
    ],
    nutritionInfo: {
      protein: "24g",
      carbs: "45g",
      fat: "12g",
      fiber: "8g"
    }
  },
  {
    id: 9,
    title: "Baked Sweet Potato with Black Beans",
    image: "https://s.lightorangebean.com/media/20240914152619/Roasted-Sweet-Potato-and-Black-Bean-Salad_-done.png",
    calories: 360,
    prepTime: "45 mins",
    servings: 2,
    category: ["dinner", "vegetarian", "vegan"],
    ingredients: [
      "2 sweet potatoes",
      "1 can black beans",
      "1/2 cup corn",
      "Avocado",
      "Lime juice",
      "Cilantro",
      "Spices"
    ],
    instructions: [
      "Bake sweet potatoes until tender",
      "Heat black beans with spices",
      "Split potatoes and fill with beans",
      "Top with corn, avocado, and cilantro"
    ],
    nutritionInfo: {
      protein: "12g",
      carbs: "52g",
      fat: "10g",
      fiber: "14g"
    }
  },
  {
    id: 10,
    title: "Shrimp and Asparagus Stir-Fry",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1776&auto=format&fit=crop",
    calories: 290,
    prepTime: "20 mins",
    servings: 2,
    category: ["dinner", "high-protein", "low-carb"],
    ingredients: [
      "1 lb shrimp",
      "1 bunch asparagus",
      "2 cloves garlic",
      "Ginger",
      "Soy sauce",
      "Sesame oil",
      "Red pepper flakes"
    ],
    instructions: [
      "Clean and devein shrimp",
      "Cut asparagus into pieces",
      "Stir-fry garlic and ginger",
      "Add shrimp until pink",
      "Add asparagus and sauce"
    ],
    nutritionInfo: {
      protein: "32g",
      carbs: "12g",
      fat: "14g",
      fiber: "4g"
    }
  }
];

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

function HealthyRecipes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter recipes based on search query and category
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || recipe.category.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
              {filteredRecipes.map((recipe, index) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    custom={index}
                    layout
                  >
                    <Card 
                      onClick={() => setSelectedRecipe(recipe)}
                      sx={{ 
                        borderRadius: 3,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={recipe.image}
                          alt={recipe.title}
                          sx={{ 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            p: 2
                          }}
                        >
                          <Typography variant="h6" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                            {recipe.title}
                          </Typography>
                        </Box>
                      </Box>
                      <CardContent>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            color: COLORS.primary
                          }}>
                            <LocalFireDepartmentIcon />
                            <Typography>{recipe.calories} cal</Typography>
                          </Box>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            color: COLORS.primary
                          }}>
                            <AccessTimeIcon />
                            <Typography>{recipe.prepTime}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {recipe.category.map((cat) => (
                            <Chip
                              key={cat}
                              label={cat}
                              size="small"
                              sx={{
                                bgcolor: `${COLORS.primary}15`,
                                color: COLORS.primary,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  bgcolor: `${COLORS.primary}25`
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>

          {/* Animated Recipe Detail Dialog */}
          <AnimatePresence>
            {selectedRecipe && (
              <Dialog 
                open={!!selectedRecipe} 
                onClose={() => setSelectedRecipe(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  component: motion.div,
                  variants: dialogVariants,
                  initial: "initial",
                  animate: "animate",
                  exit: "exit"
                }}
              >
                <DialogTitle sx={{ 
                  pb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {selectedRecipe.title}
                  </Typography>
                  <IconButton onClick={() => setSelectedRecipe(null)}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={selectedRecipe.image}
                        alt={selectedRecipe.title}
                        sx={{ borderRadius: 2, objectFit: 'cover' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Ingredients
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <Typography component="li" key={index} sx={{ mb: 1 }}>
                            {ingredient}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Instructions
                      </Typography>
                      <Box component="ol" sx={{ pl: 2 }}>
                        {selectedRecipe.instructions.map((step, index) => (
                          <Typography component="li" key={index} sx={{ mb: 1 }}>
                            {step}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Card sx={{ bgcolor: `${COLORS.primary}10`, borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Nutrition Information
                          </Typography>
                          <Grid container spacing={2}>
                            {Object.entries(selectedRecipe.nutritionInfo).map(([key, value]) => (
                              <Grid item xs={6} sm={3} key={key}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" sx={{ color: COLORS.primary }}>
                                    {value}
                                  </Typography>
                                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {key}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                  <Button 
                    onClick={() => setSelectedRecipe(null)}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </motion.div>
  );
}

export default HealthyRecipes; 