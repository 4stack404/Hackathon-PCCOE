import jwt from 'jsonwebtoken';
import { wrapResponse } from '../utils/responseWrapper.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json(wrapResponse(false, null, 'Access token is required'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json(wrapResponse(false, null, 'Invalid or expired token'));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json(wrapResponse(false, null, 'Authentication error'));
  }
}; 