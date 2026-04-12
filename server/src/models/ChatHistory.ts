import mongoose, { Schema } from 'mongoose';
import { IChatHistory, IChatMessage } from '../types/index.js';

const messageSchema = new Schema<IChatMessage>({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new Schema<IChatHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Conversation' },
  messages: [messageSchema],
  caseType: { type: String, default: '' },
  suggestedLaws: [{ act: String, section: String, description: String }],
}, { timestamps: true });

chatHistorySchema.index({ userId: 1, updatedAt: -1 });

const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', chatHistorySchema);
export default ChatHistory;
