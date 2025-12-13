const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { user, token } = await authService.registerUser(req.body);
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register };

