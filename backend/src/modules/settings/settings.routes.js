import { Router } from 'express';
import {
  getPublicSettings,
  getSocialLinks,
  getAllSettings,
  updateSettings,
  updateSocialLinks
} from './settings.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { updateSettingsSchema, updateSocialLinksSchema } from './settings.validate.js';

const router = Router();

// Public routes
router.get('/public', getPublicSettings);
router.get('/social-links', getSocialLinks);

// Admin routes
router.use(authenticate);
router.get('/', getAllSettings);
router.put('/', validateRequest(updateSettingsSchema), updateSettings);
router.put('/social-links', validateRequest(updateSocialLinksSchema), updateSocialLinks);

export default router;
