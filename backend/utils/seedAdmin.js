// Run with: npm run seed:admin
// Creates (or updates) the default admin account from .env values
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const run = async () => {
  await connectDB();

  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  let admin = await Admin.findOne({ username });

  if (admin) {
    admin.password = password;
    await admin.save();
    console.log(`Existing admin "${username}" password updated.`);
  } else {
    admin = await Admin.create({ username, password });
    console.log(`Admin account "${username}" created successfully.`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to seed admin:', err.message);
  process.exit(1);
});
