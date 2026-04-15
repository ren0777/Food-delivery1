const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/restaurantController');
const { protect, restaurantOnly } = require('../middleware/authMiddleware');

router.get('/public', getPublicRestaurants);
router.get('/:id/menu', getRestaurantPublicMenu);

router.get('/stats', protect, restaurantOnly, getRestaurantStats);
router.get('/earnings', protect, restaurantOnly, getMonthlyEarnings);
router.get('/orders', protect, restaurantOnly, getRestaurantOrders);
router.put('/order/:id/status', protect, restaurantOnly, updateOrderStatus);
router.get('/menu', protect, restaurantOnly, getRestaurantMenu);
router.post('/menu', protect, restaurantOnly, addRestaurantMenuItem);
router.put('/menu/:id', protect, restaurantOnly, updateRestaurantMenuItem);
router.delete('/menu/:id', protect, restaurantOnly, deleteRestaurantMenuItem);
router.post('/menu/use-default', protect, restaurantOnly, useDefaultMenu);

module.exports = router;