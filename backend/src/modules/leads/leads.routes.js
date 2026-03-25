import { Router } from 'express';
import leadsController from './leads.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { leadSchema, leadStatusSchema, leadNoteSchema } from './leads.validate.js';
import { apiLimiter } from '../../middleware/rateLimit.middleware.js';

const router = Router();

// Public routes (Rate limited to avoid spam)
router.post('/', apiLimiter, validateRequest(leadSchema), leadsController.createLead);

// Admin routes
router.use(authenticate);
router.get('/', leadsController.getLeads);
router.get('/:id', leadsController.getLead);
router.patch('/:id/status', validateRequest(leadStatusSchema), leadsController.updateStatus);
router.post('/:id/notes', validateRequest(leadNoteSchema), leadsController.addNote);
router.delete('/:id', leadsController.deleteLead);

export default router;
