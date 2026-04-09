const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  imageFileId: {
    type: String,
    default: '',
  },
  diseaseName: {
    type: String,
    required: [true, 'Disease name is required'],
  },
  confidence: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  symptoms: {
    type: [String],
    default: [],
  },
  treatment: {
    type: String,
    default: '',
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  petName: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

diagnosisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
