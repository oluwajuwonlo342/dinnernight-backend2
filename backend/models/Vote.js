const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    nomineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nominee',
      required: true,
    },
  },
  { timestamps: true }
);

// A student can only vote once per category
voteSchema.index({ studentId: 1, categoryId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
