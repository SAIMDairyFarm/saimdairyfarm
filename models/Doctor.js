const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add doctor name'],
    trim: true
  },
  specialization: {
    type: String,
    enum: ['Veterinarian', 'Nutritionist', 'Surgeon', 'General'],
    required: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Please add contact number']
  },
  email: {
    type: String,
    lowercase: true
  },
  clinic: {
    type: String
  },
  address: {
    type: String
  },
  consultationFee: {
    type: Number
  },
  availableDays: {
    type: String
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
