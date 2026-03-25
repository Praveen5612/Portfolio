import { Router } from 'express';
import authController from './auth.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { loginSchema } from './auth.validate.js';
import { authLimiter } from '../../middleware/rateLimit.middleware.js';

import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/login', authLimiter, validateRequest(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
