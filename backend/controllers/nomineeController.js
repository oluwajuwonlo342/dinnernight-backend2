const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const Nominee = require('../models/Nominee');
const Category = require('../models/Category');
const Vote = require('../models/Vote');

const removeFileIfExists = (relativePath) => {
  if (!relativePath) return;
  const absolute = path.join(__dirname, '..', relativePath);
  fs.unlink(absolute, () => {}); // best-effort, ignore errors
};

// @desc    Get nominees (optionally filter by category)
// @route   GET /api/admin/nominees?categoryId=xxx
// @access  Private (admin)
const getNominees = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.categoryId) filter.categoryId = req.query.categoryId;

  const nominees = await Nominee.find(filter).populate('categoryId', 'categoryName').sort({ createdAt: -1 });
  res.json({ success: true, nominees });
});

// @desc    Create nominee
// @route   POST /api/admin/nominees
// @access  Private (admin)
const createNominee = asyncHandler(async (req, res) => {
  const { categoryId, nomineeName, bio } = req.body;

  if (!categoryId || !nomineeName) {
    res.status(400);
    throw new Error('Category and nominee name are required');
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const image = req.file ? `/uploads/nominees/${req.file.filename}` : '';

  const nominee = await Nominee.create({
    categoryId,
    nomineeName: nomineeName.trim(),
    bio: bio || '',
    image,
  });

  res.status(201).json({ success: true, message: 'Nominee added successfully', nominee });
});

// @desc    Update nominee
// @route   PUT /api/admin/nominees/:id
// @access  Private (admin)
const updateNominee = asyncHandler(async (req, res) => {
  const nominee = await Nominee.findById(req.params.id);
  if (!nominee) {
    res.status(404);
    throw new Error('Nominee not found');
  }

  const { categoryId, nomineeName, bio } = req.body;

  if (categoryId) nominee.categoryId = categoryId;
  if (nomineeName) nominee.nomineeName = nomineeName.trim();
  if (bio !== undefined) nominee.bio = bio;

  if (req.file) {
    removeFileIfExists(nominee.image);
    nominee.image = `/uploads/nominees/${req.file.filename}`;
  }

  await nominee.save();

  res.json({ success: true, message: 'Nominee updated successfully', nominee });
});

// @desc    Delete nominee (and related votes)
// @route   DELETE /api/admin/nominees/:id
// @access  Private (admin)
const deleteNominee = asyncHandler(async (req, res) => {
  const nominee = await Nominee.findById(req.params.id);
  if (!nominee) {
    res.status(404);
    throw new Error('Nominee not found');
  }

  removeFileIfExists(nominee.image);
  await Vote.deleteMany({ nomineeId: nominee._id });
  await nominee.deleteOne();

  res.json({ success: true, message: 'Nominee deleted successfully' });
});

module.exports = { getNominees, createNominee, updateNominee, deleteNominee };
