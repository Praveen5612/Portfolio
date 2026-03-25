import { Router } from 'express';
import {
  getPublicProjects,
  getProject,
  getAdminProjects,
  createProject,
  updateProject,
  publishProject,
  deleteProject
} from './projects.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { projectSchema, publishSchema } from './projects.validate.js';
import { upload } from '../../config/multer.js';

const router = Router();

// Middleware to set multer folder target
const setUploadFolder = (req, res, next) => {
  req.uploadFolder = 'projects';
  next();
};

// Public routes
router.get('/', getPublicProjects);
router.get('/:id', getProject);

// Admin routes
router.use('/admin', authenticate);
router.get('/admin/all', getAdminProjects);

router.post('/', authenticate, setUploadFolder, upload.array('images', 10), validateRequest(projectSchema), createProject);
router.put('/:id', authenticate, setUploadFolder, upload.array('images', 10), validateRequest(projectSchema), updateProject);
router.put('/:id/publish', authenticate, validateRequest(publishSchema), publishProject);
router.patch('/:id/status', authenticate, validateRequest(publishSchema), publishProject); // alias for frontend
router.delete('/:id', authenticate, deleteProject);


export default router;
