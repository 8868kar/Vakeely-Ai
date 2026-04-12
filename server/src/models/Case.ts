import mongoose, { Schema, Document } from 'mongoose';

export interface ICase extends Document {
  title: string;
  petitioner: string;
  respondent: string;
  bench: string;
  author: string;
  citation: string;
  date: Date;
  judgmentText: string;
}

const caseSchema = new Schema<ICase>({
  title: { type: String, index: true },
  petitioner: { type: String },
  respondent: { type: String },
  bench: { type: String },
  author: { type: String },
  citation: { type: String },
  date: { type: Date, index: true },
  judgmentText: { type: String },
}, { timestamps: true });

// We add a text index so we can search cases very efficiently based on keywords later.
caseSchema.index({ title: 'text', judgmentText: 'text' });

const Case = mongoose.model<ICase>('Case', caseSchema);
export default Case;
