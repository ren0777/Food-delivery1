const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Burger', 'Pizza', 'Rolls', 'Dessert', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'],
    },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 4.0, min: 1, max: 5 },
    isDefaultMenuItem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);
