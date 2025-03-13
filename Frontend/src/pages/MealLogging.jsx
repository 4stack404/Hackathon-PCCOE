import { useState, useMemo, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  Alert,
  Fade,
  Zoom,
  Avatar,
  Autocomplete,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Today as TodayIcon,
  NavigateBefore,
  NavigateNext,
  Restaurant,
  LocalDining,
  FreeBreakfast,
  Fastfood,
  DinnerDining,
  ArrowForward,
  Info as InfoIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  RestaurantMenu as RestaurantMenuIcon,
  TrendingUp as TrendingUpIcon,
  LocalFireDepartment as LocalFireDepartmentIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, Filler } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { commonStyles } from '../styles/common';
import { mealService } from '../services/mealService';
import { toast } from 'react-toastify';

// Register the required Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend, Filler);

// Color constants
const COLORS = {
  primary: '#FF4081',
  secondary: '#FFB3C7',
  background: '#F8FAFC',
  carbs: '#4ECDC4',
  protein: '#FF6B6B',
  fat: '#FFD93D'
};

// Update the typography styles
const typography = {
  mainHeading: {
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 700,
    color: '#2D3748',
    letterSpacing: '0.02em'  // Slightly increased letter spacing for Raleway
  },
  subHeading: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    color: '#2D3748',
    letterSpacing: '-0.01em'
  },
  body: {
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.01em'
  }
};

// Add these animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { 
    scale: 1.02,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transition: { duration: 0.3 }
  }
};

const listItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2 }
  }
};

// Add this near the top of your file with other constants
const nutrients = [
  {
    name: 'Protein',
    key: 'protein',
    target: 75,
    color: COLORS.protein || '#FF6B6B',
  },
  {
    name: 'Carbs',
    key: 'carbs',
    target: 275,
    color: COLORS.carbs || '#4ECDC4',
  },
  {
    name: 'Fat',
    key: 'fat',
    target: 55,
    color: COLORS.fat || '#FFD93D',
  },
  {
    name: 'Fiber',
    key: 'fiber',
    target: 28,
    color: '#4CAF50',
  }
];

// Add this animation variant
const counterVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { 
    scale: 1.02,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transition: { duration: 0.3 }
  }
};

