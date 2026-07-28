const mongoose = require('mongoose');

// Singleton document holding global voting configuration
const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global',
      unique: true,
    },
    votingOpen: {
      type: Boolean,
      default: false,
    },
    votingClosesAt: {
      type: Date,
      default: null,
    },
    eventName: {
      type: String,
      default: 'Moor Plantation Dinner Night Awards',
    },
  },
  { timestamps: true }
);

settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ key: 'global' });
  if (!settings) {
    settings = await this.create({ key: 'global' });
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
