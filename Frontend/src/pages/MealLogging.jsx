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
  InputAdornment
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
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';

// Register the required Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

// Expanded food database with more options
const FOOD_DATABASE = {
  // Breakfast Items
  "Oatmeal with Berries": {
    calories: 350,
    protein: 12,
    carbs: 58,
    fat: 8,
    fiber: 8,
    iron: 2.5,
    folicAcid: 120
  },
  "Greek Yogurt with Honey": {
    calories: 150,
    protein: 15,
    carbs: 8,
    fat: 4,
    fiber: 0,
    iron: 0.2,
    folicAcid: 15
  },
  "Whole Grain Toast with Avocado": {
    calories: 280,
    protein: 8,
    carbs: 32,
    fat: 16,
    fiber: 10,
    iron: 2.0,
    folicAcid: 80
  },
  "Spinach and Cheese Omelet": {
    calories: 320,
    protein: 21,
    carbs: 4,
    fat: 24,
    fiber: 2,
    iron: 3.2,
    folicAcid: 160
  },
  // Lunch Items
  "Quinoa Salad": {
    calories: 420,
    protein: 18,
    carbs: 68,
    fat: 12,
    fiber: 10,
    iron: 4.5,
    folicAcid: 180
  },
  "Grilled Chicken Breast": {
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    iron: 1.1,
    folicAcid: 9
  },
  "Lentil Soup": {
    calories: 230,
    protein: 15,
    carbs: 40,
    fat: 2,
    fiber: 15,
    iron: 6.6,
    folicAcid: 358
  },
  "Tuna Sandwich": {
    calories: 350,
    protein: 25,
    carbs: 38,
    fat: 12,
    fiber: 4,
    iron: 2.8,
    folicAcid: 48
  },
  // Dinner Items
  "Salmon with Sweet Potato": {
    calories: 450,
    protein: 46,
    carbs: 26,
    fat: 18,
    fiber: 4,
    iron: 2.5,
    folicAcid: 220
  },
  "Stir-Fried Tofu with Vegetables": {
    calories: 380,
    protein: 24,
    carbs: 32,
    fat: 16,
    fiber: 8,
    iron: 6.2,
    folicAcid: 263
  },
  "Brown Rice with Black Beans": {
    calories: 340,
    protein: 12,
    carbs: 68,
    fat: 3,
    fiber: 12,
    iron: 3.8,
    folicAcid: 172
  },
  // Snacks
  "Apple with Almond Butter": {
    calories: 200,
    protein: 7,
    carbs: 28,
    fat: 12,
    fiber: 5,
    iron: 0.8,
    folicAcid: 40
  },
  "Trail Mix": {
    calories: 180,
    protein: 6,
    carbs: 18,
    fat: 12,
    fiber: 3,
    iron: 1.2,
    folicAcid: 25
  },
  "Hummus with Carrots": {
    calories: 160,
    protein: 6,
    carbs: 20,
    fat: 8,
    fiber: 6,
    iron: 1.5,
    folicAcid: 60
  },
  "Cottage Cheese with Peaches": {
    calories: 170,
    protein: 14,
    carbs: 22,
    fat: 4,
    fiber: 2,
    iron: 0.4,
    folicAcid: 30
  }
};

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

  // Dummy logged meals state (in a real app, this would come from a backend)
  const [loggedMeals, setLoggedMeals] = useState({
    [dayjs().format('YYYY-MM-DD')]: {
      breakfast: [
        { id: 1, food: "Oatmeal with Berries", ...FOOD_DATABASE["Oatmeal with Berries"] }
      ],
      lunch: [
        { id: 2, food: "Quinoa Salad", ...FOOD_DATABASE["Quinoa Salad"] }
      ],
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

  // Calculate daily totals whenever meals change
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
      label: meal.food,
      ...FOOD_DATABASE[meal.food]
    });
    setSelectedMealType(meal.type);
    setOpenDialog(true);
  };

  const handleDeleteMeal = (mealId, mealType) => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    
    setLoggedMeals(prevMeals => {
      const newMeals = { ...prevMeals };
      if (newMeals[dateKey] && newMeals[dateKey][mealType]) {
        newMeals[dateKey][mealType] = newMeals[dateKey][mealType].filter(
          meal => meal.id !== mealId
        );
      }
      return newMeals;
    });
  };

  const handleFoodSelection = (food) => {
    console.log('Selected food:', food); // Debug log
    setSelectedFood(food);
  };

  const handleAddMealSubmit = () => {
    if (!selectedFood || !selectedMealType) return;

    const dateKey = selectedDate.format('YYYY-MM-DD');
    const newMeal = {
      id: Date.now(),
      name: selectedFood.name,
      calories: Number(selectedFood.calories),
      protein: Number(selectedFood.protein),
      carbs: Number(selectedFood.carbs),
      fat: Number(selectedFood.fat),
      fiber: Number(selectedFood.fiber),
      timestamp: new Date().toISOString()
    };

    setLoggedMeals(prevMeals => {
      const newMeals = {
        ...prevMeals,
        [dateKey]: {
          ...prevMeals[dateKey],
          [selectedMealType]: [
            ...(prevMeals[dateKey]?.[selectedMealType] || []),
            newMeal
          ]
        }
      };
      return newMeals;
    });

    setOpenDialog(false);
    setSelectedFood(null);
    setSelectedMealType('');
    setSearchQuery('');
  };

  // Expanded food database
  const foodDatabase = [
    {
      name: "Oatmeal with Banana",
      calories: 289,
      protein: 6,
      carbs: 62,
      fat: 4,
      fiber: 8
    },
    {
      name: "Grilled Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0
    },
    {
      name: "Greek Yogurt with Berries",
      calories: 150,
      protein: 15,
      carbs: 20,
      fat: 3,
      fiber: 4
    },
    {
      name: "Salmon Fillet",
      calories: 280,
      protein: 25,
      carbs: 0,
      fat: 18,
      fiber: 0
    },
    {
      name: "Quinoa Bowl",
      calories: 220,
      protein: 8,
      carbs: 39,
      fat: 6,
      fiber: 5
    },
    {
      name: "Avocado Toast",
      calories: 320,
      protein: 10,
      carbs: 33,
      fat: 21,
      fiber: 9
    },
    {
      name: "Protein Smoothie",
      calories: 245,
      protein: 20,
      carbs: 30,
      fat: 5,
      fiber: 6
    },
    {
      name: "Turkey Sandwich",
      calories: 350,
      protein: 25,
      carbs: 35,
      fat: 12,
      fiber: 4
    },
    {
      name: "Mixed Green Salad",
      calories: 120,
      protein: 4,
      carbs: 12,
      fat: 8,
      fiber: 5
    },
    {
      name: "Almonds (1oz)",
      calories: 164,
      protein: 6,
      carbs: 6,
      fat: 14,
      fiber: 3.5
    },
    {
      name: "Brown Rice (1 cup)",
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      fiber: 3.5
    },
    {
      name: "Sweet Potato",
      calories: 103,
      protein: 2,
      carbs: 24,
      fat: 0,
      fiber: 4
    },
    {
      name: "Eggs (2 large)",
      calories: 156,
      protein: 13,
      carbs: 1,
      fat: 11,
      fiber: 0
    },
    {
      name: "Protein Bar",
      calories: 220,
      protein: 20,
      carbs: 25,
      fat: 8,
      fiber: 3
    },
    {
      name: "Hummus with Carrots",
      calories: 190,
      protein: 6,
      carbs: 22,
      fat: 11,
      fiber: 7
    }
  ];

  // Update the filtered foods logic
  const filteredFoods = useMemo(() => {
    return foodDatabase.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Add this function to handle navigation
  const handleDietPlanClick = () => {
    navigate('/diet-planning');
  };

  // Calculate macro percentages for the chart
  const macroPercentages = useMemo(() => {
    const proteinCals = dailyTotals.protein * 4;
    const carbsCals = dailyTotals.carbs * 4;
    const fatCals = dailyTotals.fat * 9;
    const totalCals = proteinCals + carbsCals + fatCals;

    return {
      protein: totalCals ? Math.round((proteinCals / totalCals) * 100) : 0,
      carbs: totalCals ? Math.round((carbsCals / totalCals) * 100) : 0,
      fat: totalCals ? Math.round((fatCals / totalCals) * 100) : 0
    };
  }, [dailyTotals]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <Box sx={{ bgcolor: COLORS.background, minHeight: '100vh', pb: 6 }}>
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
                      onClick={handleAddMeal}
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
                        {(loggedMeals[selectedDate.format('YYYY-MM-DD')]?.[
                          ['breakfast', 'lunch', 'dinner', 'snacks'][currentTab]
                        ] || []).map((meal, index) => (
                          <motion.div
                            key={meal.id}
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
                                    sx={{ 
                                      fontFamily: "'Poppins', sans-serif",
                                      fontWeight: 600,
                                      color: '#2D3748',
                                      fontSize: '1rem',
                                      mb: 0.5
                                    }}
                                  >
                                    {/* Use multiple fallbacks to ensure name is displayed */}
                                    {meal.name || meal.food || 'Unnamed Meal'}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography 
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
                                    </Typography>
                                    <Typography 
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
                                    </Typography>
                                  </Box>
                                }
                              />
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditMeal(meal)}
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
                                  onClick={() => handleDeleteMeal(meal.id, ['breakfast', 'lunch', 'dinner', 'snacks'][currentTab])}
                                  sx={{
                                    color: '#EF5350',
                                    '&:hover': {
                                      bgcolor: '#EF535015'
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
                  onClose={() => setOpenDialog(false)}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle sx={{ pb: 1 }}>Add Meal</DialogTitle>
                  <DialogContent>
                    <Box sx={{ mb: 2 }}>
                      {/* Meal Type Selection First */}
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Meal Type</InputLabel>
                        <Select
                          value={selectedMealType}
                          onChange={(e) => setSelectedMealType(e.target.value)}
                          label="Meal Type"
                        >
                          <MenuItem value="breakfast">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FreeBreakfast fontSize="small" />
                              Breakfast
                            </Box>
                          </MenuItem>
                          <MenuItem value="lunch">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocalDining fontSize="small" />
                              Lunch
                            </Box>
                          </MenuItem>
                          <MenuItem value="dinner">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DinnerDining fontSize="small" />
                              Dinner
                            </Box>
                          </MenuItem>
                          <MenuItem value="snacks">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Fastfood fontSize="small" />
                              Snacks
                            </Box>
                          </MenuItem>
                        </Select>
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
                        {filteredFoods.map((food) => (
                          <ListItem
                            key={food.name}
                            button
                            onClick={() => handleFoodSelection(food)}
                            selected={selectedFood?.name === food.name}
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
                                <Typography sx={{ 
                                  fontWeight: selectedFood?.name === food.name ? 600 : 400,
                                  color: selectedFood?.name === food.name ? COLORS.primary : 'inherit'
                                }}>
                                  {food.name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  {food.calories} kcal | P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                                </Typography>
                              }
                            />
                            {selectedFood?.name === food.name && (
                              <CheckCircleIcon sx={{ color: COLORS.primary, ml: 1 }} />
                            )}
                          </ListItem>
                        ))}
                        {filteredFoods.length === 0 && (
                          <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                              No foods found matching your search
                            </Typography>
                          </Box>
                        )}
                      </List>
                    </Box>
                  </DialogContent>
                  <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button 
                      onClick={() => setOpenDialog(false)}
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
                      onClick={handleAddMealSubmit}
                      variant="contained"
                      disabled={!selectedFood || !selectedMealType}
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
                      Add Meal
                    </Button>
                  </DialogActions>
                </Dialog>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </motion.div>
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