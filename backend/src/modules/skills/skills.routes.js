import { Router } from 'express';
import skillsController from './skills.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { skillSchema } from './skills.validate.js';

const router = Router();

// Public routes
router.get('/', skillsController.getPublicSkills);

// Admin routes
router.use('/admin', authenticate);
router.get('/admin/all', skillsController.getAdminSkills);

router.post('/', authenticate, validateRequest(skillSchema), skillsController.createSkill);
router.put('/:id', authenticate, validateRequest(skillSchema), skillsController.updateSkill);
router.delete('/:id', authenticate, skillsController.deleteSkill);

export default router;
