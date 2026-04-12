import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Lawyer from '../models/Lawyer.js';

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    
    let user;
    if (decoded.role === 'lawyer') {
      user = await Lawyer.findById(decoded.id);
    } else {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user as any;
    req.userRole = decoded.role;
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user as any).role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const lawyerOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'lawyer') {
    return res.status(403).json({ message: 'Lawyer access required' });
  }
  next();
};
