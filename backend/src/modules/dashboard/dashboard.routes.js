import { Router } from 'express';
import dashboardController from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// Internal Admin route
router.use(authenticate);

// Maps exactly to the complex aggregated payload requested
router.get('/stats', dashboardController.getStats);
router.get('/visitors-chart', dashboardController.getVisitorsChart);
router.get('/countries', dashboardController.getCountries);
router.get('/devices', dashboardController.getDevices);
router.get('/top-pages', dashboardController.getTopPages);
router.get('/recent-leads', dashboardController.getRecentLeads);
router.get('/recent-messages', dashboardController.getRecentMessages);
router.get('/traffic-sources', dashboardController.getTrafficSources);

export default router;
