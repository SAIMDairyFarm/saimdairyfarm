const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { protect, authorize } = require('../middleware/auth');

// Get all medical records
router.get('/', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get medical records by animal ID
router.get('/animal/:animalId', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ animalId: req.params.animalId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single medical record
router.get('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create medical record
router.post('/', protect, authorize('admin', 'manager', 'veterinarian'), async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update medical record
router.put('/:id', protect, authorize('admin', 'manager', 'veterinarian'), async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete medical record
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
