const mongoose = require('mongoose');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const User = require('./models/userModel');

    const adminEmail = 'admin@foodieexpress.com';
    const adminPassword = 'admin123';

    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      // Force-reset credentials to fix previously double-hashed passwords.
      adminExists.name = 'Admin';
      adminExists.email = adminEmail;
      adminExists.password = adminPassword;
      adminExists.role = 'admin';
      await adminExists.save();
      console.log('Admin already existed, credentials were reset successfully!');
    } else {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('Admin created successfully!');
    }

    console.log('Email: admin@foodieexpress.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();