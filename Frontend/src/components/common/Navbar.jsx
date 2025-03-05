import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { name: 'Appointments', path: '/appointments' },
  { name: 'About', path: '/about' },
  { name: 'Care', path: '/care' }
];

const actionItems = [
  { name: 'Diet', path: '/diet'},
  { name: 'Community', path: '/community' }
];

const settings = [
  { name: 'Profile', path: '/profile' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Logout', action: 'logout' }
];

function Navbar() {
  const { currentUser, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      logout();
    }
    handleCloseUserMenu();
    if (mobileOpen) setMobileOpen(false);
  };

  // Close drawer when route changes
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
  }, [location.pathname]);

  // Add letter animation to logo
  useEffect(() => {
    const logoElement = document.querySelector('.logo-text');
    if (logoElement) {
      const text = logoElement.textContent;
      logoElement.textContent = '';

      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.animationDelay = `${i * 0.1}s`;
        span.style.display = 'inline-block';
        logoElement.appendChild(span);
      }

      // Add hover animation to each letter
      const letters = logoElement.querySelectorAll('span');
      letters.forEach(letter => {
        letter.addEventListener('mouseover', function () {
          this.style.animation = 'letterPulse 0.5s ease';
          this.style.color = '#f8b195';
          setTimeout(() => {
            this.style.animation = '';
            this.style.color = '';
          }, 500);
        });
      });
    }
  }, []);

  const drawer = (
    <Box 
      onClick={handleDrawerToggle} 
      sx={{ 
        textAlign: 'center',
        bgcolor: '#023b4a',
        color: 'white',
        height: '100%'
      }}
    >
      <Typography variant="h6" sx={{ my: 2, fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
        PREGNANCY WELLNESS
      </Typography>
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              sx={{ 
                textAlign: 'center',
                py: 1.6,
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  pl: 3
                }
              }}
            >
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {actionItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              sx={{ 
                textAlign: 'center',
                py: 1.6,
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  pl: 3
                }
              }}
            >
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {!currentUser && (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/login"
                sx={{ 
                  textAlign: 'center',
                  py: 1.6,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    pl: 3
                  }
                }}
              >
                <ListItemText 
                  primary="Login" 
                  primaryTypographyProps={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 500
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/signup"
                sx={{ 
                  textAlign: 'center',
                  py: 1.6,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    pl: 3
                  }
                }}
              >
                <ListItemText 
                  primary="Sign Up" 
                  primaryTypographyProps={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {currentUser && settings.map((setting) => (
          <ListItem key={setting.name} disablePadding>
            <ListItemButton 
              component={setting.path ? RouterLink : 'button'}
              to={setting.path}
              onClick={setting.action ? () => handleMenuItemClick(setting) : undefined}
              sx={{ 
                textAlign: 'center',
                py: 1.6,
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  pl: 3
                }
              }}
            >
              <ListItemText 
                primary={setting.name} 
                primaryTypographyProps={{
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: '#FFF0F3',
        boxShadow: '0 2px 15px rgba(255, 20, 147, 0.1)',
        color: '#FF1493',
        animation: 'fadeIn 0.7s ease',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        <Toolbar 
          disableGutters 
          sx={{ 
            height: { xs: '60px', sm: '70px' },
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {/* Left side */}
          <Box 
            sx={{ 
              width: { xs: '50%', md: '15%' }, 
              display: 'flex', 
              justifyContent: { xs: 'flex-start', md: 'flex-start' },
              alignItems: 'center',
              height: '100%'
            }}
          >
            {/* Mobile logo (visible on small screens) */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                display: { xs: 'block', md: 'none' },
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1.2rem', sm: '1.8rem' },
                color: '#FF1493',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {isSmall ? 'PW' : 'PREGNANCY WELLNESS'}
            </Typography>
          </Box>

          {/* Middle section with nav items and logo */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              width: '70%',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { md: 1, lg: 3 },
              height: '100%'
            }}
          >
            {/* Left nav buttons */}
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item, index) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    color: '#FF1493',
                    height: '70px',
                    px: { md: 1.5, lg: 2.2 },
                    position: 'relative',
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 600,
                    fontSize: { md: '0.9rem', lg: '1rem' },
                    letterSpacing: '0.5px',
                    textTransform: 'none',
                    animation: 'fadeIn 0.5s ease both',
                    animationDelay: `${0.2 + (index * 0.1)}s`,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: 0,
                      height: 3,
                      bgcolor: '#FF1493',
                      transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      transform: 'translateX(-50%)'
                    },
                    '&:hover': {
                      color: '#FF1493',
                      bgcolor: 'rgba(255, 20, 147, 0.05)',
                      '&::after': {
                        width: '80%'
                      }
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Logo */}
            <Typography
              className="logo-text"
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                fontSize: { md: '1.8rem', lg: '2.2rem' },
                color: '#FF1493',
                textDecoration: 'none',
                letterSpacing: { md: '1px', lg: '1.5px' },
                position: 'relative',
                animation: 'fadeIn 0.7s ease',
                whiteSpace: 'nowrap',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: 2,
                  bgcolor: '#FF1493',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.5s ease'
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  '&::after': {
                    transform: 'scaleX(1)'
                  }
                },
                '@keyframes letterPulse': {
                  '0%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-5px)' },
                  '100%': { transform: 'translateY(0)' }
                }
              }}
            >
              PREGNANCY WELLNESS
            </Typography>

            {/* Right nav buttons */}
            <Box sx={{ display: 'flex' }}>
              {actionItems.map((item, index) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    color: '#FF1493',
                    height: '70px',
                    px: { md: 1.5, lg: 2.2 },
                    position: 'relative',
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 600,
                    fontSize: { md: '0.9rem', lg: '1rem' },
                    letterSpacing: '0.5px',
                    textTransform: 'none',
                    animation: 'fadeIn 0.5s ease both',
                    animationDelay: `${0.3 + (index * 0.1)}s`,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: 0,
                      height: 3,
                      bgcolor: '#FF1493',
                      transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      transform: 'translateX(-50%)'
                    },
                    '&:hover': {
                      color: '#FF1493',
                      bgcolor: 'rgba(255, 20, 147, 0.05)',
                      '&::after': {
                        width: '80%'
                      }
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Right side */}
          <Box 
            sx={{ 
              width: { xs: '50%', md: '15%' }, 
              display: 'flex', 
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              height: '100%'
            }}
          >
            {!currentUser ? (
              <>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{ 
                      color: '#FF1493',
                      mr: { md: 0.5, lg: 1 },
                      fontFamily: '"Quicksand", sans-serif',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: { md: '0.9rem', lg: '1rem' },
                      '&:hover': {
                        color: '#FF1493',
                        bgcolor: 'rgba(255, 20, 147, 0.05)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="contained"
                    sx={{ 
                      bgcolor: '#FF1493',
                      color: 'white',
                      fontFamily: '"Quicksand", sans-serif',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: { md: '0.9rem', lg: '1rem' },
                      px: { md: 1.5, lg: 2 },
                      '&:hover': {
                        bgcolor: '#FF69B4'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Tooltip title="Open settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0,
                      width: { md: 42, lg: 48 },
                      height: { md: 42, lg: 48 },
                      bgcolor: '#FF1493',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        bgcolor: '#FF69B4'
                      }
                    }}
                  >
                    {currentUser.profilePicture ? (
                      <Avatar 
                        alt={currentUser.name || "User"} 
                        src={currentUser.profilePicture}
                        sx={{ width: { md: 38, lg: 44 }, height: { md: 38, lg: 44 } }}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ fontSize: { md: 28, lg: 32 }, color: 'white' }} />
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem 
                      key={setting.name} 
                      onClick={() => handleMenuItemClick(setting)}
                      component={setting.path ? RouterLink : 'li'}
                      to={setting.path}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}

            {/* Mobile menu button */}
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                color: '#FF1493',
                '&:hover': {
                  color: '#FF69B4'
                }
              }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: { xs: '80%', sm: 240 },
            maxWidth: 300,
            bgcolor: '#023b4a'
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar; 
