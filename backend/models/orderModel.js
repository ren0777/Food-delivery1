const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
        name: String,
        price: Number,
        quantity: { type: Number, required: true, min: 1 },
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
