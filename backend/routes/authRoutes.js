const express = require('express');
const { body } = require('express-validator');
const { registerStudent, loginStudent, getMe } = require('../controllers/authController');
const { protectStudent } = require('../middleware/authMiddleware');

const router = express.Router();

const registerValidation = [
  body('fullName').trim().isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
  body('matricNumber').trim().notEmpty().withMessage('Matric number is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('level').trim().notEmpty().withMessage('Level is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

router.post('/register', registerValidation, registerStudent);
router.post('/login', loginStudent);
router.get('/me', protectStudent, getMe);

module.exports = router;
