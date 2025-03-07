import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  useTheme,
  Paper,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

// Component for fade-in animations when scrolling
const FadeInSection = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

// Exercise card component with enhanced hover effects and animations
const ExerciseCard = ({ title, description, image, link, delay }) => {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <FadeInSection delay={delay}>
      <Card
        sx={{
          height: '450px',
          width: '100%',
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
          transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex', // Ensure card is displayed as flex
          flexDirection: 'column', // Stack children vertically
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.07)',
            '& .card-overlay': {
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
            },
            '& .card-image': {
              transform: 'scale(1.03)',
            },
            '& .card-button': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#6B8E76',
              transform: 'translateY(-5px)',
            }
          },
        }}
      >
        {/* Loading spinner */}
        {!imageLoaded && (
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              zIndex: 10
            }}
          >
            <Box 
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: '#fff',
                animation: 'spin 1s infinite linear',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} 
            />
          </Box>
        )}
        
        {/* Background Image */}
        <CardMedia
          component="img"
          image={image}
          alt={title}
          className="card-image"
          onLoad={() => setImageLoaded(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            zIndex: 1,
            transition: 'transform 0.8s ease',
          }}
        />
        
        {/* Overlay Gradient */}
        <Box 
          className="card-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%)',
            zIndex: 2,
            transition: 'background 0.5s ease',
          }}
        />
        
        {/* Trimester Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#6B8E76',
            borderRadius: '30px',
            padding: '8px 16px',
            fontWeight: 600,
            fontSize: '0.85rem',
            zIndex: 3,
            boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          }}
        >
          {title}
        </Box>
        
        {/* Content Container - positioned at bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '30px',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* Title */}
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{ 
              color: 'white',
              fontWeight: 600,
              mb: 2,
              fontFamily: "'Playfair Display', serif",
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {title}
          </Typography>
          
          {/* Description */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 3,
              lineHeight: 1.6,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {description}
          </Typography>
          
          {/* Button */}
          <Button 
            component={RouterLink} 
            to={link} 
            className="card-button"
            variant="contained" 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: '#6B8E76',
              borderRadius: '30px',
              padding: '10px 24px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.4s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              }
            }}
          >
            Explore Exercises
          </Button>
        </Box>
      </Card>
    </FadeInSection>
  );
};

// Rotating quotes component
const MotivationalQuote = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = [
    "Taking care of yourself is taking care of your baby.",
    "Movement is a celebration of what your body can do.",
    "Every step counts on your pregnancy journey.",
    "Gentle movement today means strength for tomorrow.",
    "Your body is creating life - honor it with mindful movement."
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [quotes.length]);
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      my: 5,
      p: 4,
      borderRadius: 3,
      bgcolor: 'rgba(214, 228, 218, 0.2)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(214, 228, 218, 0.15) 0%, rgba(224, 213, 235, 0.15) 100%)',
        zIndex: 0
      }
    }}>
      <FormatQuoteIcon sx={{ 
        fontSize: 40, 
        color: '#A0BFA7',
        mr: 2,
        transform: 'rotate(180deg)' 
      }} />
      <Typography 
        variant="h6" 
        component="p" 
        fontStyle="italic"
        fontWeight="500"
        sx={{ 
          color: '#6B8E76',
          textAlign: 'center',
          fontFamily: "'Playfair Display', serif",
          animation: 'fadeIn 2.5s',
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 }
          }
        }}
      >
        {quotes[quoteIndex]}
      </Typography>
      <FormatQuoteIcon sx={{ 
        fontSize: 40, 
        color: '#A0BFA7',
        ml: 2 
      }} />
    </Box>
  );
};

