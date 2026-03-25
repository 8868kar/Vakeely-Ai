const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  specializations: [{ 
    type: String, 
    enum: ['Civil', 'Criminal', 'Corporate', 'IP', 'Tax', 'Family', 'Property', 'Labour', 'Constitutional', 'Consumer', 'General'] 
  }],
  experience: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 0 },
  bio: { type: String, default: '', maxlength: 1000 },
  education: { type: String, default: '' },
  barCouncilId: { type: String, default: '' },
  location: { type: String, default: '' },
  languages: [{ type: String }],
  verified: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verificationDocs: [{ filename: String, path: String, uploadedAt: { type: Date, default: Date.now } }],
  availability: {
    monday: { available: { type: Boolean, default: true }, slots: [String] },
    tuesday: { available: { type: Boolean, default: true }, slots: [String] },
    wednesday: { available: { type: Boolean, default: true }, slots: [String] },
    thursday: { available: { type: Boolean, default: true }, slots: [String] },
    friday: { available: { type: Boolean, default: true }, slots: [String] },
    saturday: { available: { type: Boolean, default: false }, slots: [String] },
    sunday: { available: { type: Boolean, default: false }, slots: [String] }
  },
  avatar: { type: String, default: '' },
  casesHandled: { type: Number, default: 0 }
}, { timestamps: true });

lawyerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

lawyerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

lawyerSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

lawyerSchema.index({ specializations: 1, rating: -1, experience: -1 });
lawyerSchema.index({ location: 1 });
lawyerSchema.index({ verified: 1 });

module.exports = mongoose.model('Lawyer', lawyerSchema);
