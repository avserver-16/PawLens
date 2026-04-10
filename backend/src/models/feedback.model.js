const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name must be at most 50 characters'],
  },
  role: {
    type: String,
    trim: true,
    maxlength: [50, 'Role must be at most 50 characters'],
    default: 'Pet Owner',
  },
  message: {
    type: String,
    required: [true, 'Feedback message is required'],
    trim: true,
    maxlength: [500, 'Message must be at most 500 characters'],
  },
  stars: {
    type: Number,
    required: [true, 'Star rating is required'],
    min: [1, 'Minimum rating is 1'],
    max: [5, 'Maximum rating is 5'],
  },
}, { timestamps: true });

feedbackSchema.index({ stars: -1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
