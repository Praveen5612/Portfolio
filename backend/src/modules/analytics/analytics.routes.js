import { Router } from 'express';
import analyticsController from './analytics.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { trackVisitorSchema, pageViewSchema, eventSchema, projectClickSchema, sessionEndSchema } from './analytics.validate.js';

const router = Router();

// Publicly exposed tracking routes
router.post('/track', validateRequest(trackVisitorSchema), analyticsController.trackVisitor);
router.post('/pageview', validateRequest(pageViewSchema), analyticsController.trackPageView);
router.post('/event', validateRequest(eventSchema), analyticsController.trackEvent);
router.post('/project-click', validateRequest(projectClickSchema), analyticsController.trackProjectClick);
router.post('/session-end', validateRequest(sessionEndSchema), analyticsController.endSession);

export default router;
