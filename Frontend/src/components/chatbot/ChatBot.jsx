import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  TextField, 
  InputAdornment,
  Avatar,
  Paper,
  List,
  ListItem,
  Divider,
  Fab,
  Zoom,
  useTheme,
  Button,
  Tooltip,
  Fade,
  Chip,
  CircularProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// Import all required icons
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

import { chatService } from '../../services/chatbotService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { keyframes } from '@mui/system';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { COLORS } from '../../theme/colors';

// Animation variants
const chatButtonVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.1,
    boxShadow: "0px 8px 15px rgba(0,0,0,0.2)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

const chatWindowVariants = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

const messageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 150 }
  }
};

// Add these animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const CHAT_COLORS = {
  primary: '#ff8fb1',        // Lighter pink
  secondary: '#fcadc7',      // Your existing pink
  accent: '#ff6b95',         // Darker pink
  background: '#fef6f9',     // Light pink background
  botMessage: '#ffffff',     // White for bot messages
  userMessage: '#ff8fb1',    // Pink for user messages
  border: '#ffe5ed',         // Light pink border
  text: {
    primary: '#2c1810',      // Dark text
    secondary: '#5c4f4a',    // Secondary text
    light: '#8b7355'         // Light text
  }
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your pregnancy wellness assistant. How can I help you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [isWindowExpanded, setIsWindowExpanded] = useState(false);
  const [typedMessages, setTypedMessages] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const typeMessage = (messageId, text) => {
    let currentText = '';
    const words = text.split(' ');
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < words.length) {
        // Type 2-3 words at a time for faster typing
        const wordsToAdd = Math.min(3, words.length - currentIndex);
        currentText += words.slice(currentIndex, currentIndex + wordsToAdd).join(' ') + ' ';
        setTypedMessages(prev => new Map(prev).set(messageId, currentText));
        currentIndex += wordsToAdd;
      } else {
        clearInterval(typeInterval);
        setTypedMessages(prev => {
          const newMap = new Map(prev);
          newMap.set(`${messageId}-complete`, true);
          return newMap;
        });
      }
    }, 30); // Reduced interval time
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await chatService.askQuestion(inputValue.trim());
      const botMessage = {
        id: messages.length + 2,
        text: response.answer.replace('**Direct Answer:**', ''),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      // Start typing effect for new message
      typeMessage(botMessage.id, botMessage.text);
    } catch (error) {
      // Handle error
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toISOString()
      }]);
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  // Helper function to detect navigation actions from response
  const getActionFromResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('diet plan') || lowerText.includes('diet planning')) {
      return {
          type: 'navigate',
          destination: '/diet-planning'
      };
    }
    
    if (lowerText.includes('recipe') || lowerText.includes('healthy food')) {
      return {
          type: 'navigate',
          destination: '/healthy-recipes'
      };
    }
    
    if (lowerText.includes('log meal') || lowerText.includes('track food')) {
      return {
          type: 'navigate',
          destination: '/meal-logging'
      };
    }

    return null;
  };

  const handleActionClick = (action) => {
    if (action?.type === 'navigate') {
      navigate(action.destination);
      setIsOpen(false);
    }
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const toggleMessageExpansion = (messageId) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const toggleWindowSize = () => {
    setIsWindowExpanded(!isWindowExpanded);
  };

  // Update the function to get the most relevant button
  const getMostRelevantButton = (text) => {
    const lowerText = text.toLowerCase();
    
    // Order matters - most specific matches first
    if (lowerText.includes('recipe') || lowerText.includes('cook') || lowerText.includes('meal preparation')) {
      return {
        text: 'View Healthy Recipes',
        path: '/healthy-recipes',
        icon: MenuBookIcon,
        color: '#4ECDC4'
      };
    }
    
    if (lowerText.includes('log meal') || lowerText.includes('track food') || lowerText.includes('food diary')) {
      return {
        text: 'Open Meal Logger',
        path: '/meal-logging',
        icon: LocalDiningIcon,
        color: '#FF9A8B'
      };
    }

    if (lowerText.includes('diet plan') || lowerText.includes('meal plan') || lowerText.includes('nutrition plan')) {
      return {
        text: 'Go to Diet Planning',
        path: '/diet-planning',
        icon: RestaurantMenuIcon,
        color: '#FF6B6B'
      };
    }

    if (lowerText.includes('exercise') || lowerText.includes('workout') || lowerText.includes('physical activity')) {
      return {
        text: 'View Exercise Plans',
        path: '/exercise',
        icon: FitnessCenterIcon,
        color: '#45B7D1'
      };
    }

    if (lowerText.includes('appointment') || lowerText.includes('schedule') || lowerText.includes('doctor visit')) {
      return {
        text: 'Schedule Appointment',
        path: '/appointments',
        icon: EventAvailableIcon,
        color: '#A78BFA'
      };
    }

    return null;
  };

  // Update the suggestion buttons
  const suggestionButtons = [
    {
      text: "Pregnancy Diet",
      icon: RestaurantMenuIcon,
      query: "What should I eat during pregnancy?"
    },
    {
      text: "Safe Exercises",
      icon: FitnessCenterIcon,
      query: "What exercises are safe during pregnancy?"
    },
    {
      text: "Nutrition Tips",
      icon: LocalDiningIcon,
      query: "What are important nutrients during pregnancy?"
    },
    {
      text: "Common Symptoms",
      icon: HealthAndSafetyIcon,
      query: "What are common pregnancy symptoms?"
    }
  ];

  return (
    <>
      {/* Floating chat button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              variants={chatButtonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <Fab
                color="primary"
                aria-label="chat"
                onClick={toggleChat}
                sx={{
                  bgcolor: CHAT_COLORS.primary,
                  '&:hover': {
                    bgcolor: CHAT_COLORS.primary,
                  }
                }}
              >
                <ChatIcon />
              </Fab>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
          >
            <motion.div
              variants={chatWindowVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Paper
                elevation={6}
                sx={{
                  width: { 
                    xs: isWindowExpanded ? '95vw' : '90vw',
                    sm: isWindowExpanded ? '600px' : '360px',
                    md: isWindowExpanded ? '800px' : '400px',
                    lg: isWindowExpanded ? '1000px' : '420px'
                  },
                  height: {
                    xs: isWindowExpanded ? '90vh' : '70vh',
                    sm: isWindowExpanded ? '80vh' : '480px',
                    md: isWindowExpanded ? '80vh' : '500px'
                  },
                  borderRadius: 3,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: CHAT_COLORS.background,
                  boxShadow: `0 10px 40px ${alpha(CHAT_COLORS.primary, 0.2)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: "'Poppins', sans-serif",
                  '&:hover': {
                    boxShadow: `0 15px 50px ${alpha(CHAT_COLORS.primary, 0.3)}`
                  }
                }}
              >
                {/* Chat header */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: CHAT_COLORS.primary,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${CHAT_COLORS.border}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src="/assets/bot-avatar.png"
                      alt="Pregnancy Assistant"
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        mr: 1.5, 
                        bgcolor: 'white',
                        boxShadow: `0 2px 8px ${alpha(CHAT_COLORS.primary, 0.3)}`
                      }}
                    >
                      <ChatIcon sx={{ color: CHAT_COLORS.primary }} />
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '1.1rem',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Pregnancy Assistant
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: 0.9,
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '0.75rem'
                        }}
                      >
                        {isTyping ? 'Typing...' : 'Online'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={toggleWindowSize}
                      sx={{ 
                        color: 'white',
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.1)
                        }
                      }}
                    >
                      {isWindowExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={toggleChat}
                      sx={{ 
                        color: 'white',
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.1)
                        }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Chat messages */}
                <Box
                  sx={{
                    p: 2,
                    flexGrow: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    bgcolor: CHAT_COLORS.background,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: alpha(CHAT_COLORS.primary, 0.2),
                      borderRadius: '4px',
                      '&:hover': {
                        background: alpha(CHAT_COLORS.primary, 0.3),
                      }
                    }
                  }}
                >
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        variants={messageVariants}
                        initial="initial"
                        animate="animate"
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                            alignItems: 'flex-start',
                            mb: 1
                          }}
                        >
                          {message.sender === 'bot' && (
                            <Avatar
                              src="/assets/bot-avatar.png"
                              alt="Bot"
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 1,
                                ml: 0,
                                bgcolor: CHAT_COLORS.primary,
                                color: 'white',
                                fontSize: '0.8rem'
                              }}
                            >
                              <ChatIcon sx={{ fontSize: '1rem' }} />
                            </Avatar>
                          )}
                          
                          <Box
                            sx={{
                              maxWidth: '80%',
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: message.sender === 'user' ? CHAT_COLORS.userMessage : CHAT_COLORS.botMessage,
                              color: message.sender === 'user' ? 'white' : CHAT_COLORS.text.primary,
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              position: 'relative',
                              ...(message.sender === 'user' ? {
                                borderTopRightRadius: 0,
                              } : {
                                borderTopLeftRadius: 0,
                              })
                            }}
                          >
                            {message.sender === 'user' ? (
                              <Typography variant="body2">
                                {message.text}
                              </Typography>
                            ) : (
                              <Box>
                                <Box
                                  sx={{
                                    maxHeight: expandedMessages.has(message.id) ? 'none' : '150px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&::after': !expandedMessages.has(message.id) && message.text.length > 300 ? {
                                      content: '""',
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      height: '50px',
                                      background: 'linear-gradient(transparent, white)',
                                      pointerEvents: 'none'
                                    } : {}
                                  }}
                                >
                                  <MarkdownPreview 
                                    source={message.text}
                                    style={{
                                      backgroundColor: 'transparent',
                                      color: message.sender === 'user' ? 'white' : 'inherit'
                                    }}
                                  />
                                </Box>

                                {/* Navigation Button - only show after typing is complete */}
                                {typedMessages.get(`${message.id}-complete`) && 
                                 getMostRelevantButton(message.text) && (
                                  <Fade in={true}>
                                    <Box sx={{ mt: 2 }}>
                                      {(() => {
                                        const button = getMostRelevantButton(message.text);
                                        const ButtonIcon = button.icon;
                                        
                                        return (
                                          <Button
                                            variant="contained"
                                            startIcon={<ButtonIcon />}
                                            onClick={() => navigate(button.path)}
                                            sx={{
                                              bgcolor: button.color,
                                              color: 'white',
                                              textTransform: 'none',
                                              borderRadius: 2,
                                              px: 2.5,
                                              py: 1,
                                              fontWeight: 500,
                                              fontSize: '0.9rem',
                                              fontFamily: "'Poppins', sans-serif",
                                              boxShadow: `0 4px 12px ${alpha(button.color, 0.3)}`,
                                              '&:hover': {
                                                bgcolor: button.color,
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 6px 16px ${alpha(button.color, 0.4)}`,
                                              },
                                              '&:active': {
                                                transform: 'translateY(0)',
                                              },
                                              transition: 'all 0.2s ease'
                                            }}
                                          >
                                            {button.text}
                                          </Button>
                                        );
                                      })()}
                                    </Box>
                                  </Fade>
                                )}

                                {message.text.length > 300 && (
                                  <Button
                                    size="small"
                                    onClick={() => toggleMessageExpansion(message.id)}
                                    sx={{
                                      mt: 2,
                                      color: CHAT_COLORS.primary,
                                      fontFamily: "'Poppins', sans-serif",
                                      fontWeight: 500,
                                      fontSize: '0.85rem',
                                      textTransform: 'none',
                                      borderRadius: 1.5,
                                      px: 2,
                                      py: 0.5,
                                      bgcolor: alpha(CHAT_COLORS.primary, 0.05),
                                      '&:hover': {
                                        bgcolor: alpha(CHAT_COLORS.primary, 0.1),
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.2s ease'
                                      }
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      {expandedMessages.has(message.id) ? (
                                        <ExpandLessIcon fontSize="small" />
                                      ) : (
                                        <ExpandMoreIcon fontSize="small" />
                                      )}
                                      {expandedMessages.has(message.id) ? 'Show Less' : 'Read More'}
                                    </Box>
                                  </Button>
                                )}
                              </Box>
                            )}
                            
                            {message.action && (
                              <Box sx={{ mt: 1 }}>
                                <Box
                                  onClick={() => handleActionClick(message.action)}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 0.5,
                                    borderRadius: 1,
                                    bgcolor: `${CHAT_COLORS.primary}15`,
                                    color: CHAT_COLORS.primary,
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: `${CHAT_COLORS.primary}25`,
                                    }
                                  }}
                                >
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Go to page
                                  </Typography>
                                  <NavigateNextIcon fontSize="small" />
                                </Box>
                              </Box>
                            )}
                            
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block', 
                                mt: 1,
                                opacity: 0.7,
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.7rem',
                                textAlign: message.sender === 'user' ? 'right' : 'left'
                              }}
                            >
                              {formatTime(message.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div
                        variants={messageVariants}
                        initial="initial"
                        animate="animate"
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1
                          }}
                        >
                          <Avatar
                            src="/assets/bot-avatar.png"
                            alt="Bot"
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 1,
                              bgcolor: CHAT_COLORS.primary,
                              color: 'white',
                              fontSize: '0.8rem'
                            }}
                          >
                            <ChatIcon sx={{ fontSize: '1rem' }} />
                          </Avatar>
                          
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'white',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              borderTopLeftRadius: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: CHAT_COLORS.primary,
                                animation: 'pulse 1s infinite',
                                '@keyframes pulse': {
                                  '0%': {
                                    opacity: 0.5,
                                    transform: 'scale(0.8)',
                                  },
                                  '50%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                  },
                                  '100%': {
                                    opacity: 0.5,
                                    transform: 'scale(0.8)',
                                  },
                                },
                              }}
                            />
                            <Box
                              component="span"
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: CHAT_COLORS.primary,
                                animation: 'pulse 1s infinite 0.2s',
                                '@keyframes pulse': {
                                  '0%': {
                                    opacity: 0.5,
                                    transform: 'scale(0.8)',
                                  },
                                  '50%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                  },
                                  '100%': {
                                    opacity: 0.5,
                                    transform: 'scale(0.8)',
                                  },
                                },
                              }}
                            />
                            <Box
                              component="span"
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: CHAT_COLORS.primary,
                                animation: 'pulse 1s infinite 0.4s',
                                '@keyframes pulse': {
                                  '0%': {
                                    opacity: 0.5,
                                    transform: 'scale(0.8)',
                                  },
                                  '50%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                  },
                                  '100%': {
                                    opacity: 0.5,
                                    transform: 'scale(0.8)',
                                  },
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </Box>

                {/* Suggestion buttons */}
                <Box
                  sx={{
                    p: 1.5,
                    borderTop: `1px solid ${CHAT_COLORS.border}`,
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    bgcolor: alpha(CHAT_COLORS.botMessage, 0.5),
                    '&::-webkit-scrollbar': {
                      height: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: alpha(CHAT_COLORS.primary, 0.2),
                      borderRadius: '3px',
                      '&:hover': {
                        background: alpha(CHAT_COLORS.primary, 0.3),
                      }
                    }
                  }}
                >
                  {suggestionButtons.map((button, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      startIcon={<button.icon />}
                      onClick={() => {
                        setInputValue(button.query);
                        handleSend();
                      }}
                      sx={{
                        borderColor: alpha(CHAT_COLORS.primary, 0.3),
                        color: CHAT_COLORS.primary,
                        bgcolor: alpha(CHAT_COLORS.botMessage, 0.8),
                        whiteSpace: 'nowrap',
                        minWidth: 'auto',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: CHAT_COLORS.primary,
                          bgcolor: alpha(CHAT_COLORS.primary, 0.05),
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease'
                        }
                      }}
                    >
                      {button.text}
                    </Button>
                  ))}
                </Box>

                {/* Chat input */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: `1px solid ${CHAT_COLORS.border}`,
                    bgcolor: CHAT_COLORS.botMessage
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    variant="outlined"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    inputRef={inputRef}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isLoading}
                            sx={{
                              color: inputValue.trim() ? CHAT_COLORS.primary : 'text.disabled',
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: inputValue.trim() ? `${CHAT_COLORS.primary}15` : 'transparent',
                              }
                            }}
                          >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: 'divider',
                        },
                        '&:hover fieldset': {
                          borderColor: `${CHAT_COLORS.primary}80`,
                        },
                      }
                    }}
                  />
                </Box>
              </Paper>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
