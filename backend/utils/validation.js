import mongoose from 'mongoose';

// Validate MongoDB ObjectId
export const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
}; 