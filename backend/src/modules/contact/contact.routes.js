import { Router } from 'express';
import {
  createMessage,
  getMessages,
  getMessage,
  replyToMessage,
  updateStatus,
  deleteMessage
} from './contact.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { contactSchema, replySchema, contactStatusSchema } from './contact.validate.js';
import { apiLimiter } from '../../middleware/rateLimit.middleware.js';

const router = Router();

// Public routes
router.post('/', apiLimiter, validateRequest(contactSchema), createMessage);

// Admin routes
router.use(authenticate);
router.get('/', getMessages);
router.get('/:id', getMessage);
router.post('/:id/reply', validateRequest(replySchema), replyToMessage);
router.patch('/:id/status', validateRequest(contactStatusSchema), updateStatus);
router.delete('/:id', deleteMessage);

export default router;
