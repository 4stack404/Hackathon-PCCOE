import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText, Button, useTheme, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect } from 'react';

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

// Motivational quote component
const MotivationalQuote = ({ quote, author }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(174, 230, 230, 0.1) 0%, rgba(216, 191, 216, 0.1) 100%)',
        border: '1px solid rgba(216, 191, 216, 0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <FormatQuoteIcon 
          sx={{ 
            fontSize: 40, 
            color: theme.palette.secondary.main,
            opacity: 0.6,
            mr: 2,
            transform: 'rotate(180deg)' 
          }} 
        />
        <Box>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              fontStyle: 'italic',
              fontWeight: 500,
              color: '#555',
              mb: 1,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {quote}
          </Typography>
          {author && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textAlign: 'right',
                fontWeight: 500,
              }}
            >
              — {author}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

// Exercise item component with video
const ExerciseItem = ({ title, description, image, instructions, benefits, videoUrl, delay }) => {
  const theme = useTheme();
  
  return (
    <FadeInSection delay={delay}>
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          },
          height: '400px', // Fixed height for symmetry
        }}
      >
        <Grid container>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h3" fontWeight="600" color="primary.main" sx={{ mb: 2 }}>
                {title}
              </Typography>
              <Typography variant="body1" paragraph>
                {description}
              </Typography>
              <Box sx={{ mb: 2, height: '100px', overflow: 'hidden' }}>
                <video controls style={{ width: '100%', borderRadius: 2 }}>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
              <Typography variant="h6" component="h4" fontWeight="600" color="secondary.main" sx={{ mt: 2, mb: 1 }}>
                How to do it:
              </Typography>
              <List dense>
                {instructions.map((instruction, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleOutlineIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={instruction} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" component="h4" fontWeight="600" color="secondary.main" sx={{ mt: 2, mb: 1 }}>
                Benefits:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {benefits}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </FadeInSection>
  );
};

// Exercise Detail Component
const ExerciseDetail = ({ exercise }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
        {exercise.title}
      </Typography>
      <CardMedia
        component="img"
        image={exercise.image}
        alt={exercise.title}
        sx={{ mb: 2, borderRadius: 2 }}
      />
      <Typography variant="body1" paragraph>
        {exercise.description}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <video controls style={{ width: '100%', borderRadius: 2 }}>
          <source src={exercise.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
      <Typography variant="h6" component="h4" fontWeight="600" color="secondary.main" sx={{ mt: 2, mb: 1 }}>
        How to do it:
      </Typography>
      <List dense>
        {exercise.instructions.map((instruction, idx) => (
          <ListItem key={idx} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlineIcon color="secondary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={instruction} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" component="h4" fontWeight="600" color="secondary.main" sx={{ mt: 2, mb: 1 }}>
        Benefits:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {exercise.benefits}
      </Typography>
    </Box>
  );
}

function FirstTrimesterExercises() {
  const theme = useTheme();
  
  // First trimester exercise data
  const exercises = [
    {
      id: 1,
      title: 'Gentle Walking',
      description: 'Walking is a simple and effective way to stay active during your first trimester.',
      image: 'https://via.placeholder.com/800x500/AEE6E6/333333?text=Gentle+Walking',
      videoUrl: 'https://www.youtube.com/watch?v=aCLm4ZdZHjE',
      instructions: [
        'Start with 10-15 minutes of walking at a comfortable pace.',
        'Gradually increase to 30 minutes most days of the week.',
        'Wear supportive shoes and stay hydrated.'
      ],
      benefits: 'Boosts mood, improves circulation, and helps maintain a healthy weight.'
    },
    {
      id: 2,
      title: 'Prenatal Yoga',
      description: 'Prenatal yoga is specially designed for expectant mothers, focusing on gentle stretches, breathing, and relaxation techniques. During your first trimester, yoga can help ease nausea, reduce stress, and create a mindful connection with your changing body. The breathing techniques you learn now will become valuable tools during labor and delivery.',
      image: 'https://via.placeholder.com/800x500/D8BFD8/333333?text=Prenatal+Yoga',
      videoUrl: 'https://www.youtube.com/watch?v=RpEcS7ZBlJo',
      instructions: [
        'Join a prenatal yoga class or follow videos designed for pregnant women',
        'Focus on breathing and gentle stretching',
        'Avoid poses that require lying flat on your back after the first trimester',
        'Use props like blocks and bolsters for support',
        'Practice for 20-30 minutes, 2-3 times per week'
      ],
      benefits: 'Improves flexibility, reduces stress and anxiety, strengthens muscles needed for childbirth, and enhances mindfulness and body awareness. Regular practice can also help reduce lower back pain and improve sleep quality.'
    },
    {
      id: 3,
      title: 'Swimming and Water Exercises',
      description: 'The weightlessness you feel in water is a welcome relief during pregnancy. Swimming and water exercises are gentle on your joints while providing excellent resistance for muscle strengthening. The buoyancy of water supports your growing body, making movement easier and more comfortable. It\'s also a refreshing way to stay cool if you\'re experiencing pregnancy-related heat sensitivity.',
      image: 'https://via.placeholder.com/800x500/AEE6E6/333333?text=Swimming',
      videoUrl: 'https://www.youtube.com/watch?v=Gu_KBxRjn1k',
      instructions: [
        'Swim laps at a comfortable pace',
        'Try water walking in the shallow end',
        'Join a prenatal water aerobics class',
        'Use a kickboard for leg-focused exercises',
        'Aim for 20-30 minutes, 2-3 times per week'
      ],
      benefits: 'Reduces swelling and joint pain, improves circulation, provides a full-body workout without strain, and helps maintain cardiovascular fitness. The hydrostatic pressure of water also helps reduce swelling and promotes better blood circulation.'
    },
    {
      id: 4,
      title: 'Pelvic Floor Exercises (Kegels)',
      description: 'Your pelvic floor muscles support your uterus, bladder, and bowels. Starting Kegel exercises early in pregnancy helps strengthen these important muscles before they bear the increasing weight of your growing baby. These simple exercises can be done anywhere, anytime, and nobody will even know you\'re doing them! Developing a regular Kegel practice now will benefit you throughout your pregnancy and recovery.',
      image: 'https://via.placeholder.com/800x500/FFCBA4/333333?text=Pelvic+Floor+Exercises',
      videoUrl: 'https://www.youtube.com/watch?v=4PvQWQMmLUw',
      instructions: [
        'Identify your pelvic floor muscles by stopping urination midstream',
        'Tighten these muscles and hold for 5-10 seconds',
        'Release and relax for 5-10 seconds',
        'Repeat 10-15 times, 3 times daily',
        'Practice both quick contractions and longer holds'
      ],
      benefits: 'Prevents urinary incontinence, prepares for easier labor and delivery, and improves postpartum recovery. Strong pelvic floor muscles also help support your growing baby and can enhance intimate experiences.'
    }
  ];

  // Motivational quotes
  const quotes = [
    {
      quote: "Movement is a medicine for creating change in a person's physical, emotional, and mental states.",
      author: "Carol Welch"
    },
    {
      quote: "Taking care of your body during pregnancy isn't about being perfect; it's about being gentle with yourself while staying active.",
      author: "Unknown"
    }
  ];

  return (
    <Box sx={{ overflowX: 'hidden', py: 6 }}>
      <Container maxWidth="xl">
        {/* Back Button */}
        <FadeInSection>
          <Button
            component={RouterLink}
            to="/exercises"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 3 }}
            color="secondary"
          >
            Back to All Exercises
          </Button>
        </FadeInSection>
        
        {/* Page Header */}
        <FadeInSection>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: '2rem', md: '2.5rem' },
                position: 'relative',
                display: 'inline-block',
                mb: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 3,
                  bgcolor: theme.palette.secondary.main,
                  borderRadius: 2
                }
              }}
            >
              First Trimester Exercises
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mb: 2,
                color: theme.palette.primary.main
              }}
            >
              <FitnessCenterIcon sx={{ fontSize: 30, mr: 1 }} />
            </Box>
            <Typography 
              variant="h6" 
              component="p" 
              sx={{ 
                maxWidth: 800, 
                mx: 'auto', 
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6
              }}
            >
              Safe and effective exercises for weeks 1-12 of your pregnancy journey.
            </Typography>
          </Box>
        </FadeInSection>
        
        {/* First Motivational Quote */}
        <FadeInSection delay={0.1}>
          <MotivationalQuote 
            quote={quotes[0].quote} 
            author={quotes[0].author} 
          />
        </FadeInSection>
        
        {/* Exercise List */}
        {exercises.map((exercise) => (
          <ExerciseDetail key={exercise.id} exercise={exercise} />
        ))}
        
        {/* Second Motivational Quote */}
        <FadeInSection delay={0.5}>
          <MotivationalQuote 
            quote={quotes[1].quote} 
            author={quotes[1].author} 
          />
        </FadeInSection>
        
        {/* Tips Section */}
        <FadeInSection delay={0.6}>
          <Box 
            sx={{ 
              mt: 4, 
              p: 4, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(255, 203, 164, 0.1) 0%, rgba(216, 191, 216, 0.1) 100%)',
              border: '1px solid rgba(255, 203, 164, 0.2)',
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 2,
                textAlign: 'center'
              }}
            >
              First Trimester Exercise Tips
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  <strong>Listen to your body:</strong> The first trimester can bring fatigue and nausea. It's perfectly okay to modify or skip workouts on days when you're not feeling well.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Stay hydrated:</strong> Drink plenty of water before, during, and after exercise to prevent dehydration and overheating.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  <strong>Wear comfortable clothing:</strong> Choose loose-fitting, breathable fabrics and a supportive bra as your body changes.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Consult your healthcare provider:</strong> Always check with your doctor before starting or continuing any exercise program during pregnancy.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </FadeInSection>
        
        {/* Back Button at Bottom */}
        <FadeInSection delay={0.7}>
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/exercises"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 6, px: 3 }}
            >
              Back to All Exercises
            </Button>
          </Box>
        </FadeInSection>
      </Container>
    </Box>
  );
}

export default FirstTrimesterExercises;
