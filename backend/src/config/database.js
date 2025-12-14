const mongoose = require('mongoose');

function getDatabaseURI() {
  if (process.env.NODE_ENV === 'test') {
    return process.env.MONGODB_URI || 'mongodb+srv://daksh22:daksh22@cluster0.bhd2pa4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/sweetshop-test';
  }
  return process.env.MONGODB_URI || 'mongodb+srv://daksh22:daksh22@cluster0.bhd2pa4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/sweetshop';
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
  
  if (!mongoose.connection.readyState) {
    return; // Not connected, nothing to clear
  }
  
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    try {
      await collections[key].deleteMany({});
    } catch (error) {
      // Ignore errors if collection doesn't exist
    }
  }
}

async function dropDatabase() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('dropDatabase can only be used in test environment');
  }
  
  if (mongoose.connection.readyState) {
    try {
      await mongoose.connection.db.dropDatabase();
    } catch (error) {
      console.error('Error dropping database:', error.message);
    }
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  clearDatabase,
  dropDatabase,
  getDatabaseURI
};

