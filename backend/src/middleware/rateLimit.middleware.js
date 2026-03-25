import rateLimit from 'express-rate-limit';
import { errorResponse } from '../global/response.js';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Global bucket per IP
  handler: (req, res) => {
    return errorResponse(res, 429, 'Too many requests overall, please try again.');
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  handler: (req, res) => {
    return errorResponse(res, 429, 'Too many requests, please try again later.');
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login requests per hour
  handler: (req, res) => {
    return errorResponse(res, 429, 'Too many login attempts, please try again after an hour');
  },
});
