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

function ThirdTrimesterExercises() {
  const theme = useTheme();
  
  // Third trimester exercise data
  const exercises = [
    {
      id: 1,
      title: 'Swimming and Water Walking',
      description: 'Water exercises are especially beneficial in the third trimester as they provide buoyancy that relieves pressure on your joints and supports your growing belly.',
      image: 'https://via.placeholder.com/800x500/AEE6E6/333333?text=Swimming+and+Water+Walking',
      videoUrl: 'https://www.youtube.com/watch?v=example1',
      instructions: [
        'Walk in waist or chest-deep water, swinging arms naturally',
        'Try side-stepping in the water to work different muscles',
        'Use a kickboard for gentle swimming if comfortable',
        'Focus on gentle breast stroke or side stroke rather than front crawl',
        'Aim for 20-30 minutes, 2-3 times per week'
      ],
      benefits: 'Reduces swelling and joint pain, provides cardiovascular exercise without strain, improves circulation, and creates a feeling of weightlessness that relieves pressure on your body.'
    },
    {
      id: 2,
      title: 'Pelvic Floor Exercises (Advanced Kegels)',
      description: 'Strengthening your pelvic floor muscles is crucial as you approach delivery.',
      image: 'https://via.placeholder.com/800x500/D8BFD8/333333?text=Advanced+Kegels',
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      instructions: [
        'Perform quick flicks for 10-15 repetitions.',
        'Practice Kegels in different positions: sitting, standing, on hands and knees.'
      ],
      benefits: 'Helps prevent urinary incontinence and prepares for labor.'
    },
    {
      id: 3,
      title: 'Seated Pelvic Tilts',
      description: 'This modified version of pelvic tilts is perfect for the third trimester when your growing belly makes other positions uncomfortable.',
      image: 'https://via.placeholder.com/800x500/FFCBA4/333333?text=Seated+Pelvic+Tilts',
      instructions: [
        'Sit on a stability ball or firm chair with feet flat on the floor',
        'Place hands on thighs or hold onto the ball/chair for support',
        'Inhale and arch your lower back slightly',
        'Exhale and tuck your pelvis under, engaging your abdominal muscles',
        'Move slowly between these positions 10-15 times',
        'Repeat several times throughout the day'
      ],
      benefits: 'Relieves lower back pain, improves posture, prepares pelvis for labor, and helps baby move into optimal position for birth.',
      videoUrl: 'https://www.youtube.com/watch?v=example3'
    },
    {
      id: 4,
      title: 'Prenatal Ball Exercises',
      description: 'Using a stability ball in the third trimester can help relieve discomfort, improve posture, and prepare your body for labor positions.',
      image: 'https://via.placeholder.com/800x500/AEE6E6/333333?text=Prenatal+Ball+Exercises',
      instructions: [
        'Sit on the ball with feet flat on the floor, hip-width apart',
        'Practice gentle bouncing and hip circles',
        'Try wall squats: place the ball between your lower back and a wall, then squat slightly',
        'Practice leaning over the ball on your knees to relieve back pressure',
        'Use the ball to find comfortable positions for rest'
      ],
      benefits: 'Relieves back pressure, encourages optimal fetal positioning, strengthens core and pelvic muscles, and helps you practice positions that may be useful during labor.',
      videoUrl: 'https://www.youtube.com/watch?v=example4'
    },
    {
      id: 5,
      title: 'Gentle Walking',
      description: 'Walking remains one of the safest and most effective exercises throughout pregnancy, including the third trimester. Adjust your pace and duration as needed.',
      image: 'https://via.placeholder.com/800x500/FFCBA4/333333?text=Gentle+Walking',
      instructions: [
        'Wear supportive shoes with good arch support',
        'Start with 10-15 minutes at a comfortable pace',
        'Use walking poles or walk with a partner for added stability if needed',
        'Take frequent breaks if you feel tired or short of breath',
        'Walk on even surfaces to prevent falls',
        'Stay hydrated and avoid walking in extreme temperatures'
      ],
      benefits: "Maintains cardiovascular fitness, helps manage weight gain, reduces swelling in ankles and feet, and can help encourage labor when you're near your due date.",
      videoUrl: 'https://www.youtube.com/watch?v=example5'
    },
    {
      id: 6,
      title: 'Breathing and Relaxation Techniques',
      description: 'While not traditional "exercise," practicing breathing and relaxation techniques is crucial in the third trimester to prepare for labor and delivery.',
      image: 'https://via.placeholder.com/800x500/D8BFD8/333333?text=Breathing+and+Relaxation+Techniques',
      instructions: [
        'Practice deep breathing: inhale slowly through your nose, exhale through your mouth',
        'Try progressive muscle relaxation: tense and then release each muscle group',
        'Practice visualization: imagine your cervix opening and your baby moving down',
        'Learn different breathing patterns for different stages of labor',
        'Combine with gentle movement like swaying or rocking'
      ],
      benefits: 'Reduces stress and anxiety, prepares you mentally for labor, provides pain management techniques for delivery, and improves oxygen flow to you and your baby.',
      videoUrl: 'https://www.youtube.com/watch?v=example6'
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
              Third Trimester Exercises
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
              Safe and effective exercises for weeks 27-40 of your pregnancy journey
            </Typography>
          </Box>
        </FadeInSection>

        {/* Introduction */}
        <FadeInSection delay={0.2}>
          <Box sx={{ mb: 6, p: 3, bgcolor: 'rgba(236, 64, 122, 0.05)', borderRadius: 3 }}>
            <Typography variant="h5" component="h2" color="primary.main" gutterBottom fontWeight="600">
              Third Trimester Exercise Guidelines
            </Typography>
            <Typography variant="body1" paragraph>
              The third trimester (weeks 27-40) brings significant physical changes as your baby grows rapidly. You may experience increased fatigue, back pain, and difficulty finding comfortable positions. However, staying active remains important for your health and can help prepare your body for labor and delivery.
            </Typography>
            <Typography variant="body1" paragraph>
              During this final stretch, focus on gentle, low-impact exercises that maintain strength and flexibility without putting excessive strain on your changing body. Listen carefully to your body and adjust your routine as needed.
            </Typography>
            <Typography variant="body1" fontWeight="600" color="secondary.main">
              Always consult with your healthcare provider before continuing or modifying your exercise program during the third trimester.
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
              Third Trimester Safety Considerations
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
                      secondary="Exercises that require lying flat on your back should be avoided as they can compress major blood vessels." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Reduce Intensity" 
                      secondary="Lower the intensity of your workouts and focus on maintaining rather than increasing fitness." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Be Extra Cautious with Balance" 
                      secondary="Your center of gravity has shifted significantly. Use supports like chairs or walls when needed." 
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
                      primary="Watch for Warning Signs" 
                      secondary="Stop exercising and contact your healthcare provider if you experience contractions, vaginal bleeding, fluid leakage, dizziness, or decreased fetal movement." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Stay Cool and Hydrated" 
                      secondary="Overheating can be dangerous in late pregnancy. Drink plenty of water and exercise in temperature-controlled environments." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Rest When Needed" 
                      secondary="Don't push through fatigue. Take breaks and alternate activity with rest periods." 
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

export default ThirdTrimesterExercises;
