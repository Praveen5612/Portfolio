import { Router } from 'express';
import projectsController from './projects.controller.js';
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
router.get('/', projectsController.getPublicProjects);
router.get('/:id', projectsController.getProject);

// Admin routes
router.use('/admin', authenticate);
router.get('/admin/all', projectsController.getAdminProjects);

router.post('/', authenticate, setUploadFolder, upload.array('images', 10), validateRequest(projectSchema), projectsController.createProject);
router.put('/:id', authenticate, setUploadFolder, upload.array('images', 10), validateRequest(projectSchema), projectsController.updateProject);
router.put('/:id/publish', authenticate, validateRequest(publishSchema), projectsController.publishProject);
router.delete('/:id', authenticate, projectsController.deleteProject);

export default router;
