import { Router } from 'express';
import { getVisitors, getVisitorDetails } from './visitors.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { visitorsQuerySchema } from './visitors.validate.js';

const router = Router();

// Admin routes only
router.use(authenticate);
router.get('/', validateRequest(visitorsQuerySchema, 'query'), getVisitors);
router.get('/:visitor_id', getVisitorDetails);

export default router;
