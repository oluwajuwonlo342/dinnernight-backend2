const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');

// @desc    Get all registered students with search + pagination
// @route   GET /api/admin/students?search=&page=&limit=
// @access  Private (admin)
const getStudents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = (req.query.search || '').trim();

  const filter = search
    ? {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { matricNumber: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const total = await Student.countDocuments(filter);
  const students = await Student.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    success: true,
    students,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    },
  });
});

// @desc    Delete a student
// @route   DELETE /api/admin/students/:id
// @access  Private (admin)
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }
  await student.deleteOne();
  res.json({ success: true, message: 'Student removed successfully' });
});

module.exports = { getStudents, deleteStudent };
