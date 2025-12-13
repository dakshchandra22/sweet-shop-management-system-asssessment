const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { createSweet, getAllSweets } = require('../controllers/sweetController');

// Create sweet (authenticated users)
router.post('/', authenticate, createSweet);

// Get all sweets (authenticated users)
router.get('/', authenticate, getAllSweets);

// Admin only route - DELETE sweet
router.delete('/:id', authenticate, isAdmin, (req, res) => {
  res.json({
    message: 'Admin route accessed',
    user: req.user,
    sweetId: req.params.id
  });
});

module.exports = router;