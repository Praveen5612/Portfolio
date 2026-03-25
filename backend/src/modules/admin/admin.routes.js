import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { updateProfileSchema, updatePasswordSchema } from './admin.validate.js';
import {
  getProfile,
  updateProfile,
  updatePassword,
  getLogs
} from './admin.controller.js';

const router = Router();

// All admin routes require authentication
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateProfileSchema), updateProfile);
router.put('/password', validateRequest(updatePasswordSchema), updatePassword);
router.get('/logs', getLogs);

export default router;

