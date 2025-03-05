import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import ChildCareIcon from '@mui/icons-material/ChildCare';

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

const Care = () => {
  const theme = useTheme();

  const careOptions = [
    {
      id: 'prenatal',
      title: 'Prenatal Care',
      description: 'Comprehensive guidance for expectant mothers during pregnancy',
      icon: <PregnantWomanIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      image: 'https://t4.ftcdn.net/jpg/06/01/66/45/360_F_601664574_l72Nqtw5PcIICG1bF8NtzWncWLeh1ida.jpg'
    },
    {
      id: 'postnatal',
      title: 'Postnatal Care',
      description: 'Essential guidance for new mothers after childbirth',
      icon: <ChildCareIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', pt: 8, pb: 10 }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          mb: 8
        }}
      >
        <Container maxWidth="lg">
          <FadeInSection>
            <Typography
              variant="h2"
              component="h1"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: theme.palette.primary.main,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Maternal Care Resources
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                color: 'text.secondary'
              }}
            >
              Comprehensive guidance for your journey before and after childbirth
            </Typography>
          </FadeInSection>
        </Container>
      </Box>

      {/* Care Options */}
      <Container maxWidth="lg">
        <FadeInSection delay={0.2}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 600,
              color: theme.palette.primary.main,
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
                bgcolor: theme.palette.secondary.main,
                borderRadius: 2
              }
            }}
          >
            Select Your Care Type
          </Typography>
        </FadeInSection>

        <Grid container spacing={4} justifyContent="center">
          {careOptions.map((option, index) => (
            <Grid item xs={12} md={6} key={option.id}>
              <FadeInSection delay={0.3 + index * 0.1}>
                <Card
                  component={motion.div}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={option.image}
                    alt={option.title}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {option.icon}
                    </Box>
                    <Typography 
                      gutterBottom 
                      variant="h4" 
                      component="h3"
                      sx={{ 
                        fontWeight: 600,
                        fontFamily: "'Playfair Display', serif",
                        mb: 2
                      }}
                    >
                      {option.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ mb: 4 }}
                    >
                      {option.description}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={`/care/${option.id}`}
                      variant="contained"
                      size="large"
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      Explore {option.title}
                    </Button>
                  </CardContent>
                </Card>
              </FadeInSection>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Care;
