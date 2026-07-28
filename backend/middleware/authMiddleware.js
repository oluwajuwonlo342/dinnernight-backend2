const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Protect routes for logged-in students
const protectStudent = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'student') {
      res.status(403);
      throw new Error('Not authorized as a student');
    }

    const student = await Student.findById(decoded.id);
    if (!student) {
      res.status(401);
      throw new Error('Student account no longer exists');
    }

    req.student = student;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

// Protect routes for logged-in admins
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized as an admin');
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      res.status(401);
      throw new Error('Admin account no longer exists');
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

module.exports = { protectStudent, protectAdmin };
