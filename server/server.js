const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const LegalAct = require('./models/LegalAct');
const User = require('./models/User');
const legalSeedData = require('./data/legalSeedData');

const authRoutes = require('./routes/authRoutes');
const lawyerRoutes = require('./routes/lawyerRoutes');
const legalRoutes = require('./routes/legalRoutes');
const chatRoutes = require('./routes/chatRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Seed database function
const seedDatabase = async () => {
  try {
    const count = await LegalAct.countDocuments();
    if (count === 0) {
      await LegalAct.insertMany(legalSeedData);
      console.log('Legal database seeded with', legalSeedData.length, 'acts');
    }

    // Create default admin user
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@vakeely.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Default admin user created (admin@vakeely.com / admin123)');
    }
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDatabase();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 VAkeely Server running on port ${PORT}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api`);
    console.log(`🔑 Default Admin: admin@vakeely.com / admin123\n`);
  });
};

startServer();
