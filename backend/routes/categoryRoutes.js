const express = require('express');
const { getCategories, getCategoryById } = require('../controllers/categoryController');
const { protectStudent } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protectStudent, getCategories);
router.get('/:id', protectStudent, getCategoryById);

module.exports = router;
