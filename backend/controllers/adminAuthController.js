const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Login admin
// @route   POST /api/admin/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  const admin = await Admin.findOne({ username: username.trim().toLowerCase() }).select('+password');

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  const token = generateToken(admin._id, 'admin');

  res.json({
    success: true,
    message: 'Login successful',
    token,
    admin: {
      id: admin._id,
      username: admin.username,
    },
  });
});

// @desc    Get current logged-in admin
// @route   GET /api/admin/auth/me
// @access  Private (admin)
const getAdminMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      username: req.admin.username,
    },
  });
});

module.exports = { loginAdmin, getAdminMe };
