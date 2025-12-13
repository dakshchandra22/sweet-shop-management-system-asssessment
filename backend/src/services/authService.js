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
  
  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);
  
  return { user, token };
}

module.exports = { registerUser };