function Exercises() {
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Exercise data for each trimester
  const trimesterExercises = [
    {
      id: 1,
      title: 'First Trimester',
      description: 'Safe, gentle exercises to start your pregnancy journey. Focus on building core strength and maintaining fitness with low-impact activities like walking, swimming, and prenatal yoga.',
      image: '/assets/exercises/trimester1.jpg',
      link: '/exercises/first-trimester'
    },
    {
      id: 2,
      title: 'Second Trimester',
      description: 'Maintain your fitness routine with modified exercises as your body changes. Incorporate pelvic floor exercises, gentle stretching, and modified strength training for this stage.',
      image: '/assets/exercises/trimester2.jpg',
      link: '/exercises/second-trimester'
    },
    {
      id: 3,
      title: 'Third Trimester',
      description: 'Prepare for labor with exercises focused on pelvic strength and relaxation techniques. Gentle movements, breathing exercises, and stretches to ease discomfort and prepare for birth.',
      image: '/assets/exercises/trimester3.jpg',
      link: '/exercises/third-trimester'
    }
  ];

  return (
    <Box sx={{ 
      overflowX: 'hidden', 
      py: 6,
      position: 'relative',
      backgroundColor: '#F9F8F6',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'linear-gradient(180deg, rgba(214, 228, 218, 0.3) 0%, rgba(255,255,255,0) 100%)',
        zIndex: -1
      }
    }}>
      <Container maxWidth="xl">
        {/* Enhanced Page Header with Gradient */}
        <FadeInSection>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #6B8E76 30%, #B8A7CC 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                position: 'relative',
                display: 'inline-block',
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.03)',
                animation: 'glow 4s infinite alternate',
                '@keyframes glow': {
                  '0%': { textShadow: '0 0 5px rgba(107, 142, 118, 0.2)' },
                  '100%': { textShadow: '0 0 12px rgba(107, 142, 118, 0.4)' }
                }
              }}
            >
              Empower Your Pregnancy Journey with Movement
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mb: 3,
                color: '#A0BFA7'
              }}
            >
              <FitnessCenterIcon sx={{ 
                fontSize: 36, 
                mr: 1,
                animation: 'gentleBounce 3s infinite ease-in-out',
                '@keyframes gentleBounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-8px)' }
                }
              }} />
            </Box>
            <Typography 
              variant="h6" 
              component="p" 
              sx={{ 
                maxWidth: 800, 
                mx: 'auto', 
                color: '#6B8E76',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Gentle exercises can make you feel energized, reduce stress, and prepare your body for childbirth. Let's take small steps together!
            </Typography>
          </Box>
        </FadeInSection>

        {/* Motivational Quote */}
        <MotivationalQuote />

        {/* Trimester Cards with Enhanced Design */}
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            mb: 4,
            alignItems: 'stretch',
          }}
        >
          {trimesterExercises.map((exercise, index) => (
            <Grid 
              item 
              xs={12} 
              md={4} 
              key={exercise.id}
              sx={{ 
                display: 'flex', // Ensure grid item is displayed as flex
                flexDirection: 'column', // Stack children vertically
              }}
            >
              <ExerciseCard
                title={exercise.title}
                description={exercise.description}
                image={exercise.image}
                link={exercise.link}
                delay={0.2 * index}
              />
            </Grid>
          ))}
        </Grid>

        {/* Animated Call-to-Action */}
        <FadeInSection delay={0.4}>
          <Box 
            sx={{ 
              mt: 6, 
              textAlign: 'center',
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(214, 228, 218, 0.2) 0%, rgba(224, 213, 235, 0.2) 100%)',
              border: '1px solid rgba(214, 228, 218, 0.4)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                top: '-50%',
                left: '-50%',
                animation: 'gentleRipple 20s infinite linear',
                '@keyframes gentleRipple': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }
            }}
          >
            <Typography 
              variant="h5" 
              component="p"
              sx={{ 
                fontWeight: 500,
                color: '#6B8E76',
                fontFamily: "'Playfair Display', serif",
                position: 'relative',
                zIndex: 1
              }}
            >
              Every step counts! Let's make this journey enjoyable and empowering.
            </Typography>
          </Box>
        </FadeInSection>

        {/* Benefits Section with Updated Colors */}
        <FadeInSection delay={0.5}>
          <Box sx={{ 
            mt: 8, 
            p: 4, 
            bgcolor: 'rgba(214, 228, 218, 0.2)', 
            borderRadius: 4,
            border: '1px solid rgba(214, 228, 218, 0.4)'
          }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 600,
                color: '#6B8E76',
                fontFamily: "'Playfair Display', serif",
                mb: 3,
                textAlign: 'center'
              }}
            >
              Benefits of Exercising During Pregnancy
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {[
                { title: 'Reduced Back Pain', description: 'Regular exercise strengthens muscles and improves posture, reducing pregnancy-related back pain.' },
                { title: 'Improved Mood', description: 'Physical activity releases endorphins that boost your mood and reduce stress and anxiety.' },
                { title: 'Better Sleep', description: 'Regular exercise can help you fall asleep more easily and enjoy deeper sleep.' },
                { title: 'Increased Energy', description: 'Consistent activity improves circulation and cardiovascular health, giving you more energy.' },
                { title: 'Easier Labor', description: 'Strengthened muscles and improved endurance can make labor and delivery easier.' },
                { title: 'Faster Recovery', description: 'Maintaining fitness during pregnancy helps your body recover more quickly after birth.' }
              ].map((benefit, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper elevation={0} sx={{ 
                    p: 3, 
                    height: '100%', 
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'transform 0.4s, box-shadow 0.4s',
                    border: '1px solid rgba(214, 228, 218, 0.4)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 15px rgba(0,0,0,0.03)',
                    },
                  }}>
                    <Typography variant="h6" component="h3" sx={{ color: '#6B8E76', fontWeight: 600 }} gutterBottom>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5E7A66' }}>
                      {benefit.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </FadeInSection>

        {/* Safety Tips */}
        <FadeInSection delay={0.6}>
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 600,
                color: '#B8A7CC',
                fontFamily: "'Playfair Display', serif",
                mb: 3
              }}
            >
              Exercise Safety Tips
            </Typography>
            <Typography variant="body1" sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              mb: 4,
              color: '#6B8E76',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}>
              Always consult with your healthcare provider before starting any exercise routine during pregnancy. 
              Listen to your body and stop if you feel pain, dizziness, or shortness of breath.
            </Typography>
          </Box>
        </FadeInSection>
      </Container>
    </Box>
  );
}

export default Exercises;
