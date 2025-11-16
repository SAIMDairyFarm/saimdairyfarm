const express = require('express');
const router = express.Router();
const MilkRecord = require('../models/MilkRecord');
const { protect, authorize } = require('../middleware/auth');

// Get all milk records
router.get('/', protect, async (req, res) => {
  try {
    const records = await MilkRecord.find().sort({ date: -1, session: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get milk records by animal ID
router.get('/animal/:animalId', protect, async (req, res) => {
  try {
    const records = await MilkRecord.find({ animalId: req.params.animalId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get milk production statistics
router.get('/stats/production', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRecords = await MilkRecord.find({ 
      date: { $gte: today } 
    });
    
    const totalToday = todayRecords.reduce((sum, record) => sum + record.quantity, 0);
    
    res.status(200).json({
      success: true,
      data: {
        todayTotal: totalToday,
        recordCount: todayRecords.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create milk record
router.post('/', protect, async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    const record = await MilkRecord.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update milk record
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const record = await MilkRecord.findByIdAndUpdate(req.params.id, req.body, {
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

// Delete milk record
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const record = await MilkRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
