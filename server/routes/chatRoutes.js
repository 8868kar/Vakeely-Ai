const express = require('express');
const ChatHistory = require('../models/ChatHistory');
const { auth } = require('../middleware/auth');
const { generateLegalResponse } = require('../config/openai');

const router = express.Router();

// Send message to AI
router.post('/', auth, async (req, res) => {
  try {
    const { message, chatId } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    let chat;
    if (chatId) {
      chat = await ChatHistory.findOne({ _id: chatId, userId: req.userId });
    }

    if (!chat) {
      chat = new ChatHistory({
        userId: req.userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: []
      });
    }

    // Add user message
    chat.messages.push({ role: 'user', content: message });

    // Generate AI response
    const aiResponse = await generateLegalResponse(message, chat.messages.slice(-10));

    const assistantMessage = aiResponse.data 
      ? JSON.stringify(aiResponse.data, null, 2) 
      : aiResponse.raw;

    // Add assistant message
    chat.messages.push({ role: 'assistant', content: assistantMessage });

    // Update case type and suggested laws from response
    if (aiResponse.data) {
      chat.caseType = aiResponse.data.caseType || chat.caseType;
      if (aiResponse.data.relevantLaws) {
        chat.suggestedLaws = aiResponse.data.relevantLaws;
      }
    }

    await chat.save();

    res.json({
      chatId: chat._id,
      response: aiResponse.data || { explanation: aiResponse.raw },
      raw: assistantMessage,
      isFallback: aiResponse.isFallback || false
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to process message', error: error.message });
  }
});

// Get chat history list
router.get('/history', auth, async (req, res) => {
  try {
    const chats = await ChatHistory.find({ userId: req.userId })
      .select('title caseType createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(50);
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat history', error: error.message });
  }
});

// Get specific chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({ _id: req.params.id, userId: req.userId });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat', error: error.message });
  }
});

// Delete chat
router.delete('/:id', auth, async (req, res) => {
  try {
    await ChatHistory.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete chat', error: error.message });
  }
});

module.exports = router;
