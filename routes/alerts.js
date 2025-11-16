const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const FeedInventory = require('../models/FeedInventory');
const { protect } = require('../middleware/auth');

// Get all alerts
router.get('/', protect, async (req, res) => {
  try {
    const alerts = [];
    const today = new Date();
    
    // Check for overdue vaccinations
    const overdueVaccinations = await MedicalRecord.find({
      recordType: 'Vaccination',
      nextVaccinationDate: { $lt: today },
      nextVaccinationDate: { $ne: null }
    });
    
    overdueVaccinations.forEach(record => {
      alerts.push({
        type: 'vaccination',
        severity: 'high',
        message: `Vaccination overdue for animal ${record.animalId}`,
        data: record
      });
    });
    
    // Check for upcoming vaccinations (within 7 days)
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 7);
    
    const upcomingVaccinations = await MedicalRecord.find({
      recordType: 'Vaccination',
      nextVaccinationDate: { $gte: today, $lte: upcomingDate }
    });
    
    upcomingVaccinations.forEach(record => {
      alerts.push({
        type: 'vaccination',
        severity: 'medium',
        message: `Upcoming vaccination for animal ${record.animalId}`,
        data: record
      });
    });
    
    // Check for low stock items
    const lowStockItems = await FeedInventory.find({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    });
    
    lowStockItems.forEach(item => {
      alerts.push({
        type: 'stock',
        severity: item.currentStock === 0 ? 'high' : 'medium',
        message: `Low stock alert: ${item.itemName} (${item.currentStock} ${item.unit})`,
        data: item
      });
    });
    
    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
