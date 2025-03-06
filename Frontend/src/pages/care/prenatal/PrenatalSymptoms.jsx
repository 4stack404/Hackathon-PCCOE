import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Button, Grid, CardMedia, Chip,
  Accordion, AccordionSummary, AccordionDetails,
  useTheme, alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';
import WarningIcon from '@mui/icons-material/Warning';
import { COLORS } from '../../../theme/colors';

const symptoms = [
  {
    title: "Morning Sickness",
    description: "Nausea and vomiting, especially in early pregnancy",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309",
    remedies: [
      "Eat small, frequent meals",
      "Stay hydrated",
      "Try ginger tea or candies",
      "Avoid strong smells",
      "Eat crackers before getting up"
    ],
    whenToWorry: [
      "Unable to keep any food down",
      "Signs of dehydration",
      "Severe weight loss",
      "Vomiting blood"
    ]
  },
  {
    title: "Back Pain",
    description: "Common as your center of gravity shifts with pregnancy",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    remedies: [
      "Practice good posture",
      "Use pregnancy support belt",
      "Gentle stretching",
      "Apply heat/cold packs",
      "Sleep with pregnancy pillow"
    ],
    whenToWorry: [
      "Severe or shooting pain",
      "Numbness or tingling",
      "Pain with fever",
      "Loss of bladder control"
    ]
  },
  {
    title: "Swelling (Edema)",
    description: "Normal swelling in feet, ankles, and hands",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c",
    remedies: [
      "Elevate feet regularly",
      "Stay active with walking",
      "Wear comfortable shoes",
      "Reduce salt intake",
      "Stay hydrated"
    ],
    whenToWorry: [
      "Sudden or severe swelling",
      "Face or eye swelling",
      "One leg more swollen",
      "Accompanied by headaches"
    ]
  },
  {
    title: "Heartburn",
    description: "Common in later pregnancy as baby grows",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a",
    remedies: [
      "Eat smaller meals",
      "Avoid lying down after eating",
      "Sleep with head elevated",
      "Avoid spicy/fatty foods",
      "Try papaya enzymes"
    ],
    whenToWorry: [
      "Severe chest pain",
      "Difficulty swallowing",
      "Shortness of breath",
      "Pain radiating to arms"
    ]
  }
];

const emergencySigns = [
  {
    symptom: "Severe Headache",
    description: "Especially if accompanied by vision changes or swelling"
  },
  {
    symptom: "Decreased Baby Movement",
    description: "If you notice significantly reduced fetal movement"
  },
  {
    symptom: "Vaginal Bleeding",
    description: "Any amount of bleeding requires immediate attention"
  },
  {
    symptom: "Contractions Before 37 Weeks",
    description: "Regular, painful contractions in early pregnancy"
  }
];

const PrenatalSymptoms = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);

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
        Common Pregnancy Symptoms & Remedies
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
        Understanding and managing pregnancy discomforts
      </Typography>

      <Grid container spacing={4}>
        {symptoms.map((symptom, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 'none',
                border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
                '&:hover': {
                  boxShadow: `0 8px 24px ${alpha(COLORS.primary, 0.15)}`
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={symptom.image}
                alt={symptom.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    color: COLORS.primary,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600
                  }}
                >
                  {symptom.title}
                </Typography>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3,
                    color: COLORS.text.secondary,
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  {symptom.description}
                </Typography>

                <Accordion 
                  sx={{ 
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    bgcolor: alpha(COLORS.primary, 0.05),
                    mb: 2
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      '& .MuiAccordionSummary-content': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }
                    }}
                  >
                    <HealingIcon sx={{ color: COLORS.primary }} />
                    <Typography 
                      sx={{ 
                        color: COLORS.primary,
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600
                      }}
                    >
                      Natural Remedies
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      {symptom.remedies.map((remedy, idx) => (
                        <Typography 
                          key={idx}
                          component="li"
                          sx={{ 
                            mb: 1,
                            color: COLORS.text.secondary,
                            fontFamily: "'Poppins', sans-serif"
                          }}
                        >
                          {remedy}
                        </Typography>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion 
                  sx={{ 
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    bgcolor: alpha('#ff4081', 0.05)
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      '& .MuiAccordionSummary-content': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }
                    }}
                  >
                    <WarningIcon sx={{ color: '#ff4081' }} />
                    <Typography 
                      sx={{ 
                        color: '#ff4081',
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600
                      }}
                    >
                      When to Call Your Doctor
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      {symptom.whenToWorry.map((warning, idx) => (
                        <Typography 
                          key={idx}
                          component="li"
                          sx={{ 
                            mb: 1,
                            color: COLORS.text.secondary,
                            fontFamily: "'Poppins', sans-serif"
                          }}
                        >
                          {warning}
                        </Typography>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3,
            color: '#ff4081',
            fontFamily: "'Playfair Display', serif",
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <LocalHospitalIcon /> Emergency Warning Signs
        </Typography>

        <Grid container spacing={3}>
          {emergencySigns.map((sign, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  bgcolor: alpha('#ff4081', 0.05),
                  boxShadow: 'none',
                  border: `1px solid ${alpha('#ff4081', 0.1)}`
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      color: '#ff4081',
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600
                    }}
                  >
                    {sign.symptom}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: COLORS.text.secondary,
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {sign.description}
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

export default PrenatalSymptoms; 