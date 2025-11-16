const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const PDFGenerator = require('../utils/pdfGenerator');
const Animal = require('../models/Animal');
const MedicalRecord = require('../models/MedicalRecord');
const MilkRecord = require('../models/MilkRecord');
const FeedInventory = require('../models/FeedInventory');
const Employee = require('../models/Employee');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');

// Export Livestock PDF
router.get('/livestock', protect, async (req, res) => {
    try {
        const animals = await Animal.find().sort({ createdAt: -1 });
        
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=livestock-report.pdf');
        doc.pipe(res);

        PDFGenerator.generateHeader(doc, 'Livestock Management Report');

        const headers = ['Tag ID', 'Name', 'Type', 'Breed', 'Status', 'Location'];
        const data = animals.map(a => [
            a.tagId,
            a.name || 'N/A',
            a.type,
            a.breed,
            a.status,
            a.location || 'N/A'
        ]);

        PDFGenerator.generateTable(doc, headers, data);
        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Export Medical Records PDF
router.get('/medical', protect, async (req, res) => {
    try {
        const records = await MedicalRecord.find().sort({ date: -1 }).limit(100);
        
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=medical-records.pdf');
        doc.pipe(res);

        PDFGenerator.generateHeader(doc, 'Medical Records Report');

        const headers = ['Animal ID', 'Type', 'Date', 'Doctor', 'Diagnosis'];
        const data = records.map(r => [
            r.animalId,
            r.recordType,
            new Date(r.date).toLocaleDateString(),
            r.doctorName || 'N/A',
            r.diagnosis || r.vaccineName || 'N/A'
        ]);

        PDFGenerator.generateTable(doc, headers, data);
        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Export Milk Production PDF
router.get('/milk', protect, async (req, res) => {
    try {
        const records = await MilkRecord.find().sort({ date: -1 }).limit(100);
        
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=milk-production.pdf');
        doc.pipe(res);

        PDFGenerator.generateHeader(doc, 'Milk Production Report');

        const totalProduction = records.reduce((sum, r) => sum + r.quantity, 0);
        doc.fontSize(12).text(`Total Production: ${totalProduction.toFixed(2)} Liters`, 50, 120);

        const headers = ['Animal ID', 'Date', 'Session', 'Quantity (L)', 'Quality'];
        const data = records.map(r => [
            r.animalId,
            new Date(r.date).toLocaleDateString(),
            r.session,
            r.quantity.toFixed(2),
            r.quality
        ]);

        PDFGenerator.generateTable(doc, headers, data, 150);
        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Export Feed Inventory PDF
router.get('/feed', protect, async (req, res) => {
    try {
        const items = await FeedInventory.find().sort({ itemName: 1 });
        
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=feed-inventory.pdf');
        doc.pipe(res);

        PDFGenerator.generateHeader(doc, 'Feed & Inventory Report');

        const headers = ['Item Name', 'Category', 'Stock', 'Reorder Level', 'Supplier'];
        const data = items.map(i => [
            i.itemName,
            i.category,
            `${i.currentStock} ${i.unit}`,
            `${i.reorderLevel} ${i.unit}`,
            i.supplier || 'N/A'
        ]);

        PDFGenerator.generateTable(doc, headers, data);
        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Export HR PDF
router.get('/hr', protect, async (req, res) => {
    try {
        const employees = await Employee.find().sort({ name: 1 });
        const doctors = await Doctor.find().sort({ name: 1 });
        
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=hr-report.pdf');
        doc.pipe(res);

        PDFGenerator.generateHeader(doc, 'Human Resources Report');

        // Employees Section
        doc.fontSize(14).fillColor('#2c5f2d').text('Employees', 50, 120);
        const empHeaders = ['Name', 'Role', 'Contact', 'Status'];
        const empData = employees.map(e => [e.name, e.role, e.contactNumber, e.status]);
        PDFGenerator.generateTable(doc, empHeaders, empData, 145);

        // Doctors Section
        const doctorsY = 145 + (employees.length * 25) + 50;
        doc.fontSize(14).fillColor('#2c5f2d').text('Doctors/Consultants', 50, doctorsY);
        const docHeaders = ['Name', 'Specialization', 'Contact', 'Clinic'];
        const docData = doctors.map(d => [d.name, d.specialization, d.contactNumber, d.clinic || 'N/A']);
        PDFGenerator.generateTable(doc, docHeaders, docData, doctorsY + 25);

        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
