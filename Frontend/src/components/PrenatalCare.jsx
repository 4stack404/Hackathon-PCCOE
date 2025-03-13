import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Divider, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Alert, 
  AlertTitle,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  LocalHospital as LocalHospitalIcon,
  FitnessCenter as FitnessCenterIcon,
  Restaurant as RestaurantIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  Spa as SpaIcon,
  Lightbulb as LightbulbIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  EmojiEvents as EmojiEventsIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  Recommend as RecommendIcon,
  SelfImprovement as SelfImprovementIcon,
  LocalDrink as LocalDrinkIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Close as CloseIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  YouTube as YouTubeIcon,
  VideoLibrary as VideoLibraryIcon
} from '@mui/icons-material';
// Import motion but disable the linter warning
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import dietPlanService from '../services/dietPlanService';
import { userAPI, authAPI } from '../services/api';

// Sample data - in a real app, this would come from your backend
const weeklyTips = [
  {
    week: 12,
    title: "Stay Hydrated",
    content: "During your 12th week, it's especially important to stay hydrated as your blood volume increases. Aim for at least 10 cups of fluids daily, primarily water. Consider carrying a reusable water bottle with time markers to track your intake throughout the day.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    week: 13,
    title: "Focus on Iron-Rich Foods",
    content: "Your body needs more iron now to help with increased blood production. Include lean red meat, spinach, beans, and fortified cereals in your diet. Pair these with vitamin C-rich foods to enhance absorption.",
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    week: 14,
    title: "Start Sleeping on Your Side",
    content: "As your pregnancy progresses, sleeping on your left side improves circulation to your heart and allows for better blood flow to the fetus, uterus, and kidneys. Consider using pregnancy pillows for added comfort.",
    image: "https://images.unsplash.com/photo-1631157769562-cba2d7b28f2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Diet plan data
const dietPlanData = {
  diet_plan: {
    breakfast: [
      {
        comment: "A nutrient-dense smoothie with a balance of protein, healthy fats, and complex carbohydrates, suitable for a morning boost.",
        recipe_id: 9
      },
      {
        comment: "A simple, fiber-rich oatmeal recipe that provides sustained energy throughout the morning.",
        recipe_id: 10
      },
      {
        comment: "A protein-packed breakfast scramble with sweet potatoes, providing a filling and satisfying start to the day.",
        recipe_id: 21
      }
    ],
    dinner: [
      {
        comment: "A well-balanced dinner recipe with a good source of protein, healthy fats, and complex carbohydrates, suitable for a satisfying evening meal.",
        recipe_id: 2
      },
      {
        comment: "A flavorful and nutritious curry recipe with a balance of protein, healthy fats, and complex carbohydrates, suitable for a comforting dinner.",
        recipe_id: 11
      },
      {
        comment: "A nutrient-dense pasta recipe with a balance of protein, healthy fats, and complex carbohydrates, suitable for a satisfying dinner.",
        recipe_id: 25
      }
    ],
    lunch: [
      {
        comment: "A nutrient-dense salad with a balance of protein, healthy fats, and complex carbohydrates, suitable for a mid-day meal.",
        recipe_id: 1
      },
      {
        comment: "A fiber-rich, plant-based dal recipe that provides a boost of protein and energy for the rest of the day.",
        recipe_id: 3
      },
      {
        comment: "A protein-packed quinoa salad with a balance of healthy fats and complex carbohydrates, suitable for a satisfying lunch.",
        recipe_id: 22
      }
    ],
    snacks: [
      {
        calories: 60,
        description: "A mix of seasonal fruits, providing a natural source of energy and fiber.",
        name: "Fresh Fruit Salad"
      },
      {
        calories: 120,
        description: "A crunchy and satisfying snack, rich in protein and fiber.",
        name: "Roasted Chickpeas"
      }
    ]
  }
};

const exerciseData = [
  {
    name: "Gentle Prenatal Yoga",
    description: "Improves flexibility, mental centering, and helps with breathing techniques for labor. Focus on poses that open the hips and strengthen the pelvic floor.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    duration: "20-30 minutes",
    frequency: "3-4 times per week"
  },
  {
    name: "Swimming",
    description: "Excellent low-impact cardiovascular exercise that relieves pressure on joints. The buoyancy of water supports your growing belly and reduces swelling.",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    duration: "30 minutes",
    frequency: "2-3 times per week"
  },
  {
    name: "Walking",
    description: "Safe, easy, and accessible exercise that improves cardiovascular health without straining your joints and muscles. Start with 10 minutes and gradually increase.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    duration: "20-30 minutes",
    frequency: "Daily if possible"
  },
  {
    name: "Pelvic Floor Exercises",
    description: "Strengthens the muscles that support your bladder, bowels, and uterus. Regular practice can help prevent incontinence and aid in postpartum recovery.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    duration: "5-10 minutes",
    frequency: "Daily"
  }
];

const dietRecommendations = [
  {
    name: "Spinach and Feta Breakfast Wrap",
    comment: "Rich in folate and calcium, essential for fetal neural tube development and bone health. The whole grain wrap provides sustained energy throughout your morning.",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    name: "Salmon with Quinoa and Roasted Vegetables",
    comment: "Excellent source of omega-3 fatty acids for baby's brain development. Quinoa provides complete protein and the vegetables offer essential vitamins and minerals.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    name: "Greek Yogurt Parfait with Berries and Granola",
    comment: "High in protein and probiotics for digestive health. Berries provide antioxidants and vitamin C, which helps with iron absorption.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    name: "Lentil Soup with Whole Grain Bread",
    comment: "Plant-based protein and iron source, important for increased blood volume during pregnancy. The fiber helps prevent constipation, a common pregnancy discomfort.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

const weeklySymptoms = {
  12: [
    "Reduced nausea",
    "Increased energy",
    "Visible baby bump",
    "Increased appetite"
  ],
  13: [
    "Visible veins on breasts and abdomen",
    "Increased sex drive",
    "Less frequent urination",
    "Continued energy improvement"
  ],
  14: [
    "Round ligament pain",
    "Improved skin (pregnancy glow)",
    "Nasal congestion",
    "Increased appetite"
  ]
};

// Define but disable the linter warning
// eslint-disable-next-line no-unused-vars
const LOGGED_SYMPTOMS = [
  {
    name: "Severe headache",
    severity: "high",
    frequency: "daily",
    date: "2023-06-15"
  },
  {
    name: "Swelling in feet",
    severity: "medium",
    frequency: "evening",
    date: "2023-06-14"
  }
];

const selfCareRecommendations = [
  {
    title: "Prenatal Massage",
    description: "This type of massage therapy is specifically designed for pregnant women to help alleviate discomfort, promote relaxation, and provide overall well-being.",
    icon: <SpaIcon />,
    benefits: ["Relaxation", "Relief from discomfort", "Improved circulation", "Alleviation of muscle tension", "Better sleep"]
  },
  {
    title: "Comfortable Clothes",
    description: "Opt for loose-fitting, breathable clothing made from natural fabrics to prevent overheating and allow your body to move comfortably.",
    icon: <SelfImprovementIcon />,
    options: ["Leggings with stretch", "Maxi dresses and skirts", "Maternity bras", "Absorbing underwear", "Comfortable shoes"]
  },
  {
    title: "Hydration",
    description: "Drinking plenty of water can help alleviate common pregnancy symptoms like constipation and swelling. Aim for at least 8-10 glasses of water per day.",
    icon: <LocalDrinkIcon />
  },
  {
    title: "Regular Exercise",
    description: "Engage in safe and appropriate prenatal exercises to help maintain strength, flexibility, and alleviate discomfort.",
    icon: <FitnessCenterIcon />
  }
];

// Animation variants
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
    transition: { duration: 0.5 }
  }
};

// Add this function to handle fetching exercise data with video URLs
const addVideoUrlsToExercises = (exercises) => {
  // Sample video mapping - in a real app, these would come from your database
  const videoMapping = {
    'Walking': 'https://www.youtube.com/watch?v=szBTVcb4JBw',
    'Swimming': 'https://www.youtube.com/watch?v=HmJ7YV_gIaU',
    'Yoga': 'https://www.youtube.com/watch?v=RpKAB0r_wMI',
    'Pilates': 'https://www.youtube.com/watch?v=K56Z12XNQ5c',
    'Kegel Exercises': 'https://www.youtube.com/watch?v=7qJLcKKPTYg',
    'Pelvic Tilts': 'https://www.youtube.com/watch?v=7zTBDTzoEjA',
    'Squats': 'https://www.youtube.com/watch?v=42bFodPahBU',
    'Cat-Cow Stretch': 'https://www.youtube.com/watch?v=kqnua4rHVVA',
    'Bird Dog': 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
    'Wall Push-Ups': 'https://www.youtube.com/watch?v=EOf3cGIQpA4',
    'Side-Lying Leg Lifts': 'https://www.youtube.com/watch?v=vVPiPR7T6J4',
    'Ankle Circles': 'https://www.youtube.com/watch?v=V-gQAuJyBvE'
  };

  return exercises.map(exercise => {
    // Check if we have a video for this exercise
    if (videoMapping[exercise.name]) {
      return { ...exercise, videoUrl: videoMapping[exercise.name] };
    }
    return exercise;
  });
};

// Add this function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  
  // Log the original URL for debugging
  console.log('Converting YouTube URL:', url);
  
  try {
    // Handle different YouTube URL formats
    let videoId = '';
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v');
    } 
    // Format: https://youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    // Format: https://www.youtube.com/embed/VIDEO_ID
    else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1].split('?')[0];
    }
    
    if (!videoId) {
      console.error('Could not extract video ID from URL:', url);
      return '';
    }
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    console.log('Converted to embed URL:', embedUrl);
    return embedUrl;
  } catch (error) {
    console.error('Error converting YouTube URL:', error);
    return '';
  }
};

