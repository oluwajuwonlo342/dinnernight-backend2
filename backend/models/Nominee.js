const mongoose = require('mongoose');

const nomineeSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    nomineeName: {
      type: String,
      required: [true, 'Nominee name is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

nomineeSchema.index({ categoryId: 1 });

module.exports = mongoose.model('Nominee', nomineeSchema);
