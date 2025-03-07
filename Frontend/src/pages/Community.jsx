import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  CardActions, 
  Avatar, 
  Divider, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  CircularProgress,
  Chip,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { communityService } from '../services/communityService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

// Sample data for questions and answers
const sampleQuestions = [
  {
    id: 1,
    title: "Morning sickness remedies during first trimester?",
    content: "I'm 8 weeks pregnant and struggling with severe morning sickness. What remedies have worked for you?",
    author: "Sarah J.",
    authorAvatar: "/avatars/avatar1.jpg",
    date: "2023-12-15",
    likes: 24,
    category: "First Trimester",
    answers: [
      {
        id: 101,
        content: "Ginger tea worked wonders for me! I also found that eating small, frequent meals helped keep the nausea at bay. Try to keep crackers by your bedside and eat a few before getting out of bed in the morning.",
        author: "Emily R.",
        authorAvatar: "/avatars/avatar2.jpg",
        date: "2023-12-16",
        likes: 15,
        isAccepted: true
      },
      {
        id: 102,
        content: "Sea-bands (acupressure wristbands) helped me a lot. Also, vitamin B6 supplements with the approval of my doctor made a big difference.",
        author: "Michelle K.",
        authorAvatar: "/avatars/avatar3.jpg",
        date: "2023-12-17",
        likes: 8,
        isAccepted: false
      }
    ]
  },
  {
    id: 2,
    title: "Exercise recommendations during second trimester?",
    content: "I'm entering my second trimester and want to maintain a healthy exercise routine. What exercises are safe and recommended?",
    author: "Jessica T.",
    authorAvatar: "/avatars/avatar4.jpg",
    date: "2023-12-10",
    likes: 18,
    category: "Second Trimester",
    answers: [
      {
        id: 201,
        content: "Swimming is fantastic during pregnancy! It's gentle on your joints while providing a full-body workout. Prenatal yoga is also excellent for maintaining flexibility and preparing for labor.",
        author: "Alicia M.",
        authorAvatar: "/avatars/avatar5.jpg",
        date: "2023-12-11",
        likes: 12,
        isAccepted: true
      }
    ]
  },
  {
    id: 3,
    title: "Preparing for hospital delivery - what to pack?",
    content: "I'm 34 weeks pregnant and starting to prepare my hospital bag. What are the essential items I should pack?",
    author: "Rachel G.",
    authorAvatar: "/avatars/avatar6.jpg",
    date: "2023-12-05",
    likes: 32,
    category: "Third Trimester",
    answers: [
      {
        id: 301,
        content: "Don't forget comfortable clothes for after delivery, nursing bras if you plan to breastfeed, toiletries, phone charger, and going-home outfits for you and baby. Also bring snacks - hospital food isn't always great!",
        author: "Tina L.",
        authorAvatar: "/avatars/avatar7.jpg",
        date: "2023-12-06",
        likes: 20,
        isAccepted: false
      },
      {
        id: 302,
        content: "I recommend bringing your own pillow with a colored pillowcase (so it doesn't get mixed up with hospital pillows), a long charging cable, slip-on shoes, and a folder for all the paperwork you'll receive.",
        author: "Danielle P.",
        authorAvatar: "/avatars/avatar8.jpg",
        date: "2023-12-07",
        likes: 15,
        isAccepted: true
      }
    ]
  }
];

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#FFD6E0',
  color: '#FF5A8C',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#FFB6C1',
  },
}));

const AcceptedAnswerCard = styled(Card)(({ theme }) => ({
  borderLeft: '4px solid #4CAF50',
  marginBottom: theme.spacing(2),
}));

const RegularAnswerCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

