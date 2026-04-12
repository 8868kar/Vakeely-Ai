import mongoose, { Schema } from 'mongoose';
import { IAppointment } from '../types/index.js';

const appointmentSchema = new Schema<IAppointment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lawyerId: { type: Schema.Types.ObjectId, ref: 'Lawyer', required: true },
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

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
export default Appointment;
