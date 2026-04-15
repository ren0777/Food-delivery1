const express = require('express');
const router = express.Router();
const { getCartItems } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, getCartItems);

module.exports = router;
