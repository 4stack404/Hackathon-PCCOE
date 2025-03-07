import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Personalized Pregnancy Journey',
    description: 'Track your pregnancy milestones with customized guidance and support.',
    image: '/assets/backdrop3.jpg',
    buttonText: 'Get Started',
    buttonLink: '/signup'
  },
  {
    id: 2,
    title: 'Expert Nutrition Advice',
    description: 'Receive tailored nutrition plans and meal suggestions for a healthy pregnancy.',
    image: '/assets/backdrop3.jpg',
    buttonText: 'Learn More',
    buttonLink: '/signup'
  },
  {
    id: 3,
    title: 'Prenatal & Postnatal Care',
    description: 'Comprehensive care guides for before and after your baby arrives.',
    image: '/assets/backdrop3.jpg',
    buttonText: 'Explore',
    buttonLink: '/signup'
  },
  {
    id: 4,
    title: 'Community Support',
    description: 'Connect with other expecting mothers and share your journey together.',
    image: '/assets/backdrop3.jpg',
    buttonText: 'Join Now',
    buttonLink: '/signup'
  }
];

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', height: { xs: '60vh', md: '70vh' }, width: '100%' }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
              zIndex: 1
            }}
          />
          <Container 
            maxWidth="lg"
            sx={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              px: { xs: 2, md: 4 }
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: { xs: 3, md: 5 },
                borderRadius: 4,
                backdropFilter: 'blur(6px)',
                transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
                transitionDelay: '0.2s',
                width: { xs: '100%', md: '80%' },
                maxWidth: '800px'
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.4rem', md: '3.5rem' },
                  color: '#FFFFFF',
                  mb: 2,
                  lineHeight: 1.1,
                  fontFamily: "'Montserrat', sans-serif",
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                  letterSpacing: '1px',
                }}
              >
                {slide.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: '#F5F5F5',
                  fontSize: { xs: '1.4rem', md: '1.7rem' },
                  lineHeight: 1.6,
                  fontWeight: 500,
                  maxWidth: '700px',
                  mx: 'auto',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                  fontFamily: "'Quicksand', sans-serif",
                }}
              >
                {slide.description}
              </Typography>
              <Button
                component={RouterLink}
                to={slide.buttonLink}
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 1.8,
                  fontSize: '1.3rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  fontFamily: "'Quicksand', sans-serif",
                }}
              >
                {slide.buttonText}
              </Button>
            </Box>
          </Container>
        </Box>
      ))}

      {/* Navigation Arrows */}
      {!isMobile && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: { xs: 20, md: 40 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.35)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.3s ease',
              zIndex: 2,
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: { xs: 20, md: 40 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.35)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.3s ease',
              zIndex: 2,
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}

      {/* Indicator Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: index === currentSlide ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              '&:hover': {
                bgcolor: index === currentSlide ? '#FFFFFF' : 'rgba(255,255,255,0.8)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Carousel;