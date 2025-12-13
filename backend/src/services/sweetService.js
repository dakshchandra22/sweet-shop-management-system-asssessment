const Sweet = require('../models/Sweet');

async function createSweet(sweetData) {
  const sweet = await Sweet.create(sweetData);
  return sweet;
}

async function getAllSweets() {
  const sweets = await Sweet.find().sort({ createdAt: -1 });
  return sweets;
}

async function searchSweets(filters) {
  const { name, category, minPrice, maxPrice } = filters;
  const query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sweets = await Sweet.find(query).sort({ createdAt: -1 });
  return sweets;
}

async function updateSweet(id, updateData) {
  const sweet = await Sweet.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!sweet) {
    throw new Error('Sweet not found');
  }
  
  return sweet;
}

async function deleteSweet(id) {
  const sweet = await Sweet.findByIdAndDelete(id);
  
  if (!sweet) {
    throw new Error('Sweet not found');
  }
  
  return sweet;
}

async function purchaseSweet(id, quantity) {
  const sweet = await Sweet.findById(id);
  
  if (!sweet) {
    throw new Error('Sweet not found');
  }
  
  if (sweet.quantity === 0) {
    throw new Error('Sweet is out of stock');
  }
  
  if (sweet.quantity < quantity) {
    throw new Error(`Insufficient quantity. Available: ${sweet.quantity}`);
  }
  
  sweet.quantity -= quantity;
  await sweet.save();
  
  return sweet;
}

async function restockSweet(id, quantity) {
  const sweet = await Sweet.findById(id);
  
  if (!sweet) {
    throw new Error('Sweet not found');
  }
  
  sweet.quantity += quantity;
  await sweet.save();
  
  return sweet;
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

