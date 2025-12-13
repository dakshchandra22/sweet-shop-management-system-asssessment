const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');

// Protected route - GET all sweets (any authenticated user)
router.get('/', authenticate, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user
  });
});

// Admin only route - DELETE sweet
router.delete('/:id', authenticate, isAdmin, (req, res) => {
  res.json({
    message: 'Admin route accessed',
    user: req.user,
    sweetId: req.params.id
  });
});

module.exports = router;