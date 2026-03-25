import { Router } from 'express';
import contactController from './contact.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { contactSchema, replySchema, contactStatusSchema } from './contact.validate.js';
import { apiLimiter } from '../../middleware/rateLimit.middleware.js';

const router = Router();

// Public routes
router.post('/', apiLimiter, validateRequest(contactSchema), contactController.createMessage);

// Admin routes
router.use(authenticate);
router.get('/', contactController.getMessages);
router.get('/:id', contactController.getMessage);
router.post('/:id/reply', validateRequest(replySchema), contactController.replyToMessage);
router.patch('/:id/status', validateRequest(contactStatusSchema), contactController.updateStatus);
router.delete('/:id', contactController.deleteMessage);

export default router;
