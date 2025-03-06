import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Button, Grid, CardMedia, Accordion,
  AccordionSummary, AccordionDetails,
  List, ListItem, ListItemIcon, ListItemText,
  useTheme, alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { COLORS } from '../../../theme/colors';

const laborPrep = {
  hospitalBag: [
    {
      category: "For Mom",
      items: [
        "Comfortable nightgown or labor dress",
        "Robe and slippers",
        "Toiletries and personal care items",
        "Comfortable going-home outfit",
        "Phone charger and camera",
        "Insurance cards and hospital paperwork",
        "Birth plan copies"
      ]
    },
    {
      category: "For Baby",
      items: [
        "Diapers and wipes",
        "2-3 onesies or sleepers",
        "Blankets",
        "Car seat",
        "Hat and socks",
        "Going-home outfit"
      ]
    },
    {
      category: "For Partner",
      items: [
        "Change of clothes",
        "Snacks and drinks",
        "Entertainment items",
        "Basic toiletries",
        "List of people to contact"
      ]
    }
  ],
  birthPlan: [
    {
      title: "Labor Preferences",
      points: [
        "Preferred labor positions",
        "Pain management options",
        "Music or environment preferences",
        "Who should be present",
        "Photography/video preferences"
      ]
    },
    {
      title: "Medical Preferences",
      points: [
        "Induction preferences",
        "C-section preferences if needed",
        "Episiotomy preferences",
        "Monitoring preferences",
        "Emergency contact information"
      ]
    },
    {
      title: "After Birth",
      points: [
        "Immediate skin-to-skin contact",
        "Delayed cord clamping",
        "Breastfeeding assistance",
        "Newborn procedures",
        "Rooming-in preferences"
      ]
    }
  ],
  laborSigns: [
    {
      sign: "Contractions",
      description: "Regular, painful contractions that get closer together",
      whenToAct: "When contractions are 5 minutes apart for 1 hour"
    },
    {
      sign: "Water Breaking",
      description: "Rupture of membranes - can be a gush or slow leak",
      whenToAct: "Contact hospital immediately"
    },
    {
      sign: "Bloody Show",
      description: "Loss of mucus plug with bloody or pink discharge",
      whenToAct: "Normal in late pregnancy, but report heavy bleeding"
    },
    {
      sign: "Baby Movement Changes",
      description: "Significant decrease in baby's movement",
      whenToAct: "Contact healthcare provider immediately"
    }
  ]
};

const LaborPrep = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/care/prenatal')}
        sx={{ mb: 3, color: COLORS.primary }}
      >
        Back to Prenatal Care
      </Button>

      <Typography 
        variant="h3" 
        sx={{ 
          mb: 1,
          color: COLORS.primary,
          fontFamily: "'Playfair Display', serif"
        }}
      >
        Labor & Delivery Preparation
      </Typography>

      <Typography 
        variant="h6" 
        sx={{ 
          mb: 4,
          color: COLORS.text.secondary,
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 400
        }}
      >
        Everything you need to know to prepare for your big day
      </Typography>

      {/* Hospital Bag Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3,
            color: COLORS.primary,
            fontFamily: "'Playfair Display', serif",
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <LocalHospitalIcon /> Hospital Bag Checklist
        </Typography>

        <Grid container spacing={3}>
          {laborPrep.hospitalBag.map((category, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: 'none',
                  border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha(COLORS.primary, 0.15)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      color: COLORS.primary,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600
                    }}
                  >
                    {category.category}
                  </Typography>
                  <List>
                    {category.items.map((item, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: COLORS.primary }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif"
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Birth Plan Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3,
            color: COLORS.primary,
            fontFamily: "'Playfair Display', serif",
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <EventNoteIcon /> Birth Plan Elements
        </Typography>

        {laborPrep.birthPlan.map((section, index) => (
          <Accordion 
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{ 
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: `1px solid ${alpha(COLORS.primary, 0.1)}`
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography 
                sx={{ 
                  color: COLORS.primary,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600
                }}
              >
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {section.points.map((point, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: COLORS.primary }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={point}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontFamily: "'Poppins', sans-serif"
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Labor Signs Section */}
      <Box>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3,
            color: COLORS.primary,
            fontFamily: "'Playfair Display', serif",
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <BabyChangingStationIcon /> Signs of Labor
        </Typography>

        <Grid container spacing={3}>
          {laborPrep.laborSigns.map((sign, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: 'none',
                  border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha(COLORS.primary, 0.15)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      color: COLORS.primary,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600
                    }}
                  >
                    {sign.sign}
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      mb: 2,
                      color: COLORS.text.secondary,
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {sign.description}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: COLORS.primary,
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500
                    }}
                  >
                    When to Act:
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: COLORS.text.secondary,
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {sign.whenToAct}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default LaborPrep; 