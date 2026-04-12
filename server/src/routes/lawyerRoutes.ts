import express, { Request, Response, Router } from 'express';
import Lawyer from '../models/Lawyer.js';
import Appointment from '../models/Appointment.js';
import { auth } from '../middleware/auth.js';
import { ILawyer } from '../types/index.js';

const router: Router = express.Router();

// Search Lawyers with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { specialization, minRating, minExperience, maxFee, location, search, page = '1', limit = '12' } = req.query;
    
    const filter: any = { verified: 'approved' };
    
    if (specialization) filter.specializations = specialization;
    if (minRating) filter.rating = { $gte: parseFloat(minRating as string) };
    if (minExperience) filter.experience = { $gte: parseInt(minExperience as string) };
    if (maxFee) filter.consultationFee = { $lte: parseInt(maxFee as string) };
    if (location) filter.location = { $regex: location as string, $options: 'i' };
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { bio: { $regex: search as string, $options: 'i' } },
        { specializations: { $regex: search as string, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const lawyers = await Lawyer.find(filter)
      .select('-password')
      .sort({ rating: -1, experience: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Lawyer.countDocuments(filter);

    res.json({
      lawyers,
      pagination: {
        total,
        page: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch lawyers', error: error.message });
  }
});

// Get Lawyer Profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id).select('-password');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch lawyer', error: error.message });
  }
});

// Update Lawyer Profile
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    if (req.userId !== req.params.id && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updates = req.body;
    delete updates.password;
    delete updates.verified;
    delete updates.rating;

    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Get Lawyer Appointments
router.get('/:id/appointments', auth, async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({ lawyerId: req.params.id })
      .populate('userId', 'name email phone')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

export default router;
