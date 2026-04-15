const Food = require('../models/foodModel');


const getAllFood = async (req, res) => {
  try {
    const { category, restaurantId } = req.query;

    if (restaurantId) {
      const restaurantFilter = { restaurant: restaurantId, available: true };
      if (category) restaurantFilter.category = category;

      let foods = await Food.find(restaurantFilter).sort({ createdAt: -1 });

      if (foods.length === 0) {
        const defaultFilter = { isDefaultMenuItem: true, available: true };
        if (category) defaultFilter.category = category;
        foods = await Food.find(defaultFilter).sort({ createdAt: -1 });
      }

      return res.json(foods);
    }

    const filter = {
      available: true,
      $or: [{ isDefaultMenuItem: true }, { restaurant: null }, { restaurant: { $exists: false } }],
    };
    if (category) filter.category = category;

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : 'default.jpg';
    const food = await Food.create({
      name,
      description,
      price,
      category,
      image,
      restaurant: null,
      isDefaultMenuItem: true,
    });
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
