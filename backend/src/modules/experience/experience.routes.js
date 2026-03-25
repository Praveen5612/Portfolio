import { Router } from 'express';
import experienceController from './experience.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { experienceSchema } from './experience.validate.js';

const router = Router();

// Public routes
router.get('/', experienceController.getPublicExperience);

// Admin routes
router.use('/admin', authenticate);
router.get('/admin/all', experienceController.getAdminExperience);

router.post('/', authenticate, validateRequest(experienceSchema), experienceController.createExperience);
router.put('/:id', authenticate, validateRequest(experienceSchema), experienceController.updateExperience);
router.delete('/:id', authenticate, experienceController.deleteExperience);

export default router;
