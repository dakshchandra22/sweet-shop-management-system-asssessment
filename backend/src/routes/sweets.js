const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} = require('../controllers/sweetController');

// Create sweet (authenticated users)
router.post('/', authenticate, createSweet);

// Get all sweets (authenticated users)
router.get('/', authenticate, getAllSweets);

// Search sweets (authenticated users)
router.get('/search', authenticate, searchSweets);

// Update sweet (authenticated users)
router.put('/:id', authenticate, updateSweet);

// Delete sweet (admin only)
router.delete('/:id', authenticate, isAdmin, deleteSweet);

// Purchase sweet (authenticated users)
router.post('/:id/purchase', authenticate, purchaseSweet);

// Restock sweet (admin only)
router.post('/:id/restock', authenticate, isAdmin, restockSweet);

module.exports = router;