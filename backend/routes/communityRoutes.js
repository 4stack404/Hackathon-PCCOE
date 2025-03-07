import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
  getQuestions,
  getQuestion,
  createQuestion,
  addAnswer,
  likeQuestion,
  likeAnswer,
  acceptAnswer
} from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Post routes
router.route('/posts')
  .get(getPosts)
  .post(protect, createPost);

router.route('/posts/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/posts/:id/like')
  .put(protect, likePost);

router.route('/posts/:id/comments')
  .post(protect, addComment);

router.route('/posts/:id/comments/:commentId')
  .delete(protect, deleteComment);

// Question routes
router.route('/questions')
  .get(getQuestions)
  .post(protect, createQuestion);

router.route('/questions/:id')
  .get(getQuestion);

router.route('/questions/:id/answers')
  .post(protect, addAnswer);

router.route('/questions/:id/like')
  .post(protect, likeQuestion);

router.route('/questions/:questionId/answers/:answerId/like')
  .post(protect, likeAnswer);

router.route('/questions/:questionId/answers/:answerId/accept')
  .put(protect, acceptAnswer);

export default router; 