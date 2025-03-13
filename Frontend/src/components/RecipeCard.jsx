import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip, 
  Grid, 
  Divider 
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// Define animation variants
const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const RecipeCard = ({ recipe, comment, onClick }) => {
  const theme = useTheme();
  
  if (!recipe) return null;

  // Get nutritionInfo from recipe data
  const nutritionInfo = recipe.nutritionInfo || {};
  
  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[8]
          }
        }}
        onClick={() => onClick(recipe)}
      >
        <CardMedia
          component="img"
          height="140"
          image={recipe.image || "/assets/recipes/default.jpg"}
          alt={recipe.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom component="div">
            {recipe.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {recipe.description}
          </Typography>
          
          {comment && (
            <Typography variant="body2" color="primary" sx={{ 
              fontStyle: 'italic', 
              mt: 1,
              p: 1,
              borderLeft: `3px solid ${theme.palette.primary.main}`,
              bgcolor: 'rgba(0, 0, 0, 0.03)',
              mb: 2
            }}>
              {comment}
            </Typography>
          )}
          
          <Box sx={{ mt: 'auto' }}>
            {/* Time and Servings Info */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 2 
            }}>
              <Chip 
                size="small" 
                label={`${recipe.prepTime}`} 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                size="small" 
                label={`${recipe.servings} servings`} 
                color="secondary" 
                variant="outlined"
              />
            </Box>

            {/* Nutrition Info */}
            <Divider sx={{ mb: 2 }} />
            
            {/* Calories Display - using recipe.calories directly */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                p: 1,
                bgcolor: theme.palette.primary.light,
                borderRadius: 2,
                color: 'white'
              }}
            >
              <LocalFireDepartmentIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                {recipe.calories} calories
              </Typography>
            </Box>

            {/* Macronutrients */}
            <Grid container spacing={1}>
              {/* Protein */}
              <Grid item xs={4}>
                <Box sx={{ 
                  textAlign: 'center',
                  bgcolor: 'background.default',
                  p: 1,
                  borderRadius: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {nutritionInfo.protein}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Protein
                  </Typography>
                </Box>
              </Grid>
              
              {/* Carbs */}
              <Grid item xs={4}>
                <Box sx={{ 
                  textAlign: 'center',
                  bgcolor: 'background.default',
                  p: 1,
                  borderRadius: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {nutritionInfo.carbs}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Carbs
                  </Typography>
                </Box>
              </Grid>
              
              {/* Fat */}
              <Grid item xs={4}>
                <Box sx={{ 
                  textAlign: 'center',
                  bgcolor: 'background.default',
                  p: 1,
                  borderRadius: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {nutritionInfo.fat}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fat
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecipeCard; 