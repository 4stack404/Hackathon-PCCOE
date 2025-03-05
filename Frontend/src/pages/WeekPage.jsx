import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Container, Typography, Paper, Grid, CircularProgress, Button, Card, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import { motion } from 'framer-motion';

const FadeInSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

function WeekPage() {
  const { weekNumber } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  
  // Convert weekNumber to a number for navigation
  const currentWeek = parseInt(weekNumber, 10);
  
  // Calculate previous and next week numbers
  const prevWeek = currentWeek > 2 ? currentWeek - 1 : null;
  const nextWeek = currentWeek < 41 ? currentWeek + 1 : null;
  
  // Default image path in public folder
  const defaultBabyImagePath = '/assets/baby-size/fruit-week-20-Photoroom.png';
  const [babyImagePath, setBabyImagePath] = useState(defaultBabyImagePath);
  
  useEffect(() => {
    // Reset image error state when week changes
    setImageError(false);
    
    // Set the image path for the current week (now in public folder)
    const imagePath = `/assets/baby-size/fruit-week-${weekNumber}-Photoroom.png`;
    setBabyImagePath(imagePath);
    
    // Fetch the weekData.json from public folder
    const fetchWeekData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/assets/weekData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch week data');
        }
        
        const weekData = await response.json();
        
        // Get the specific week data
        const weekDataForCurrentWeek = weekData[`week ${weekNumber}`];
        
        if (!weekDataForCurrentWeek) {
          setError(`No data found for week ${weekNumber}`);
          setLoading(false);
          return;
        }
        
        setData(weekDataForCurrentWeek);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching week data:", err);
        setError("Failed to load week data. Please try again later.");
        setLoading(false);
      }
    };

    fetchWeekData();
  }, [weekNumber]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        flexDirection: 'column',
        gap: 3
      }}>
        <CircularProgress color="secondary" size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary" fontFamily="'Poppins', sans-serif">
          Loading week {weekNumber} information...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <FadeInSection>
          <Paper elevation={3} sx={{ 
            p: 5, 
            borderRadius: 3,
            textAlign: 'center',
            borderTop: '4px solid #FF5A8C'
          }}>
            <Typography variant="h5" color="error" align="center" gutterBottom>
              {error}
            </Typography>
            <Button 
              component={Link} 
              to="/dashboard"
              variant="contained" 
              sx={{ 
                mt: 3,
                backgroundColor: '#FF5A8C',
                '&:hover': { backgroundColor: '#e64c7f' }
              }}
              startIcon={<HomeIcon />}
            >
              Return to Dashboard
            </Button>
          </Paper>
        </FadeInSection>
      </Container>
    );
  }

  return (
    <Box component="main" sx={{ 
      minHeight: '100vh', 
      py: 6,
      background: 'linear-gradient(180deg, #FFF5F8 0%, #FFFFFF 100%)'
    }}>
      <Container maxWidth="lg">
        <FadeInSection>
          {/* Week Navigation */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 5 
          }}>
            {prevWeek ? (
              <Button 
                component={Link} 
                to={`/week/${prevWeek}`}
                variant="contained" 
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  backgroundColor: '#FF5A8C',
                  '&:hover': { backgroundColor: '#e64c7f' },
                  borderRadius: 2,
                  py: 1.2,
                  boxShadow: '0 4px 10px rgba(255, 90, 140, 0.3)'
                }}
              >
                Week {prevWeek}
              </Button>
            ) : (
              <Box />
            )}
            
            <Typography 
              variant="h2" 
              component="h1" 
              align="center" 
              sx={{ 
                fontWeight: 700, 
                color: '#2D3748',
                fontFamily: "'Playfair Display', serif",
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 3,
                  bgcolor: '#FF5A8C',
                  borderRadius: 2
                }
              }}
            >
              Week {weekNumber}
            </Typography>
            
            {nextWeek ? (
              <Button 
                component={Link} 
                to={`/week/${nextWeek}`}
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  backgroundColor: '#FF5A8C',
                  '&:hover': { backgroundColor: '#e64c7f' },
                  borderRadius: 2,
                  py: 1.2,
                  boxShadow: '0 4px 10px rgba(255, 90, 140, 0.3)'
                }}
              >
                Week {nextWeek}
              </Button>
            ) : (
              <Box />
            )}
          </Box>
        </FadeInSection>
        
        {/* Baby Size Image */}
        <FadeInSection delay={0.2}>
          <Card 
            elevation={3} 
            sx={{ 
              mb: 5, 
              borderRadius: 3, 
              overflow: 'hidden',
              backgroundColor: 'white',
              textAlign: 'center',
              p: 4,
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              borderTop: '4px solid #FF5A8C'
            }}
          >
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: '#FF5A8C',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Your Baby This Week
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 3,
              position: 'relative'
            }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Box 
                  component="img"
                  src={imageError ? defaultBabyImagePath : babyImagePath}
                  alt={`Baby size at week ${weekNumber}`}
                  sx={{ 
                    height: 240,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))'
                  }}
                  onError={() => setImageError(true)}
                />
              </motion.div>
            </Box>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#4A5568',
                maxWidth: '700px',
                mx: 'auto',
                fontStyle: 'italic'
              }}
            >
              {data?.babySize || "Your baby is growing and developing every day!"}
            </Typography>
          </Card>
        </FadeInSection>

        {/* Week Content */}
        <FadeInSection delay={0.4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 3, 
              mb: 5, 
              backgroundColor: 'white',
              boxShadow: '0 12px 24px rgba(0,0,0,0.06)'
            }}
          >
            {data && data.Title1 && (
              <>
                {data.Title1.titles.map((title, titleIndex) => (
                  <Box key={titleIndex} sx={{ mb: titleIndex < data.Title1.titles.length - 1 ? 6 : 0 }}>
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      sx={{ 
                        mb: 4, 
                        fontWeight: 600, 
                        color: '#2D3748',
                        fontFamily: "'Playfair Display', serif",
                        borderBottom: '2px solid #FFD6E0',
                        pb: 2
                      }}
                    >
                      {title}
                    </Typography>

                    {data.Title1.sections[titleIndex] && (
                      <Grid container spacing={4}>
                        {data.Title1.sections[titleIndex].map((section, sectionIndex) => (
                          <Grid item xs={12} md={6} key={sectionIndex}>
                            <motion.div
                              whileHover={{ 
                                y: -8,
                                transition: { duration: 0.3 }
                              }}
                            >
                              <Paper 
                                elevation={2} 
                                sx={{ 
                                  p: 4, 
                                  height: '100%',
                                  borderRadius: 3,
                                  backgroundColor: '#FFF9FB',
                                  borderLeft: '4px solid #FF5A8C',
                                  transition: 'box-shadow 0.3s',
                                  '&:hover': {
                                    boxShadow: '0 16px 32px rgba(0,0,0,0.12)'
                                  }
                                }}
                              >
                                <Typography 
                                  variant="h6" 
                                  component="h3" 
                                  sx={{ 
                                    mb: 2.5, 
                                    fontWeight: 600, 
                                    color: '#FF5A8C'
                                  }}
                                >
                                  {section.subtitle}
                                </Typography>
                                <Divider sx={{ mb: 2.5, backgroundColor: '#FFE0E9' }} />
                                {section.content.map((paragraph, paraIndex) => (
                                  <Typography 
                                    key={paraIndex} 
                                    variant="body1" 
                                    paragraph 
                                    sx={{ 
                                      color: '#4A5568',
                                      lineHeight: 1.8,
                                      mb: 2.5,
                                      fontSize: '1.05rem'
                                    }}
                                  >
                                    {paragraph}
                                  </Typography>
                                ))}
                              </Paper>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                ))}
              </>
            )}
          </Paper>
        </FadeInSection>
        
        {/* Week Navigation (Bottom) */}
        <FadeInSection delay={0.6}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 5,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 2
          }}>
            {prevWeek ? (
              <Button 
                component={Link} 
                to={`/week/${prevWeek}`}
                variant="contained" 
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  backgroundColor: '#FF5A8C',
                  '&:hover': { backgroundColor: '#e64c7f' },
                  borderRadius: 2,
                  py: 1.5,
                  px: 3,
                  boxShadow: '0 4px 10px rgba(255, 90, 140, 0.3)',
                  order: { xs: 2, sm: 1 },
                  flex: { xs: '1 0 45%', sm: '0 0 auto' }
                }}
              >
                Previous Week
              </Button>
            ) : (
              <Box sx={{ order: { xs: 2, sm: 1 }, flex: { xs: '1 0 45%', sm: '0 0 auto' } }} />
            )}
            
            <Button 
              component={Link} 
              to="/dashboard"
              variant="outlined" 
              sx={{ 
                color: '#FF5A8C',
                borderColor: '#FF5A8C',
                '&:hover': { 
                  borderColor: '#e64c7f',
                  backgroundColor: 'rgba(255, 90, 140, 0.1)'
                },
                borderRadius: 2,
                py: 1.5,
                px: 3,
                order: { xs: 1, sm: 2 },
                flex: { xs: '1 0 100%', sm: '0 0 auto' },
                mb: { xs: 2, sm: 0 }
              }}
              startIcon={<HomeIcon />}
            >
              Back to Dashboard
            </Button>
            
            {nextWeek ? (
              <Button 
                component={Link} 
                to={`/week/${nextWeek}`}
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  backgroundColor: '#FF5A8C',
                  '&:hover': { backgroundColor: '#e64c7f' },
                  borderRadius: 2,
                  py: 1.5,
                  px: 3,
                  boxShadow: '0 4px 10px rgba(255, 90, 140, 0.3)',
                  order: { xs: 3, sm: 3 },
                  flex: { xs: '1 0 45%', sm: '0 0 auto' }
                }}
              >
                Next Week
              </Button>
            ) : (
              <Box sx={{ order: { xs: 3, sm: 3 }, flex: { xs: '1 0 45%', sm: '0 0 auto' } }} />
            )}
          </Box>
        </FadeInSection>
      </Container>
    </Box>
  );
}

export default WeekPage;