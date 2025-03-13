import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CircularProgress, 
  Divider, 
  Chip,
  Container,
  Paper, 
  Button,
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import GrainIcon from '@mui/icons-material/Grain';
import OpacityIcon from '@mui/icons-material/Opacity';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import { dietPlanService } from '../services/dietPlanService';
import { authAPI } from '../services/api';
import { userAPI } from '../services/api';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  },
  hover: {
    scale: 1.03,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
    transition: { type: 'spring', stiffness: 400 }
  }
};

const NutritionCard = ({ title, value, color, icon }) => {
  return (
    <motion.div variants={itemVariants}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: `4px solid ${color}`,
          borderRadius: 2
        }}
      >
        <Box sx={{ mb: 1, color: color }}>{icon}</Box>
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: color }}>
          {value}
        </Typography>
      </Paper>
    </motion.div>
  );
};

const SnackCard = ({ snack }) => {
  return (
    <motion.div 
      variants={cardVariants}
      whileHover="hover"
    >
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'rgba(0, 0, 0, 0.02)'
      }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom component="div">
            {snack.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {snack.description}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Chip 
              size="small" 
              label={`${snack.calories} cal`} 
              color="primary" 
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MealSection = ({ title, items, icon, getRecipe, onRecipeClick }) => {
  return (
    <motion.div variants={itemVariants}>
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 1, color: 'primary.main' }}>{icon}</Box>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              {item.recipe_id ? (
                <RecipeCard 
                  recipe={getRecipe(item.recipe_id)} 
                  comment={item.comment}
                  onClick={onRecipeClick}
                />
              ) : (
                <SnackCard snack={item} />
              )}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </motion.div>
  );
};

