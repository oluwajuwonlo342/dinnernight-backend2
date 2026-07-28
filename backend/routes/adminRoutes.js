const express = require('express');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const { getDashboardSummary, getSettings, updateSettings } = require('../controllers/adminController');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { getNominees, createNominee, updateNominee, deleteNominee } = require('../controllers/nomineeController');
const { getStudents, deleteStudent } = require('../controllers/studentController');
const { getResults, exportResultsCSV } = require('../controllers/voteController');

const router = express.Router();

// All routes below require a valid admin token
router.use(protectAdmin);

// Dashboard
router.get('/dashboard', getDashboardSummary);

// Voting settings (open/close voting, countdown)
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Nominees
router.get('/nominees', getNominees);
router.post('/nominees', upload.single('image'), createNominee);
router.put('/nominees/:id', upload.single('image'), updateNominee);
router.delete('/nominees/:id', deleteNominee);

// Students
router.get('/students', getStudents);
router.delete('/students/:id', deleteStudent);

// Results
router.get('/votes/results', getResults);
router.get('/votes/export', exportResultsCSV);

module.exports = router;
