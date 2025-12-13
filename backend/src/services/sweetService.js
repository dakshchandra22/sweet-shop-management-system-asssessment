const Sweet = require('../models/Sweet');

async function createSweet(sweetData) {
  const sweet = await Sweet.create(sweetData);
  return sweet;
}

async function getAllSweets() {
  const sweets = await Sweet.find().sort({ createdAt: -1 });
  return sweets;
}

module.exports = { createSweet, getAllSweets };

