import { Box, Container, Typography, Grid, Paper, useTheme, Button, IconButton } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link as RouterLink } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

import Carousel from '../components/common/Carousel';
import FeatureCard from '../components/common/FeatureCard';

const FadeInSection = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <Box
      ref={ref}
      sx={{
        opacity: 0,
        transform: 'translateY(20px)',
        animation: inView ? `fadeInUp 0.8s ease-out ${delay}s forwards` : 'none',
        '@keyframes fadeInUp': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      {children}
    </Box>
  );
};

function Home() {
  const theme = useTheme();
  const weekScrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device for performance reasons
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollWeeks = (direction) => {
    if (weekScrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      weekScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const features = [
    {
      id: 1,
      icon: <RestaurantMenuIcon fontSize="inherit" />,
      title: 'Food & Diet',
      description: 'Personalized nutrition plans and meal suggestions tailored to your pregnancy stage.',
      link: '#'
    },
    {
      id: 2,
      icon: <CalendarMonthIcon fontSize="inherit" />,
      title: 'Appointments',
      description: 'Keep track of appointments, milestones, and important dates throughout your pregnancy.',
      link: '/appointments'
    },
    {
      id: 3,
      icon: <ChildCareIcon fontSize="inherit" />,
      title: 'Prenatal & Postnatal Care',
      description: 'Expert guidance for before and after your baby arrives, with personalized care plans.',
      link: '/care'
    },
    {
      id: 4,
      icon: <DashboardIcon fontSize="inherit" />,
      title: 'Dashboard',
      description: 'Monitor your progress, track important metrics, and get a complete overview of your journey.',
      link: '/dashboard'
    },
    {
      id: 5,
      icon: <FitnessCenterIcon fontSize="inherit" />,
      title: 'Pregnancy Exercises',
      description: 'Safe and effective exercises for each trimester to keep you healthy and prepare for delivery.',
      link: '/exercises'
    }
  ];

  const weekImages = {
    2: `/assets/baby-size/fruit-week-2-Photoroom.png`,
    3: '/assets/baby-size/fruit-week-3-Photoroom.png',
    4: '/assets/baby-size/fruit-week-4-Photoroom.png',
    5: '/assets/baby-size/fruit-week-5-Photoroom.png',
    6: '/assets/baby-size/fruit-week-6-Photoroom.png',
    7: '/assets/baby-size/fruit-week-7-Photoroom.png',
    8: '/assets/baby-size/fruit-week-8-Photoroom.png',
    9: '/assets/baby-size/fruit-week-9-Photoroom.png',
    10: '/assets/baby-size/fruit-week-10-Photoroom.png',
    11: '/assets/baby-size/fruit-week-11-Photoroom.png',
    12: '/assets/baby-size/fruit-week-12-Photoroom.png',
    13: '/assets/baby-size/fruit-week-13-Photoroom.png',
    14: '/assets/baby-size/fruit-week-14-Photoroom.png',
    15: '/assets/baby-size/fruit-week-15-Photoroom.png',
    16: '/assets/baby-size/fruit-week-16-Photoroom.png',
    17: '/assets/baby-size/fruit-week-17-Photoroom.png',
    18: '/assets/baby-size/fruit-week-18-Photoroom.png',
    19: '/assets/baby-size/fruit-week-19-Photoroom.png',
    20: '/assets/baby-size/fruit-week-20-Photoroom.png',
    21: '/assets/baby-size/fruit-week-21-Photoroom.png',
    22: '/assets/baby-size/fruit-week-22-Photoroom.png',
    23: '/assets/baby-size/fruit-week-23-Photoroom.png',
    24: '/assets/baby-size/fruit-week-24-Photoroom.png',
    25: '/assets/baby-size/fruit-week-25-Photoroom.png',
    26: '/assets/baby-size/fruit-week-26-Photoroom.png',
    27: '/assets/baby-size/fruit-week-27-Photoroom.png',
    28: '/assets/baby-size/fruit-week-28-Photoroom.png',
    29: '/assets/baby-size/fruit-week-29-Photoroom.png',
    30: '/assets/baby-size/fruit-week-30-Photoroom.png',
    31: '/assets/baby-size/fruit-week-31-Photoroom.png',
    32: '/assets/baby-size/fruit-week-32-Photoroom.png',
    33: '/assets/baby-size/fruit-week-33-Photoroom.png',
    34: '/assets/baby-size/fruit-week-34-Photoroom.png',
    35: '/assets/baby-size/fruit-week-35-Photoroom.png',
    36: '/assets/baby-size/fruit-week-36-Photoroom.png',
    37: '/assets/baby-size/fruit-week-37-Photoroom.png',
    38: '/assets/baby-size/fruit-week-38-Photoroom.png',
    39: '/assets/baby-size/fruit-week-39-Photoroom.png',
    40: '/assets/baby-size/fruit-week-40-Photoroom.png',
    41: '/assets/baby-size/fruit-week-41-Photoroom.png',
  };

  return (
    <Box sx={{ overflowX: 'hidden', overflowY: 'hidden' }}>
      {/* Hero Carousel Section */}
      <Box sx={{ 
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Carousel />
      </Box>

      {/* Pregnancy Week Tracker Section */}
      <Box
        sx={{
          py: 6,
          bgcolor: 'white',
          position: 'relative'
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 4,
              fontWeight: 600,
              color: '#ff1493',
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 3,
                bgcolor: '#ec407a',
                borderRadius: 2
              }
            }}
          >
            My pregnancy week by week
          </Typography>

          <Box
            sx={{
              position: 'relative',
              width: '100%',
              py: 2
            }}
          >
            <IconButton
              onClick={() => scrollWeeks('left')}
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            
            <Box 
              ref={weekScrollRef}
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                scrollbarWidth: 'none',  // Hide scrollbar for Firefox
                msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
                '&::-webkit-scrollbar': {
                  display: 'none',       // Hide scrollbar for Chrome/Safari/Opera
                },
                scrollBehavior: 'smooth',
                px: 4,
                mx: -2,
                width: 'calc(100% - 16px)',
              }}
            >
              {[...Array(39)].map((_, index) => {
                const week = index + 3; // Start from week 3
                return (
                  <Box
                    key={week}
                    component={RouterLink}
                    to={`/week/${week}`}
                    sx={{
                      minWidth: { xs: 130, sm: 140, md: 150 },
                      height: 120,
                      background: "#5e35b1",
                      borderRadius: 2,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'transform 0.2s, box-shadow 0.2s, background 0.3s',
                      textDecoration: 'none',
                      color: 'white',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        background: 'linear-gradient(135deg, #5e35b1 0%, #7c4dff 100%)',
                      },
                      flexShrink: 0,
                    }}
                  >
                    {weekImages[week] && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          right: 12,
                          transform: 'translateY(-50%)',
                          width: 40,
                          height: 40,
                        }}
                      >
                        <img
                          src={weekImages[week]}
                          alt={`Week ${week}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            opacity: 0.85,
                          }}
                        />
                      </Box>
                    )}

                    <Typography
                      variant="h3"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.8rem',
                      }}
                    >
                      {week}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 500,
                      }}
                    >
                      weeks
                    </Typography>
                    <Typography
                      sx={{
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 500,
                      }}
                    >
                      pregnant
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <IconButton
              onClick={() => scrollWeeks('right')}
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Main Features Section */}
      <FadeInSection delay={0.2}>
        <Box id="features" sx={{ py: 8, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h2" 
              component="h2" 
              align="center" 
              gutterBottom
              sx={{ 
                mb: 6,
                color: '#2C3E50'
              }}
            >
              Our Features
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={feature.id}>
                  <FadeInSection delay={index * 0.2}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        bgcolor: 'white',
                        border: '2px solid #4A90E2',
                        borderRadius: 4,
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.05)',
                          boxShadow: '0 20px 40px rgba(74, 144, 226, 0.2)',
                          border: '2px solid #2980B9',
                          perspective: '1000px',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(74,144,226,0.1) 0%, rgba(41,128,185,0.05) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease-in-out',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        className="feature-icon"
                        sx={{
                          fontSize: '3rem',
                          color: '#4A90E2',
                          mb: 2,
                          transition: 'all 0.3s ease-in-out',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        className="feature-title"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          color: '#2C3E50',
                          textAlign: 'center',
                          transition: 'color 0.3s ease-in-out',
                          fontFamily: "'Quicksand', sans-serif",
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#666',
                          textAlign: 'center',
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          fontFamily: "'Quicksand', sans-serif",
                        }}
                      >
                        {feature.description}
                      </Typography>
                      <Button
                        component={RouterLink}
                        to={feature.link}
                        variant="text"
                        sx={{
                          mt: 2,
                          color: '#4A90E2',
                          display: 'block',
                          margin: '20px auto 0',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: '#2980B9',
                            transform: 'translateX(5px)',
                          },
                          '&::after': {
                            content: '"→"',
                            marginLeft: '5px',
                            transition: 'transform 0.3s ease',
                          },
                          '&:hover::after': {
                            transform: 'translateX(5px)',
                          },
                        }}
                      >
                        Learn More
                      </Button>
                    </Paper>
                  </FadeInSection>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </FadeInSection>

      {/* Quote Section */}
      <FadeInSection>
        <Box 
          sx={{ 
            py: 8, 
            bgcolor: 'rgba(255, 192, 203, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -100,
              right: -100,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,105,180,0.05) 0%, rgba(255,20,147,0.02) 100%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,105,180,0.05) 0%, rgba(255,20,147,0.02) 100%)',
            }
          }}
        >
          <Container maxWidth="md">
            <Box 
              sx={{ 
                position: 'relative',
                textAlign: 'center',
                py: 4,
                px: { xs: 2, md: 6 },
                borderRadius: 4,
                animation: 'fadeIn 1s ease-out',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              <FormatQuoteIcon 
                sx={{ 
                  fontSize: 60, 
                  color: '#FF1493',
                  opacity: 0.8,
                  mb: 2,
                  transform: 'rotate(8deg)',
                  animation: 'floatQuote 3s ease-in-out infinite',
                  '@keyframes floatQuote': {
                    '0%, 100%': { transform: 'rotate(8deg) translateY(0)' },
                    '50%': { transform: 'rotate(8deg) translateY(-10px)' }
                  }
                }} 
              />
              <Typography 
                variant="h4" 
                component="blockquote"
                sx={{ 
                  fontStyle: 'italic',
                  fontWeight: 500,
                  mb: 3,
                  color: '#2C3E50',
                  lineHeight: 1.6,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontFamily: "'Playfair Display', serif",
                  position: 'relative',
                  '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    width: 40,
                    height: 3,
                    background: 'linear-gradient(90deg, #FF69B4 0%, #FF1493 100%)',
                    borderRadius: 2,
                  },
                  '&::before': {
                    left: '50%',
                    top: -20,
                    transform: 'translateX(-50%)',
                  },
                  '&::after': {
                    left: '50%',
                    bottom: -20,
                    transform: 'translateX(-50%)',
                  },
                  animation: 'slideIn 1s ease-out',
                  '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateX(-20px)' },
                    to: { opacity: 1, transform: 'translateX(0)' }
                  }
                }}
              >
                "Pregnancy is a journey that transforms not just your body, but your entire perspective on life and love."
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#FF1493',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  fontFamily: "'Quicksand', sans-serif",
                  opacity: 0.9,
                  mt: 4,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50%',
                    height: 2,
                    background: 'linear-gradient(90deg, #FF69B4 0%, #FF1493 100%)',
                    borderRadius: 1,
                  },
                  animation: 'fadeUp 1s ease-out 0.5s both',
                  '@keyframes fadeUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                — Dr. Sarah Johnson
              </Typography>
              <Typography
                sx={{
                  color: '#666',
                  fontSize: '0.9rem',
                  mt: 1,
                  animation: 'fadeUp 1s ease-out 0.7s both'
                }}
              >
                Pregnancy Wellness Expert
              </Typography>
            </Box>
          </Container>
        </Box>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <Box 
          sx={{ 
            py: 10, 
            bgcolor: 'primary.main',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            clipPath: 'polygon(0 10%, 100% 0, 100% 100%, 0 100%)', // Creates slanted top edge
            mt: -5, // Pull up slightly to show the slant
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,105,180,0.2) 0%, rgba(255,20,147,0.1) 100%)',
              animation: 'shimmer 3s infinite linear',
              '@keyframes shimmer': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' }
              }
            }
          }}
        >
          <Container maxWidth="md">
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontFamily: "'Playfair Display', serif",
                animation: 'slideDown 1s ease-out',
                '@keyframes slideDown': {
                  from: { opacity: 0, transform: 'translateY(-30px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              Ready to Start Your Wellness Journey?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4,
                opacity: 0.9,
                maxWidth: '700px',
                mx: 'auto',
                fontFamily: "'Quicksand', sans-serif",
                animation: 'fadeIn 1s ease-out 0.3s both',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              Join thousands of expecting mothers who have transformed their pregnancy experience with our personalized wellness platform.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
                mt: 4,
                animation: 'fadeUp 1s ease-out 0.6s both',
                '@keyframes fadeUp': {
                  from: { opacity: 0, transform: 'translateY(30px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: '#FF1493',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Sign Up Now
              </Button>
              <Button
                component={RouterLink}
                to="/about"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
            </Box>
            
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: '20%',
                left: '5%',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                animation: 'pulse 3s infinite ease-in-out',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' }
                }
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                animation: 'pulse 3s infinite ease-in-out 1.5s'
              }}
            />
          </Container>
        </Box>
      </FadeInSection>
    </Box>
  );
}

export default Home;