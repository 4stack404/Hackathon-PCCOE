import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import helmet from 'helmet';

// Import routes
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dietPlanRoutes from './routes/dietPlanRoutes.js';

// Import the diet plan controller functions directly
import { getUserCalories, updateUserCalories } from './controllers/dietPlanController.js';
import { protect } from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "https:", "data:"],
    connectSrc: ["'self'", "https://*", "http://*"]
  }
}));

// Configure CORS to allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  console.log('Authorization:', req.headers.authorization);
  next();
});

// Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    env: {
      nodeEnv: process.env.NODE_ENV,
      frontendUrl: process.env.FRONTEND_URL
    }
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/diet-plans', dietPlanRoutes);

// Direct routes for diet-plan
app.options('/api/diet-plan', (req, res) => {
  // Add CORS headers directly
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

app.get('/api/diet-plan', protect, (req, res) => {
  // Add CORS headers directly
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Call the controller function
  getUserCalories(req, res);
});

app.post('/api/diet-plan', protect, (req, res) => {
  // Add CORS headers directly
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Call the controller function
  updateUserCalories(req, res);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        message: 'File size is too large. Max size is 5MB.' 
      });
    }
  }
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
