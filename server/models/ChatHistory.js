const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Conversation' },
  messages: [messageSchema],
  caseType: { type: String, default: '' },
  suggestedLaws: [{ act: String, section: String, description: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

chatHistorySchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
