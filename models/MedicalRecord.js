const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  animalId: {
    type: String,
    required: [true, 'Please specify animal ID'],
    ref: 'Animal'
  },
  recordType: {
    type: String,
    enum: ['Treatment', 'Vaccination', 'Checkup', 'Surgery'],
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  doctorName: {
    type: String
  },
  symptoms: {
    type: String
  },
  diagnosis: {
    type: String
  },
  treatment: {
    type: String
  },
  medication: {
    type: String
  },
  dosage: {
    type: String
  },
  vaccineName: {
    type: String
  },
  nextVaccinationDate: {
    type: Date
  },
  recoveryDate: {
    type: Date
  },
  cost: {
    type: Number
  },
  notes: {
    type: String
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
