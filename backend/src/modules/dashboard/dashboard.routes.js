import { Router } from 'express';
import {
  getStats,
  getVisitorsChart,
  getCountries,
  getDevices,
  getTopPages,
  getRecentLeads,
  getRecentMessages,
  getTrafficSources
} from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// Internal Admin route
router.use(authenticate);

// Maps exactly to the complex aggregated payload requested
router.get('/stats', getStats);
router.get('/visitors-chart', getVisitorsChart);
router.get('/countries', getCountries);
router.get('/devices', getDevices);
router.get('/top-pages', getTopPages);
router.get('/recent-leads', getRecentLeads);
router.get('/recent-messages', getRecentMessages);
router.get('/traffic-sources', getTrafficSources);

export default router;
