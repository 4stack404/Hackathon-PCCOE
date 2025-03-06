import Post from '../models/communityModel.js';
import Question from '../models/Question.js';
import { validateObjectId } from '../utils/validation.js';

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .sort('-date');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single post
// @route   GET /api/community/posts/:id
// @access  Public
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name')
      .populate('comments.user', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new post
// @route   POST /api/community/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      ...req.body
    });

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update post
// @route   PUT /api/community/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Make sure user owns post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name');

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete post
// @route   DELETE /api/community/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Make sure user owns post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.remove();

    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like post
// @route   PUT /api/community/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post has already been liked
    if (post.likes.includes(req.user._id)) {
      // Unlike
      post.likes = post.likes.filter(
        like => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add comment to post
// @route   POST /api/community/posts/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      text: req.body.text,
      user: req.user._id
    };

    post.comments.unshift(newComment);

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name')
      .populate('comments.user', 'name');

    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete comment
// @route   DELETE /api/community/posts/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Pull out comment
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Make sure user owns comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Get remove index
    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.commentId
    );

    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all questions with pagination and filters
export const getQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const questions = await Question.find(query)
      .populate('author', 'name avatar')
      .populate('answers.author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Question.countDocuments(query);

    res.json({
      success: true,
      data: questions,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error in getQuestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

// Get a single question by ID
export const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID'
      });
    }

    const question = await Question.findById(id)
      .populate('author', 'name avatar')
      .populate('answers.author', 'name avatar');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Increment views
    question.views += 1;
    await question.save();

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Error in getQuestion:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
};

// Create a new question
export const createQuestion = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.user._id;

    const question = new Question({
      title,
      content,
      category,
      author
    });

    await question.save();
    await question.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Error in createQuestion:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
};

// Add an answer to a question
export const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const author = req.user._id;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID'
      });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answer = {
      content,
      author,
      date: new Date()
    };

    question.answers.push(answer);
    await question.save();
    await question.populate('answers.author', 'name avatar');

    const newAnswer = question.answers[question.answers.length - 1];

    res.status(201).json({
      success: true,
      data: newAnswer
    });
  } catch (error) {
    console.error('Error in addAnswer:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding answer',
      error: error.message
    });
  }
};

// Like a question
export const likeQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID'
      });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const likeIndex = question.likes.indexOf(userId);
    if (likeIndex === -1) {
      question.likes.push(userId);
    } else {
      question.likes.splice(likeIndex, 1);
    }

    await question.save();

    res.json({
      success: true,
      data: {
        likes: question.likes.length,
        isLiked: likeIndex === -1
      }
    });
  } catch (error) {
    console.error('Error in likeQuestion:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking question',
      error: error.message
    });
  }
};

// Like an answer
export const likeAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const userId = req.user._id;

    if (!validateObjectId(questionId) || !validateObjectId(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question or answer ID'
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    const likeIndex = answer.likes.indexOf(userId);
    if (likeIndex === -1) {
      answer.likes.push(userId);
    } else {
      answer.likes.splice(likeIndex, 1);
    }

    await question.save();

    res.json({
      success: true,
      data: {
        likes: answer.likes.length,
        isLiked: likeIndex === -1
      }
    });
  } catch (error) {
    console.error('Error in likeAnswer:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking answer',
      error: error.message
    });
  }
};

// Accept an answer
export const acceptAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const userId = req.user._id;

    if (!validateObjectId(questionId) || !validateObjectId(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question or answer ID'
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Only the question author can accept an answer
    if (question.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the question author can accept an answer'
      });
    }

    // Reset all answers' accepted status
    question.answers.forEach(answer => {
      answer.isAccepted = false;
    });

    // Set the selected answer as accepted
    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    answer.isAccepted = true;
    await question.save();

    res.json({
      success: true,
      data: answer
    });
  } catch (error) {
    console.error('Error in acceptAnswer:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting answer',
      error: error.message
    });
  }
};

const communityController = {
  getQuestions,
  getQuestion,
  createQuestion,
  addAnswer,
  likeQuestion,
  likeAnswer,
  acceptAnswer
}; 