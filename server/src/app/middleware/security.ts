import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import httpStatus from 'http-status';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Recursively removes keys that could be read as MongoDB operators or paths. */
const stripOperatorKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripOperatorKeys);
  if (value && typeof value === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.') || key === '__proto__') continue;
      clean[key] = stripOperatorKeys(val);
    }
    return clean;
  }
  return value;
};

export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') req.body = stripOperatorKeys(req.body);
  next();
};

/**
 * CSRF guard for cookie sessions: browsers cannot attach a custom header to a
 * cross-site request without a CORS preflight, which the origin allowlist rejects.
 */
export const requireCsrfHeader = (req: Request, res: Response, next: NextFunction) => {
  if (SAFE_METHODS.has(req.method)) return next();
  if (req.get('x-requested-with') !== 'portfolio-dashboard') {
    return res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: 'Missing CSRF header',
      errorSources: [{ path: '', message: 'Missing CSRF header' }],
    });
  }
  next();
};

const limiter = (windowMinutes: number, limit: number, message: string) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message, errorSources: [{ path: '', message }] },
  });

export const apiLimiter = limiter(15, 600, 'Too many requests, try again later.');
// Per-IP ceiling for all credential endpoints; per-account lockout (5 failures) is the main brute-force guard.
export const loginLimiter = limiter(15, 20, 'Too many login attempts, try again in 15 minutes.');
// Public contact form: a person rarely sends more than a few messages.
export const contactLimiter = limiter(60, 5, 'Too many messages, try again later.');
export const writeLimiter = limiter(15, 200, 'Too many changes, slow down.');
