import { Router } from 'express';
import {
  getPublicSkills,
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill
} from './skills.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { skillSchema } from './skills.validate.js';

const router = Router();

// Public routes
router.get('/', getPublicSkills);

// Admin routes
router.use('/admin', authenticate);
router.get('/admin/all', getAdminSkills);

router.post('/', authenticate, validateRequest(skillSchema), createSkill);
router.put('/:id', authenticate, validateRequest(skillSchema), updateSkill);
router.delete('/:id', authenticate, deleteSkill);

export default router;
