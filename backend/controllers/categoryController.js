const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Nominee = require('../models/Nominee');
const Vote = require('../models/Vote');

// @desc    Get all categories with their nominees (for voting/dashboard)
// @route   GET /api/categories
// @access  Private (student) / Public depending on route mount
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ createdAt: 1 }).lean();

  const categoriesWithNominees = await Promise.all(
    categories.map(async (category) => {
      const nominees = await Nominee.find({ categoryId: category._id }).sort({ nomineeName: 1 }).lean();
      return { ...category, nominees };
    })
  );

  res.json({ success: true, categories: categoriesWithNominees });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  const nominees = await Nominee.find({ categoryId: category._id });
  res.json({ success: true, category, nominees });
});

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (admin)
const createCategory = asyncHandler(async (req, res) => {
  const { categoryName, description } = req.body;

  if (!categoryName || !categoryName.trim()) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const exists = await Category.findOne({ categoryName: categoryName.trim() });
  if (exists) {
    res.status(400);
    throw new Error('A category with this name already exists');
  }

  const category = await Category.create({
    categoryName: categoryName.trim(),
    description: description || '',
  });

  res.status(201).json({ success: true, message: 'Category created successfully', category });
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (admin)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { categoryName, description, isActive } = req.body;

  if (categoryName) category.categoryName = categoryName.trim();
  if (description !== undefined) category.description = description;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();

  res.json({ success: true, message: 'Category updated successfully', category });
});

// @desc    Delete category (and its nominees + votes)
// @route   DELETE /api/admin/categories/:id
// @access  Private (admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await Nominee.deleteMany({ categoryId: category._id });
  await Vote.deleteMany({ categoryId: category._id });
  await category.deleteOne();

  res.json({ success: true, message: 'Category and its nominees deleted successfully' });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
