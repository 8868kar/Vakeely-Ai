import express, { Request, Response, Router } from 'express';
import ChatHistory from '../models/ChatHistory.js';
import LegalAct from '../models/LegalAct.js';
import { auth } from '../middleware/auth.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';
import { validateChatInput, MAX_MESSAGE_LENGTH } from '../middleware/inputValidator.js';
import { generateLegalResponse, getAIStatus } from '../config/openai.js';
import { IChatMessage } from '../types/index.js';

const router: Router = express.Router();

// ─── AI STATUS ────────────────────────────────────────────────────────────────

// GET /api/chat/status — Returns current AI engine status (public)
router.get('/status', (_req: Request, res: Response) => {
  const status = getAIStatus();
  res.json({
    ...status,
    maxMessageLength: MAX_MESSAGE_LENGTH,
    rateLimit: { requests: 20, windowHours: 1 }
  });
});

// ─── SEND MESSAGE (RAG-powered) ───────────────────────────────────────────────

// POST /api/chat — Send a message and get an AI legal response
router.post('/', auth, chatRateLimiter, validateChatInput, async (req: Request, res: Response) => {
  try {
    const { message, chatId } = req.body;

    // Load or create chat session
    let chat: any;
    if (chatId) {
      chat = await ChatHistory.findOne({ _id: chatId, userId: req.userId });
    }

    if (!chat) {
      chat = new ChatHistory({
        userId: req.userId,
        title: message.substring(0, 60) + (message.length > 60 ? '...' : ''),
        messages: []
      });
    }

    // Add user message to history
    chat.messages.push({ role: 'user', content: message, timestamp: new Date() });

    // Generate RAG response — pass LegalAct model for DB retrieval
    const aiResponse = await generateLegalResponse(message, chat.messages as IChatMessage[], LegalAct);

    // Serialize the response content to store in DB
    const assistantContent = aiResponse.data
      ? JSON.stringify(aiResponse.data)
      : aiResponse.raw;

    // Add assistant response to history
    chat.messages.push({ role: 'assistant', content: assistantContent, timestamp: new Date() });

    // Update chat metadata from response
    if (aiResponse.data) {
      if (aiResponse.data.caseType) {
        chat.caseType = aiResponse.data.caseType;
      }
      if (aiResponse.data.relevantLaws && aiResponse.data.relevantLaws.length > 0) {
        chat.suggestedLaws = aiResponse.data.relevantLaws.slice(0, 5);
      }
    }

    await chat.save();

    // Return structured response to frontend
    res.json({
      chatId: chat._id,
      response: aiResponse.data || { explanation: aiResponse.raw },
      raw: assistantContent,
      isFallback: aiResponse.isFallback || false,
      isRAG: aiResponse.isRAG || false,
      model: aiResponse.model || null,
      rateLimit: {
        remaining: res.getHeader('X-RateLimit-Remaining'),
        limit: res.getHeader('X-RateLimit-Limit'),
        reset: res.getHeader('X-RateLimit-Reset')
      }
    });

  } catch (error: any) {
    console.error('[Chat] Error processing message:', error);
    res.status(500).json({ message: 'Failed to process message', error: error.message });
  }
});

// ─── CHAT HISTORY ─────────────────────────────────────────────────────────────

// GET /api/chat/history — Get list of user's chat sessions
router.get('/history', auth, async (req: Request, res: Response) => {
  try {
    const chats = await ChatHistory.find({ userId: req.userId })
      .select('title caseType createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(50);
    res.json(chats);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch chat history', error: error.message });
  }
});

// GET /api/chat/:id — Get a specific chat session with all messages
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const chat = await ChatHistory.findOne({ _id: req.params.id, userId: req.userId });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch chat', error: error.message });
  }
});

// DELETE /api/chat/:id — Delete a chat session
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    await ChatHistory.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Chat deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete chat', error: error.message });
  }
});

export default router;
