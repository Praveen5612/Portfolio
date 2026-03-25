import { Router } from 'express';
import adminController from './admin.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { updateProfileSchema, updatePasswordSchema } from './admin.validate.js';

const router = Router();

router.use(authenticate);

router.get('/profile', adminController.getProfile);
router.put('/profile', validateRequest(updateProfileSchema), adminController.updateProfile);
router.put('/password', validateRequest(updatePasswordSchema), adminController.updatePassword);
router.get('/logs', adminController.getLogs);

export default router;
