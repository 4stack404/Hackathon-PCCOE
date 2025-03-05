import { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  useTheme, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  Link
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Reusing the FadeInSection component from Home.jsx
const FadeInSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true, threshold: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

function About() {
  const theme = useTheme();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const features = [
    {
      id: 1,
      icon: <PregnantWomanIcon fontSize="large" />,
      title: "Platform for Pregnant women",
      description: "A comprehensive platform providing health and wellness information for expectant mothers, helping them stay informed and confident throughout their pregnancy journey."
    },
    {
      id: 2,
      icon: <CalendarMonthIcon fontSize="large" />,
      title: "Calendar keeping track of all details",
      description: "A calendar tool for tracking doctor's appointments, health progress, important milestones, and other crucial events throughout your pregnancy."
    },
    {
      id: 3,
      icon: <ChildCareIcon fontSize="large" />,
      title: "Prenatal and postnatal care guidelines",
      description: "Expert information and advice for prenatal and postnatal care, ensuring mothers receive accurate guidance at every stage of their journey.",
      link: "/care"
    },
    {
      id: 4,
      icon: <FavoriteIcon fontSize="large" />,
      title: "Food and diet plans tracking",
      description: "A specialized feature to track food and diet plans during pregnancy, promoting healthy eating habits for both mother and baby."
    }
  ];

  const weekImages = {
    3: '/assets/baby-size/fruit-week-3-Photoroom.png',
    8: '/assets/baby-size/fruit-week-8-Photoroom.png',
    16: '/assets/baby-size/fruit-week-16-Photoroom.png',
    24: '/assets/baby-size/fruit-week-24-Photoroom.png',
    32: '/assets/baby-size/fruit-week-32-Photoroom.png',
    40: '/assets/baby-size/fruit-week-40-Photoroom.png',
  };

  return (
    <Box component="main">
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FFF5F8 0%, #FFD6E5 75%, #FFBCD8 100%)',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <FadeInSection>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: '#FF1493',
                    fontFamily: "'Playfair Display', serif",
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                  }}
                >
                  Comprehensive Pregnancy Support
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    lineHeight: 1.6
                  }}
                >
                  A dedicated platform providing valuable health and wellness information, tracking tools, and care guidelines for expectant mothers.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#FF1493',
                    '&:hover': {
                      bgcolor: '#E6007A',
                    },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(255, 20, 147, 0.4)',
                  }}
                >
                  Explore Week by Week
                </Button>
              </FadeInSection>
            </Grid>
            <Grid item xs={12} md={6}>
              <FadeInSection delay={0.2}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    height: { xs: 300, md: 400 }
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Box
                      component="img"
                      src="/assets/backdrop1.png"
                      alt="Baby development visualization"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </motion.div>
                </Box>
              </FadeInSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Mission Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <FadeInSection>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{
                mb: 6,
                fontWeight: 600,
                color: '#5e35b1',
                fontFamily: "'Playfair Display', serif",
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 3,
                  bgcolor: '#FF1493',
                  borderRadius: 2
                }
              }}
            >
              Our Mission
            </Typography>
          </FadeInSection>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <FadeInSection delay={0.2}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    mb: 3,
                    color: '#FF1493'
                  }}
                >
                  Supporting Expectant Mothers
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: '1.1rem',
                    lineHeight: 1.8
                  }}
                >
                  Our pregnancy tracking website was created with a simple mission: to provide expectant mothers with comprehensive support and guidance throughout their pregnancy journey. We understand that this transformative time requires reliable information and organized tracking tools.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: '1.1rem',
                    lineHeight: 1.8
                  }}
                >
                  We believe that a dedicated platform can provide valuable health and wellness information, helping mothers stay informed and confident. Our calendar feature allows users to keep track of important details such as doctor's appointments and health progress.
                </Typography>
              </FadeInSection>
            </Grid>
            <Grid item xs={12} md={6}>
              <FadeInSection delay={0.4}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    mb: 3,
                    color: '#FF1493'
                  }}
                >
                  Comprehensive Care Guidelines
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: '1.1rem',
                    lineHeight: 1.8
                  }}
                >
                  We offer prenatal and postnatal care guidelines to ensure mothers receive accurate advice at every stage. Our platform is designed to enhance the pregnancy experience with reliable information and organized tracking tools.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8
                  }}
                >
                  Additionally, our food and diet plan tracking feature promotes a healthy lifestyle, providing nutritional guidance specific to each stage of pregnancy. The objective of our platform is to create a supportive environment that makes the pregnancy journey smoother and more informed.
                </Typography>
              </FadeInSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: '#FFF5F8' }}>
        <Container maxWidth="lg">
          <FadeInSection>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{
                mb: 6,
                fontWeight: 600,
                color: '#5e35b1',
                fontFamily: "'Playfair Display', serif",
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 3,
                  bgcolor: '#FF1493',
                  borderRadius: 2
                }
              }}
            >
              What Makes Us Special
            </Typography>
          </FadeInSection>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={feature.id}>
                <FadeInSection delay={0.2 * index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 4,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        color: '#FF1493',
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: '#5e35b1'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.7
                      }}
                    >
                      {feature.description}
                    </Typography>
                    {feature.link && (
                      <Button
                        component={RouterLink}
                        to={feature.link}
                        variant="text"
                        sx={{
                          color: '#FF1493',
                          fontWeight: 600,
                          mt: 2,
                          p: 0,
                          '&:hover': {
                            background: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Learn More
                      </Button>
                    )}
                  </Paper>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Visual Journey Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <FadeInSection>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{
                mb: 6,
                fontWeight: 600,
                color: '#5e35b1',
                fontFamily: "'Playfair Display', serif",
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 3,
                  bgcolor: '#FF1493',
                  borderRadius: 2
                }
              }}
            >
              Week-by-Week Pregnancy Journey
            </Typography>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <Typography
              variant="body1"
              align="center"
              sx={{
                mb: 5,
                maxWidth: '800px',
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.secondary'
              }}
            >
              Our platform guides you through each stage of pregnancy with detailed information and visual representations. 
              Track your baby's growth while accessing prenatal care guidelines and nutritional advice specific to each week.
            </Typography>
          </FadeInSection>

          <Grid container spacing={3}>
            {Object.entries(weekImages).map(([week, image], index) => (
              <Grid item xs={6} sm={4} md={2} key={week}>
                <FadeInSection delay={0.1 * index}>
                  <Card
                    component={RouterLink}
                    to={`/week/${week}`}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      },
                      textDecoration: 'none'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={image}
                      alt={`Week ${week} of pregnancy`}
                      sx={{
                        objectFit: 'contain',
                        p: 2,
                        bgcolor: '#FFF5F8'
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{ color: '#FF1493', fontWeight: 600 }}
                      >
                        Week {week}
                      </Typography>
                    </CardContent>
                  </Card>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>

          <FadeInSection delay={0.6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 6
              }}
            >
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#FF1493',
                  '&:hover': {
                    bgcolor: '#E6007A',
                  },
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(255, 20, 147, 0.4)',
                }}
              >
                Explore All Weeks
              </Button>
            </Box>
          </FadeInSection>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: '#5e35b1',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <FadeInSection>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 3,
                fontWeight: 600,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Comprehensive Support Throughout Your Pregnancy
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                fontWeight: 400,
                opacity: 0.9
              }}
            >
              Access prenatal care guidelines, track your appointments, follow a healthy diet plan, and monitor your baby's development week by week
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#5e35b1',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
              }}
            >
              Explore Our Platform
            </Button>
          </FadeInSection>
        </Container>
      </Box>
    </Box>
  );
}

export default About;
