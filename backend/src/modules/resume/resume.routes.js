import { Router } from 'express';
import resumeController from './resume.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { resumeUploadSchema, resumeDownloadSchema } from './resume.validate.js';
import { upload } from '../../config/multer.js';

const router = Router();

// Middleware to specify subfolder for multer
const setUploadFolder = (req, res, next) => {
  req.uploadFolder = 'resumes';
  next();
};

// Public endpoints
router.get('/active', resumeController.getActiveResume);
router.get('/download/:id', validateRequest(resumeDownloadSchema, 'query'), resumeController.downloadResume);

// Admin endpoints
router.use(authenticate);
router.get('/admin/all', resumeController.getAllResumes);

router.post('/upload', setUploadFolder, upload.single('resume'), validateRequest(resumeUploadSchema), resumeController.uploadResume);
router.delete('/:id', resumeController.deleteResume);

export default router;
