const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add employee name'],
    trim: true
  },
  role: {
    type: String,
    enum: ['Milker', 'Feeder', 'General Farmhand', 'Supervisor', 'Maintenance'],
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
  address: {
    type: String
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  salary: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  emergencyContact: {
    name: String,
    number: String,
    relation: String
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
