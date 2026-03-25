const express = require('express');
const Appointment = require('../models/Appointment');
const Lawyer = require('../models/Lawyer');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Book appointment
router.post('/', auth, async (req, res) => {
  try {
    const { lawyerId, date, time, caseType, description } = req.body;

    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    if (lawyer.verified !== 'approved') return res.status(400).json({ message: 'Lawyer is not verified' });

    // Check for conflicting appointments
    const existing = await Appointment.findOne({
      lawyerId, date: new Date(date), time, status: { $in: ['pending', 'confirmed'] }
    });
    if (existing) return res.status(400).json({ message: 'Time slot already booked' });

    const appointment = new Appointment({
      userId: req.userId,
      lawyerId,
      date: new Date(date),
      time,
      caseType: caseType || '',
      description: description || '',
      fee: lawyer.consultationFee
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
});

// Get appointments (for user or lawyer)
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    if (req.userRole === 'lawyer') {
      filter.lawyerId = req.userId;
    } else {
      filter.userId = req.userId;
    }
    
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('userId', 'name email phone')
      .populate('lawyerId', 'name email phone specializations consultationFee')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// Update appointment status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes) update.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('userId', 'name email phone')
      .populate('lawyerId', 'name email phone specializations');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
});

module.exports = router;
