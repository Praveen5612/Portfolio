import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import projectsRoutes from '../modules/projects/projects.routes.js';
import skillsRoutes from '../modules/skills/skills.routes.js';
import experienceRoutes from '../modules/experience/experience.routes.js';
import leadsRoutes from '../modules/leads/leads.routes.js';
import contactRoutes from '../modules/contact/contact.routes.js';
import visitorsRoutes from '../modules/visitors/visitors.routes.js';
import analyticsRoutes from '../modules/analytics/analytics.routes.js';
import resumeRoutes from '../modules/resume/resume.routes.js';
import blogsRoutes from '../modules/blogs/blogs.routes.js';
import settingsRoutes from '../modules/settings/settings.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
import uploadsRoutes from '../modules/uploads/uploads.routes.js';

const router = Router();

// Register module routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/projects', projectsRoutes);
router.use('/skills', skillsRoutes);
router.use('/experience', experienceRoutes);
router.use('/leads', leadsRoutes);
router.use('/contact', contactRoutes);
router.use('/visitors', visitorsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/resume', resumeRoutes);
router.use('/blogs', blogsRoutes);     // Frontend calls /api/blogs
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/upload', uploadsRoutes);  // Matching old /api/upload

export default router;