const DietPlanning = () => {
  const [loading, setLoading] = useState(true);
  const [dietPlan, setDietPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isFetchingNew, setIsFetchingNew] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const navigate = useNavigate();
  const [nutritionNeeds, setNutritionNeeds] = useState({
    calories: 2200,
    protein: 75,
    carbs: 275,
    fats: 73
  });
  const [userInfo] = useState({
    weight: 60,
    height: 165,
    age: 30,
    activityLevel: 'light',
    trimester: 'first'
  });
  const theme = useTheme();
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('User not logged in, using default values');
          return;
        }
        
        // Try to get nutrition data directly
        try {
          const nutritionResponse = await userAPI.getNutritionData();
          if (nutritionResponse && nutritionResponse.data) {
            console.log('Nutrition data fetched:', nutritionResponse.data);
            const nutritionData = nutritionResponse.data;
            
            // Update nutrition needs from direct nutrition data
            setNutritionNeeds({
              calories: nutritionData.calories || nutritionNeeds.calories,
              protein: nutritionData.protein || nutritionNeeds.protein,
              carbs: nutritionData.carbohydrates || nutritionNeeds.carbs,
              fats: nutritionData.fats || nutritionNeeds.fats
            });
            
            setUserData({ hasNutritionData: true });
            return;
          }
        } catch (nutritionError) {
          console.error('Error fetching nutrition data:', nutritionError);
        }
        
        // Try to get user profile if nutrition endpoint fails
        try {
          const profileResponse = await userAPI.getProfile();
          if (profileResponse && profileResponse.data) {
            const user = profileResponse.data;
            console.log('User profile data fetched:', user);
            console.log('User nutrition fields:', {
              calories: user.calories,
              protein: user.protein,
              carbohydrates: user.carbohydrates,
              fats: user.fats
            });
            console.log('User healthInfo.nutrition:', user.healthInfo?.nutrition);
            
            setUserData(user);
            
            // Update nutrition needs from user data if available
            if (user.healthInfo && user.healthInfo.nutrition) {
              const nutrition = user.healthInfo.nutrition;
              console.log('Using healthInfo.nutrition data');
              setNutritionNeeds({
                calories: nutrition.calories || nutritionNeeds.calories,
                protein: nutrition.protein || nutritionNeeds.protein,
                carbs: nutrition.carbohydrates || nutritionNeeds.carbs,
                fats: nutrition.fats || nutritionNeeds.fats
              });
            } else if (user.calories && user.protein && user.carbohydrates && user.fats) {
              // Use top-level nutrition data if available
              console.log('Using top-level nutrition data');
              setNutritionNeeds({
                calories: user.calories || nutritionNeeds.calories,
                protein: user.protein || nutritionNeeds.protein,
                carbs: user.carbohydrates || nutritionNeeds.carbs,
                fats: user.fats || nutritionNeeds.fats
              });
            } else {
              console.log('No nutrition data found in user profile, using calculated values');
            }
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          
          // Fallback to getCurrentUser if getProfile fails
          try {
            const response = await authAPI.getCurrentUser();
            if (response && response.data) {
              const user = response.data;
              console.log('User data fetched from auth API:', user);
              setUserData(user);
              
              // Update nutrition needs from user data if available
              if (user.healthInfo && user.healthInfo.nutrition) {
                const nutrition = user.healthInfo.nutrition;
                setNutritionNeeds({
                  calories: nutrition.calories || nutritionNeeds.calories,
                  protein: nutrition.protein || nutritionNeeds.protein,
                  carbs: nutrition.carbohydrates || nutritionNeeds.carbs,
                  fats: nutrition.fats || nutritionNeeds.fats
                });
              } else if (user.calories && user.protein && user.carbohydrates && user.fats) {
                // Use top-level nutrition data if available
                setNutritionNeeds({
                  calories: user.calories || nutritionNeeds.calories,
                  protein: user.protein || nutritionNeeds.protein,
                  carbs: user.carbohydrates || nutritionNeeds.carbs,
                  fats: user.fats || nutritionNeeds.fats
                });
              }
            }
          } catch (authError) {
            console.error('Error fetching user data from auth API:', authError);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Fetch recipes
  useEffect(() => {
    fetch('/recipes.json')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecipes(data);
        } else if (data && Array.isArray(data.recipes)) {
          setRecipes(data.recipes);
        }
      })
      .catch(error => console.error('Error loading recipes:', error));
  }, []);
  
  // Function to get recipe by ID
  const getRecipe = (id) => {
    return recipes.find(recipe => recipe.id === parseInt(id));
  };

  // Handle recipe click
  const handleRecipeClick = (recipe) => {
    navigate(`/healthy-recipes/${recipe.id}`);
  };
  
  // Calculate calories based on user info and trimester
  const calculateCalories = () => {
    // Base calorie calculation using Harris-Benedict equation
    // BMR = 655.1 + (9.563 × weight in kg) + (1.850 × height in cm) - (4.676 × age in years)
    const weight = userInfo.weight || 60;
    const height = userInfo.height || 165;
    const age = userInfo.age || 30;
    
    // Calculate BMR (Basal Metabolic Rate)
    const bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
    
    // Activity level multiplier
    const activityLevels = {
      sedentary: 1.2, // Little or no exercise
      light: 1.375, // Light exercise 1-3 days/week
      moderate: 1.55, // Moderate exercise 3-5 days/week
      active: 1.725, // Hard exercise 6-7 days/week
      veryActive: 1.9 // Very hard exercise & physical job
    };
    
    const activityLevel = userInfo.activityLevel || 'light';
    const activityMultiplier = activityLevels[activityLevel];
    
    // Calculate maintenance calories
    let maintenanceCalories = bmr * activityMultiplier;
    
    // Adjust based on trimester
    let additionalCalories = 0;
    
    switch(userInfo.trimester) {
      case 'first':
        // No additional calories needed in first trimester
        additionalCalories = 0;
        break;
      case 'second':
        // Add 340 calories in second trimester
        additionalCalories = 340;
        break;
      case 'third':
        // Add 450 calories in third trimester
        additionalCalories = 450;
        break;
      case 'postnatal':
        // Add 330-400 calories for breastfeeding (using 350 as average)
        additionalCalories = 350;
        break;
      default:
        additionalCalories = 0;
    }
    
    // Calculate total calories
    const totalCalories = Math.round(maintenanceCalories + additionalCalories);
    
    // Update protein, carbs, and fats based on calculated calories
    const protein = Math.round((totalCalories * 0.15) / 4); // 15% of calories from protein, 4 calories per gram
    const fats = Math.round((totalCalories * 0.3) / 9); // 30% of calories from fat, 9 calories per gram
    const carbs = Math.round((totalCalories * 0.55) / 4); // 55% of calories from carbs, 4 calories per gram
    
    console.log('Calculated nutrition values:', {
      calories: totalCalories,
      protein,
      carbs,
      fats
    });
    
    // Only update nutrition needs if user data is not available
    if (!userData) {
      setNutritionNeeds({
        calories: totalCalories,
        protein,
        carbs,
        fats
      });
    }
    
    return totalCalories;
  };
  
  // Try to get saved diet plan from database
  const getSavedDietPlan = async () => {
    try {
      setLoading(true);
      const savedPlan = await dietPlanService.getSavedDietPlan();
      
      if (savedPlan && savedPlan.diet_plan) {
        setDietPlan(savedPlan.diet_plan);
        toast.success('Retrieved your saved diet plan');
        
        // Update nutrition needs based on the saved plan
        if (savedPlan.calorieGoal) {
          const protein = Math.round((savedPlan.calorieGoal * 0.15) / 4);
          const fats = Math.round((savedPlan.calorieGoal * 0.3) / 9);
          const carbs = Math.round((savedPlan.calorieGoal * 0.55) / 4);
          
          setNutritionNeeds({
            calories: savedPlan.calorieGoal,
            protein,
            carbs,
            fats
          });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error getting saved diet plan:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch diet plan from API and save to database
  const fetchAndSaveDietPlan = async () => {
    setLoading(true);
    setIsFetchingNew(true);
    
    try {
      // Calculate calories based on user info
      const calories = calculateCalories();
      
      // Call the API with calculated calories
      const data = await dietPlanService.generateDietPlan(calories);
      
      if (data && data.diet_plan) {
        setDietPlan(data.diet_plan);
        
        // Try to save the diet plan to the database
        const savedPlan = await dietPlanService.saveDietPlan(data.diet_plan, calories);
        
        if (savedPlan) {
          toast.success('New diet plan generated and saved!');
        } else {
          toast.success('New diet plan generated!');
          toast.info('Sign in to save your diet plan for future visits');
        }
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error("Error fetching diet plan:", error);
      toast.error('Failed to generate diet plan. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingNew(false);
    }
  };
  
  // Initial load - try to get saved plan first, then fetch new one if needed
  useEffect(() => {
    const loadDietPlan = async () => {
      const hasSavedPlan = await getSavedDietPlan();
      
      if (!hasSavedPlan) {
        // No saved plan found, generate a new one
        await fetchAndSaveDietPlan();
      }
    };
    
    loadDietPlan();
  }, []);
  
  // Handle refresh button click
  const handleRefreshDietPlan = () => {
    fetchAndSaveDietPlan();
  };
  
  if (loading && !dietPlan) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        flexDirection: 'column'
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          {isFetchingNew ? 'Generating a new diet plan...' : 'Loading your diet plan...'}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Introduction Section */}
      <Box sx={{ mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              mb: 3
            }}
          >
            Your Personalized Pregnancy Diet Plan
          </Typography>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 2,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom color="primary.dark" sx={{ mb: 0 }}>
                Why This Diet Plan Is Important For You
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefreshDietPlan}
                disabled={isFetchingNew}
                size="small"
              >
                Refresh Plan
              </Button>
            </Box>
            
            <Typography variant="body1" paragraph>
              During pregnancy, your nutritional needs increase significantly to support both you and your growing baby. 
              This personalized diet plan is designed to ensure you receive all essential nutrients while maintaining 
              a healthy weight gain throughout your pregnancy.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    Your Daily Nutritional Requirements
                    {isLoadingUser && (
                      <CircularProgress size={16} sx={{ ml: 1 }} />
                    )}
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocalFireDepartmentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Calories: ${nutritionNeeds.calories} calories/day`}
                        secondary={userData ? "Based on your profile data" : "Increased caloric needs to support pregnancy"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <RestaurantIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Protein: ${nutritionNeeds.protein}g/day`}
                        secondary={userData ? "Based on your profile data" : "Essential for baby's growth and development"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <GrainIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Carbohydrates: ${nutritionNeeds.carbs}g/day`}
                        secondary={userData ? "Based on your profile data" : "Primary energy source for you and your baby"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <OpacityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Healthy Fats: ${nutritionNeeds.fats}g/day`}
                        secondary={userData ? "Based on your profile data" : "Important for brain development and absorption of vitamins"}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    Key Benefits of This Diet Plan
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Balanced Nutrition"
                        secondary="Carefully planned meals to meet increased nutritional demands"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Healthy Weight Gain"
                        secondary="Supports appropriate pregnancy weight gain"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Essential Nutrients"
                        secondary="Rich in folate, iron, calcium, and other vital nutrients"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Energy Balance"
                        secondary="Maintains steady energy levels throughout the day"
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                💡 Pro Tip: Try to eat small, frequent meals throughout the day to maintain energy levels 
                and manage morning sickness. Stay hydrated by drinking plenty of water!
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Your Personalized Diet Plan
          </Typography>
          
          <Typography variant="body1" paragraph align="center" sx={{ mb: 5 }}>
            Based on your profile, we've created a customized diet plan to support your pregnancy journey.
            Here are your daily nutritional requirements and meal suggestions.
            {userData && (
              <Box component="span" sx={{ display: 'block', mt: 1, fontWeight: 'medium', color: 'primary.main' }}>
                Your nutritional requirements are personalized based on your profile data.
              </Box>
            )}
          </Typography>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Daily Nutritional Requirements
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <NutritionCard 
                title="Calories" 
                value={`${nutritionNeeds.calories} kcal`} 
                color="#FF5722"
                icon={<LocalDiningIcon fontSize="large" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <NutritionCard 
                title="Protein" 
                value={`${nutritionNeeds.protein}g`} 
                color="#2196F3"
                icon={<RestaurantIcon fontSize="large" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <NutritionCard 
                title="Carbohydrates" 
                value={`${nutritionNeeds.carbs}g`} 
                color="#4CAF50"
                icon={<GrainIcon fontSize="large" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <NutritionCard 
                title="Fats" 
                value={`${nutritionNeeds.fats}g`} 
                color="#FFC107"
                icon={<OpacityIcon fontSize="large" />}
              />
            </Grid>
          </Grid>
        </motion.div>
        
        {dietPlan && (
          <>
            {dietPlan.breakfast && dietPlan.breakfast.length > 0 && (
              <MealSection 
                title="Breakfast Options" 
                items={dietPlan.breakfast}
                icon={<FreeBreakfastIcon fontSize="medium" />}
                getRecipe={getRecipe}
                onRecipeClick={handleRecipeClick}
              />
            )}
            
            {dietPlan.lunch && dietPlan.lunch.length > 0 && (
              <MealSection 
                title="Lunch Options" 
                items={dietPlan.lunch}
                icon={<LunchDiningIcon fontSize="medium" />}
                getRecipe={getRecipe}
                onRecipeClick={handleRecipeClick}
              />
            )}
            
            {dietPlan.dinner && dietPlan.dinner.length > 0 && (
              <MealSection 
                title="Dinner Options" 
                items={dietPlan.dinner}
                icon={<DinnerDiningIcon fontSize="medium" />}
                getRecipe={getRecipe}
                onRecipeClick={handleRecipeClick}
              />
            )}
            
            {dietPlan.snacks && dietPlan.snacks.length > 0 && (
              <MealSection 
                title="Healthy Snacks" 
                items={dietPlan.snacks}
                icon={<RestaurantIcon fontSize="medium" />}
                getRecipe={getRecipe}
                onRecipeClick={handleRecipeClick}
              />
            )}
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default DietPlanning; 