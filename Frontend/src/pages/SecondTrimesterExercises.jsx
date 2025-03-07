import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText, Button, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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

// Exercise item component
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
};

function SecondTrimesterExercises() {
  const theme = useTheme();
  
  // Second trimester exercise data
  const exercises = [
    {
      id: 1,
      title: 'Modified Squats',
      description: 'Squats are great for strengthening your legs and glutes.',
      image: 'https://via.placeholder.com/800x500/D8BFD8/333333?text=Modified+Squats',
      videoUrl: 'https://www.youtube.com/watch?v=example', // Placeholder
      instructions: [
        'Stand with feet shoulder-width apart.',
        'Lower your body as if sitting in a chair.',
        'Keep your back straight and return to standing.'
      ],
      benefits: 'Strengthens legs and prepares your body for labor.'
    },
    {
      id: 2,
      title: 'Pelvic Tilts',
      description: 'Pelvic tilts are gentle exercises that strengthen your abdominal muscles and help relieve back pain, which is common during the second trimester.',
      image: 'https://via.placeholder.com/800x500/AEE6E6/333333?text=Pelvic+Tilts',
      instructions: [
        'Stand with your back against a wall, feet shoulder-width apart',
        'Inhale and press your lower back against the wall',
        'Exhale and tilt your pelvis forward, engaging your abdominal muscles',
        'Hold for 3-5 seconds, then release',
        'Repeat 10-15 times, several times throughout the day'
      ],
      benefits: 'Relieves lower back pain, strengthens core muscles, improves posture, and increases body awareness for labor preparation.'
    },
    {
      id: 3,
      title: 'Modified Side Planks',
      description: 'Side planks help strengthen your core and improve stability, which becomes increasingly important as your center of gravity shifts during pregnancy.',
      image: 'https://via.placeholder.com/800x500/FFCBA4/333333?text=Modified+Side+Planks',
      instructions: [
        'Lie on your side with your knees bent at a 90-degree angle',
        'Prop yourself up on your elbow, keeping it directly under your shoulder',
        'Lift your hips off the ground, creating a straight line from your knees to your shoulders',
        'Hold for 10-30 seconds, breathing normally',
        'Lower down and repeat on the other side',
        'Perform 2-3 sets on each side'
      ],
      benefits: 'Strengthens core, shoulders, and hips, improves balance and stability, and helps maintain good posture as your pregnancy progresses.'
    },
    {
      id: 4,
      title: 'Prenatal Pilates',
      description: 'Prenatal Pilates focuses on core strength, posture, and controlled breathing, making it ideal for the second trimester when your body is changing rapidly.',
      image: 'https://via.placeholder.com/800x500/D8BFD8/333333?text=Prenatal+Pilates',
      instructions: [
        'Join a prenatal Pilates class or follow videos designed for pregnant women',
        'Focus on proper breathing techniques during all movements',
        'Avoid exercises that require lying flat on your back',
        'Use props like pillows and bolsters for support',
        'Practice 2-3 times per week for 20-30 minutes'
      ],
      benefits: 'Improves core strength without strain, enhances posture and body awareness, reduces back pain, and prepares the body for labor with focused breathing techniques.'
    },
    {
      id: 5,
      title: 'Stationary Cycling',
      description: 'Stationary cycling provides cardiovascular benefits without impact on your joints, which is especially beneficial as your weight increases in the second trimester.',
      image: 'https://via.placeholder.com/800x500/FFCBA4/333333?text=Stationary+Cycling',
      instructions: [
        'Adjust the bike seat to a comfortable height',
        'Keep resistance low to moderate',
        'Maintain an upright posture to avoid pressure on your abdomen',
        'Start with 10-15 minutes and gradually increase to 20-30 minutes',
        'Keep intensity moderate – you should be able to talk while cycling'
      ],
      benefits: "Improves cardiovascular fitness, strengthens leg muscles, reduces swelling in legs and feet, and provides a low-impact workout that's gentle on your joints."
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
              Second Trimester Exercises
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
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}
            >
              Safe and effective exercises for weeks 13-26 of your pregnancy journey
            </Typography>
          </Box>
        </FadeInSection>

        {/* Introduction */}
        <FadeInSection delay={0.2}>
          <Box sx={{ mb: 6, p: 3, bgcolor: 'rgba(236, 64, 122, 0.05)', borderRadius: 3 }}>
            <Typography variant="h5" component="h2" color="primary.main" gutterBottom fontWeight="600">
              Second Trimester Exercise Guidelines
            </Typography>
            <Typography variant="body1" paragraph>
              The second trimester (weeks 13-26) is often called the "golden period" of pregnancy. Morning sickness typically subsides, energy levels increase, and your baby bump is growing but not yet large enough to significantly limit movement.
            </Typography>
            <Typography variant="body1" paragraph>
              This is an ideal time to establish or maintain a regular exercise routine. However, as your center of gravity shifts and ligaments loosen due to hormonal changes, it's important to modify exercises to ensure safety and comfort.
            </Typography>
            <Typography variant="body1" fontWeight="600" color="secondary.main">
              Always consult with your healthcare provider before starting or continuing any exercise program during pregnancy.
            </Typography>
          </Box>
        </FadeInSection>

        {/* Exercise List */}
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, color: theme.palette.primary.main }}>
          Recommended Exercises
        </Typography>
        
        {exercises.map((exercise) => (
          <ExerciseDetail key={exercise.id} exercise={exercise} />
        ))}

        {/* Safety Tips */}
        <FadeInSection delay={0.4}>
          <Box sx={{ mt: 6, p: 4, bgcolor: 'rgba(94, 53, 177, 0.05)', borderRadius: 3 }}>
            <Typography variant="h5" component="h2" color="primary.main" gutterBottom fontWeight="600">
              Second Trimester Safety Considerations
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Avoid Lying on Your Back" 
                      secondary="After 20 weeks, avoid exercises that require lying flat on your back for extended periods, as this can reduce blood flow to your baby." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Modify Abdominal Exercises" 
                      secondary="Traditional crunches and sit-ups are not recommended. Focus on gentle core strengthening exercises like modified planks and pelvic tilts." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Be Mindful of Balance" 
                      secondary="Your center of gravity is shifting, which can affect balance. Use support when needed and avoid activities with a high risk of falling." 
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Stay Hydrated" 
                      secondary="Drink plenty of water before, during, and after exercise to prevent dehydration and overheating." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Wear Supportive Gear" 
                      secondary="Invest in a supportive maternity sports bra and comfortable shoes as your body changes." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Listen to Your Body" 
                      secondary="If you experience pain, dizziness, shortness of breath, or unusual symptoms, stop exercising and consult your healthcare provider." 
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        </FadeInSection>
      </Container>
    </Box>
  );
}

export default SecondTrimesterExercises;
