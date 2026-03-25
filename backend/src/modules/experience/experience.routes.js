import { Router } from 'express';
import {
  getPublicExperience,
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience
} from './experience.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { experienceSchema } from './experience.validate.js';

const router = Router();

// Public routes
router.get('/', getPublicExperience);

// Admin routes
router.use('/admin', authenticate);
router.get('/admin/all', getAdminExperience);

router.post('/', authenticate, validateRequest(experienceSchema), createExperience);
router.put('/:id', authenticate, validateRequest(experienceSchema), updateExperience);
router.delete('/:id', authenticate, deleteExperience);

export default router;