const PrenatalCare = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(12);
  const [currentTip, setCurrentTip] = useState(weeklyTips[0]);
  // Define but disable the linter warning
  // eslint-disable-next-line no-unused-vars
  const [userCalories, setUserCalories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customizedDietPlan, setCustomizedDietPlan] = useState(null);
  const [openCaloriesDialog, setOpenCaloriesDialog] = useState(false);
  const [newCalories, setNewCalories] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  
  // State for exercises
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [exercisesError, setExercisesError] = useState(null);
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  const [generalAdvice, setGeneralAdvice] = useState('');
  const [userData, setUserData] = useState(null);
  
  // Add state for dialog inside the component function, near other state variables
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  // Fetch user calories from the database
  useEffect(() => {
    const fetchUserCalories = async () => {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User not authenticated, using default calories');
        const defaultCalories = 2000;
        setUserCalories(defaultCalories);
        customizeDietPlan(defaultCalories);
        setError('Please log in to see your personalized diet plan. Using default values.');
        setLoading(false);
        return;
      }
      
      try {
        // Try multiple approaches to get nutrition data
        let nutritionData = null;
        let dataSource = 'default';
        
        // Approach 1: Try to get nutrition data directly from the nutrition endpoint
        try {
          console.log('Trying to fetch nutrition data from nutrition endpoint...');
          const nutritionResponse = await userAPI.getNutritionData();
          console.log('Nutrition response:', nutritionResponse);
          
          if (nutritionResponse && nutritionResponse.data) {
            console.log('Nutrition data fetched successfully:', nutritionResponse.data);
            nutritionData = nutritionResponse.data;
            dataSource = 'nutrition endpoint';
          }
        } catch (nutritionError) {
          console.error('Error fetching nutrition data from nutrition endpoint:', nutritionError);
        }
        
        // Approach 2: If nutrition endpoint fails, try user profile
        if (!nutritionData || !nutritionData.calories) {
          try {
            console.log('Trying to fetch nutrition data from user profile...');
            const profileResponse = await userAPI.getProfile();
            console.log('Profile response:', profileResponse);
            
            if (profileResponse && profileResponse.data) {
              const user = profileResponse.data;
              console.log('User profile data fetched:', user);
              
              // Check if nutrition data is available in healthInfo
              if (user.healthInfo && user.healthInfo.nutrition && user.healthInfo.nutrition.calories) {
                nutritionData = user.healthInfo.nutrition;
                dataSource = 'user profile (healthInfo.nutrition)';
              } 
              // Check if nutrition data is available at top level
              else if (user.calories) {
                nutritionData = {
                  calories: user.calories,
                  protein: user.protein,
                  carbohydrates: user.carbohydrates,
                  fats: user.fats
                };
                dataSource = 'user profile (top level)';
              }
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
        }
        
        // Approach 3: If user profile fails, try auth endpoint
        if (!nutritionData || !nutritionData.calories) {
          try {
            console.log('Trying to fetch nutrition data from auth endpoint...');
            const authResponse = await authAPI.getCurrentUser();
            console.log('Auth response:', authResponse);
            
            if (authResponse && authResponse.data) {
              const user = authResponse.data;
              console.log('User data fetched from auth API:', user);
              
              // Check if nutrition data is available in healthInfo
              if (user.healthInfo && user.healthInfo.nutrition && user.healthInfo.nutrition.calories) {
                nutritionData = user.healthInfo.nutrition;
                dataSource = 'auth endpoint (healthInfo.nutrition)';
              } 
              // Check if nutrition data is available at top level
              else if (user.calories) {
                nutritionData = {
                  calories: user.calories,
                  protein: user.protein,
                  carbohydrates: user.carbohydrates,
                  fats: user.fats
                };
                dataSource = 'auth endpoint (top level)';
              }
            }
          } catch (authError) {
            console.error('Error fetching user data from auth API:', authError);
          }
        }
        
        // Approach 4: If all API calls fail, use dietPlanService as fallback
        if (!nutritionData || !nutritionData.calories) {
          try {
            console.log('Trying to fetch nutrition data from dietPlanService...');
            const dietPlanData = await dietPlanService.getUserCalories();
            console.log('Diet plan service response:', dietPlanData);
            
            if (dietPlanData && dietPlanData.calories) {
              nutritionData = {
                calories: dietPlanData.calories
              };
              dataSource = 'diet plan service';
            }
          } catch (dietPlanError) {
            console.error('Error fetching nutrition data from dietPlanService:', dietPlanError);
          }
        }
        
        // Use the nutrition data if available, otherwise use default values
        if (nutritionData && nutritionData.calories) {
          console.log(`Using nutrition data from ${dataSource}:`, nutritionData);
          const calories = parseInt(nutritionData.calories);
          setUserCalories(calories);
          customizeDietPlan(calories);
          
          // Show data source in UI
          if (dataSource !== 'nutrition endpoint') {
            setError(`Using nutrition data from ${dataSource}. Some values may be calculated.`);
          }
        } else {
          console.log('No nutrition data available, using default values');
          const defaultCalories = 2000;
          setUserCalories(defaultCalories);
          customizeDietPlan(defaultCalories);
          setError('Could not fetch your personalized nutrition data. Using default values.');
        }
      } catch (err) {
        console.error('Error in fetchUserCalories:', err);
        
        // Use default calories if there's an error
        const defaultCalories = 2000;
        setUserCalories(defaultCalories);
        customizeDietPlan(defaultCalories);
        setError(`Failed to fetch personalized data: ${err.message}. Using default values.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCalories();
  }, []);
  
  // Function to handle manual calorie update
  const handleUpdateCalories = async () => {
    if (!newCalories || isNaN(newCalories) || Number(newCalories) <= 0) {
      setUpdateError('Please enter a valid calorie value');
      return;
    }
    
    setUpdateLoading(true);
    setUpdateError(null);
    
    try {
      const data = await dietPlanService.updateUserCalories(Number(newCalories));
      setUserCalories(data.calories);
      customizeDietPlan(data.calories);
      setOpenCaloriesDialog(false);
      setNewCalories('');
    } catch (err) {
      console.error('Error updating calories:', err);
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Function to customize diet plan based on calories
  const customizeDietPlan = (calories) => {
    console.log('Customizing diet plan with calories:', calories);
    
    // Ensure calories is a number
    calories = parseInt(calories) || 2000;
    
    // Calculate macronutrient distribution (example: 50% carbs, 30% fat, 20% protein)
    const carbCalories = calories * 0.5;
    const fatCalories = calories * 0.3;
    const proteinCalories = calories * 0.2;
    
    // Convert to grams (carbs: 4 cal/g, fat: 9 cal/g, protein: 4 cal/g)
    const carbGrams = Math.round(carbCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);
    const proteinGrams = Math.round(proteinCalories / 4);
    
    // Distribute calories across meals (example: 25% breakfast, 30% lunch, 35% dinner, 10% snacks)
    const breakfastCalories = Math.round(calories * 0.25);
    const lunchCalories = Math.round(calories * 0.30);
    const dinnerCalories = Math.round(calories * 0.35);
    const snacksCalories = Math.round(calories * 0.10);
    
    const dietPlan = {
      totalCalories: calories,
      macros: {
        carbs: carbGrams,
        fat: fatGrams,
        protein: proteinGrams
      },
      mealCalories: {
        breakfast: breakfastCalories,
        lunch: lunchCalories,
        dinner: dinnerCalories,
        snacks: snacksCalories
      }
    };
    
    console.log('Customized diet plan:', dietPlan);
    setCustomizedDietPlan(dietPlan);
  };
  
  // Update current tip when week changes
  useEffect(() => {
    const tip = weeklyTips.find(tip => tip.week === currentWeek) || weeklyTips[0];
    setCurrentTip(tip);
  }, [currentWeek]);

  // Fetch user data and recommended exercises
  useEffect(() => {
    const fetchUserDataAndExercises = async () => {
      setExercisesLoading(true);
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('User not logged in, using default exercises');
          setRecommendedExercises(addVideoUrlsToExercises(exerciseData));
          setExercisesLoading(false);
          return;
        }
        
        // Fetch user profile data
        const userProfileResponse = await userAPI.getProfile();
        if (!userProfileResponse || !userProfileResponse.data) {
          throw new Error('Failed to fetch user profile data');
        }
        
        const user = userProfileResponse.data;
        setUserData(user);
        console.log('User profile data:', user);
        
        // Prepare request body for exercise recommendations
        const requestBody = {
          age: user.age || 30,
          weight: user.weight || 65,
          height: user.height || 165,
          medical_conditions: user.healthInfo?.medicalConditions || [],
          joint_pain: user.healthInfo?.hasJointPain ? [user.healthInfo.jointPainType || 'back'] : [],
          is_prenatal: true,
          trimester: user.pregnancyDetails?.trimester || 2
        };
        
        console.log('Sending exercise recommendation request:', requestBody);
        
        // Fetch exercise recommendations
        const response = await fetch('https://hm0034-4stack-1.onrender.com/api/recommend-exercises', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch exercise recommendations: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Exercise recommendations received:', data);
        
        if (data.recommendations && data.recommendations.length > 0) {
          console.log('Exercise image paths:', data.recommendations.map(ex => ex.image));
          // Add video URLs to the recommendations
          setRecommendedExercises(addVideoUrlsToExercises(data.recommendations));
          setGeneralAdvice(data.advice || '');
        } else {
          console.log('No recommendations found, using default exercises');
          setRecommendedExercises(addVideoUrlsToExercises(exerciseData));
        }
      } catch (error) {
        console.error('Error fetching exercise recommendations:', error);
        setExercisesError('Failed to load personalized exercise recommendations. Showing default exercises instead.');
        setRecommendedExercises(addVideoUrlsToExercises(exerciseData));
      } finally {
        setExercisesLoading(false);
      }
    };
    
    fetchUserDataAndExercises();
  }, []);
  
  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.log('No image path provided, using placeholder');
      return "https://via.placeholder.com/300x200?text=Exercise+Image";
    }
    
    // If it's a full URL, use it directly
    if (imagePath.startsWith('http')) {
      console.log(`Using direct URL: ${imagePath}`);
      return imagePath;
    }
    
    // If it's a relative path from the API starting with /assets/excercise_image
    if (imagePath.startsWith('/assets/excercise_image')) {
      // Note: The folder name has a typo in it (excercise instead of exercise)
      const localUrl = `/assets/excercise_image/${imagePath.split('/').pop()}`;
      console.log(`Using local exercise image path: ${localUrl}`);
      return localUrl;
    }
    
    // If it's a relative path from the API starting with /assets
    if (imagePath.startsWith('/assets')) {
      const localUrl = `/assets${imagePath.substring(7)}`;
      console.log(`Using local assets path: ${localUrl}`);
      return localUrl;
    }
    
    // If it's a relative path without /assets prefix but with a filename
    if (imagePath.startsWith('/') && imagePath.includes('.')) {
      const filename = imagePath.split('/').pop();
      const localUrl = `/assets/excercise_image/${filename}`;
      console.log(`Using extracted filename for path: ${localUrl}`);
      return localUrl;
    }
    
    // Default fallback
    console.log(`Using original path: ${imagePath}`);
    return imagePath;
  };

  // Add these functions inside the component function, before the return statement
  const handleOpenDialog = (exercise) => {
    console.log('Opening dialog with exercise:', exercise);
    setSelectedExercise(exercise);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    console.log('Closing dialog');
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Title */}
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 700, 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          mb: 4
        }}
      >
        Your Prenatal Care Journey
      </Typography>

      {/* Week Selection */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            disabled={currentWeek <= 12}
            onClick={() => setCurrentWeek(prev => Math.max(12, prev - 1))}
          >
            Previous Week
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 600, minWidth: '120px', textAlign: 'center' }}>
            Week {currentWeek}
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            disabled={currentWeek >= 14}
            onClick={() => setCurrentWeek(prev => Math.min(14, prev + 1))}
          >
            Next Week
          </Button>
        </Box>
      </Box>

      {/* Weekly Tip Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <Card 
          elevation={3}
          sx={{ 
            mb: 5, 
            borderRadius: 2,
            overflow: 'hidden',
            background: 'linear-gradient(to right, #f8f9fa, #e9ecef)'
          }}
        >
          <Grid container>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                height="100%"
                image={currentTip.image}
                alt={currentTip.title}
                sx={{ 
                  height: { xs: '200px', md: '100%' },
                  objectFit: 'cover'
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LightbulbIcon sx={{ color: '#FFD700', mr: 1 }} />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    Week {currentTip.week} Tip: {currentTip.title}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {currentTip.content}
                </Typography>
                  <Button 
                  variant="contained" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                  component={RouterLink}
                  to="/diet-planning"
                  sx={{ 
                    borderRadius: 8,
                    px: 3
                  }}
                >
                  Learn More
                  </Button>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </motion.div>

      {/* Diet Plan Section */}
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            mb: 3,
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: '#4CAF50',
            borderRadius: '2px'
          }
        }}
      >
        Personalized Diet Plan
        </Typography>
        
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 5, background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Loading your personalized diet plan...</Typography>
              <Box sx={{ width: '50%', maxWidth: '400px' }}>
                <LinearProgress color="secondary" />
              </Box>
            </Box>
          ) : error ? (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>Notice</AlertTitle>
              {error}
              {!localStorage.getItem('token') && (
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/login')}
                  >
                    Log In
                  </Button>
                </Box>
              )}
            </Alert>
          ) : null}
          
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#4a4a4a', mb: 3, display: 'flex', alignItems: 'center' }}>
            <RestaurantIcon sx={{ color: '#4CAF50', mr: 1 }} />
            Balanced Nutrition for Pregnancy
                    </Typography>
            
          {customizedDietPlan && (
            <Box sx={{ mb: 4, p: 3, bgcolor: '#f1f8e9', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Your Daily Nutritional Requirements</span>
                {error && error.includes('Using nutrition data from') && (
                  <Chip 
                    size="small" 
                    color="info" 
                    label="Data Source Info" 
                    onClick={() => setError(null)}
                    sx={{ cursor: 'pointer' }}
                  />
                )}
            </Typography>
            
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Total Daily Calories: {customizedDietPlan.totalCalories}
            </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on your profile information
            </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        onClick={() => navigate('/profile')}
                        sx={{ borderRadius: 8 }}
                      >
                        Update Profile
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        size="small"
                        onClick={() => setOpenCaloriesDialog(true)}
                        sx={{ borderRadius: 8 }}
                      >
                        Set Calories
                      </Button>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Recommended Meal Distribution:
            </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label={`Breakfast: ${customizedDietPlan.mealCalories.breakfast} cal`} 
                      sx={{ bgcolor: '#fff3e0', color: '#e65100' }} 
                    />
                    <Chip 
                      label={`Lunch: ${customizedDietPlan.mealCalories.lunch} cal`} 
                      sx={{ bgcolor: '#e3f2fd', color: '#0d47a1' }} 
                    />
                    <Chip 
                      label={`Dinner: ${customizedDietPlan.mealCalories.dinner} cal`} 
                      sx={{ bgcolor: '#ede7f6', color: '#4527a0' }} 
                    />
                    <Chip 
                      label={`Snacks: ${customizedDietPlan.mealCalories.snacks} cal`} 
                      sx={{ bgcolor: '#fce4ec', color: '#880e4f' }} 
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Recommended Macronutrients:
            </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Carbohydrates:</span>
                      <span>{customizedDietPlan.macros.carbs}g</span>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={50} 
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e8f5e9', '& .MuiLinearProgress-bar': { bgcolor: '#66bb6a' } }} 
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Protein:</span>
                      <span>{customizedDietPlan.macros.protein}g</span>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={20} 
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e8f5e9', '& .MuiLinearProgress-bar': { bgcolor: '#42a5f5' } }} 
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Fat:</span>
                      <span>{customizedDietPlan.macros.fat}g</span>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={30} 
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e8f5e9', '& .MuiLinearProgress-bar': { bgcolor: '#ffb74d' } }} 
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
            
            <Typography variant="body1" paragraph>
            A well-balanced diet during pregnancy is essential for your baby's growth and development. Here's a customized meal plan to ensure you're getting all the nutrients you need.
            </Typography>
            
          {/* Breakfast Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#FF9800', borderBottom: '2px solid #FF9800', pb: 1, display: 'inline-block' }}>
              Breakfast Options {customizedDietPlan && `(~${customizedDietPlan.mealCalories.breakfast} calories)`}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {dietPlanData.diet_plan.breakfast.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#4a4a4a' }}>
                        Recipe #{item.recipe_id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {item.comment}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/healthy-recipes/${item.recipe_id}`)}
                        sx={{ borderRadius: 8 }}
                      >
                        View Recipe
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* Lunch Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2196F3', borderBottom: '2px solid #2196F3', pb: 1, display: 'inline-block' }}>
              Lunch Options {customizedDietPlan && `(~${customizedDietPlan.mealCalories.lunch} calories)`}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {dietPlanData.diet_plan.lunch.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#4a4a4a' }}>
                        Recipe #{item.recipe_id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {item.comment}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/healthy-recipes/${item.recipe_id}`)}
                        sx={{ borderRadius: 8 }}
                      >
                        View Recipe
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* Dinner Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#673AB7', borderBottom: '2px solid #673AB7', pb: 1, display: 'inline-block' }}>
              Dinner Options {customizedDietPlan && `(~${customizedDietPlan.mealCalories.dinner} calories)`}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {dietPlanData.diet_plan.dinner.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#4a4a4a' }}>
                        Recipe #{item.recipe_id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {item.comment}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/healthy-recipes/${item.recipe_id}`)}
                        sx={{ borderRadius: 8 }}
                      >
                        View Recipe
                      </Button>
                  </CardContent>
        </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* Snacks Section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#E91E63', borderBottom: '2px solid #E91E63', pb: 1, display: 'inline-block' }}>
              Healthy Snacks {customizedDietPlan && `(~${customizedDietPlan.mealCalories.snacks} calories)`}
                  </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {dietPlanData.diet_plan.snacks.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#4a4a4a' }}>
                        {item.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={`${item.calories} calories`} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f3e5f5', 
                            color: '#9c27b0',
                            fontWeight: 500
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: '#e8f5e9', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32', mb: 2, display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} />
              Nutrition Tips for Pregnancy:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                  <CheckCircleOutlineIcon color="success" />
                      </ListItemIcon>
                <ListItemText primary="Aim for 300-500 additional calories per day during the second and third trimesters." />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                  <CheckCircleOutlineIcon color="success" />
                      </ListItemIcon>
                <ListItemText primary="Include foods rich in folate, iron, calcium, and omega-3 fatty acids." />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                  <CheckCircleOutlineIcon color="success" />
                      </ListItemIcon>
                <ListItemText primary="Stay hydrated by drinking at least 8-10 glasses of water daily." />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                  <CheckCircleOutlineIcon color="success" />
                      </ListItemIcon>
                <ListItemText primary="Limit caffeine intake to less than 200mg per day (about one 12oz cup of coffee)." />
                    </ListItem>
                  </List>
          </Box>
        </Paper>
              </motion.div>

      {/* Common Symptoms Section */}
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          fontWeight: 600, 
          mb: 3,
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: '#FF6B6B',
            borderRadius: '2px'
          }
        }}
      >
        Common Symptoms at Week {currentWeek}
                  </Typography>

      {/* Calories Update Dialog */}
      <Dialog open={openCaloriesDialog} onClose={() => setOpenCaloriesDialog(false)}>
        <DialogTitle>Update Daily Calorie Goal</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
            Enter your new daily calorie goal. This will be used to customize your diet plan.
                  </Typography>
          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Calories"
            type="number"
            fullWidth
            value={newCalories}
            onChange={(e) => setNewCalories(e.target.value)}
            disabled={updateLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCaloriesDialog(false)} disabled={updateLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateCalories} 
            color="primary" 
            disabled={updateLoading}
            startIcon={updateLoading ? <CircularProgress size={20} /> : null}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#4a4a4a' }}>
                Expected Symptoms
              </Typography>
              <List>
                {weeklySymptoms[currentWeek]?.map((symptom, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon>
                      <CheckCircleOutlineIcon color="success" />
                      </ListItemIcon>
                    <ListItemText primary={symptom} />
                    </ListItem>
                ))}
                  </List>
            </Paper>
            </motion.div>
        </Grid>
          
        <Grid item xs={12} md={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#4a4a4a', display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />
                When to Contact Your Doctor
                  </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>Important</AlertTitle>
                Contact your healthcare provider immediately if you experience any of these symptoms:
              </Alert>
              <List>
                <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon>
                    <WarningIcon sx={{ color: '#f44336' }} />
                      </ListItemIcon>
                  <ListItemText primary="Severe abdominal pain or cramping" />
                    </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon>
                    <WarningIcon sx={{ color: '#f44336' }} />
                      </ListItemIcon>
                  <ListItemText primary="Vaginal bleeding or fluid discharge" />
                    </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon>
                    <WarningIcon sx={{ color: '#f44336' }} />
                      </ListItemIcon>
                  <ListItemText primary="Severe headache or visual disturbances" />
                    </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon>
                    <WarningIcon sx={{ color: '#f44336' }} />
                      </ListItemIcon>
                  <ListItemText primary="Sudden swelling of face, hands, or feet" />
                    </ListItem>
                  </List>
            </Paper>
            </motion.div>
          </Grid>
        </Grid>
        
      {/* Recommended Exercises */}
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            mb: 3,
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: '#4ECDC4',
            borderRadius: '2px'
          }
        }}
      >
        <span>Recommended Exercises</span>
        {userData && (
          <Chip 
            label="Personalized" 
            color="secondary" 
            size="small" 
            sx={{ ml: 2 }} 
          />
        )}
            </Typography>
            
      {exercisesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress color="secondary" />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading your personalized exercise plan...</Typography>
        </Box>
      ) : (
      <motion.div
          variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
          {exercisesError && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {exercisesError}
            </Alert>
          )}
          
          {generalAdvice && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Personalized Advice
        </Typography>
              <Typography variant="body2">
                {generalAdvice}
              </Typography>
            </Alert>
          )}
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
            {recommendedExercises.map((exercise, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div variants={itemVariants}>
                <Card 
                    elevation={2} 
                  sx={{ 
                      height: '100%', 
                    display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 2,
                    overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                      }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                      height="180"
                      image={getImageUrl(exercise.image)}
                    alt={exercise.name}
                      onError={(e) => {
                        console.error(`Failed to load image: ${e.target.src}`);
                        e.target.src = "https://via.placeholder.com/300x200?text=Exercise+Image";
                      }}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 2
                      }}
                    >
                      <Typography variant="h6" component="h3" sx={{ color: 'white', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                      {exercise.name}
                    </Typography>
                      {exercise.videoUrl && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            borderRadius: '50%',
                            p: 1,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(exercise.videoUrl, '_blank');
                          }}
                        >
                          <PlayCircleOutlineIcon sx={{ color: 'white', fontSize: 40 }} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {exercise.duration && (
                      <Chip 
                          icon={<FitnessCenterIcon />} 
                          label={`Duration: ${exercise.duration}`} 
                        size="small" 
                          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}
                      />
                      )}
                      {exercise.frequency && (
                      <Chip 
                          icon={<EmojiEventsIcon />} 
                          label={`Frequency: ${exercise.frequency}`} 
                        size="small" 
                          sx={{ bgcolor: '#e3f2fd', color: '#1565c0' }}
                        />
                      )}
                      {exercise.videoUrl && (
                        <Chip 
                          icon={<YouTubeIcon />} 
                          label="Video" 
                          size="small" 
                          sx={{ bgcolor: '#ffebee', color: '#c62828' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(exercise.videoUrl, '_blank');
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {exercise.description.length > 100 
                        ? `${exercise.description.substring(0, 100)}...` 
                        : exercise.description}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      fullWidth
                      onClick={() => handleOpenDialog(exercise)}
                      sx={{ 
                        mt: 'auto',
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
      )}

      {/* Diet Recommendations */}
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            mb: 3,
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: '#FF6B6B',
            borderRadius: '2px'
          }
        }}
      >
        Nutritional Recommendations
        </Typography>
        
      <Box sx={{ mb: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Nutrition Tip</AlertTitle>
          During week {currentWeek}, focus on foods rich in {currentWeek === 12 ? 'calcium and vitamin D' : currentWeek === 13 ? 'iron and folate' : 'omega-3 fatty acids'} to support your baby's development.
        </Alert>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {dietRecommendations.map((food, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <motion.div variants={itemVariants}>
                <Card 
                  sx={{ 
                    display: 'flex', 
                    height: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 150 }}
                    image={food.image}
                    alt={food.name}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                      <Typography component="h3" variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {food.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {food.comment}
                    </Typography>
                  </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 2 }}>
                    <Button 
                        size="small" 
                        endIcon={<ArrowForwardIcon />}
                        component={RouterLink}
                        to="/diet-planning"
                      >
                        View Recipe
                    </Button>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Self-Care Recommendations */}
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            mb: 3,
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: '#9C27B0',
            borderRadius: '2px'
          }
        }}
      >
        Self-Care Recommendations
        </Typography>
        
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {selfCareRecommendations.map((recommendation, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div variants={itemVariants}>
        <Card 
                  elevation={2} 
                          sx={{ 
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#9C27B0', mr: 2 }}>
                        {recommendation.icon}
                      </Avatar>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {recommendation.title}
                          </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {recommendation.description}
                          </Typography>
                    {recommendation.benefits && (
                      <>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Benefits:
                          </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {recommendation.benefits.map((benefit, idx) => (
                          <Chip 
                            key={idx} 
                            label={benefit} 
                            size="small" 
                              sx={{ bgcolor: '#f3e5f5', color: '#6a1b9a' }}
                          />
                        ))}
                            </Box>
                      </>
                    )}
                    {recommendation.options && (
                      <>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Options:
                      </Typography>
                      <List dense>
                          {recommendation.options.map((option, idx) => (
                            <ListItem key={idx} sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: '30px' }}>
                                <CheckCircleOutlineIcon color="success" />
                          </ListItemIcon>
                              <ListItemText primary={option} />
                        </ListItem>
                          ))}
                      </List>
                      </>
                    )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Call to Action */}
      <Box 
          sx={{ 
          textAlign: 'center', 
          py: 4,
          px: 3,
          borderRadius: 4,
          background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
          color: 'white',
          boxShadow: '0 8px 16px rgba(255, 107, 107, 0.3)',
          mb: 4
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Track Your Pregnancy Journey
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}>
          Keep a record of your symptoms, appointments, and milestones to share with your healthcare provider and create lasting memories of this special time.
                  </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/meal-logging')}
          sx={{ 
            bgcolor: 'white', 
            color: '#FF6B6B',
            '&:hover': {
              bgcolor: '#f5f5f5'
            },
            px: 4,
            py: 1.5,
            borderRadius: 8,
            fontWeight: 600
          }}
        >
          Start Tracking Now
        </Button>
                      </Box>

      {/* Exercise Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        aria-labelledby="exercise-dialog-title"
        aria-describedby="exercise-dialog-description"
      >
        {selectedExercise && (
          <>
            <DialogTitle id="exercise-dialog-title" sx={{ pb: 1, pr: 7 }}>
              {selectedExercise.name}
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                <Box sx={{ flex: '0 0 40%', maxWidth: { xs: '100%', md: '40%' } }}>
                  {selectedExercise.videoUrl ? (
                    <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                      <iframe
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 0
                        }}
                        src={getYouTubeEmbedUrl(selectedExercise.videoUrl)}
                        title={`${selectedExercise.name} video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </Box>
                  ) : (
                    <img 
                      src={getImageUrl(selectedExercise.image)} 
                      alt={selectedExercise.name} 
                      style={{ 
                        width: '100%', 
                        borderRadius: '8px', 
                        maxHeight: '300px', 
                        objectFit: 'cover' 
                      }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${e.target.src}`);
                        e.target.src = "https://via.placeholder.com/300x200?text=Exercise+Image";
                      }}
                    />
                  )}
                  
                  {!selectedExercise.videoUrl && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                      No video available for this exercise
                      </Typography>
                  )}
                    </Box>
                <Box sx={{ flex: '1 1 60%' }}>
                  <Typography variant="h6" gutterBottom>
                    Description
                      </Typography>
                      <Typography variant="body1" paragraph>
                    {selectedExercise.description}
                      </Typography>
                  
                  {selectedExercise.benefits && selectedExercise.benefits.length > 0 && (
                    <>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Benefits
                      </Typography>
                      <List dense disablePadding>
                        {selectedExercise.benefits.map((benefit, index) => (
                          <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircleOutlineIcon color="success" />
                          </ListItemIcon>
                            <ListItemText primary={benefit} />
                        </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {selectedExercise.duration && (
                      <Chip 
                        icon={<FitnessCenterIcon />} 
                        label={`Duration: ${selectedExercise.duration}`} 
                        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}
                      />
                    )}
                    {selectedExercise.frequency && (
                      <Chip 
                        icon={<EmojiEventsIcon />} 
                        label={`Frequency: ${selectedExercise.frequency}`} 
                        sx={{ bgcolor: '#e3f2fd', color: '#1565c0' }}
                      />
                    )}
                          </Box>
                          </Box>
                          </Box>
              
              {selectedExercise.steps && selectedExercise.steps.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    How to Perform
                      </Typography>
                <List>
                    {selectedExercise.steps.map((step, index) => (
                      <ListItem key={index} alignItems="flex-start" sx={{ py: 1 }}>
                        <ListItemIcon sx={{ mt: 0 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 28, height: 28, fontSize: 14 }}>
                            {index + 1}
                  </Avatar>
                    </ListItemIcon>
                        <ListItemText primary={step} />
                  </ListItem>
                    ))}
                </List>
                </>
              )}
              
              {selectedExercise.precautions && selectedExercise.precautions.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3, color: 'warning.dark' }}>
                    Precautions
                  </Typography>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <List dense disablePadding>
                      {selectedExercise.precautions.map((precaution, index) => (
                        <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                          <ListItemText primary={precaution} />
                  </ListItem>
                      ))}
                </List>
                  </Alert>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default PrenatalCare; 