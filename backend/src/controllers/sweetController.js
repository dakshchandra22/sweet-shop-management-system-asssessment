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

async function searchSweets(req, res, next) {
  try {
    const sweets = await sweetService.searchSweets(req.query);
    res.json(sweets);
  } catch (error) {
    next(error);
  }
}

async function updateSweet(req, res, next) {
  try {
    const sweet = await sweetService.updateSweet(req.params.id, req.body);
    res.json(sweet);
  } catch (error) {
    next(error);
  }
}

async function deleteSweet(req, res, next) {
  try {
    await sweetService.deleteSweet(req.params.id);
    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function purchaseSweet(req, res, next) {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be a positive number'
      });
    }
    
    const sweet = await sweetService.purchaseSweet(req.params.id, quantity);
    res.json(sweet);
  } catch (error) {
    next(error);
  }
}

async function restockSweet(req, res, next) {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be a positive number'
      });
    }
    
    const sweet = await sweetService.restockSweet(req.params.id, quantity);
    res.json(sweet);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
};

