const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  number: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [String],
  penalty: { type: String, default: '' }
});

const legalActSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortTitle: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Civil', 'Criminal', 'Corporate', 'IP', 'Tax', 'Family', 'Property', 'Labour', 'Constitutional', 'Consumer'],
    required: true 
  },
  year: { type: Number },
  description: { type: String, required: true },
  sections: [sectionSchema],
  keywords: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

legalActSchema.index({ category: 1 });
legalActSchema.index({ 'sections.keywords': 1 });
legalActSchema.index({ title: 'text', description: 'text', 'sections.title': 'text', 'sections.description': 'text' });

module.exports = mongoose.model('LegalAct', legalActSchema);
