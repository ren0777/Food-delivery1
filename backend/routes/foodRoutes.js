const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllFood, getFoodById, addFood, updateFood, deleteFood } = require('../controllers/foodController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/', getAllFood);
router.get('/:id', getFoodById);
router.post('/', protect, adminOnly, upload.single('image'), addFood);
router.put('/:id', protect, adminOnly, updateFood);
router.delete('/:id', protect, adminOnly, deleteFood);

module.exports = router;