function MealLogging() {
  const navigate = useNavigate();
  
  // Add dailyTargets definition
  const dailyTargets = {
    calories: 2000, // Default daily calorie target
    protein: 150,   // Target in grams
    carbs: 250,     // Target in grams
    fat: 65,        // Target in grams
    fiber: 25       // Target in grams
  };

  // Add this if you want to make it customizable
  const [userDailyTargets, setUserDailyTargets] = useState(dailyTargets);

  // Your existing state definitions
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loggedMeals, setLoggedMeals] = useState({
    [selectedDate.format('YYYY-MM-DD')]: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    }
  });

  // State for daily totals
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });

  // Add this state to track form validation
  const [formErrors, setFormErrors] = useState({
    mealType: false,
    food: false
  });

  // Add this function to load meals from the database
  const fetchMeals = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.format('YYYY-MM-DD');
      const response = await mealService.getMeals(formattedDate);
      
      if (response.success) {
        // Transform the meals into the format expected by the component
        const mealsData = response.data;
        console.log('Meals data from API:', mealsData);
        
        const formattedMeals = {
          [formattedDate]: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
          }
        };
        
        // Group meals by type
        mealsData.forEach(meal => {
          // Ensure consistent meal type handling
          let mealType = meal.type;
          
          // For backward compatibility, convert 'snack' to 'snacks' if needed
          if (mealType === 'snack') {
            mealType = 'snacks';
          }
          
          if (formattedMeals[formattedDate][mealType]) {
            // Ensure we have both id and _id for compatibility
            const mealWithConsistentIds = {
              id: meal._id,
              _id: meal._id, // Store both formats for compatibility
              name: meal.name,
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              fiber: meal.fiber || 0,
              type: mealType, // Use the consistent meal type
              date: formattedDate,
              notes: meal.notes || ''
            };
            
            console.log('Adding meal to state:', mealWithConsistentIds);
            formattedMeals[formattedDate][mealType].push(mealWithConsistentIds);
          } else {
            console.warn(`Unknown meal type: ${meal.type}`);
          }
        });
        
        setLoggedMeals(formattedMeals);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast.error('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  // Add this useEffect to load meals when the component mounts or the date changes
  useEffect(() => {
    fetchMeals(selectedDate);
  }, [selectedDate]);

  // Fetch recipes data when component mounts
  useEffect(() => {
    fetch('/recipes.json')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecipes(data);
          console.log("Recipes loaded:", data.length);
        } else if (data && Array.isArray(data.recipes)) {
          setRecipes(data.recipes);
          console.log("Recipes loaded from data.recipes:", data.recipes.length);
        } else {
          console.error("Unexpected recipes data format:", data);
        }
      })
      .catch(error => console.error('Error loading recipes:', error));
  }, []);

  // Update the useEffect that calculates daily totals
  useEffect(() => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    const meals = loggedMeals[dateKey] || {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };

    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };

    // Calculate totals from all meal types
    Object.values(meals).forEach(mealTypeArray => {
      mealTypeArray.forEach(meal => {
        totals.calories += Number(meal.calories) || 0;
        totals.protein += Number(meal.protein) || 0;
        totals.carbs += Number(meal.carbs) || 0;
        totals.fat += Number(meal.fat) || 0;
        totals.fiber += Number(meal.fiber) || 0;
      });
    });

    setDailyTotals(totals);
  }, [loggedMeals, selectedDate]);

  // Calculate remaining calories
  const remainingCalories = Math.max(0, userDailyTargets.calories - dailyTotals.calories);

  // Calculate percentage of daily goal
  const caloriePercentage = Math.min(
    Math.round((dailyTotals.calories / userDailyTargets.calories) * 100),
    100
  );

  // Add macroChartData calculation
  const macroChartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [
        dailyTotals.protein * 4, // Protein: 4 calories per gram
        dailyTotals.carbs * 4,   // Carbs: 4 calories per gram
        dailyTotals.fat * 9      // Fat: 9 calories per gram
      ],
      backgroundColor: [
        COLORS.protein || '#FF6B6B',
        COLORS.carbs || '#4ECDC4',
        COLORS.fat || '#FFD93D'
      ],
      borderWidth: 0
    }]
  };

  // Add chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}% (${Math.round(value)} kcal)`;
          }
        }
      }
    }
  };

  // Add a progress calculation helper
  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleAddMeal = () => {
    setOpenDialog(true);
    setEditingMeal(null);
    setSelectedFood(null);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setSelectedFood({
      id: meal.id,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat
    });
    setSelectedMealType(meal.type);
    setOpenDialog(true);
  };

  const handleDeleteMeal = async (mealId, mealType) => {
    if (!mealId) {
      toast.error('Invalid meal ID');
      return;
    }

    // Log the complete meal object for debugging
    console.log('Meal being deleted:', {
      id: mealId,
      type: mealType,
      idType: typeof mealId
    });

    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        setLoading(true);
        console.log('Attempting to delete meal with ID:', mealId, 'and type:', mealType);
        
        // Check if this is a MongoDB ObjectId (24 hex characters)
        const isMongoId = typeof mealId === 'string' && /^[0-9a-fA-F]{24}$/.test(mealId);
        
        if (isMongoId) {
          // If it's a MongoDB ID, delete from the database
          try {
            console.log('Sending delete request to server for ID:', mealId);
            const response = await mealService.deleteMeal(mealId);
            console.log('Delete API response:', response);
            
            if (response.success) {
              toast.success('Meal deleted successfully');
            } else {
              console.error('API returned error:', response.message);
              // Continue with local state update even if API fails
            }
          } catch (error) {
            console.error('Error calling delete API:', error);
            // If we get an "Invalid meal ID" error, just update the local state
            if (error.response && error.response.data) {
              console.error('Error response data:', error.response.data);
              if (error.response.data.message && error.response.data.message.includes('Invalid meal ID')) {
                console.log('Continuing with local state update despite invalid ID format');
              } else {
                // For other errors, show the error message but still continue
                toast.error(`Error: ${error.response.data.message || 'Failed to delete from database'}`);
              }
            } else {
              toast.error('Error deleting from database, but removing from view');
            }
          }
        } else {
          console.log('Not a MongoDB ID, only updating local state');
        }
        
        // Update local state regardless of API success
        const dateKey = selectedDate.format('YYYY-MM-DD');
        setLoggedMeals(prevMeals => {
          const newMeals = { ...prevMeals };
          if (newMeals[dateKey] && newMeals[dateKey][mealType]) {
            console.log('Filtering out meal with ID:', mealId, 'from type:', mealType);
            console.log('Before filter:', newMeals[dateKey][mealType]);
            
            newMeals[dateKey][mealType] = newMeals[dateKey][mealType].filter(
              meal => {
                // Check both id and _id to handle different formats
                const mealIdMatches = 
                  (meal.id && meal.id.toString() === mealId.toString()) || 
                  (meal._id && meal._id.toString() === mealId.toString());
                
                // Log each meal being compared for debugging
                console.log('Comparing meal:', {
                  mealId: meal.id || meal._id,
                  matches: mealIdMatches
                });
                
                return !mealIdMatches;
              }
            );
            
            console.log('After filter:', newMeals[dateKey][mealType]);
          }
          return newMeals;
        });
        
        // Refresh meals from the database to ensure UI is in sync
        // Only if we're dealing with a MongoDB ID
        if (isMongoId) {
          await fetchMeals(selectedDate);
        }
        
      } catch (error) {
        console.error('Error in handleDeleteMeal:', error);
        toast.error('Failed to delete meal');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFoodSelection = (recipe) => {
    if (!recipe) return;
    
    // Extract protein, carbs, fat values and convert to numbers
    let protein = 0, carbs = 0, fat = 0, fiber = 0;
    
    if (recipe.nutritionInfo) {
      // Handle different formats of nutrition info
      const proteinStr = recipe.nutritionInfo.protein || '0g';
      const carbsStr = recipe.nutritionInfo.carbs || '0g';
      const fatStr = recipe.nutritionInfo.fat || '0g';
      const fiberStr = recipe.nutritionInfo.fiber || '0g';
      
      // Remove 'g' suffix if present and convert to number
      protein = parseFloat(proteinStr.replace('g', ''));
      carbs = parseFloat(carbsStr.replace('g', ''));
      fat = parseFloat(fatStr.replace('g', ''));
      fiber = parseFloat(fiberStr.replace('g', ''));
    }
    
    setSelectedFood({
      id: recipe.id,
      name: recipe.title,
      calories: recipe.calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      fiber: fiber,
      servings: recipe.servings || 1
    });
    
    console.log("Selected food:", recipe.title, "with calories:", recipe.calories);
  };

  const handleSubmit = async () => {
    // Reset form errors
    const errors = {
      mealType: false,
      food: false
    };
    
    // Validate required fields
    if (!selectedFood) {
      errors.food = true;
      toast.error('Please select a food');
    }

    // Validate meal type - ensure it's a non-empty string
    if (!selectedMealType || selectedMealType.trim() === '') {
      errors.mealType = true;
      toast.error('Please select a meal type');
    }
    
    // Update form errors state
    setFormErrors(errors);
    
    // If there are any errors, don't proceed
    if (errors.food || errors.mealType) {
      return;
    }

    try {
      setLoading(true);
      const dateKey = selectedDate.format('YYYY-MM-DD');
      
      // Prepare meal data for API
      const mealData = {
        name: selectedFood.name,
        type: selectedMealType,
        calories: selectedFood.calories,
        protein: selectedFood.protein || 0,
        carbs: selectedFood.carbs || 0,
        fat: selectedFood.fat || 0,
        notes: '',
        date: dateKey
      };
      
      console.log("Saving meal with data:", mealData);
      
      let response;
      
      if (editingMeal && typeof editingMeal.id === 'string' && editingMeal.id.length > 10) {
        // Update existing meal in database
        console.log("Updating existing meal with ID:", editingMeal.id);
        response = await mealService.updateMeal(editingMeal.id, mealData);
      } else {
        // Create new meal in database
        console.log("Creating new meal");
        response = await mealService.createMeal(mealData);
      }
      
      console.log("API response:", response);
      
      if (response.success) {
        // Refresh meals from the database
        await fetchMeals(selectedDate);
        toast.success(editingMeal ? 'Meal updated' : 'Meal added');
        handleCloseDialog();
      } else {
        console.error("Failed to save meal:", response.message);
        toast.error(response.message || 'Failed to save meal');
      }
    } catch (error) {
      console.error('Error saving meal:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      toast.error('Failed to save meal');
    } finally {
      setLoading(false);
    }
  };

  // Calculate macro percentages for the chart
  const macroPercentages = useMemo(() => {
    const proteinCals = dailyTotals?.protein * 4 || 0;
    const carbsCals = dailyTotals?.carbs * 4 || 0;
    const fatCals = dailyTotals?.fat * 9 || 0;
    const totalCals = proteinCals + carbsCals + fatCals;

    return {
      protein: totalCals ? Math.round((proteinCals / totalCals) * 100) : 0,
      carbs: totalCals ? Math.round((carbsCals / totalCals) * 100) : 0,
      fat: totalCals ? Math.round((fatCals / totalCals) * 100) : 0
    };
  }, [dailyTotals]);

  // Form states
  const [mealData, setMealData] = useState({
    name: '',
    type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: ''
  });

  // Meal types with icons
  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: <FreeBreakfast /> },
    { value: 'lunch', label: 'Lunch', icon: <LocalDining /> },
    { value: 'dinner', label: 'Dinner', icon: <DinnerDining /> },
    { value: 'snacks', label: 'Snacks', icon: <Fastfood /> }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenDialog = (meal = null) => {
    // Reset form errors
    setFormErrors({
      mealType: false,
      food: false
    });
    
    if (meal) {
      setEditingMeal(meal);
      setSelectedMealType(meal.type || 'breakfast');
      setMealData({
        name: meal.name,
        type: meal.type || 'breakfast',
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        notes: meal.notes || ''
      });
    } else {
      setEditingMeal(null);
      // Use the current tab to determine the default meal type
      const mealTypeMap = {
        0: 'breakfast',
        1: 'lunch',
        2: 'dinner',
        3: 'snacks'
      };
      const defaultMealType = mealTypeMap[currentTab] || 'breakfast';
      setSelectedMealType(defaultMealType);
      setMealData({
        name: '',
        type: defaultMealType,
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMeal(null);
    setSelectedFood(null);
    setSelectedMealType('breakfast');
    setMealData({
      name: '',
      type: 'breakfast',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      notes: ''
    });
    setSearchQuery('');
  };

  // Update the getMealsForCurrentTab function to handle undefined values properly
  const getMealsForCurrentTab = () => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    const mealTypeMap = {
      0: 'breakfast',
      1: 'lunch',
      2: 'dinner',
      3: 'snacks'
    };
    const mealType = mealTypeMap[currentTab];
    
    console.log("Getting meals for tab:", currentTab, "meal type:", mealType);
    console.log("Current logged meals:", loggedMeals);
    
    // Make sure loggedMeals[dateKey] and loggedMeals[dateKey][mealType] exist
    if (!loggedMeals[dateKey] || !loggedMeals[dateKey][mealType]) {
      console.log("No meals found for this date/type");
      return []; // Return empty array if no meals exist for this date/type
    }
    
    console.log("Found meals:", loggedMeals[dateKey][mealType]);
    return loggedMeals[dateKey][mealType].map(meal => ({
      ...meal,
      calories: Number(meal.calories) || 0,
      protein: Number(meal.protein) || 0,
      carbs: Number(meal.carbs) || 0,
      fat: Number(meal.fat) || 0
    }));
  };

  // Add this function to handle navigation
  const handleDietPlanClick = () => {
    navigate('/diet-planning');
  };

  // Fix the renderFoodList function to handle undefined recipes and show nutrient info
  const renderFoodList = () => (
    <List 
      sx={{ 
        maxHeight: 300, 
        overflow: 'auto',
        bgcolor: '#F8FAFC',
        borderRadius: 1,
        '& .MuiListItem-root': {
          transition: 'all 0.2s ease'
        }
      }}
    >
      {recipes && recipes.length > 0 ? (
        recipes
          .filter(recipe => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((recipe) => (
            <ListItem
              key={recipe.id}
              button
              onClick={() => handleFoodSelection(recipe)}
              selected={selectedFood?.id === recipe.id}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: `${COLORS.primary}15`,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}20`,
                  }
                },
                '&:hover': {
                  bgcolor: `${COLORS.primary}10`,
                }
              }}
            >
              <ListItemText
                primary={
                  <Typography 
                    sx={{ 
                      fontWeight: selectedFood?.id === recipe.id ? 600 : 400,
                      color: selectedFood?.id === recipe.id ? COLORS.primary : 'inherit'
                    }}
                  >
                    {recipe.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {recipe.calories} kcal | P: {recipe.nutritionInfo?.protein || '0g'} • 
                    C: {recipe.nutritionInfo?.carbs || '0g'} • 
                    F: {recipe.nutritionInfo?.fat || '0g'}
                  </Typography>
                }
              />
              {selectedFood?.id === recipe.id && (
                <CheckCircleIcon sx={{ color: COLORS.primary, ml: 1 }} />
              )}
            </ListItem>
          ))
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Loading recipes...
          </Typography>
        </Box>
      )}
      {recipes && recipes.length > 0 && 
       recipes.filter(recipe => recipe.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No foods found matching your search
          </Typography>
        </Box>
      )}
    </List>
  );

  // Add this function to handle delete since it was removed but still referenced
  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Invalid meal ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        setLoading(true);
        console.log('Attempting to delete meal with ID:', id);
        
        // Check if this is a MongoDB ObjectId (24 hex characters)
        const isMongoId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
        
        if (isMongoId) {
          // If it's a MongoDB ID, delete from the database
          try {
            const response = await mealService.deleteMeal(id);
            console.log('Delete API response:', response);
            
            if (response.success) {
              toast.success('Meal deleted successfully');
            } else {
              console.error('API returned error:', response.message);
              // Continue with local state update even if API fails
            }
          } catch (error) {
            console.error('Error calling delete API:', error);
            // If we get an "Invalid meal ID" error, just update the local state
            if (error.response && error.response.data && error.response.data.message === 'Invalid meal ID format') {
              console.log('Continuing with local state update despite invalid ID format');
            } else {
              // For other errors, show the error message but still continue
              toast.error('Error deleting from database, but removing from view');
            }
          }
        } else {
          console.log('Not a MongoDB ID, only updating local state');
        }
        
        // Update local state regardless of API success
        const dateKey = selectedDate.format('YYYY-MM-DD');
        
        setLoggedMeals(prevMeals => {
          const newMeals = { ...prevMeals };
          
          // Find and remove the meal from all meal types
          Object.keys(newMeals[dateKey] || {}).forEach(mealType => {
            if (newMeals[dateKey][mealType]) {
              console.log('Filtering out meal with ID:', id, 'from type:', mealType);
              
              newMeals[dateKey][mealType] = newMeals[dateKey][mealType].filter(
                meal => {
                  // Check both id and _id to handle different formats
                  const mealIdMatches = 
                    (meal.id && meal.id.toString() === id.toString()) || 
                    (meal._id && meal._id.toString() === id.toString());
                  
                  return !mealIdMatches;
                }
              );
            }
          });
          
          return newMeals;
        });
        
        // Refresh meals from the database to ensure UI is in sync
        // Only if we're dealing with a MongoDB ID
        if (isMongoId) {
          await fetchMeals(selectedDate);
        }
        
      } catch (error) {
        console.error('Error in handleDelete:', error);
        toast.error('Failed to delete meal');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={commonStyles.pageContainer}>
      <Container maxWidth="lg">
        {/* Header with Title and Date */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            pt: 4,
            mb: 4,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h3" 
              sx={{ 
                ...typography.mainHeading,
                fontSize: { xs: '2.5rem', md: '3rem' },
                backgroundImage: `linear-gradient(135deg, ${COLORS.primary} 0%, #FF92B4 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: { xs: 2, md: 0 }
              }}
            >
              Meal Logger
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                    bgcolor: 'white'
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        {/* Full-width Calorie Counter */}
        <motion.div
          variants={counterVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Card 
            elevation={2}
            sx={{ 
              mb: 4,
              borderRadius: 3,
              bgcolor: 'white',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Background decoration */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                right: 0,
                width: '30%',
                height: '100%',
                background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.primary}05)`,
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
              }}
            />

            <CardContent sx={{ py: 4 }}>
              <Grid container spacing={3} alignItems="center">
                {/* Main Calorie Display */}
                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box sx={{ 
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                      <motion.div
                        initial={{ rotate: -5 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <LocalFireDepartmentIcon 
                          sx={{ 
                            fontSize: '2.5rem', 
                            color: COLORS.primary,
                            mb: 1
                          }} 
                        />
                      </motion.div>
                      <Typography 
                        variant="h2" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '2.5rem', md: '3.5rem' },
                          color: COLORS.primary,
                          lineHeight: 1,
                          mb: 1
                        }}
                      >
                        <motion.span
                          key={dailyTotals.calories}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {Math.round(dailyTotals.calories)}
                        </motion.span>
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        Calories Today
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>

                {/* Progress Section */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ px: 2 }}>
                    <Box sx={{ 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        Daily Goal Progress
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: COLORS.primary,
                          fontWeight: 600
                        }}
                      >
                        {caloriePercentage}%
                      </Typography>
                    </Box>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={caloriePercentage}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: `${COLORS.primary}15`,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: COLORS.primary,
                            borderRadius: 5,
                            background: `linear-gradient(90deg, ${COLORS.primary}, #FF92B4)`
                          }
                        }}
                      />
                    </motion.div>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        mt: 1,
                        textAlign: 'center',
                        fontSize: '0.875rem'
                      }}
                    >
                      Target: {userDailyTargets.calories} kcal
                    </Typography>
                  </Box>
                </Grid>

                {/* Stats Section */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    pl: { md: 3 },
                    borderLeft: { md: `2px solid ${COLORS.primary}20` }
                  }}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        bgcolor: `${COLORS.primary}08`,
                        borderRadius: 2
                      }}>
                        <TrendingUpIcon sx={{ color: COLORS.primary }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Remaining
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.primary }}>
                            {remainingCalories} kcal
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        bgcolor: `${COLORS.primary}08`,
                        borderRadius: 2
                      }}>
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%',
                          bgcolor: COLORS.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}>
                          %
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Macro Split
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            P: {macroPercentages.protein}% • 
                            C: {macroPercentages.carbs}% • 
                            F: {macroPercentages.fat}%
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Macro Distribution and Progress */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ ...typography.subHeading, mb: 3 }}>
                    Macro Distribution
                  </Typography>
                  <Box sx={{ 
                    height: 250,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <motion.div
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <Doughnut data={macroChartData} options={chartOptions} />
                    </motion.div>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ ...typography.subHeading, mb: 3 }}>
                    Daily Progress
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {[
                      { label: 'Protein', value: dailyTotals.protein, target: userDailyTargets.protein, color: COLORS.protein },
                      { label: 'Carbs', value: dailyTotals.carbs, target: userDailyTargets.carbs, color: COLORS.carbs },
                      { label: 'Fat', value: dailyTotals.fat, target: userDailyTargets.fat, color: COLORS.fat }
                    ].map((macro, index) => (
                      <motion.div
                        key={macro.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontWeight: 500 }}>{macro.label}</Typography>
                            <Typography sx={{ color: macro.color, fontWeight: 600 }}>
                              {Math.round(macro.value)}g / {macro.target}g
                            </Typography>
                          </Box>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={calculateProgress(macro.value, macro.target)}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: `${macro.color}20`,
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: macro.color,
                                  borderRadius: 4
                                }
                              }}
                            />
                          </motion.div>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Meal Logging Section */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3 
              }}>
                <Typography variant="h6" sx={typography.subHeading}>
                  Logged Meals
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    sx={{
                      bgcolor: COLORS.primary,
                      '&:hover': {
                        bgcolor: '#FF1F71'
                      }
                    }}
                  >
                    Add Meal
                  </Button>
                </motion.div>
              </Box>

              <Tabs 
                value={currentTab} 
                onChange={(e, newValue) => setCurrentTab(newValue)}
                variant="fullWidth"
                sx={{
                  mb: 3,
                  '& .MuiTab-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }
                }}
              >
                <Tab icon={<FreeBreakfast />} label="Breakfast" />
                <Tab icon={<LocalDining />} label="Lunch" />
                <Tab icon={<DinnerDining />} label="Dinner" />
                <Tab icon={<Fastfood />} label="Snacks" />
              </Tabs>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <List>
                    <AnimatePresence>
                      {getMealsForCurrentTab().map((meal, index) => (
                        <motion.div
                          key={meal._id || `meal-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListItem
                            sx={{
                              mb: 1,
                              bgcolor: '#F8FAFC',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateX(8px)',
                                bgcolor: '#F1F5F9'
                              }
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography 
                                  component="div"
                                  sx={{ 
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                    color: '#2D3748',
                                    fontSize: '1rem',
                                    mb: 0.5
                                  }}
                                >
                                  {meal.name}
                                </Typography>
                              }
                              secondary={
                                <Typography component="div">
                                  <Box 
                                    component="div" 
                                    sx={{ 
                                      color: 'text.secondary',
                                      fontSize: '0.875rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      mb: 0.5
                                    }}
                                  >
                                    <Restaurant />
                                    {meal.calories} kcal
                                  </Box>
                                  <Box 
                                    component="div" 
                                    sx={{ 
                                      color: 'text.secondary',
                                      fontSize: '0.75rem',
                                      display: 'flex',
                                      gap: 2
                                    }}
                                  >
                                    <span>Protein: {meal.protein}g</span>
                                    <span>Carbs: {meal.carbs}g</span>
                                    <span>Fat: {meal.fat}g</span>
                                  </Box>
                                </Typography>
                              }
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(meal)}
                                sx={{
                                  color: COLORS.primary,
                                  '&:hover': {
                                    bgcolor: `${COLORS.primary}15`
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  // Use either _id or id, whichever is available
                                  const mealId = meal._id || meal.id;
                                  console.log('Delete button clicked for meal:', meal);
                                  if (!mealId) {
                                    toast.error('Cannot delete meal: Missing ID');
                                    return;
                                  }
                                  handleDeleteMeal(mealId, meal.type);
                                }}
                                disabled={loading}
                                sx={{
                                  color: '#EF5350',
                                  '&:hover': {
                                    bgcolor: '#EF535015'
                                  },
                                  '&.Mui-disabled': {
                                    color: '#EF535080'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </ListItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Diet Plan Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleDietPlanClick}
              startIcon={<RestaurantMenuIcon />}
              sx={{
                bgcolor: COLORS.primary,
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: '#FF1F71',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Your Personalized Diet Plan
            </Button>
          </motion.div>
        </Box>

        {/* Add Dialog Animation */}
        <AnimatePresence>
          {openDialog && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    maxWidth: 600
                  }
                }}
              >
                <DialogTitle sx={{ pb: 1 }}>{editingMeal ? 'Edit Meal' : 'Log New Meal'}</DialogTitle>
                <DialogContent>
                  <Box sx={{ mb: 2 }}>
                    {/* Meal Type Selection First */}
                    <FormControl fullWidth required sx={{ mb: 3, zIndex: 1000 }}>
                      <InputLabel id="meal-type-label" error={formErrors.mealType}>Meal Type *</InputLabel>
                      <Select
                        labelId="meal-type-label"
                        id="meal-type"
                        value={selectedMealType}
                        onChange={(e) => {
                          setSelectedMealType(e.target.value);
                          setFormErrors(prev => ({...prev, mealType: false}));
                        }}
                        label="Meal Type *"
                        required
                        error={formErrors.mealType}
                        sx={{
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }
                        }}
                      >
                        {mealTypes.map((type) => (
                          <MenuItem 
                            key={type.value} 
                            value={type.value} 
                            sx={{ 
                              textTransform: 'capitalize',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            {type.icon}
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.mealType && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          Please select a meal type
                        </Typography>
                      )}
                    </FormControl>

                    {/* Search Section with Selection Indicator */}
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Search Foods"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      {selectedFood && (
                        <Box 
                          sx={{ 
                            mt: 1,
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: `${COLORS.primary}15`,
                            border: `1px solid ${COLORS.primary}40`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                color: COLORS.primary,
                                fontWeight: 600 
                              }}
                            >
                              Selected: {selectedFood.name}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                display: 'block'
                              }}
                            >
                              {selectedFood.calories} kcal | P: {selectedFood.protein}g • C: {selectedFood.carbs}g • F: {selectedFood.fat}g
                            </Typography>
                          </Box>
                          <IconButton 
                            size="small" 
                            onClick={() => setSelectedFood(null)}
                            sx={{ color: COLORS.primary }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    {/* Food List */}
                    {renderFoodList()}
                  </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                  <Button 
                    onClick={handleCloseDialog}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: '#F1F5F9'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!selectedFood || !selectedMealType || loading}
                    sx={{
                      bgcolor: COLORS.primary,
                      '&:hover': {
                        bgcolor: '#FF1F71'
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#E2E8F0',
                        color: '#94A3B8'
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : editingMeal ? 'Update' : 'Save'}
                  </Button>
                </DialogActions>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}

// Add this component for nutrient progress bars
const NutrientProgressBar = ({ nutrient, value, target }) => (
  <Box sx={{ mb: 2 }}>
    <Typography 
      variant="body2" 
      sx={{ 
        mb: 1, 
        display: 'flex', 
        justifyContent: 'space-between',
        fontFamily: typography.body.fontFamily
      }}
    >
      <span>{nutrient.name}</span>
      <span>{Math.round(value || 0)}g / {target}g</span>
    </Typography>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(((value || 0) / target) * 100, 100)}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <LinearProgress
        variant="determinate"
        value={Math.min(((value || 0) / target) * 100, 100)}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: `${nutrient.color}20`,
          '& .MuiLinearProgress-bar': {
            bgcolor: nutrient.color,
            borderRadius: 4,
          }
        }}
      />
    </motion.div>
  </Box>
);

// Add a calorie tracking component at the top of your page
const CalorieTracker = ({ dailyTotals, dailyTargets }) => {
  const caloriePercentage = Math.min((dailyTotals.calories / dailyTargets.calories) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        elevation={3}
        sx={{ 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${COLORS.primary}15, #fff)`,
          position: 'relative',
          overflow: 'visible',
          mb: 4
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    ...typography.mainHeading,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    color: COLORS.primary,
                    mb: 1
                  }}
                >
                  {Math.round(dailyTotals.calories)}
                  <Typography 
                    component="span" 
                    sx={{ 
                      ...typography.body,
                      fontSize: '1.2rem',
                      color: 'text.secondary',
                      ml: 1
                    }}
                  >
                    / {dailyTargets.calories} kcal
                  </Typography>
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    ...typography.body,
                    color: 'text.secondary'
                  }}
                >
                  Daily Calorie Goal
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', p: 2 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${caloriePercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={caloriePercentage}
                    sx={{
                      height: 20,
                      borderRadius: 10,
                      bgcolor: `${COLORS.primary}20`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: COLORS.primary,
                        borderRadius: 10,
                      }
                    }}
                  />
                </motion.div>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    ...typography.body,
                    mt: 1,
                    textAlign: 'right',
                    color: 'text.secondary'
                  }}
                >
                  {Math.round(caloriePercentage)}% of daily goal
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Meal Type Breakdown */}
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
                const mealCalories = (loggedMeals[selectedDate.format('YYYY-MM-DD')]?.[mealType] || [])
                  .reduce((sum, meal) => sum + meal.calories, 0);
                
                return (
                  <Grid item xs={6} sm={3} key={mealType}>
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          ...typography.body,
                          textTransform: 'capitalize',
                          color: 'text.secondary',
                          mb: 0.5
                        }}
                      >
                        {mealType}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          ...typography.mainHeading,
                          color: COLORS.primary
                        }}
                      >
                        {Math.round(mealCalories)}
                        <Typography 
                          component="span" 
                          sx={{ 
                            fontSize: '0.8rem',
                            color: 'text.secondary',
                            ml: 0.5
                          }}
                        >
                          kcal
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MealLogging; 