const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Student = require('../models/Student');
const generateToken = require('../utils/generateToken');

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { fullName, matricNumber, department, level, phone, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const matric = matricNumber.trim().toUpperCase();

  const existingStudent = await Student.findOne({ matricNumber: matric });
  if (existingStudent) {
    res.status(400);
    throw new Error('A student with this matric number is already registered');
  }

  const student = await Student.create({
    fullName,
    matricNumber: matric,
    department,
    level,
    phone,
    password,
  });

  const token = generateToken(student._id, 'student');

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    student: {
      id: student._id,
      fullName: student.fullName,
      matricNumber: student.matricNumber,
      department: student.department,
      level: student.level,
      phone: student.phone,
      hasVoted: student.hasVoted,
    },
  });
});

// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
const loginStudent = asyncHandler(async (req, res) => {
  const { matricNumber, password } = req.body;

  if (!matricNumber || !password) {
    res.status(400);
    throw new Error('Please provide matric number and password');
  }

  const matric = matricNumber.trim().toUpperCase();

  const student = await Student.findOne({ matricNumber: matric }).select('+password');

  if (!student || !(await student.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid matric number or password');
  }

  const token = generateToken(student._id, 'student');

  res.json({
    success: true,
    message: 'Login successful',
    token,
    student: {
      id: student._id,
      fullName: student.fullName,
      matricNumber: student.matricNumber,
      department: student.department,
      level: student.level,
      phone: student.phone,
      hasVoted: student.hasVoted,
    },
  });
});

// @desc    Get current logged-in student
// @route   GET /api/auth/me
// @access  Private (student)
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    student: {
      id: req.student._id,
      fullName: req.student.fullName,
      matricNumber: req.student.matricNumber,
      department: req.student.department,
      level: req.student.level,
      phone: req.student.phone,
      hasVoted: req.student.hasVoted,
    },
  });
});

module.exports = { registerStudent, loginStudent, getMe };
