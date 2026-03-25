import { Router } from 'express';
import {
  getActiveResume,
  downloadResume,
  getAllResumes,
  uploadResume,
  deleteResume
} from './resume.controller.js';
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
router.get('/active', getActiveResume);
router.get('/download/:id', validateRequest(resumeDownloadSchema, 'query'), downloadResume);

// Admin endpoints
router.use(authenticate);
router.get('/admin/all', getAllResumes);

router.post('/upload', setUploadFolder, upload.single('resume'), validateRequest(resumeUploadSchema), uploadResume);
router.delete('/:id', deleteResume);

export default router;
