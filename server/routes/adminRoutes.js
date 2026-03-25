const express = require('express');
const Lawyer = require('../models/Lawyer');
const User = require('../models/User');
const LegalAct = require('../models/LegalAct');
const Appointment = require('../models/Appointment');
const ChatHistory = require('../models/ChatHistory');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get pending lawyer verifications
router.get('/lawyers', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { verified: status } : {};
    const lawyers = await Lawyer.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lawyers', error: error.message });
  }
});

// Approve/Reject lawyer
router.put('/lawyers/:id/verify', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const lawyer = await Lawyer.findByIdAndUpdate(
      req.params.id, 
      { verified: status }, 
      { new: true }
    ).select('-password');

    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update verification', error: error.message });
  }
});

// Analytics dashboard
router.get('/analytics', auth, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalLawyers, pendingVerifications, totalAppointments, totalChats] = await Promise.all([
      User.countDocuments(),
      Lawyer.countDocuments(),
      Lawyer.countDocuments({ verified: 'pending' }),
      Appointment.countDocuments(),
      ChatHistory.countDocuments()
    ]);

    const recentAppointments = await Appointment.find()
      .populate('userId', 'name')
      .populate('lawyerId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const categoryStats = await LegalAct.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const appointmentStats = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      stats: { totalUsers, totalLawyers, pendingVerifications, totalAppointments, totalChats },
      recentAppointments,
      categoryStats,
      appointmentStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

// Manage legal database - Add act
router.post('/legal', auth, adminOnly, async (req, res) => {
  try {
    const act = new LegalAct(req.body);
    await act.save();
    res.status(201).json(act);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add act', error: error.message });
  }
});

// Update act
router.put('/legal/:id', auth, adminOnly, async (req, res) => {
  try {
    const act = await LegalAct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!act) return res.status(404).json({ message: 'Act not found' });
    res.json(act);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update act', error: error.message });
  }
});

// Delete act
router.delete('/legal/:id', auth, adminOnly, async (req, res) => {
  try {
    await LegalAct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Act deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete act', error: error.message });
  }
});

// Get all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

module.exports = router;
