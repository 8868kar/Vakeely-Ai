import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Input validation and sanitization middleware for chat messages.
 * Strips dangerous characters, enforces length limits, blocks spam.
 * Now using Zod for robust runtime type checking.
 */

export const MAX_MESSAGE_LENGTH = 2000;
export const MIN_MESSAGE_LENGTH = 3;

// Zod schema for chat request
const chatSchema = z.object({
  message: z.string()
    .min(MIN_MESSAGE_LENGTH, `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`)
    .max(MAX_MESSAGE_LENGTH, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`),
  chatId: z.string().optional()
});

// Simple HTML/script tag stripper
export const stripDangerousContent = (str: string): string => {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')           // strip all HTML tags
    .replace(/javascript:/gi, '')       // strip JS URLs
    .replace(/on\w+\s*=/gi, '')        // strip event handlers
    .trim();
};

export const validateChatInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body structure using Zod
    const result = chatSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        message: 'Invalid request input.',
        errors: result.error.errors.map(e => e.message)
      });
    }

    const { message } = result.data;

    // Sanitize message content
    const sanitizedMessage = stripDangerousContent(message);

    if (sanitizedMessage.length < MIN_MESSAGE_LENGTH) {
      return res.status(400).json({
        message: `Sanitized message is too short. Please describe your legal situation clearly.`
      });
    }

    // Replace the raw message with the sanitized version in the request body
    req.body.message = sanitizedMessage;
    next();
  } catch (error: any) {
    res.status(500).json({ message: 'Input validation service error.' });
  }
};
