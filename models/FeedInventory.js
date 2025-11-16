const mongoose = require('mongoose');

const FeedInventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please specify item name'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Hay', 'Silage', 'Concentrate', 'Supplement', 'Medicine', 'Other'],
    required: true
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['KG', 'Liters', 'Bags', 'Units']
  },
  reorderLevel: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    type: String,
    trim: true
  },
  lastPurchaseDate: {
    type: Date
  },
  lastPurchaseQuantity: {
    type: Number
  },
  lastPurchaseCost: {
    type: Number
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FeedInventory', FeedInventorySchema);
