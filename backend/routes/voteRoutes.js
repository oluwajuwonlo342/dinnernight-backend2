const express = require('express');
const { submitVotes, getVotingStatus } = require('../controllers/voteController');
const { protectStudent } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/status', protectStudent, getVotingStatus);
router.post('/', protectStudent, submitVotes);

module.exports = router;
