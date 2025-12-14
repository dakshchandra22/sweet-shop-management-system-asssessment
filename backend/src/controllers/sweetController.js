const sweetService = require('../services/sweetService');

async function createSweet(req, res, next) {
  try {
    // Simple create: accept JSON payload only
    const payload = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity
    };

    const sweet = await sweetService.createSweet(payload);
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
    // Accept JSON body for updates (no file upload)
    const updatePayload = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity
    };

    const sweet = await sweetService.updateSweet(req.params.id, updatePayload);
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

