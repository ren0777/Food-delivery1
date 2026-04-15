const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'restaurant', 'admin'], default: 'user' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    restaurantDetails: {
      restaurantName: { type: String, default: '' },
      cuisine: { type: String, default: '' },
      openingTime: { type: String, default: '09:00' },
      closingTime: { type: String, default: '22:00' },
      deliveryRadius: { type: Number, default: 5 },
      isOpen: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
