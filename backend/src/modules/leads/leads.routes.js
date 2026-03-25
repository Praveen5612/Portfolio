import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateStatus,
  addNote,
  deleteLead
} from './leads.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { leadSchema, leadStatusSchema, leadNoteSchema } from './leads.validate.js';
import { apiLimiter } from '../../middleware/rateLimit.middleware.js';

const router = Router();

// Public routes (Rate limited to avoid spam)
router.post('/', apiLimiter, validateRequest(leadSchema), createLead);

// Admin routes
router.use(authenticate);
router.get('/', getLeads);
router.get('/:id', getLead);
router.patch('/:id/status', validateRequest(leadStatusSchema), updateStatus);
router.post('/:id/notes', validateRequest(leadNoteSchema), addNote);
router.delete('/:id', deleteLead);

export default router;
