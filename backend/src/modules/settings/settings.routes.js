import { Router } from 'express';
import settingsController from './settings.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { updateSettingsSchema, updateSocialLinksSchema } from './settings.validate.js';

const router = Router();

// Public routes
router.get('/public', settingsController.getPublicSettings);
router.get('/social-links', settingsController.getSocialLinks);

// Admin routes
router.use(authenticate);
router.get('/', settingsController.getAllSettings);
router.put('/', validateRequest(updateSettingsSchema), settingsController.updateSettings);
router.put('/social-links', validateRequest(updateSocialLinksSchema), settingsController.updateSocialLinks);

export default router;
