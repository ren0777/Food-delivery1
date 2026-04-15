const Order = require('../models/orderModel');
const Food = require('../models/foodModel');
const User = require('../models/userModel');
const defaultMenu = require('../data/defaultMenu');

const seedDefaultMenuIfMissing = async () => {
  const defaultCount = await Food.countDocuments({ isDefaultMenuItem: true });
  if (defaultCount > 0) return;

  await Food.insertMany(
    defaultMenu.map((item) => ({
      ...item,
      isDefaultMenuItem: true,
      restaurant: null,
      available: true,
    }))
  );
};

// @route GET /api/restaurant/public
const getPublicRestaurants = async (req, res) => {
  try {
    const restaurants = await User.find({ role: 'restaurant' })
      .select('name email restaurantDetails')
      .sort({ createdAt: -1 });

    const withMenuCounts = await Promise.all(
      restaurants.map(async (restaurant) => {
        const menuCount = await Food.countDocuments({
          restaurant: restaurant._id,
          available: true,
        });

        return {
          _id: restaurant._id,
          name: restaurant.name,
          email: restaurant.email,
          restaurantDetails: restaurant.restaurantDetails,
          menuCount,
          usesDefaultMenu: menuCount === 0,
        };
      })
    );

    res.json(withMenuCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/restaurant/:id/menu
const getRestaurantPublicMenu = async (req, res) => {
  try {
    await seedDefaultMenuIfMissing();

    const restaurant = await User.findOne({ _id: req.params.id, role: 'restaurant' }).select(
      'name restaurantDetails'
    );
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    let foods = await Food.find({ restaurant: restaurant._id, available: true }).sort({ createdAt: -1 });
    let usingDefaultMenu = false;

    if (foods.length === 0) {
      foods = await Food.find({ isDefaultMenuItem: true, available: true }).sort({ createdAt: -1 });
      usingDefaultMenu = true;
    }

    res.json({ restaurant, usingDefaultMenu, foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/restaurant/stats
const getRestaurantStats = async (req, res) => {
  try {
    const restaurantId = req.user._id;

    const totalOrders = await Order.countDocuments({ restaurant: restaurantId });
    const deliveredOrders = await Order.countDocuments({ restaurant: restaurantId, status: 'Delivered' });
    const pendingOrders = await Order.countDocuments({ restaurant: restaurantId, status: 'Pending' });
    const cancelledOrders = await Order.countDocuments({ restaurant: restaurantId, status: 'Cancelled' });

    const totalEarnings = await Order.aggregate([
      { $match: { restaurant: restaurantId, status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      totalOrders,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      totalEarnings: totalEarnings[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/restaurant/earnings
const getMonthlyEarnings = async (req, res) => {
  try {
    const restaurantId = req.user._id;
    const { month, year } = req.query;

    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) - 1, 1);
    const endDate = new Date(year || new Date().getFullYear(), month || new Date().getMonth(), 0, 23, 59, 59);

    const monthlyEarnings = await Order.aggregate([
      {
        $match: {
          restaurant: restaurantId,
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'Delivered',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const dailyEarnings = await Order.aggregate([
      {
        $match: {
          restaurant: restaurantId,
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'Delivered',
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$createdAt' },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      month: monthlyEarnings[0]?.count || 0,
      totalEarnings: monthlyEarnings[0]?.total || 0,
      dailyEarnings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/restaurant/orders
const getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.user._id;
    const { status } = req.query;
    const filter = { restaurant: restaurantId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/restaurant/order/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const restaurantId = req.user._id;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, restaurant: restaurantId },
      { status },
      { new: true }
    ).populate('user', 'name email phone');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/restaurant/menu
const getRestaurantMenu = async (req, res) => {
  try {
    const foods = await Food.find({ restaurant: req.user._id }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/restaurant/menu
const addRestaurantMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    const food = await Food.create({
      restaurant: req.user._id,
      name,
      description,
      price,
      category,
      image: image || 'default.jpg',
      isDefaultMenuItem: false,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/restaurant/menu/:id
const updateRestaurantMenuItem = async (req, res) => {
  try {
    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user._id },
      req.body,
      { new: true }
    );

    if (!food) return res.status(404).json({ message: 'Menu item not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/restaurant/menu/:id
const deleteRestaurantMenuItem = async (req, res) => {
  try {
    const food = await Food.findOneAndDelete({ _id: req.params.id, restaurant: req.user._id });
    if (!food) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/restaurant/menu/use-default
const useDefaultMenu = async (req, res) => {
  try {
    await seedDefaultMenuIfMissing();

    await Food.deleteMany({ restaurant: req.user._id });

    const defaultFoods = await Food.find({ isDefaultMenuItem: true });
    const restaurantFoods = defaultFoods.map((item) => ({
      restaurant: req.user._id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      available: item.available,
      rating: item.rating,
      isDefaultMenuItem: false,
    }));

    if (restaurantFoods.length > 0) {
      await Food.insertMany(restaurantFoods);
    }

    res.json({ message: 'Default menu copied to your restaurant menu' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurantStats,
  getMonthlyEarnings,
  getRestaurantOrders,
  updateOrderStatus,
  getPublicRestaurants,
  getRestaurantPublicMenu,
  getRestaurantMenu,
  addRestaurantMenuItem,
  updateRestaurantMenuItem,
  deleteRestaurantMenuItem,
  useDefaultMenu,
};