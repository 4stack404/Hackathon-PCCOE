import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Diet() {
  const [activeSection, setActiveSection] = useState(null);

  const dietTips = [
    "Increase your caloric intake by about 300-500 calories per day during pregnancy",
    "Focus on nutrient-dense foods rather than empty calories",
    "Aim for 70-100 grams of protein daily to support your baby's growth",
    "Include foods rich in folate, iron, calcium, and omega-3 fatty acids",
    "Stay hydrated by drinking at least 8-10 glasses of water daily",
    "Limit caffeine to less than 200mg per day (about one 12oz cup of coffee)"
  ];

  const mealPlanSample = [
    {
      meal: "Breakfast",
      options: [
        "Greek yogurt with berries and granola",
        "Whole grain toast with avocado and a boiled egg",
        "Spinach and cheese omelet with whole grain toast"
      ]
    },
    {
      meal: "Lunch",
      options: [
        "Quinoa salad with chickpeas, vegetables, and feta cheese",
        "Whole grain wrap with hummus, vegetables, and grilled chicken",
        "Lentil soup with a side salad and whole grain bread"
      ]
    },
    {
      meal: "Dinner",
      options: [
        "Grilled salmon with sweet potato and steamed broccoli",
        "Whole grain pasta with tomato sauce, vegetables, and lean ground turkey",
        "Stir-fried tofu with brown rice and mixed vegetables"
      ]
    },
    {
      meal: "Snacks",
      options: [
        "Apple slices with almond butter",
        "Carrot sticks with hummus",
        "A handful of nuts and dried fruits",
        "Whole grain crackers with cheese"
      ]
    }
  ];

  const popularRecipes = [
    {
      title: "Pregnancy Power Smoothie",
      image: "/assets/blueberry-smoothie.webp",
      description: "Packed with folate, protein, and calcium - perfect for morning sickness!",
      ingredients: ["1 banana", "1 cup spinach", "1 cup milk or plant-based alternative", "1 tbsp nut butter", "1 tbsp chia seeds", "½ cup frozen berries"]
    },
    {
      title: "Iron-Rich Lentil Soup",
      image: "/assets/lentil-soup.jpg",
      description: "A hearty soup to boost your iron levels during pregnancy.",
      ingredients: ["1 cup red lentils", "1 onion, diced", "2 carrots, diced", "2 celery stalks, diced", "4 cups vegetable broth", "2 tbsp olive oil", "2 cloves garlic, minced", "1 tsp cumin"]
    },
    {
      title: "Calcium-Boosting Chia Pudding",
      image: "/assets/chia-pudding.jpg",
      description: "Make ahead for a nutritious breakfast or snack.",
      ingredients: ["¼ cup chia seeds", "1 cup milk or plant-based alternative", "1 tbsp honey or maple syrup", "½ tsp vanilla extract", "Fresh fruits for topping"]
    }
  ];

  const renderDietPlanning = () => (
    <Box>
      <Typography variant="h5" component="h3" sx={{ mb: 3, color: '#2D3748', fontWeight: 600 }}>
        Nutrition During Pregnancy
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#FF5A8C', fontWeight: 600 }}>
              Key Nutrition Tips
            </Typography>
            <List>
              {dietTips.map((tip, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#FF5A8C', fontWeight: 600 }}>
              Foods to Avoid
            </Typography>
            <List>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                </ListItemIcon>
                <ListItemText primary="Raw or undercooked meat, poultry, fish, and eggs" />
              </ListItem>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                </ListItemIcon>
                <ListItemText primary="Unpasteurized dairy products and juices" />
              </ListItem>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                </ListItemIcon>
                <ListItemText primary="High-mercury fish (shark, swordfish, king mackerel, tilefish)" />
              </ListItem>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                </ListItemIcon>
                <ListItemText primary="Raw sprouts and unwashed produce" />
              </ListItem>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                </ListItemIcon>
                <ListItemText primary="Excessive caffeine (limit to 200mg per day)" />
              </ListItem>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#FF5A8C' }} />
                </ListItemIcon>
                <ListItemText primary="Alcohol (no safe amount during pregnancy)" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      <Typography variant="h5" component="h3" sx={{ mt: 5, mb: 3, color: '#2D3748', fontWeight: 600 }}>
        Sample Meal Plan
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {mealPlanSample.map((mealTime, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ 
                p: 2, 
                bgcolor: index % 2 === 0 ? '#FFF0F3' : 'white', 
                height: '100%',
                borderRadius: 2,
                border: '1px solid #FFD6E0'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#FF5A8C', fontWeight: 600 }}>
                  {mealTime.meal}
                </Typography>
                <List dense>
                  {mealTime.options.map((option, optIndex) => (
                    <ListItem key={optIndex} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <RestaurantIcon fontSize="small" sx={{ color: '#FF5A8C' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={option} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { fontWeight: 500 }
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained"
          onClick={() => setActiveSection('recipes')}
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            backgroundColor: '#FF5A8C',
            '&:hover': { backgroundColor: '#e64c7f' },
            py: 1.5,
            px: 4,
            borderRadius: 2,
          }}
        >
          Explore Healthy Recipes
        </Button>
      </Box>
    </Box>
  );

  const renderRecipes = () => (
    <Box>
      <Typography variant="h5" component="h3" sx={{ mb: 3, color: '#2D3748', fontWeight: 600 }}>
        Pregnancy-Friendly Recipes
      </Typography>
      
      <Grid container spacing={4}>
        {popularRecipes.map((recipe, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={recipe.image}
                alt={recipe.title}
                onError={(e) => {
                  e.target.src = '/assets/placeholder-food.jpg';
                }}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" sx={{ mb: 1, color: '#FF5A8C', fontWeight: 600 }}>
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {recipe.description}
                </Typography>
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
      
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h3" sx={{ mb: 3, color: '#2D3748', fontWeight: 600 }}>
          Trimester-Specific Nutrition
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%', 
                borderRadius: 2,
                borderTop: '4px solid #FF5A8C'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#FF5A8C', fontWeight: 600 }}>
                First Trimester
              </Typography>
              <Typography variant="body2" paragraph>
                Focus on folate-rich foods like leafy greens, citrus fruits, and fortified cereals to support neural tube development.
              </Typography>
              <Typography variant="body2" paragraph>
                If experiencing morning sickness, try small, frequent meals and ginger-containing foods to ease nausea.
              </Typography>
              <Typography variant="body2">
                Stay hydrated with water, herbal teas, and electrolyte drinks if vomiting is frequent.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%', 
                borderRadius: 2,
                borderTop: '4px solid #FF5A8C'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#FF5A8C', fontWeight: 600 }}>
                Second Trimester
              </Typography>
              <Typography variant="body2" paragraph>
                Increase calcium intake with dairy products, fortified plant milks, and leafy greens for bone development.
              </Typography>
              <Typography variant="body2" paragraph>
                Add more iron-rich foods like lean meats, beans, and spinach to support increased blood volume.
              </Typography>
              <Typography variant="body2">
                Include omega-3 fatty acids from fish, walnuts, and flaxseeds for brain development.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%', 
                borderRadius: 2,
                borderTop: '4px solid #FF5A8C'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#FF5A8C', fontWeight: 600 }}>
                Third Trimester
              </Typography>
              <Typography variant="body2" paragraph>
                Focus on vitamin D and calcium for final bone development and preparation for breastfeeding.
              </Typography>
              <Typography variant="body2" paragraph>
                Include more fiber-rich foods to combat constipation and maintain digestive health.
              </Typography>
              <Typography variant="body2">
                Eat smaller, more frequent meals to accommodate reduced stomach capacity as baby grows.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained"
          onClick={() => setActiveSection('dietPlanning')}
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            backgroundColor: '#FF5A8C',
            '&:hover': { backgroundColor: '#e64c7f' },
            py: 1.5,
            px: 4,
            borderRadius: 2,
          }}
        >
          Back to Diet Planning
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box component="main" sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          sx={{ 
            mb: 2, 
            fontWeight: 600, 
            color: '#2D3748',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Pregnancy Nutrition
        </Typography>
        
        <Typography 
          variant="h6" 
          component="p" 
          align="center" 
          sx={{ 
            mb: 6, 
            fontWeight: 400, 
            color: '#4A5568',
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          Proper nutrition during pregnancy is crucial for both you and your baby's health. 
          Explore our diet planning resources and pregnancy-friendly recipes.
        </Typography>
        
        {/* Main Cards */}
        {!activeSection && (
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => setActiveSection('dietPlanning')}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image="/assets/diet-planning.jpg"
                    alt="Diet Planning"
                    onError={(e) => {
                      e.target.src = '/assets/placeholder-diet.jpg';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <CalendarMonthIcon sx={{ fontSize: 60, color: '#FF5A8C', mb: 2 }} />
                    <Typography gutterBottom variant="h4" component="h2" sx={{ fontWeight: 600, color: '#2D3748' }}>
                      Diet Planning
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Get personalized nutrition guidance for each trimester, meal planning tips, 
                      and learn about essential nutrients for a healthy pregnancy.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => setActiveSection('recipes')}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image="/assets/recipes.jpg"
                    alt="Healthy Recipes"
                    onError={(e) => {
                      e.target.src = '/assets/placeholder-recipes.jpg';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <RestaurantIcon sx={{ fontSize: 60, color: '#FF5A8C', mb: 2 }} />
                    <Typography gutterBottom variant="h4" component="h2" sx={{ fontWeight: 600, color: '#2D3748' }}>
                      Healthy Recipes
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Discover delicious, nutrient-rich recipes designed specifically for pregnant women, 
                      addressing common pregnancy symptoms and nutritional needs.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {/* Detailed Content */}
        {activeSection === 'dietPlanning' && renderDietPlanning()}
        {activeSection === 'recipes' && renderRecipes()}
        
        {/* Back Button (only when viewing detailed content) */}
        {activeSection && (
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Button 
              variant="outlined"
              onClick={() => setActiveSection(null)}
              sx={{ 
                color: '#FF5A8C',
                borderColor: '#FF5A8C',
                '&:hover': { 
                  borderColor: '#e64c7f',
                  backgroundColor: 'rgba(255, 90, 140, 0.1)'
                },
                py: 1,
                px: 4
              }}
            >
              Back to Main Options
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Diet; 