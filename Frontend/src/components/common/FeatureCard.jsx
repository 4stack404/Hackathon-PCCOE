import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function FeatureCard({ icon, title, description, link }) {
  return (
    <Card 
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
        },
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <CardActionArea 
        component={RouterLink} 
        to={link}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          height: '100%',
          p: 2,
        }}
      >
        <Box 
          sx={{ 
            color: 'primary.main', 
            fontSize: 64, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default FeatureCard; 