function Community() {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openNewQuestion, setOpenNewQuestion] = useState(false);
  const [openNewAnswer, setOpenNewAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('General');
  const [newAnswerContent, setNewAnswerContent] = useState('');
  
  // Categories
  const categories = ['All', 'First Trimester', 'Second Trimester', 'Third Trimester', 'Postpartum', 'General'];
  
  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await communityService.getQuestions();
      if (response.success) {
        setQuestions(response.data);
        setFilteredQuestions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast.error('Failed to load questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  
  // Filter questions based on search term and category
  useEffect(() => {
    let results = questions;
    
    if (searchTerm) {
      results = results.filter(question => 
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        question.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      results = results.filter(question => question.category === selectedCategory);
    }
    
    setFilteredQuestions(results);
  }, [searchTerm, selectedCategory, questions]);
  
  // Handle opening the new question dialog
  const handleOpenNewQuestion = () => {
    setOpenNewQuestion(true);
  };
  
  // Handle closing the new question dialog
  const handleCloseNewQuestion = () => {
    setOpenNewQuestion(false);
    setNewQuestionTitle('');
    setNewQuestionContent('');
    setNewQuestionCategory('General');
  };
  
  // Handle submitting a new question
  const handleSubmitQuestion = async () => {
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;
    
    try {
      setLoading(true);
      const questionData = {
        title: newQuestionTitle.trim(),
        content: newQuestionContent.trim(),
        category: newQuestionCategory,
      };
      
      const response = await communityService.createQuestion(questionData);
      if (response.success) {
        setQuestions(prev => [response.data, ...prev]);
        handleCloseNewQuestion();
        toast.success('Question posted successfully!');
      }
    } catch (error) {
      console.error('Failed to post question:', error);
      toast.error('Failed to post question. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle opening the new answer dialog
  const handleOpenNewAnswer = (question) => {
    setCurrentQuestion(question);
    setOpenNewAnswer(true);
  };
  
  // Handle closing the new answer dialog
  const handleCloseNewAnswer = () => {
    setOpenNewAnswer(false);
    setNewAnswerContent('');
    setCurrentQuestion(null);
  };
  
  // Handle submitting a new answer
  const handleSubmitAnswer = async () => {
    if (!newAnswerContent.trim() || !currentQuestion) return;
    
    try {
      setLoading(true);
      const answerData = {
        content: newAnswerContent.trim(),
      };
      
      const response = await communityService.addAnswer(currentQuestion._id, answerData);
      if (response.success) {
        const updatedQuestions = questions.map(q => {
          if (q._id === currentQuestion._id) {
            return {
              ...q,
              answers: [...q.answers, response.data]
            };
          }
          return q;
        });
        
        setQuestions(updatedQuestions);
        handleCloseNewAnswer();
        toast.success('Answer posted successfully!');
      }
    } catch (error) {
      console.error('Failed to post answer:', error);
      toast.error('Failed to post answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle liking a question
  const handleLikeQuestion = async (questionId) => {
    try {
      const response = await communityService.likeQuestion(questionId);
      if (response.success) {
        const updatedQuestions = questions.map(q => {
          if (q._id === questionId) {
            return {
              ...q,
              likes: response.data.likes
            };
          }
          return q;
        });
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error('Failed to like question:', error);
      toast.error('Failed to like question. Please try again.');
    }
  };
  
  // Handle liking an answer
  const handleLikeAnswer = async (questionId, answerId) => {
    try {
      const response = await communityService.likeAnswer(questionId, answerId);
      if (response.success) {
        const updatedQuestions = questions.map(q => {
          if (q._id === questionId) {
            const updatedAnswers = q.answers.map(a => {
              if (a._id === answerId) {
                return {
                  ...a,
                  likes: response.data.likes
                };
              }
              return a;
            });
            
            return {
              ...q,
              answers: updatedAnswers
            };
          }
          return q;
        });
        
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error('Failed to like answer:', error);
      toast.error('Failed to like answer. Please try again.');
    }
  };

  // Handle accepting an answer
  const handleAcceptAnswer = async (questionId, answerId) => {
    try {
      const response = await communityService.acceptAnswer(questionId, answerId);
      if (response.success) {
        const updatedQuestions = questions.map(q => {
          if (q._id === questionId) {
            const updatedAnswers = q.answers.map(a => ({
              ...a,
              isAccepted: a._id === answerId
            }));
            
            return {
              ...q,
              answers: updatedAnswers
            };
          }
          return q;
        });
        
        setQuestions(updatedQuestions);
        toast.success('Answer marked as accepted!');
      }
    } catch (error) {
      console.error('Failed to accept answer:', error);
      toast.error('Failed to accept answer. Please try again.');
    }
  };
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h1" 
            align="center" 
            sx={{ 
              mb: 6, 
              fontWeight: 600, 
              color: '#2D3748',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Pregnancy Community
          </Typography>
          
          {/* Search and filter section */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              backgroundColor: 'white',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SearchIcon sx={{ color: '#FF5A8C', mr: 1 }} />
                  <TextField
                    fullWidth
                    placeholder="Search questions..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#FFD6E0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#FF5A8C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF5A8C',
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FilterListIcon sx={{ color: '#FF5A8C', mr: 1 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {categories.map((category) => (
                      <CategoryChip
                        key={category}
                        label={category}
                        onClick={() => setSelectedCategory(category)}
                        variant={selectedCategory === category ? "filled" : "outlined"}
                        sx={{
                          backgroundColor: selectedCategory === category ? '#FF5A8C' : '#FFD6E0',
                          color: selectedCategory === category ? 'white' : '#FF5A8C',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleOpenNewQuestion}
                  sx={{
                    backgroundColor: '#FF5A8C',
                    '&:hover': { backgroundColor: '#e64c7f' },
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Ask Question
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Questions list */}
          <Box sx={{ mb: 4 }}>
            {filteredQuestions.length === 0 ? (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  borderRadius: 2,
                  textAlign: 'center',
                  backgroundColor: 'white',
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  No questions found. Be the first to ask!
                </Typography>
              </Paper>
            ) : (
              filteredQuestions.map((question) => (
                <StyledCard key={question._id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={question.author.avatar} 
                          alt={question.author.name}
                          sx={{ width: 40, height: 40, mr: 1 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {question.author.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(question.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <CategoryChip label={question.category} />
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600, 
                        color: '#2D3748',
                      }}
                    >
                      {question.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3,
                        color: '#4A5568',
                      }}
                    >
                      {question.content}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          onClick={() => handleLikeQuestion(question._id)}
                          sx={{ color: '#FF5A8C' }}
                        >
                          <ThumbUpOutlinedIcon />
                        </IconButton>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          {question.likes}
                        </Typography>
                        
                        <CommentIcon sx={{ color: '#FF5A8C', mr: 1 }} />
                        <Typography variant="body2">
                          {question.answers.length}
                        </Typography>
                      </Box>
                      
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenNewAnswer(question)}
                        sx={{
                          color: '#FF5A8C',
                          borderColor: '#FF5A8C',
                          '&:hover': { 
                            borderColor: '#e64c7f',
                            backgroundColor: 'rgba(255, 90, 140, 0.1)'
                          }
                        }}
                      >
                        Answer
                      </Button>
                    </Box>
                  </CardContent>
                  
                  {question.answers.length > 0 && (
                    <Box sx={{ px: 3, pb: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2, 
                          fontWeight: 600, 
                          color: '#2D3748',
                        }}
                      >
                        Answers ({question.answers.length})
                      </Typography>
                      
                      {question.answers.map((answer) => (
                        answer.isAccepted ? (
                          <AcceptedAnswerCard key={answer._id}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar 
                                    src={answer.author.avatar} 
                                    alt={answer.author.name}
                                    sx={{ width: 32, height: 32, mr: 1 }}
                                  />
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {answer.author.name}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {new Date(answer.date).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip 
                                  label="Accepted Answer" 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: '#4CAF50', 
                                    color: 'white',
                                    fontWeight: 600
                                  }} 
                                />
                              </Box>
                              
                              <Typography variant="body1">
                                {answer.content}
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton 
                                  onClick={() => handleLikeAnswer(question._id, answer._id)}
                                  size="small"
                                  sx={{ color: '#FF5A8C' }}
                                >
                                  <ThumbUpIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body2">
                                  {answer.likes}
                                </Typography>
                              </Box>
                            </CardActions>
                          </AcceptedAnswerCard>
                        ) : (
                          <RegularAnswerCard key={answer._id}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar 
                                  src={answer.author.avatar} 
                                  alt={answer.author.name}
                                  sx={{ width: 32, height: 32, mr: 1 }}
                                />
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {answer.author.name}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {new Date(answer.date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Typography variant="body1">
                                {answer.content}
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton 
                                  onClick={() => handleLikeAnswer(question._id, answer._id)}
                                  size="small"
                                  sx={{ color: '#FF5A8C' }}
                                >
                                  <ThumbUpOutlinedIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body2">
                                  {answer.likes}
                                </Typography>
                              </Box>
                            </CardActions>
                          </RegularAnswerCard>
                        )
                      ))}
                    </Box>
                  )}
                </StyledCard>
              ))
            )}
          </Box>
        </Container>
      </Box>
      
      {/* New Question Dialog */}
      <Dialog 
        open={openNewQuestion} 
        onClose={handleCloseNewQuestion}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Ask a New Question
            </Typography>
            <IconButton onClick={handleCloseNewQuestion}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Question Title
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., How to manage back pain during third trimester?"
              variant="outlined"
              value={newQuestionTitle}
              onChange={(e) => setNewQuestionTitle(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#FFD6E0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF5A8C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF5A8C',
                  },
                },
              }}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Question Details
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Provide details about your question..."
              variant="outlined"
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#FFD6E0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF5A8C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF5A8C',
                  },
                },
              }}
            />
          </Box>
          
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Category
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.filter(cat => cat !== 'All').map((category) => (
                <CategoryChip
                  key={category}
                  label={category}
                  onClick={() => setNewQuestionCategory(category)}
                  variant={newQuestionCategory === category ? "filled" : "outlined"}
                  sx={{
                    backgroundColor: newQuestionCategory === category ? '#FF5A8C' : '#FFD6E0',
                    color: newQuestionCategory === category ? 'white' : '#FF5A8C',
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseNewQuestion}
            sx={{ color: '#4A5568' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitQuestion}
            disabled={!newQuestionTitle.trim() || !newQuestionContent.trim() || loading}
            sx={{
              backgroundColor: '#FF5A8C',
              '&:hover': { backgroundColor: '#e64c7f' },
              '&.Mui-disabled': {
                backgroundColor: '#FFD6E0',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Post Question'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* New Answer Dialog */}
      <Dialog 
        open={openNewAnswer} 
        onClose={handleCloseNewAnswer}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Answer Question
            </Typography>
            <IconButton onClick={handleCloseNewAnswer}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {currentQuestion && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {currentQuestion.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {currentQuestion.content}
              </Typography>
            </Box>
          )}
          
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Your Answer
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Share your knowledge or experience..."
              variant="outlined"
              value={newAnswerContent}
              onChange={(e) => setNewAnswerContent(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#FFD6E0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF5A8C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF5A8C',
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseNewAnswer}
            sx={{ color: '#4A5568' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitAnswer}
            disabled={!newAnswerContent.trim() || loading}
            sx={{
              backgroundColor: '#FF5A8C',
              '&:hover': { backgroundColor: '#e64c7f' },
              '&.Mui-disabled': {
                backgroundColor: '#FFD6E0',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Post Answer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Community; 