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
  Button
} from '@mui/material';
import { 
  RestaurantMenu, 
  MenuBook, 
  LocalDining,
  TrendingUp
} from '@mui/icons-material';

function Diet() {
  const features = [
    {
      title: "Diet Planning",
      description: "Get personalized diet plans and nutrition guidelines for a healthy pregnancy.",
      icon: <MenuBook sx={{ fontSize: 40 }} />,
      path: "/diet-planning",
      image: "/assets/diet-planning.jpg"
    },
    {
      title: "Healthy Recipes",
      description: "Discover pregnancy-friendly recipes that are both nutritious and delicious.",
      icon: <RestaurantMenu sx={{ fontSize: 40 }} />,
      path: "/healthy-recipes",
      image: "/assets/healthy-recipes.jpg"
    },
    {
      title: "Meal Logging",
      description: "Track your daily meals and monitor nutritional intake with smart insights.",
      icon: <LocalDining sx={{ fontSize: 40 }} />,
      path: "/meal-logging",
      image: "/assets/meal-logging.jpg"
    }
  ];

  return (
    <Box sx={{ py: 6, bgcolor: '#FFF5F8' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: '#2D3748',
            textAlign: 'center'
          }}
        >
          Pregnancy Nutrition Hub
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardActionArea 
                  component={RouterLink} 
                  to={feature.path}
                  sx={{ flexGrow: 1 }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={feature.image}
                    alt={feature.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      color: '#FF5A8C'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2"
                      sx={{ fontWeight: 600, color: '#2D3748' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          </Grid>
      </Container>
    </Box>
  );
}

export default Diet; 