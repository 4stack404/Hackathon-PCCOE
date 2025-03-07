import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Button, 
  useTheme, 
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogContent
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';

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

// Exercise detail component with video
const ExerciseDetail = ({ 
  title, 
  description, 
  image, 
  instructions, 
  benefits, 
  videoUrl, 
  videoTitle,
  tips,
  cautions,
  delay 
}) => {
  const theme = useTheme();
  const [videoOpen, setVideoOpen] = useState(false);
  
  const handleOpenVideo = () => {
    setVideoOpen(true);
  };

  const handleCloseVideo = () => {
    setVideoOpen(false);
  };

  // Extract YouTube video ID from URL if it's a YouTube link
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };
  
  return (
    <FadeInSection delay={delay}>
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Grid container>
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative', height: '100%', minHeight: 300 }}>
              <CardMedia
                component="img"
                image={image}
                alt={title}
                sx={{
                  height: '100%',
                  minHeight: 300,
                  objectFit: 'cover',
                }}
              />
              {videoUrl && (
                <Box 
                  component={Button}
                  onClick={handleOpenVideo}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.main,
                      transform: 'translate(-50%, -50%) scale(1.1)',
                    }
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 40 }} />
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                fontWeight="600"
                color="primary.main"
                sx={{ mb: 2 }}
              >
                {title}
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#444'
                }}
              >
                {description}
              </Typography>
              
              <Typography 
                variant="h6" 
                component="h3" 
                fontWeight="600" 
                color="secondary.main" 
                sx={{ mt: 3, mb: 1 }}
              >
                How to do it:
              </Typography>
              <List>
                {instructions.map((instruction, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleOutlineIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={instruction} 
                      primaryTypographyProps={{
                        sx: { fontSize: '1rem', color: '#555' }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Typography 
                variant="h6" 
                component="h3" 
                fontWeight="600" 
                color="secondary.main" 
                sx={{ mt: 3, mb: 1 }}
              >
                Benefits:
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  fontSize: '1rem',
                  color: '#555',
                  lineHeight: 1.6
                }}
              >
                {benefits}
              </Typography>

              {tips && (
                <>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    fontWeight="600" 
                    color="secondary.main" 
                    sx={{ mt: 3, mb: 1 }}
                  >
                    Helpful Tips:
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3,
                      fontSize: '1rem',
                      color: '#555',
                      lineHeight: 1.6
                    }}
                  >
                    {tips}
                  </Typography>
                </>
              )}

              {cautions && (
                <>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    fontWeight="600" 
                    color="error.main" 
                    sx={{ mt: 3, mb: 1 }}
                  >
                    Cautions:
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3,
                      fontSize: '1rem',
                      color: '#555',
                      lineHeight: 1.6
                    }}
                  >
                    {cautions}
                  </Typography>
                </>
              )}
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Video Dialog */}
      <Dialog
        open={videoOpen}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          bgcolor: theme.palette.primary.main,
          color: 'white'
        }}>
          <Typography variant="h6">{videoTitle || title}</Typography>
          <IconButton onClick={handleCloseVideo} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
            <iframe
              src={getYoutubeEmbedUrl(videoUrl)}
              title={videoTitle || title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </FadeInSection>
  );
};

export default ExerciseDetail;
