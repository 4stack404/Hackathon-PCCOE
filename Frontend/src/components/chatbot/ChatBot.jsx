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
  CircularProgress,
  Dialog,
  DialogContent
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
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';

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

const pulseRing = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
`;

const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
`;

const blink = keyframes`
  from, to { opacity: 1; }
  50% { opacity: 0; }
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

// First, define the MessageBubble component outside of ChatBot
const MessageBubble = ({ 
  message, 
  isExpanded, 
  isTyping: isMsgTyping, 
  displayText,
  expandTransition,
  isInitialMessage
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        mb: isExpanded ? 2 : 1.5,
        px: isExpanded ? 3 : 2,
        ...expandTransition,
      }}
    >
      {message.sender === 'bot' && (
        <Avatar
          src="/assets/bot-avatar.png"
          alt="Bot"
          sx={{ 
            width: isExpanded ? 48 : 32,
            height: isExpanded ? 48 : 32,
            mr: isExpanded ? 2 : 1,
            bgcolor: CHAT_COLORS.primary,
            ...expandTransition,
          }}
        >
          <ChatIcon sx={{ fontSize: isExpanded ? '1.5rem' : '1rem' }} />
        </Avatar>
      )}
      
      <Box
        sx={{
          maxWidth: isExpanded ? '70%' : '80%',
          p: isExpanded ? 2.5 : 1.5,
          borderRadius: 2,
          bgcolor: message.sender === 'user' ? CHAT_COLORS.userMessage : CHAT_COLORS.botMessage,
          color: message.sender === 'user' ? 'white' : CHAT_COLORS.text.primary,
          position: 'relative',
          boxShadow: isExpanded ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
          ...(message.sender === 'user' ? {
            borderTopRightRadius: 0,
          } : {
            borderTopLeftRadius: 0,
          }),
          ...expandTransition,
        }}
      >
        {message.sender === 'user' ? (
          <Typography 
            variant="body1"
            sx={{ 
              fontSize: isExpanded ? {
                xs: '1rem',
                sm: '1.1rem',
                md: '1.2rem'
              } : '1rem',
              lineHeight: isExpanded ? 1.6 : 1.5,
              color: 'inherit',
              ...expandTransition,
            }}
          >
            {displayText}
          </Typography>
        ) : (
          <Box sx={{ 
            '& .wmde-markdown': {
              backgroundColor: 'transparent',
              fontSize: isExpanded ? {
                xs: '1rem',
                sm: '1.1rem',
                md: '1.2rem'
              } : '1rem',
              lineHeight: isExpanded ? 1.6 : 1.5,
            },
            '& .wmde-markdown pre': {
              backgroundColor: alpha(CHAT_COLORS.primary, 0.1),
            },
            '& .wmde-markdown code': {
              backgroundColor: alpha(CHAT_COLORS.primary, 0.1),
              color: CHAT_COLORS.text.primary,
              padding: '2px 4px',
              borderRadius: 1,
            },
            '& .wmde-markdown ul, & .wmde-markdown ol': {
              paddingLeft: '20px',
              margin: '8px 0',
            },
            '& .wmde-markdown li': {
              margin: '4px 0',
            },
            '& .wmde-markdown p': {
              margin: '8px 0',
            },
          }}>
            <MarkdownPreview 
              source={isInitialMessage ? message.text : displayText} 
              remarkPlugins={[remarkGfm]}
              wrapperElement={{
                "data-color-mode": "light"
              }}
            />
            {isMsgTyping && !isInitialMessage && (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  ml: 0.5,
                  animation: `${blink} 1s step-end infinite`
                }}
              >
                ▋
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      text: "Hello! I'm your pregnancy wellness assistant. How can I help you today? You can:\n\n" +
            "- Ask questions about pregnancy and wellness\n" +
            "- Get diet and nutrition advice\n" +
            "- Learn about exercise during pregnancy\n" +
            "- Get information about prenatal care\n\n" +
            "Feel free to type your question or use the microphone to speak!",
      sender: 'bot',
      timestamp: new Date().toISOString()
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
  const [typingText, setTypingText] = useState(new Map());
  const [completedMessages, setCompletedMessages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [conversations, setConversations] = useState([]);
  const [voiceHistory, setVoiceHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesisRef = useRef(null);

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

  // Add this useEffect to mark the initial message as completed
  useEffect(() => {
    // Mark the initial message as completed so it shows immediately
    if (messages.length === 1) {
      setCompletedMessages(new Set([messages[0].id]));
    }
  }, []);

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
    setTypingText(new Map().set(messageId, '')); // Initialize empty text
    const words = text.split(' ');
    let currentIndex = 0;
    const wordsPerFrame = 3;
    
    const typeInterval = setInterval(() => {
      if (currentIndex < words.length) {
        const endIndex = Math.min(currentIndex + wordsPerFrame, words.length);
        const currentText = words.slice(0, endIndex).join(' ');
        setTypingText(prev => new Map(prev).set(messageId, currentText));
        currentIndex = endIndex;
      } else {
        clearInterval(typeInterval);
        setCompletedMessages(prev => new Set(prev).add(messageId));
        setTypingText(prev => {
          const newMap = new Map(prev);
          newMap.delete(messageId);
          return newMap;
        });
      }
    }, 30);

    return () => clearInterval(typeInterval);
  };

  // Add this effect to initialize speech synthesis
  useEffect(() => {
    // Load voices when component mounts
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    // Cleanup
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Update the toggleSpeech function
  const toggleSpeech = () => {
    const newSpeechState = !isSpeechEnabled;
    setIsSpeechEnabled(newSpeechState);
    
    if (!newSpeechState) {
      // If turning off, cancel any ongoing speech
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Add this function to safely check if speech synthesis is available
  const isSpeechSynthesisAvailable = () => {
    return typeof window !== 'undefined' && 
           window.speechSynthesis && 
           typeof window.speechSynthesis.speak === 'function';
  };

  // Update the speakText function with better error handling
  const speakText = (text) => {
    if (!isSpeechSynthesisAvailable()) {
      console.warn('Speech synthesis is not available in this browser');
      return;
    }
    
    if (!isSpeechEnabled) {
      console.log('Speech is disabled, not speaking');
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const cleanText = text.replace(/[*#\[\]`]/g, '')
                           .replace(/\n/g, ' ')
                           .replace(/\s+/g, ' ')
                           .trim();

      if (!cleanText) {
        console.log('No text to speak');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Try to get a voice that works well
      const voices = window.speechSynthesis.getVoices();
      
      // First try to find an Indian English voice
      let selectedVoice = voices.find(voice => 
        voice.name.includes('Indian') || 
        voice.name.includes('Raveena') || 
        voice.name.includes('Priya')
      );
      
      // If no Indian voice, try to find any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('en') || 
          voice.name.includes('English')
        );
      }
      
      // If still no voice, use the default
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name);
      } else {
        console.log('No suitable voice found, using default voice');
      }

      // Configure speech properties
      utterance.rate = 0.85;  // Slower for clarity
      utterance.pitch = 1.0;  // Normal pitch
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        
        // Try again with simpler settings if there was an error
        if (event.error !== 'canceled') {
          try {
            const simpleUtterance = new SpeechSynthesisUtterance(cleanText);
            simpleUtterance.rate = 1.0;
            simpleUtterance.pitch = 1.0;
            simpleUtterance.onend = () => setIsSpeaking(false);
            simpleUtterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(simpleUtterance);
          } catch (fallbackError) {
            console.error('Fallback speech also failed:', fallbackError);
          }
        }
      };

      // Only speak if speech is enabled
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      setIsSpeaking(false);
    }
  };

  // Update the handleVoiceInput function to respect the isSpeechEnabled state and ensure speech is properly toggled
  const handleVoiceInput = async (transcript) => {
    if (!transcript.trim()) return;

    try {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const userMessage = {
        id: Date.now(),
        text: transcript,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      const response = await chatService.askQuestion(transcript);
      const botResponse = response.answer.replace('**Direct Answer:**', '');
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
      setCompletedMessages(prev => new Set(prev).add(botMessage.id));
      
      // Only speak if speech is enabled
      if (isSpeechEnabled) {
        speakText(botResponse);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setCompletedMessages(prev => new Set(prev).add(errorMessage.id));
      
      // Only speak error message if speech is enabled
      if (isSpeechEnabled) {
        speakText(errorMessage.text);
      }
    } finally {
      setIsTyping(false);
      setVoiceTranscript('');
    }
  };

  // Update the handleSend function with better error handling
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsLoading(true);

    // Create a placeholder for the bot response
    const botResponseId = Date.now() + 1;
    const botPlaceholder = {
      id: botResponseId,
      text: '',
      sender: 'bot',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, botPlaceholder]);
    setTypingText(prev => new Map(prev).set(botResponseId, ''));

    try {
      // Check if the API is available
      let apiAvailable = false;
      try {
        const healthCheck = await chatService.checkHealth();
        apiAvailable = healthCheck.status === 'ok';
      } catch (healthError) {
        console.warn('API health check failed:', healthError);
        apiAvailable = false;
      }

      let botResponse;
      
      if (apiAvailable) {
        // Try to get a response from the API
        try {
          const response = await chatService.askQuestion(inputValue);
          botResponse = response.answer || "I'm sorry, I couldn't find an answer to that question.";
        } catch (apiError) {
          console.error('API error:', apiError);
          throw new Error('Failed to get response from the API');
        }
      } else {
        // Fallback to a local response if API is not available
        botResponse = getFallbackResponse(inputValue);
      }

      // Simulate typing effect
      let displayedText = '';
      const words = botResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        displayedText += (i > 0 ? ' ' : '') + words[i];
        setTypingText(prev => new Map(prev).set(botResponseId, displayedText));
        
        // Adjust typing speed based on word length
        const delay = Math.min(100, 20 + words[i].length * 10);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Update the message with the full response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botResponseId 
            ? { ...msg, text: botResponse } 
            : msg
        )
      );
      
      // Mark message as completed
      setCompletedMessages(prev => new Set(prev).add(botResponseId));
      
      // Only speak if speech is enabled
      if (isSpeechEnabled) {
        speakText(botResponse);
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      // Create a friendly error message
      const errorMessage = {
        id: botResponseId,
        text: "I'm having trouble connecting to my knowledge base right now. Please try again later or ask me something else.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      // Update the placeholder with the error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botResponseId 
            ? errorMessage
            : msg
        )
      );
      
      // Mark message as completed
      setCompletedMessages(prev => new Set(prev).add(botResponseId));
      
      // Only speak error message if speech is enabled
      if (isSpeechEnabled) {
        speakText(errorMessage.text);
      }
    } finally {
      setIsTyping(false);
      setIsLoading(false);
      // Scroll to the bottom
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Add a fallback response function
  const getFallbackResponse = (query) => {
    const normalizedQuery = query.toLowerCase();
    
    // Common pregnancy-related queries
    if (normalizedQuery.includes('morning sickness') || normalizedQuery.includes('nausea')) {
      return "Morning sickness is common in early pregnancy. Try eating small, frequent meals, staying hydrated, and avoiding triggers. Ginger tea or crackers may help. If severe, consult your doctor.";
    }
    
    if (normalizedQuery.includes('exercise') || normalizedQuery.includes('workout')) {
      return "Moderate exercise is generally safe during pregnancy. Walking, swimming, and prenatal yoga are excellent options. Always consult your healthcare provider before starting any exercise routine.";
    }
    
    if (normalizedQuery.includes('diet') || normalizedQuery.includes('food') || normalizedQuery.includes('eat')) {
      return "A balanced diet is crucial during pregnancy. Focus on fruits, vegetables, whole grains, lean proteins, and dairy. Stay hydrated and take prenatal vitamins as recommended by your doctor.";
    }
    
    if (normalizedQuery.includes('sleep') || normalizedQuery.includes('insomnia')) {
      return "Sleep challenges are common during pregnancy. Try sleeping on your left side with pillows for support, establish a bedtime routine, and avoid caffeine and screens before bed.";
    }
    
    // Default response
    return "I'm currently having trouble connecting to my knowledge base. This is a basic response. For more detailed information, please try again later or consult your healthcare provider.";
  };

  // Add a function to stop speaking
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Update the initializeSpeechRecognition function
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return null;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsListening(true);
      // Stop speaking when user starts talking
      stopSpeaking();
    };

    recognitionInstance.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;

      setVoiceTranscript(transcript);

      if (lastResult.isFinal) {
        handleVoiceInput(transcript);
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recognitionInstance.onend = () => {
      if (isVoiceMode) {
        try {
          recognitionInstance.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    return recognitionInstance;
  };

  // Update the toggleVoiceMode function
  const toggleVoiceMode = () => {
    if (!isVoiceMode) {
      setIsVoiceMode(true);
      setVoiceTranscript('');
      if (!recognition) {
        const newRecognition = initializeSpeechRecognition();
        if (newRecognition) {
          setRecognition(newRecognition);
          newRecognition.start();
        }
      } else {
        try {
          recognition.start();
        } catch (error) {
          console.error('Error starting recognition:', error);
        }
      }
    } else {
      setIsVoiceMode(false);
      if (recognition) {
        recognition.stop();
      }
      if (isBotSpeaking) {
        window.speechSynthesis.cancel();
        setIsBotSpeaking(false);
      }
      setVoiceTranscript('');
    }
  };

  // Update the VoiceModeIndicator component to show speaking status
  const VoiceModeIndicator = ({ isListening, isSpeaking, transcript }) => (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        p: 2,
        bgcolor: CHAT_COLORS.botMessage,
        borderBottom: `1px solid ${CHAT_COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => !isSpeaking && toggleVoiceMode()}
          color={isListening ? "error" : "primary"}
          sx={{
            bgcolor: isListening ? alpha(CHAT_COLORS.accent, 0.1) : 'transparent',
            animation: isListening ? `${pulseRing} 1.5s infinite` : 'none',
          }}
        >
          {isListening ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
        {isSpeaking && (
          <IconButton
            onClick={stopSpeaking}
            color="primary"
            sx={{
              animation: `${pulseRing} 1.5s infinite`,
            }}
          >
            <VolumeUpIcon />
          </IconButton>
        )}
      </Box>
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          color: CHAT_COLORS.text.primary,
        }}
      >
        {isListening ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>Listening:</span>
            <span style={{ fontStyle: 'italic', color: CHAT_COLORS.text.secondary }}>
              {transcript || 'Speak now...'}
            </span>
          </Box>
        ) : isSpeaking ? (
          'Speaking...'
        ) : (
          'Tap mic to speak'
        )}
      </Typography>
    </Box>
  );

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

  // Add console logs for debugging
  useEffect(() => {
    console.log('Voice mode:', isVoiceMode);
    console.log('Is listening:', isListening);
    console.log('Is bot speaking:', isBotSpeaking);
  }, [isVoiceMode, isListening, isBotSpeaking]);

  // Add this debug button in development mode
  {process.env.NODE_ENV === 'development' && (
    <Button
      variant="outlined"
      size="small"
      onClick={() => {
        console.log('Current state:', {
          isVoiceMode,
          isListening,
          isBotSpeaking,
          recognition,
          messages
        });
      }}
      sx={{ position: 'absolute', top: 0, right: 0, m: 1 }}
    >
      Debug
    </Button>
  )}

  // Add a button to manually test speech (for debugging)
  {process.env.NODE_ENV === 'development' && (
    <Button
      variant="outlined"
      size="small"
      onClick={() => {
        speakText("This is a test message to verify speech synthesis is working.");
      }}
      sx={{ position: 'absolute', top: 0, right: 0, m: 1 }}
    >
      Test Speech
    </Button>
  )}

  // Update the expandTransition constant
  const expandTransition = {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                elevation={3}
                sx={{
                  height: isExpanded ? {
                    xs: '85vh',
                    sm: '80vh',
                    md: '75vh'
                  } : {
                    xs: '80vh',
                    sm: '600px',
                    md: '600px'
                  },
                  width: isExpanded ? {
                    xs: '95vw',
                    sm: '600px',
                    md: '800px',
                    lg: '1000px'
                  } : {
                    xs: '95vw',
                    sm: '400px',
                    md: '450px'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                  ...expandTransition,
                  boxShadow: isExpanded 
                    ? '0 8px 32px rgba(0,0,0,0.1)' 
                    : '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {/* Chat Header */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: CHAT_COLORS.primary,
                    color: 'white',
                    borderBottom: `1px solid ${CHAT_COLORS.border}`,
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {/* Expand/Collapse Button */}
                  <IconButton
                    onClick={() => setIsExpanded(!isExpanded)}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        bgcolor: alpha('#fff', 0.1),
                      },
                      padding: '4px',
                    }}
                  >
                    {isExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                  </IconButton>

                  <Typography 
                    variant="h6"
                    sx={{ 
                      flex: 1,
                      fontSize: isExpanded ? {
                        xs: '1.25rem',
                        sm: '1.5rem'
                      } : '1.25rem',
                      ...expandTransition
                    }}
                  >
                    Chat Assistant
                  </Typography>

                  <IconButton
                    onClick={toggleSpeech}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        bgcolor: alpha('#fff', 0.1),
                      },
                    }}
                  >
                    {isSpeechEnabled ? <VolumeUpIcon /> : <VolumeMuteIcon />}
                  </IconButton>

                  {/* Add Close Button */}
                  <IconButton
                    onClick={() => setIsOpen(false)}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        bgcolor: alpha('#fff', 0.1),
                      },
                    }}
                    aria-label="close chatbot"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Main Chat Container */}
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                    bgcolor: CHAT_COLORS.background,
                  }}
                >
                  {/* Voice Mode Indicator */}
                  {isVoiceMode && (
                    <VoiceModeIndicator
                      isListening={isListening}
                      isSpeaking={isSpeaking}
                      transcript={voiceTranscript}
                    />
                  )}

                  {/* Messages Container */}
                  <Box
                    ref={messagesEndRef}
                    sx={{
                      flex: 1,
                      overflowY: 'auto',
                      pt: isVoiceMode ? '64px' : 2,
                      pb: 2,
                      position: 'relative',
                      bgcolor: 'inherit',
                      ...expandTransition,
                    }}
                  >
                    {messages.map((message) => (
                      <MessageBubble 
                        key={message.id}
                        message={message}
                        isExpanded={isExpanded}
                        isTyping={!completedMessages.has(message.id) && message.sender === 'bot'}
                        displayText={
                          !completedMessages.has(message.id) && message.sender === 'bot'
                            ? typingText.get(message.id) || ''
                            : message.text
                        }
                        expandTransition={expandTransition}
                        isInitialMessage={message.id === messages[0].id}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Chat Input Section */}
                  <Box
                    sx={{
                      p: isExpanded ? 3 : 2,
                      borderTop: `1px solid ${CHAT_COLORS.border}`,
                      bgcolor: CHAT_COLORS.botMessage,
                      zIndex: 2,
                      ...expandTransition,
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        mb: 1,
                        justifyContent: 'flex-start'
                      }}
                    >
                      <IconButton
                        onClick={toggleVoiceMode}
                        color={isVoiceMode ? "error" : "primary"}
                        sx={{
                          width: isExpanded ? 48 : 40,
                          height: isExpanded ? 48 : 40,
                          bgcolor: alpha(isVoiceMode ? CHAT_COLORS.accent : CHAT_COLORS.primary, 0.1),
                          '&:hover': {
                            bgcolor: alpha(isVoiceMode ? CHAT_COLORS.accent : CHAT_COLORS.primary, 0.2),
                          },
                          ...expandTransition,
                        }}
                      >
                        {isVoiceMode ? (
                          <MicOffIcon sx={{ fontSize: isExpanded ? 28 : 24 }} />
                        ) : (
                          <MicIcon sx={{ fontSize: isExpanded ? 28 : 24 }} />
                        )}
                      </IconButton>
                    </Box>
                    
                    {!isVoiceMode && (
                      <TextField
                        fullWidth
                        placeholder="Type your message..."
                        variant="outlined"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        disabled={isListening}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: isExpanded ? '1.1rem' : '1rem',
                            ...expandTransition,
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                color="primary"
                                sx={{
                                  width: isExpanded ? 48 : 40,
                                  height: isExpanded ? 48 : 40,
                                  ...expandTransition,
                                }}
                              >
                                <SendIcon sx={{ fontSize: isExpanded ? 28 : 24 }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                        }}
                      />
                    )}
                          </Box>
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
