const User = require('../models/userModel');
const Food = require('../models/foodModel');

// Cart is stored in frontend context (localStorage)
// These endpoints are optional server-side cart helpers

// @route GET /api/cart - Get cart items by IDs
const getCartItems = async (req, res) => {
  try {
    const { ids } = req.body;
    const foods = await Food.find({ _id: { $in: ids } });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCartItems };
