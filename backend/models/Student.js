const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    matricNumber: {
      type: String,
      required: [true, 'Matric number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    hasVoted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

studentSchema.index({ matricNumber: 1 }, { unique: true });

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
