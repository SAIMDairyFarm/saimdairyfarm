const express = require('express');
const router = express.Router();
const FeedInventory = require('../models/FeedInventory');
const FeedAllocation = require('../models/FeedAllocation');
const { protect, authorize } = require('../middleware/auth');

// Get all inventory items
router.get('/inventory', protect, async (req, res) => {
  try {
    const items = await FeedInventory.find().sort({ itemName: 1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single inventory item
router.get('/inventory/:id', protect, async (req, res) => {
  try {
    const item = await FeedInventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create inventory item
router.post('/inventory', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const item = await FeedInventory.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update inventory item
router.put('/inventory/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const item = await FeedInventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete inventory item
router.delete('/inventory/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await FeedInventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all allocations
router.get('/allocations', protect, async (req, res) => {
  try {
    const allocations = await FeedAllocation.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: allocations.length,
      data: allocations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create allocation
router.post('/allocations', protect, async (req, res) => {
  try {
    req.body.allocatedBy = req.user.id;
    
    // Update inventory stock
    const item = await FeedInventory.findById(req.body.feedItemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Feed item not found' });
    }
    
    if (item.currentStock < req.body.quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }
    
    item.currentStock -= req.body.quantity;
    item.updatedAt = Date.now();
    await item.save();
    
    const allocation = await FeedAllocation.create(req.body);
    res.status(201).json({ success: true, data: allocation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
