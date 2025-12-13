const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

async function registerUser(userData) {
  const { username, email, password } = userData;
  
  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  try {
    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    return { user, token };
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new Error(`${field} already exists`);
    }
    throw error;
  }
}

async function loginUser(email, password) {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
  
  const token = generateToken(user._id);
  return { user, token };
}

module.exports = { registerUser, loginUser };