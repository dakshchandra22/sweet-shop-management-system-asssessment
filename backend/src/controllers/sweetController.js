const sweetService = require('../services/sweetService');

async function createSweet(req, res, next) {
  try {
    const sweet = await sweetService.createSweet(req.body);
    res.status(201).json(sweet);
  } catch (error) {
    next(error);
  }
}

async function getAllSweets(req, res, next) {
  try {
    const sweets = await sweetService.getAllSweets();
    res.json(sweets);
  } catch (error) {
    next(error);
  }
}

module.exports = { createSweet, getAllSweets };

