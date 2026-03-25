const express = require('express');
const Lawyer = require('../models/Lawyer');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Search Lawyers with filters
router.get('/', async (req, res) => {
  try {
    const { specialization, minRating, minExperience, maxFee, location, search, page = 1, limit = 12 } = req.query;
    
    const filter = { verified: 'approved' };
    
    if (specialization) filter.specializations = specialization;
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (minExperience) filter.experience = { $gte: parseInt(minExperience) };
    if (maxFee) filter.consultationFee = { $lte: parseInt(maxFee) };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { specializations: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const lawyers = await Lawyer.find(filter)
      .select('-password')
      .sort({ rating: -1, experience: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lawyer.countDocuments(filter);

    res.json({
      lawyers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lawyers', error: error.message });
  }
});

// Get Lawyer Profile
router.get('/:id', async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id).select('-password');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lawyer', error: error.message });
  }
});

// Update Lawyer Profile
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updates = req.body;
    delete updates.password;
    delete updates.verified;
    delete updates.rating;

    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Get Lawyer Appointments
router.get('/:id/appointments', auth, async (req, res) => {
  try {
    const Appointment = require('../models/Appointment');
    const appointments = await Appointment.find({ lawyerId: req.params.id })
      .populate('userId', 'name email phone')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

module.exports = router;
