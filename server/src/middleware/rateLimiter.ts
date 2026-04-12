import { Request, Response, NextFunction } from 'express';

/**
 * Per-user in-memory rate limiter for the /api/chat endpoint.
 * Production-grade: limits authenticated users to 20 requests per hour.
 * Uses a sliding-window log approach for accuracy.
 */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 20;

// Map<userId, number[]> — array of timestamps of recent requests
const requestLog = new Map<string, number[]>();

// Cleanup stale entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [userId, timestamps] of requestLog.entries()) {
    const fresh = timestamps.filter(t => now - t < WINDOW_MS);
    if (fresh.length === 0) {
      requestLog.delete(userId);
    } else {
      requestLog.set(userId, fresh);
    }
  }
}, 10 * 60 * 1000);

export const chatRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId?.toString();
  if (!userId) return next(); // auth middleware will handle missing userId

  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Get fresh timestamps within the current window
  const timestamps = (requestLog.get(userId) || []).filter(t => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldestTimestamp = timestamps[0];
    const retryAfterMs = WINDOW_MS - (now - oldestTimestamp);
    const retryAfterSecs = Math.ceil(retryAfterMs / 1000);

    return res.status(429).json({
      message: `Rate limit exceeded. You can send ${MAX_REQUESTS} messages per hour.`,
      retryAfter: retryAfterSecs,
      requestsUsed: timestamps.length,
      requestsLimit: MAX_REQUESTS,
      windowResetAt: new Date(oldestTimestamp + WINDOW_MS).toISOString()
    });
  }

  // Log this request
  timestamps.push(now);
  requestLog.set(userId, timestamps);

  // Attach rate limit info to response headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - timestamps.length);
  res.setHeader('X-RateLimit-Reset', new Date(timestamps[0] + WINDOW_MS).toISOString());

  next();
};
