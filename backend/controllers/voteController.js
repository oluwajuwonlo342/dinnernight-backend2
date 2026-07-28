const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Vote = require('../models/Vote');
const Student = require('../models/Student');
const Category = require('../models/Category');
const Nominee = require('../models/Nominee');
const Settings = require('../models/Settings');

// @desc    Submit all votes at once (one nominee per category)
// @route   POST /api/votes
// @access  Private (student)
const submitVotes = asyncHandler(async (req, res) => {
  const student = req.student;
  const { votes } = req.body; // [{ categoryId, nomineeId }, ...]

  const settings = await Settings.getSettings();
  if (!settings.votingOpen) {
    res.status(403);
    throw new Error('Voting is currently closed');
  }

  if (settings.votingClosesAt && new Date() > new Date(settings.votingClosesAt)) {
    settings.votingOpen = false;
    await settings.save();
    res.status(403);
    throw new Error('Voting has closed');
  }

  if (student.hasVoted) {
    res.status(400);
    throw new Error('You have already voted. Thank you for participating.');
  }

  if (!Array.isArray(votes) || votes.length === 0) {
    res.status(400);
    throw new Error('Please select a nominee in every category before submitting');
  }

  const activeCategories = await Category.find({ isActive: true }).select('_id');
  const activeCategoryIds = activeCategories.map((c) => c._id.toString());

  if (votes.length < activeCategoryIds.length) {
    res.status(400);
    throw new Error('Please vote in every category before submitting');
  }

  // Validate every submitted category/nominee pair
  for (const v of votes) {
    if (!v.categoryId || !v.nomineeId) {
      res.status(400);
      throw new Error('Invalid vote entry submitted');
    }
    if (!activeCategoryIds.includes(v.categoryId.toString())) {
      res.status(400);
      throw new Error('One of the submitted categories is invalid or inactive');
    }
    const nomineeBelongs = await Nominee.exists({ _id: v.nomineeId, categoryId: v.categoryId });
    if (!nomineeBelongs) {
      res.status(400);
      throw new Error('One of the submitted nominees does not belong to its category');
    }
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const voteDocs = votes.map((v) => ({
      studentId: student._id,
      categoryId: v.categoryId,
      nomineeId: v.nomineeId,
    }));

    await Vote.insertMany(voteDocs, { session });

    await Student.findByIdAndUpdate(student._id, { hasVoted: true }, { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    if (error.code === 11000) {
      res.status(400);
      throw new Error('You have already voted. Thank you for participating.');
    }
    throw error;
  } finally {
    session.endSession();
  }

  res.status(201).json({
    success: true,
    message: 'Your votes have been submitted successfully. Thank you for participating!',
  });
});

// @desc    Check voting status for logged-in student + global voting window
// @route   GET /api/votes/status
// @access  Private (student)
const getVotingStatus = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  res.json({
    success: true,
    hasVoted: req.student.hasVoted,
    votingOpen: settings.votingOpen,
    votingClosesAt: settings.votingClosesAt,
    eventName: settings.eventName,
  });
});

// @desc    Get live results (vote counts per nominee per category)
// @route   GET /api/admin/votes/results
// @access  Private (admin)
const getResults = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 }).lean();

  const results = await Promise.all(
    categories.map(async (category) => {
      const nominees = await Nominee.find({ categoryId: category._id }).lean();

      const nomineesWithCounts = await Promise.all(
        nominees.map(async (nominee) => {
          const count = await Vote.countDocuments({ nomineeId: nominee._id });
          return { ...nominee, voteCount: count };
        })
      );

      nomineesWithCounts.sort((a, b) => b.voteCount - a.voteCount);
      const totalVotes = nomineesWithCounts.reduce((sum, n) => sum + n.voteCount, 0);

      return {
        _id: category._id,
        categoryName: category.categoryName,
        totalVotes,
        nominees: nomineesWithCounts,
      };
    })
  );

  res.json({ success: true, results });
});

// @desc    Export voting results as CSV
// @route   GET /api/admin/votes/export
// @access  Private (admin)
const exportResultsCSV = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 }).lean();

  let csv = 'Category,Nominee,Vote Count\n';

  for (const category of categories) {
    const nominees = await Nominee.find({ categoryId: category._id }).lean();
    for (const nominee of nominees) {
      const count = await Vote.countDocuments({ nomineeId: nominee._id });
      const safeCategory = `"${category.categoryName.replace(/"/g, '""')}"`;
      const safeNominee = `"${nominee.nomineeName.replace(/"/g, '""')}"`;
      csv += `${safeCategory},${safeNominee},${count}\n`;
    }
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="voting-results.csv"');
  res.status(200).send(csv);
});

module.exports = { submitVotes, getVotingStatus, getResults, exportResultsCSV };
