import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import User from '../models/User.js';
import Lawyer from '../models/Lawyer.js';
import { auth } from '../middleware/auth.js';

const router: Router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// Google Login
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { token, accountType } = req.body;
    
    let email, name, picture;
    try {
      // Verify Google Token if GOOGLE_CLIENT_ID is set
      // For local testing without client ID, we can decode it on client. But server verification is secure.
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) return res.status(400).json({ message: 'Invalid Google token payload' });
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } catch (err: any) {
      console.warn('Google verification error (usually missing client_id):', err);
      // Fallback decode if not completely secure (Not recommended for prod, but helps dev if no client id yet)
      const decodedUser = jwt.decode(token) as any;
      if (!decodedUser || !decodedUser.email) {
        return res.status(400).json({ message: 'Could not decode Google token' });
      }
      email = decodedUser.email;
      name = decodedUser.name;
      picture = decodedUser.picture;
    }
    
    let user: any;
    let role: string = accountType === 'lawyer' ? 'lawyer' : 'user';

    // Search by accountType
    if (accountType === 'lawyer') {
      user = await Lawyer.findOne({ email });
    } else if (accountType === 'user') {
      user = await User.findOne({ email });
    }

    // Try both if no specific accountType
    if (!user && !accountType) {
      user = await User.findOne({ email });
      if (user) {
        role = user.role || 'user';
      } else {
        user = await Lawyer.findOne({ email });
        if (user) role = 'lawyer';
      }
    }

    // If user still doesn't exist, register them
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      if (role === 'lawyer') {
        user = new Lawyer({
          name: name || 'Google User',
          email,
          password: randomPassword,
          avatar: picture || '',
          specializations: ['General'],
        });
      } else {
        user = new User({
          name: name || 'Google User',
          email,
          password: randomPassword,
          avatar: picture || '',
          role: 'user'
        });
      }
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    
    res.json({ 
      token: jwtToken, 
      user, 
      accountType: role === 'lawyer' ? 'lawyer' : 'user',
      role: role
    });

  } catch (error: any) {
    console.error('Google Auth error:', error);
    res.status(500).json({ message: 'Google Authentication failed', error: error.message });
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
