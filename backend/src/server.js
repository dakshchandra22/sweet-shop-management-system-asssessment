const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth');
const sweetRoutes = require('./routes/sweets');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS configuration
// Allow adding a custom client origin via CLIENT_ORIGIN env var (comma-separated or single)
const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];
let allowedOrigins = [...defaultOrigins];
if (process.env.CLIENT_ORIGIN) {
  const extra = process.env.CLIENT_ORIGIN.split(',').map(s => s.trim()).filter(Boolean);
  allowedOrigins = Array.from(new Set([...allowedOrigins, ...extra]));
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 204
};

// Middleware - CORS must be before other middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (images)
// Uploads are stored in backend/uploads and served at /uploads/<filename>
// No static uploads serving — keeping server logic simple (no file uploads)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sweet Shop Management System API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection (only in non-test environments)
if (process.env.NODE_ENV !== 'test') {
  connectDB().catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
}

const PORT = process.env.PORT || 5000;

if (require.main === module && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;