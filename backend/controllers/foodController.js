const Food = require('../models/foodModel');

// @route GET /api/food
const getAllFood = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category, available: true } : { available: true };
    const foods = await Food.find(filter);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/food/:id
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/food (admin)
const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : 'default.jpg';
    const food = await Food.create({ name, description, price, category, image });
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/food/:id (admin)
const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/food/:id (admin)
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllFood, getFoodById, addFood, updateFood, deleteFood };
