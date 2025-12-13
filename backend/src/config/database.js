const mongoose = require('mongoose');

function getDatabaseURI() {
  if (process.env.NODE_ENV === 'test') {
    return process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetshop-test';
  }
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetshop';
}

async function connectDB() {
  const uri = getDatabaseURI();
  const dbName = process.env.NODE_ENV === 'test' ? 'sweetshop-test' : 'sweetshop';
  
  try {
    await mongoose.connect(uri);
    
    console.log(`✅ Connected to MongoDB: ${dbName}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error.message);
  }
}

async function clearDatabase() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearDatabase can only be used in test environment');
  }
  
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  clearDatabase,
  getDatabaseURI
};

