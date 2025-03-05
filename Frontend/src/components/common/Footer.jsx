import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Link, TextField, Button, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Chat } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
  useEffect(() => {
    // JavaScript for animating logo text in footer
    const footerLogo = document.querySelector('.footer-logo-text');
    if (footerLogo) {
      const logoText = footerLogo.textContent;
      footerLogo.textContent = '';

      // Create spans for each letter
      for (let i = 0; i < logoText.length; i++) {
        const span = document.createElement('span');
        span.textContent = logoText[i];
        span.style.animationDelay = `${i * 0.1}s`;
        span.style.display = 'inline-block';
        span.style.transition = 'color 0.3s ease, transform 0.3s ease';
        
        span.addEventListener('mouseover', function() {
          this.style.color = '#f8b195';
          this.style.animation = 'letterScale 0.5s ease';
        });
        
        span.addEventListener('mouseout', function() {
          this.style.color = '';
          this.style.animation = '';
        });
        
        footerLogo.appendChild(span);
      }
    }
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#FFD6E0',
        color: '#4A4A4A',
        py: 6,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '@keyframes fadeInUp': {
          from: {
            opacity: 0,
            transform: 'translateY(20px)'
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)'
          }
        },
        '@keyframes letterScale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,20,147,0.1) 100%)',
        }
      }}
    >
      {/* Wave SVG */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0
        }}
      >
        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          sx={{
            position: 'relative',
            display: 'block',
            width: '100%',
            height: '30px'
          }}
        >
          <Box
            component="path"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            sx={{ fill: '#f8f9fb' }}
          />
        </Box>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h2" 
              className="footer-logo-text"
              sx={{ 
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '2.2rem', md: '3rem' },
                color: 'white',
                letterSpacing: '2px',
                mb: 2,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '100%',
                  height: '3px',
                  bgcolor: '#f8b195',
                  transform: 'scaleX(0.7)',
                  transformOrigin: 'center',
                  transition: 'transform 0.5s ease'
                },
                '&:hover::after': {
                  transform: 'scaleX(1)'
                }
              }}
            >
              PREGNANCY WELLNESS
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto', 
                opacity: 0.8,
                fontFamily: '"Mulish", sans-serif'
              }}
            >
              Supporting your journey through pregnancy and beyond with expert guidance and personalized care.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={3} 
            sx={{ 
              animation: 'fadeInUp 0.7s ease both',
              animationDelay: '0.1s'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: '"Quicksand", sans-serif',
                fontWeight: 600,
                fontSize: '1.2rem',
                mb: 2.5,
                position: 'relative',
                pb: 1.2,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '40px',
                  height: '2px',
                  bgcolor: '#f8b195',
                  transition: 'width 0.3s ease'
                },
                '&:hover::after': {
                  width: '60px'
                }
              }}
            >
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="/" 
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Home
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="/about" 
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  About Us
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="/care" 
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Care
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="/appointments" 
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Appointments
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="/dashboard" 
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Dashboard
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={3}
            sx={{ 
              animation: 'fadeInUp 0.7s ease both',
              animationDelay: '0.2s'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: '"Quicksand", sans-serif',
                fontWeight: 600,
                fontSize: '1.2rem',
                mb: 2.5,
                position: 'relative',
                pb: 1.2,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '40px',
                  height: '2px',
                  bgcolor: '#f8b195',
                  transition: 'width 0.3s ease'
                },
                '&:hover::after': {
                  width: '60px'
                }
              }}
            >
              Resources
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="#" 
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Blog
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="#" 
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  FAQ
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="#" 
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Testimonials
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="#"  
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Support
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Community */}
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={3}
            sx={{ 
              animation: 'fadeInUp 0.7s ease both',
              animationDelay: '0.3s'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: '"Quicksand", sans-serif',
                fontWeight: 600,
                fontSize: '1.2rem',
                mb: 2.5,
                position: 'relative',
                pb: 1.2,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '40px',
                  height: '2px',
                  bgcolor: '#f8b195',
                  transition: 'width 0.3s ease'
                },
                '&:hover::after': {
                  width: '60px'
                }
              }}
            >
              Community
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="/community"  
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Forums
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="#"  
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Events
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="#"  
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Members
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.2 }}>
                <Link 
                  component={RouterLink} 
                  to="#"  
                  sx={{ 
                    color: '#4A4A4A',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pl: 0,
                    display: 'inline-block',
                    '&:hover': {
                      color: '#FF1493',
                      pl: 0.6
                    },
                    '&::before': {
                      content: '"›"',
                      position: 'absolute',
                      left: '-15px',
                      opacity: 0,
                      transition: 'all 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1,
                      left: '-5px'
                    }
                  }}
                >
                  Guidelines
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Connect */}
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={3}
            sx={{ 
              animation: 'fadeInUp 0.7s ease both',
              animationDelay: '0.4s'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: '"Quicksand", sans-serif',
                fontWeight: 600,
                fontSize: '1.2rem',
                mb: 2.5,
                position: 'relative',
                pb: 1.2,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '40px',
                  height: '2px',
                  bgcolor: '#f8b195',
                  transition: 'width 0.3s ease'
                },
                '&:hover::after': {
                  width: '60px'
                }
              }}
            >
              Connect
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                fontFamily: '"Mulish", sans-serif'
              }}
            >
              Stay updated with our latest news and updates.
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1.5, 
                mb: 3,
                flexWrap: 'wrap'
              }}
            >
              <IconButton 
                sx={{ 
                  color: '#4A4A4A',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FF1493',
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: '#4A4A4A',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FF1493',
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: '#4A4A4A',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FF1493',
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: '#4A4A4A',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FF1493',
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: '#4A4A4A',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FF1493',
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <Chat fontSize="small" />
              </IconButton>
            </Box>
            
            <Box 
              component="form" 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1.2
              }}
            >
              <TextField
                placeholder="Your email address"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontFamily: '"Mulish", sans-serif',
                    fontSize: '0.9rem',
                    py: 1.5
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#f8b195',
                  color: '#023b4a',
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 1.2,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#f9c4ad',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(74,74,74,0.2)' }} />

        {/* Bottom Footer */}
        <Box 
          sx={{ 
            textAlign: 'center',
            pt: 2
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.7,
              fontFamily: '"Mulish", sans-serif',
              fontSize: '0.9rem'
            }}
          >
            © {new Date().getFullYear()} Pregnancy Wellness. All Rights Reserved.
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 3,
              mt: 1.5
            }}
          >
            <Link 
              component={RouterLink} 
              to="#" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: '"Mulish", sans-serif',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#f8b195'
                }
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              component={RouterLink} 
              to="#" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: '"Mulish", sans-serif',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#f8b195'
                }
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 