import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Lawyer from '../models/Lawyer.js';
import { auth } from '../middleware/auth.js';

const router: Router = express.Router();

// Register User
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role, accountType } = req.body;

    if (accountType === 'lawyer') {
      const existingLawyer = await Lawyer.findOne({ email });
      if (existingLawyer) return res.status(400).json({ message: 'Email already registered' });

      const { specializations, experience, consultationFee, bio, education, barCouncilId, location, languages } = req.body;
      const lawyer = new Lawyer({
        name, email, password, phone,
        specializations: specializations || ['General'],
        experience: experience || 0,
        consultationFee: consultationFee || 500,
        bio: bio || '',
        education: education || '',
        barCouncilId: barCouncilId || '',
        location: location || '',
        languages: languages || ['English']
      });
      await lawyer.save();

      const token = jwt.sign({ id: lawyer._id, role: 'lawyer' }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
      res.status(201).json({ token, user: lawyer, accountType: 'lawyer' });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already registered' });

      const user = new User({ name, email, password, phone, role: role || 'user' });
      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
      res.status(201).json({ token, user, accountType: 'user' });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, accountType } = req.body;

    let user: any;
    let role: string;

    // Try to find user in either collection if accountType is not specified
    if (accountType === 'lawyer') {
      user = await Lawyer.findOne({ email });
      role = 'lawyer';
    } else {
      user = await User.findOne({ email });
      role = user?.role || 'user';
    }

    // If not found and accountType wasn't forced, try the other collection
    if (!user && !accountType) {
      user = await Lawyer.findOne({ email });
      if (user) role = 'lawyer';
    }

    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ 
      token, 
      user, 
      accountType: role === 'lawyer' ? 'lawyer' : 'user',
      role: role
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get Current User
router.get('/me', auth, async (req: Request, res: Response) => {
  try {
    res.json({ 
      user: req.user, 
      accountType: req.userRole === 'lawyer' ? 'lawyer' : 'user',
      role: req.userRole
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

export default router;
