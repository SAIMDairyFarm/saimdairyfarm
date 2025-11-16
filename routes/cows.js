const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const { protect, authorize } = require('../middleware/auth');

// Get all animals
router.get('/', protect, async (req, res) => {
  try {
    const animals = await Animal.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: animals.length,
      data: animals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single animal
router.get('/:id', protect, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }
    res.status(200).json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create animal
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json({ success: true, data: animal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update animal
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }
    res.status(200).json({ success: true, data: animal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete animal
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
