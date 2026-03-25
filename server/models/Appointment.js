const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  caseType: { type: String, default: '' },
  description: { type: String, default: '', maxlength: 2000 },
  notes: { type: String, default: '' },
  fee: { type: Number, default: 0 }
}, { timestamps: true });

appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ lawyerId: 1, status: 1 });
appointmentSchema.index({ date: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
