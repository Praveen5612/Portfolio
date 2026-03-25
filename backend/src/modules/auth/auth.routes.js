import { Router } from 'express';
import { login, getMe } from './auth.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { loginSchema } from './auth.validate.js';
import { authLimiter } from '../../middleware/rateLimit.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { updateProfile, updatePassword, getLogs } from '../admin/admin.controller.js';
import { updateProfileSchema, updatePasswordSchema } from '../admin/admin.validate.js';

const router = Router();

// Public
router.post('/login', authLimiter, validateRequest(loginSchema), login);

// Protected — profile & session management (used by frontend authApi)
router.get('/me', authenticate, getMe);
router.get('/login-logs', authenticate, getLogs);
router.put('/profile', authenticate, validateRequest(updateProfileSchema), updateProfile);
router.put('/password', authenticate, validateRequest(updatePasswordSchema), updatePassword);

export default router;

