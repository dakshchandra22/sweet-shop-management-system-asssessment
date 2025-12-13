
require('dotenv').config({ path: '.env.test' });

// Override any environment variables for testing
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetshop-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing-only';
process.env.PORT = process.env.PORT || '5001';

