const express = require('express');
const { loginAdmin, getAdminMe } = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getAdminMe);

module.exports = router;
