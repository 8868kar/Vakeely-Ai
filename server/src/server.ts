import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import LegalAct from './models/LegalAct.js';
import User from './models/User.js';
import Lawyer from './models/Lawyer.js';
import legalSeedData from './data/legalSeedData.js';
import lawyerSeedData from './data/lawyerSeedData.js';
import { getAIStatus } from './config/openai.js';

import authRoutes from './routes/authRoutes.js';
import lawyerRoutes from './routes/lawyerRoutes.js';
import legalRoutes from './routes/legalRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CORS ─────────────────────────────────────────────────────────────────────

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_URL, 'https://vakeely.vercel.app'].filter(Boolean) as string[]
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl, Postman) in development
    if (!origin || process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// ─── HEALTH & AI STATUS ───────────────────────────────────────────────────────

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

app.get('/api/ai/status', (_req: Request, res: Response) => {
  res.json(getAIStatus());
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err.message);

  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS: Origin not allowed' });
  }

  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

// ─── DATABASE SEEDING ─────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    // ── Legal Acts ──
    // Force reseed if the data has grown (version tracking via count)
    const dbCount = await LegalAct.countDocuments();
    const seedCount = legalSeedData.length;

    if (dbCount === 0 || dbCount < seedCount) {
      if (dbCount > 0) {
        console.log(`[Seed] Detected law database update (DB: ${dbCount}, Seed: ${seedCount}). Reseeding...`);
        await LegalAct.deleteMany({});
      }
      await LegalAct.insertMany(legalSeedData);
      console.log(`[Seed] ✅ Legal database seeded with ${seedCount} acts.`);
    } else {
      console.log(`[Seed] Legal acts already seeded (${dbCount} acts). Skipping.`);
    }

    // ── Lawyers ──
    const lawyerCount = await Lawyer.countDocuments();
    if (lawyerCount === 0) {
      await Lawyer.insertMany(lawyerSeedData);
      console.log(`[Seed] ✅ Seeded ${lawyerSeedData.length} lawyers.`);
    }

    // ── Default Admin ──
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@vakeely.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('[Seed] ✅ Default admin created: admin@vakeely.com / admin123');
    }

  } catch (error: any) {
    console.error('[Seed] ❌ Seeding error:', error.message);
    // Don't crash server on seed error
  }
};

// ─── SERVER STARTUP ───────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  // Log AI engine status at startup
  const aiStatus = getAIStatus();

  app.listen(PORT, () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀  VAkeely Server running on port ${PORT}`);
    console.log(`📡  API: http://localhost:${PORT}/api`);
    console.log(`🧠  AI Engine: ${aiStatus.available ? `${aiStatus.model} (RAG mode)` : 'Keyword Fallback'}`);
    console.log(`⚖️   Law Database: ${legalSeedData.length} acts loaded`);
    console.log(`🔑  Default Admin: admin@vakeely.com / admin123`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });
};

startServer();
