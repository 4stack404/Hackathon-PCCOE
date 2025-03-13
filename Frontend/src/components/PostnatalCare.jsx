import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Typography, Grid, Card, CardContent, CardMedia, Button, Divider, Container, Paper, 
  List, ListItem, ListItemIcon, ListItemText, Chip, Tabs, Tab, Checkbox, LinearProgress,
  FormControlLabel, FormGroup, Switch, useTheme, useMediaQuery, IconButton, Tooltip,
  Avatar, Badge, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, CircularProgress
} from '@mui/material';
import { 
  CheckCircle, LocalDining, FitnessCenter, Healing, ArrowForward, HealthAndSafety,
  CalendarToday, CalendarViewWeek, CalendarViewMonth, Notifications, NotificationsActive,
  CheckBoxOutlineBlank, CheckBox, Info, WbSunny, NightsStay, ChildCare, Face, Celebration,
  Add, Edit, Delete, Save, Close, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Favorite, FavoriteBorder, Star, StarBorder, EmojiEvents, Timeline, BarChart, Warning
} from '@mui/icons-material';
import { dietPlanService } from '../services/dietPlanService';
import { userAPI } from '../services/api';

const PostnatalCare = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for recipes and diet plan
  // eslint-disable-next-line no-unused-vars
  const [allRecipes, setAllRecipes] = useState([]);
  const [personalDietPlan, setPersonalDietPlan] = useState(null);
  const [dietSuggestions, setDietSuggestions] = useState({
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: []
  });
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  
  // State for exercises
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [exercisesError, setExercisesError] = useState(null);
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  const [generalAdvice, setGeneralAdvice] = useState('');
  const [userData, setUserData] = useState(null);
  
  // Fetch personal diet plan from database
  useEffect(() => {
    const fetchPersonalDietPlan = async () => {
      setLoading(true);
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('User not logged in, using default diet plan');
          fetchDefaultRecipes();
          setLoading(false);
          return;
        }
        
        // Try to get the user's saved diet plan
        const dietPlanData = await dietPlanService.getSavedDietPlan();
        console.log('Fetched diet plan data:', dietPlanData);
        
        if (dietPlanData && dietPlanData.diet_plan) {
          setPersonalDietPlan(dietPlanData);
          // Fetch all recipes to get details for the diet plan
          const recipesResponse = await fetch('/recipes.json');
          const recipesData = await recipesResponse.json();
          setAllRecipes(recipesData);
          
          // Map recipe IDs to full recipe objects
          const breakfast = dietPlanData.diet_plan.breakfast.map(item => {
            const recipe = recipesData.find(r => r.id === item.recipe_id);
            return recipe ? { ...recipe, comment: item.comment } : null;
          }).filter(Boolean);
          
          const lunch = dietPlanData.diet_plan.lunch.map(item => {
            const recipe = recipesData.find(r => r.id === item.recipe_id);
            return recipe ? { ...recipe, comment: item.comment } : null;
          }).filter(Boolean);
          
          const dinner = dietPlanData.diet_plan.dinner.map(item => {
            const recipe = recipesData.find(r => r.id === item.recipe_id);
            return recipe ? { ...recipe, comment: item.comment } : null;
          }).filter(Boolean);
          
          // For snacks, we already have the full data
          const snack = dietPlanData.diet_plan.snacks || [];
        
        setDietSuggestions({
            breakfast,
            lunch,
            dinner,
            snack
          });
          
          console.log('Personalized diet plan loaded successfully');
        } else {
          console.log('No saved diet plan found, using default recipes');
          fetchDefaultRecipes();
        }
      } catch (error) {
        console.error('Error fetching personal diet plan:', error);
        setError('Failed to load your personalized diet plan. Showing default recommendations instead.');
        fetchDefaultRecipes();
      } finally {
        setLoading(false);
      }
    };
    
    fetchPersonalDietPlan();
  }, []);
  
  // Fetch user data and recommended exercises
  useEffect(() => {
    const fetchUserDataAndExercises = async () => {
      setExercisesLoading(true);
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('User not logged in, using default exercises');
          setRecommendedExercises(recoveryExercises);
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
          is_prenatal: false,
          age: user.age || 30,
          weight: user.weight || 65,
          medical_conditions: user.healthInfo?.medicalConditions || [],
          joint_pains: user.healthInfo?.hasJointPain ? [user.healthInfo.jointPainType || 'back'] : []
        };
        
        console.log('Exercise recommendation request:', requestBody);
        
        // Fetch exercise recommendations
        const exerciseResponse = await fetch('https://hm0034-4stack-1.onrender.com/api/recommend-exercises', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!exerciseResponse.ok) {
          throw new Error(`Failed to fetch exercise recommendations: ${exerciseResponse.status}`);
        }
        
        const exerciseData = await exerciseResponse.json();
        console.log('Exercise recommendations:', exerciseData);
        
        if (exerciseData.detailed_exercises && exerciseData.detailed_exercises.length > 0) {
          setRecommendedExercises(exerciseData.detailed_exercises);
          setGeneralAdvice(exerciseData.recommendations?.general_advice || '');
        } else {
          console.log('No exercise recommendations found, using default exercises');
          setRecommendedExercises(recoveryExercises);
        }
      } catch (error) {
        console.error('Error fetching exercise recommendations:', error);
        setExercisesError('Failed to load personalized exercise recommendations. Showing default exercises instead.');
        setRecommendedExercises(recoveryExercises);
      } finally {
        setExercisesLoading(false);
      }
    };
    
    fetchUserDataAndExercises();
  }, []);
  
  // Fetch default recipes if no personalized diet plan is available
  const fetchDefaultRecipes = async () => {
    try {
      const response = await fetch('/recipes.json');
      const data = await response.json();
      setAllRecipes(data);
        
        // Organize recipes into meal categories
        const breakfast = data.filter(recipe => 
          recipe.title.toLowerCase().includes('oatmeal') || 
          recipe.title.toLowerCase().includes('toast') || 
          recipe.title.toLowerCase().includes('breakfast')
        ).slice(0, 3);
        
        const lunch = data.filter(recipe => 
          recipe.title.toLowerCase().includes('salad') || 
          recipe.title.toLowerCase().includes('soup') || 
          recipe.title.toLowerCase().includes('wrap')
        ).slice(0, 3);
        
        const snack = data.filter(recipe => 
        recipe.title.toLowerCase().includes('smoothie') || 
          recipe.title.toLowerCase().includes('yogurt') || 
        recipe.title.toLowerCase().includes('snack')
        ).slice(0, 3);
        
        const dinner = data.filter(recipe => 
          recipe.title.toLowerCase().includes('chicken') || 
        recipe.title.toLowerCase().includes('fish') || 
        recipe.title.toLowerCase().includes('pasta')
        ).slice(0, 3);
        
        setDietSuggestions({
        breakfast,
        lunch,
        snack,
        dinner
      });
    } catch (error) {
      console.error('Error loading recipes:', error);
      setError('Failed to load recipes. Please try again later.');
    }
  };
  
  // Function to handle recipe click
  const handleRecipeClick = (recipeId) => {
    navigate(`/healthy-recipes/${recipeId}`);
  };

  // Function to render meal section
  const renderMealSection = (title, mealType) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#6a1b9a' }}>
        {title}
        {personalDietPlan && <Chip 
          size="small" 
          label="Personalized" 
          color="secondary" 
          sx={{ ml: 1, fontSize: '0.7rem' }} 
        />}
      </Typography>
      <Grid container spacing={2}>
        {dietSuggestions[mealType].map((recipe, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <CardMedia
                component="img"
                height="140"
                image={recipe.image || "https://via.placeholder.com/300x200?text=Recipe+Image"}
                alt={recipe.title}
              />
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {recipe.title}
                </Typography>
                {recipe.comment && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    "{recipe.comment}"
                </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocalDining sx={{ color: '#6a1b9a', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {recipe.calories} calories
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Function to render snacks section
  const renderSnacksSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#6a1b9a' }}>
        Healthy Snacks
        {personalDietPlan && <Chip 
                  size="small" 
          label="Personalized" 
          color="secondary" 
          sx={{ ml: 1, fontSize: '0.7rem' }} 
        />}
      </Typography>
      <Grid container spacing={2}>
        {dietSuggestions.snack.map((snack, index) => (
              <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ height: '100%' }}>
                    <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {snack.name || snack.title}
                        </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {snack.description || snack.ingredients?.join(', ')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <LocalDining sx={{ color: '#6a1b9a', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                    {snack.calories} calories
                      </Typography>
                </Box>
                    </CardContent>
                  </Card>
              </Grid>
            ))}
          </Grid>
          </Box>
  );

  // Sample data for recovery exercises (fallback)
  const recoveryExercises = [
    {
      name: "Pelvic Floor Exercises (Kegels)",
      description: "Strengthens the pelvic floor muscles that support the uterus, bladder, and bowels.",
      benefits: ["Reduces urinary incontinence", "Speeds healing of perineal tissues", "Improves core stability"],
      steps: [
        "Contract your pelvic floor muscles (as if stopping urination midstream) for 5 seconds, then relax for 5 seconds.",
        "Repeat 10 times, 3 times daily."
      ],
      precautions: [
        "Avoid holding your breath while doing Kegels.",
        "Don't engage your thighs or glutes—focus only on pelvic muscles."
      ],
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      video: "https://www.youtube.com/watch?v=xKXlmZP1jCY"
    },
    {
      name: "Gentle Walking",
      description: "Low-impact cardiovascular exercise that improves circulation and mood without straining your body.",
      benefits: ["Boosts energy levels", "Reduces risk of blood clots", "Improves mental wellbeing"],
      steps: [
        "Start with 5-10 minute walks around your home or neighborhood.",
        "Gradually increase duration as you feel stronger."
      ],
      precautions: [
        "Wear supportive shoes",
        "Stay hydrated",
        "Stop if you feel pain or excessive fatigue"
      ],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      video: "https://www.youtube.com/watch?v=njeZ29umqVE"
    },
    {
      name: "Gentle Abdominal Contractions",
      description: "Helps restore tone to abdominal muscles that were stretched during pregnancy.",
      benefits: ["Improves posture", "Reduces back pain", "Strengthens core"],
      steps: [
        "Lie on your back with knees bent.",
        "Exhale and gently draw your belly button toward your spine.",
        "Hold for 5 seconds, then release.",
        "Repeat 10 times."
      ],
      precautions: [
        "Avoid if you had a C-section until cleared by your doctor",
        "Stop if you feel pain"
      ],
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      video: "https://www.youtube.com/watch?v=TdGPOlcmKQI"
    }
  ];

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

    return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#6a1b9a' }}>
        Postnatal Care
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress color="secondary" />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading your personalized diet plan...</Typography>
        </Box>
      ) : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
            {error && (
              <Alert severity="info" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#4a148c', mb: 3 }}>
              Nutrition for Recovery
              {personalDietPlan && (
                <Chip 
                  label="Personalized Plan" 
                  color="secondary" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
                </Typography>
                
            <Typography variant="body1" paragraph>
              Proper nutrition is crucial during the postpartum period to support your recovery, maintain energy levels, and ensure adequate milk production if you're breastfeeding. Here are some nutritious meal suggestions to help you recover and thrive.
                              </Typography>
            
            {renderMealSection('Breakfast Ideas', 'breakfast')}
            {renderMealSection('Lunch Ideas', 'lunch')}
            {renderSnacksSection()}
            {renderMealSection('Dinner Ideas', 'dinner')}
            
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f3e5f5', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4a148c', mb: 1 }}>
                Nutrition Tips for Postpartum Recovery:
                                </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#6a1b9a' }} />
                                      </ListItemIcon>
                                      <ListItemText 
                    primary="Stay hydrated by drinking at least 8-10 glasses of water daily, especially if breastfeeding."
                                      />
                                    </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#6a1b9a' }} />
                                      </ListItemIcon>
                                      <ListItemText 
                    primary="Include iron-rich foods like lean meats, beans, and leafy greens to replenish iron stores after childbirth."
                                      />
                                    </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#6a1b9a' }} />
                                      </ListItemIcon>
                                      <ListItemText 
                    primary="Consume calcium-rich foods such as dairy products, fortified plant milks, and leafy greens for bone health."
                                      />
                                    </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#6a1b9a' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Include protein in every meal to support tissue repair and healing."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#6a1b9a' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Eat fiber-rich foods to prevent constipation, which is common after childbirth."
                  />
                </ListItem>
                                </List>
        </Box>
      </Paper>
    </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#4a148c', mb: 3, display: 'flex', alignItems: 'center' }}>
            <span>Postpartum Recovery Exercises</span>
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
            <>
              <Typography variant="body1" paragraph>
                Gentle exercise can help you recover from childbirth, regain strength, and improve your mood. Always consult with your healthcare provider before starting any postpartum exercise program.
                        </Typography>
              
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
              
              {recommendedExercises.map((exercise, index) => (
      <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <CardMedia
                      component="img"
                      height="100%"
                          image={getImageUrl(exercise.image)}
                      alt={exercise.name}
                          sx={{ height: { xs: '200px', md: '100%' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#4a148c' }}>
                        {exercise.name}
                      </Typography>
                          
                          <Typography variant="body1" paragraph>
                        {exercise.description}
                      </Typography>
                      
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                            Benefits:
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {exercise.benefits.map((benefit, i) => (
                              <Chip 
                                key={i}
                                label={benefit}
                                size="small"
                                sx={{ bgcolor: '#f3e5f5', color: '#6a1b9a' }}
                              />
                            ))}
                          </Box>
                          
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        How to do it:
                      </Typography>
                          
                      <List dense>
                        {exercise.steps.map((step, i) => (
                          <ListItem key={i}>
                                <ListItemIcon>
                                  <CheckCircle sx={{ color: '#6a1b9a', fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText primary={step} />
                          </ListItem>
                        ))}
                      </List>
                      
                          {exercise.precautions && exercise.precautions.length > 0 && (
                            <>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1, color: '#f44336' }}>
                            Precautions:
                          </Typography>
                              
                          <List dense>
                            {exercise.precautions.map((precaution, i) => (
                                  <ListItem key={i}>
                                    <ListItemIcon>
                                      <Warning sx={{ color: '#f44336', fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText primary={precaution} />
                              </ListItem>
                            ))}
                          </List>
                            </>
                          )}
                      
                      <Button 
                            variant="outlined" 
                            color="secondary"
                            startIcon={<FitnessCenter />}
                        href={exercise.video}
                        target="_blank"
                            sx={{ mt: 2 }}
                      >
                        Watch Video Tutorial
                      </Button>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </motion.div>
          ))}
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              Remember: Listen to your body and progress at your own pace. Consistency is more important than intensity.
            </Typography>
          </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default PostnatalCare;