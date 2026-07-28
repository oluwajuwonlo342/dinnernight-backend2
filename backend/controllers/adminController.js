const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Category = require('../models/Category');
const Nominee = require('../models/Nominee');
const Vote = require('../models/Vote');
const Settings = require('../models/Settings');

// @desc    Get dashboard summary stats
// @route   GET /api/admin/dashboard
// @access  Private (admin)
const getDashboardSummary = asyncHandler(async (req, res) => {
  const [totalStudents, votedStudents, totalCategories, totalNominees, totalVotes, settings] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ hasVoted: true }),
    Category.countDocuments(),
    Nominee.countDocuments(),
    Vote.countDocuments(),
    Settings.getSettings(),
  ]);

  res.json({
    success: true,
    summary: {
      totalStudents,
      votedStudents,
      pendingStudents: totalStudents - votedStudents,
      totalCategories,
      totalNominees,
      totalVotes,
      votingOpen: settings.votingOpen,
      votingClosesAt: settings.votingClosesAt,
      eventName: settings.eventName,
    },
  });
});

// @desc    Get voting settings
// @route   GET /api/admin/settings
// @access  Private (admin)
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  res.json({ success: true, settings });
});

// @desc    Update voting settings (open/close voting, set closing time, event name)
// @route   PUT /api/admin/settings
// @access  Private (admin)
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  const { votingOpen, votingClosesAt, eventName } = req.body;

  if (votingOpen !== undefined) settings.votingOpen = votingOpen;
  if (votingClosesAt !== undefined) settings.votingClosesAt = votingClosesAt || null;
  if (eventName !== undefined) settings.eventName = eventName;

  await settings.save();

  res.json({
    success: true,
    message: `Voting is now ${settings.votingOpen ? 'OPEN' : 'CLOSED'}`,
    settings,
  });
});

module.exports = { getDashboardSummary, getSettings, updateSettings };
