const mongoose = require('mongoose');

const MilkRecordSchema = new mongoose.Schema({
  animalId: {
    type: String,
    required: [true, 'Please specify animal ID'],
    ref: 'Animal'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  session: {
    type: String,
    enum: ['AM', 'PM'],
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity in liters'],
    min: 0
  },
  fatContent: {
    type: Number,
    min: 0,
    max: 100
  },
  snf: {
    type: Number,
    min: 0,
    max: 100
  },
  somaticCellCount: {
    type: Number
  },
  quality: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Poor'],
    default: 'Good'
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
MilkRecordSchema.index({ animalId: 1, date: -1 });

module.exports = mongoose.model('MilkRecord', MilkRecordSchema);
