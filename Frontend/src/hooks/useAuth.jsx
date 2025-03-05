import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Using named function for better HMR compatibility
export function useAuth() {
  return useContext(AuthContext);
} 