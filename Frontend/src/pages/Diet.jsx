import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Container, IconButton, 
  useTheme, useMediaQuery, Card
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { COLORS } from '../theme/colors';

const sections = [
  {
    id: 'mealLogging',
    title: 'Meal Logging',
    subtitle: 'Track Your Journey',
    description: 'Log your meals effortlessly with our intuitive tracking system',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    path: '/meal-logging',
    icon: RestaurantMenuIcon,
    color: COLORS.primary,
    features: ['Smart Tracking', 'Visual Analytics', 'Nutritional Insights']
  },
  {
    id: 'dietPlanning',
    title: 'Diet Planning',
    subtitle: 'Personalized For You',
    description: 'Get customized diet plans that match your lifestyle',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    path: '/diet-planning',
    icon: LocalDiningIcon,
    color: '#FF92B4',
    features: ['AI-Powered Plans', 'Flexible Options', 'Expert Guidance']
  },
  {
    id: 'healthyRecipes',
    title: 'Healthy Recipes',
    subtitle: 'Cook with Confidence',
    description: 'Discover delicious recipes that nourish your body',
    image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg',
    path: '/healthy-recipes',
    icon: MenuBookIcon,
    color: '#FF6B9C',
    features: ['Easy to Follow', 'Nutritionist Approved', 'Diet Friendly']
  }
];

const Diet = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isHovering, setIsHovering] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    hover: {
      scale: 1.02,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const featureVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const backgroundVariants = {
    initial: { scale: 1.2, opacity: 0.3 },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: { duration: 20, repeat: Infinity, repeatType: "reverse" }
    }
  };

  return (
    <Container maxWidth={false} sx={{ 
      minHeight: '100vh',
      background: '#FFF5F8',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated background patterns */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.4 }}>
        <motion.div
          variants={backgroundVariants}
          initial="initial"
          animate="animate"
          style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at center, transparent 0%, transparent 50%, #FFE5EC 100%)',
            top: '-50%',
            left: '-50%',
          }}
        />
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', py: 8, position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FF92B4 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 2,
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
              Pregnancy Nutrition Hub
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                mb: 6,
                fontWeight: 500
              }}
            >
              Nourish your body and your baby with our specialized tools
            </Typography>
          </motion.div>
        </Box>

        {/* Cards Section */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 4,
          px: 4,
          pb: 8
        }}>
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              variants={cardVariants}
              whileHover="hover"
              onHoverStart={() => setIsHovering(index)}
              onHoverEnd={() => setIsHovering(null)}
            >
              <Card sx={{
                height: '100%', 
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: isHovering === index 
                  ? `0 20px 40px rgba(0,0,0,0.12), 0 0 0 2px ${section.color}`
                  : '0 8px 24px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate(section.path)}
              >
                <Box sx={{
                  height: 200,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <motion.img
                    src={section.image}
                    alt={section.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(to bottom, transparent, ${section.color}88)`
                  }} />
                </Box>

                <Box sx={{ p: 3 }}>
                  <Typography 
                    variant="overline" 
                    sx={{ 
                      color: section.color, 
                      fontWeight: 600,
                      letterSpacing: 1.2
                    }}
                  >
                    {section.subtitle}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 700,
                      color: '#2D3748'
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6
                    }}
                  >
                    {section.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {section.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        variants={featureVariants}
                        initial="hidden"
                        animate="visible"
                        custom={idx}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: section.color
                        }}>
                          <section.icon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography 
                            variant="body2"
                            sx={{ fontWeight: 500 }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>

                <Box sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  opacity: isHovering === index ? 1 : 0,
                  transform: `translateX(${isHovering === index ? 0 : -20}px)`,
                  transition: 'all 0.3s ease'
                }}>
                  <IconButton 
                    sx={{ 
                      bgcolor: section.color,
                      color: 'white',
                      '&:hover': {
                        bgcolor: section.color,
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Container>
  );
};

export default Diet;