import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  useTheme
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Close as CloseIcon, 
  Send as SendIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../theme/colors';
import pregnancyBotResponses from './chatbotResponses';

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
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.trim());
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        action: botResponse.action
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for navigation requests
    if (lowerInput.includes('diet plan') || lowerInput.includes('diet planning')) {
      return {
        text: "I can help you with diet planning. Would you like to go to our Diet Planning page?",
        action: {
          type: 'navigate',
          destination: '/diet-planning'
        }
      };
    }
    
    if (lowerInput.includes('recipe') || lowerInput.includes('healthy food')) {
      return {
        text: "Looking for healthy recipes? I can take you to our Healthy Recipes page.",
        action: {
          type: 'navigate',
          destination: '/healthy-recipes'
        }
      };
    }
    
    if (lowerInput.includes('log meal') || lowerInput.includes('track food')) {
      return {
        text: "Want to log your meals? Let me take you to our Meal Logging page.",
        action: {
          type: 'navigate',
          destination: '/meal-logging'
        }
      };
    }

    // Check for general questions
    for (const response of pregnancyBotResponses) {
      for (const keyword of response.keywords) {
        if (lowerInput.includes(keyword)) {
          return { text: response.response };
        }
      }
    }

    // Default response
    return { 
      text: "I'm not sure I understand. You can ask me about nutrition during pregnancy, meal planning, or healthy recipes. You can also ask me to navigate to different pages of our app."
    };
  };

  const handleActionClick = (action) => {
    if (action?.type === 'navigate') {
      navigate(action.destination);
      setIsOpen(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
                  bgcolor: COLORS.primary,
                  '&:hover': {
                    bgcolor: COLORS.primary,
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
                  width: { xs: 320, sm: 360 },
                  height: 480,
                  borderRadius: 3,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                }}
              >
                {/* Chat header */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: COLORS.primary,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src="/assets/bot-avatar.png"
                      alt="Pregnancy Assistant"
                      sx={{ width: 36, height: 36, mr: 1.5, bgcolor: 'white' }}
                    >
                      <ChatIcon sx={{ color: COLORS.primary }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Pregnancy Assistant
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {isTyping ? 'Typing...' : 'Online'}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={toggleChat}
                    sx={{ color: 'white' }}
                  >
                    <CloseIcon />
                  </IconButton>
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
                    bgcolor: '#f5f7fb'
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
                                bgcolor: COLORS.primary,
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
                              bgcolor: message.sender === 'user' ? COLORS.primary : 'white',
                              color: message.sender === 'user' ? 'white' : 'text.primary',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              position: 'relative',
                              ...(message.sender === 'user' ? {
                                borderTopRightRadius: 0,
                              } : {
                                borderTopLeftRadius: 0,
                              })
                            }}
                          >
                            <Typography variant="body2">
                              {message.text}
                            </Typography>
                            
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
                                    bgcolor: `${COLORS.primary}15`,
                                    color: COLORS.primary,
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: `${COLORS.primary}25`,
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
                                mt: 0.5, 
                                opacity: 0.7,
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
                              bgcolor: COLORS.primary,
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
                                bgcolor: COLORS.primary,
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
                                bgcolor: COLORS.primary,
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
                                bgcolor: COLORS.primary,
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

                {/* Chat input */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'white'
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
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            sx={{
                              color: inputValue.trim() ? COLORS.primary : 'text.disabled',
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: inputValue.trim() ? `${COLORS.primary}15` : 'transparent',
                              }
                            }}
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: 'divider',
                        },
                        '&:hover fieldset': {
                          borderColor: `${COLORS.primary}80`,
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
