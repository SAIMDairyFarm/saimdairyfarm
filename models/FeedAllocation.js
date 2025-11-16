const mongoose = require('mongoose');

const FeedAllocationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  feedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeedInventory',
    required: true
  },
  feedItemName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  allocatedTo: {
    type: String,
    required: true
  },
  allocatedBy: {
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

module.exports = mongoose.model('FeedAllocation', FeedAllocationSchema);
