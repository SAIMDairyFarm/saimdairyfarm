const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const { protect, authorize } = require('../middleware/auth');

// Get all calves
router.get('/', protect, async (req, res) => {
  try {
    const calves = await Animal.find({ type: 'Calf' }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: calves.length,
      data: calves
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
