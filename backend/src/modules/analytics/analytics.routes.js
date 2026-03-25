import { Router } from 'express';
import { 
  trackVisitor, 
  trackPageView, 
  trackEvent, 
  trackProjectClick, 
  endSession 
} from './analytics.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { trackVisitorSchema, pageViewSchema, eventSchema, projectClickSchema, sessionEndSchema } from './analytics.validate.js';

const router = Router();

// Publicly exposed tracking routes
router.post('/track', validateRequest(trackVisitorSchema), trackVisitor);
router.post('/pageview', validateRequest(pageViewSchema), trackPageView);
router.post('/event', validateRequest(eventSchema), trackEvent);
router.post('/project-click', validateRequest(projectClickSchema), trackProjectClick);
router.post('/session-end', validateRequest(sessionEndSchema), endSession);

export default router;
