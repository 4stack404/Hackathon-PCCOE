import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for authentication
 * @param {string} id - User ID to include in the token
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export default generateToken; 