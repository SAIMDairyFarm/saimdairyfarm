const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  tagId: {
    type: String,
    required: [true, 'Please add a unique tag ID'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  breed: {
    type: String,
    required: [true, 'Please specify breed']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add date of birth']
  },
  type: {
    type: String,
    enum: ['Cow', 'Calf', 'Heifer', 'Bull'],
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  motherId: {
    type: String,
    trim: true
  },
  fatherId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pregnant', 'Lactating', 'Dry', 'Culled', 'Sold', 'Active', 'Sick'],
    default: 'Active'
  },
  location: {
    type: String,
    trim: true
  },
  group: {
    type: String,
    trim: true
  },
  lastCalvingDate: {
    type: Date
  },
  expectedCalvingDate: {
    type: Date
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number
  },
  saleDate: {
    type: Date
  },
  salePrice: {
    type: Number
  },
  cullingReason: {
    type: String
  },
  weight: {
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

module.exports = mongoose.model('Animal', AnimalSchema);
