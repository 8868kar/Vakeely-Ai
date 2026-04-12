import mongoose, { Schema } from 'mongoose';
import { ILegalAct, ILegalSection } from '../types/index.js';

const sectionSchema = new Schema<ILegalSection>({
  number: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [String],
  penalty: { type: String, default: '' }
});

const legalActSchema = new Schema<ILegalAct>({
  title: { type: String, required: true },
  shortTitle: { type: String, default: '' },
  category: {
    type: String,
    enum: [
      'Civil', 'Criminal', 'Corporate', 'IP', 'Tax',
      'Family', 'Property', 'Labour', 'Constitutional',
      'Consumer', 'Traffic', 'Banking', 'Environment', 'Arbitration'
    ],
    required: true
  },
  year: { type: Number },
  description: { type: String, required: true },
  sections: [sectionSchema],
  keywords: [String],
  isActive: { type: Boolean, default: true },
  embeddingVector: { type: [Number], default: undefined, select: false }
}, { timestamps: true });

legalActSchema.index({ category: 1 });
legalActSchema.index({ keywords: 1 });
legalActSchema.index({ 'sections.keywords': 1 });

// Full-text search index
legalActSchema.index({
  title: 'text',
  description: 'text',
  keywords: 'text',
  'sections.title': 'text',
  'sections.description': 'text',
  'sections.keywords': 'text'
}, {
  weights: {
    title: 10,
    keywords: 8,
    'sections.title': 7,
    description: 5,
    'sections.keywords': 4,
    'sections.description': 3
  },
  name: 'LegalSearchIndex'
});

const LegalAct = mongoose.model<ILegalAct>('LegalAct', legalActSchema);
export default LegalAct;
