import { Router } from 'express';
import blogsController from './blogs.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { blogSchema } from './blogs.validate.js';
import { upload } from '../../config/multer.js';

const router = Router();

const setUploadFolder = (req, res, next) => {
  req.uploadFolder = 'blogs';
  next();
};

// Public endpoints
router.get('/', blogsController.getPublicBlogs);
router.get('/:slug', blogsController.getBlogDetails);

// Admin endpoints
router.use('/admin', authenticate);
router.get('/admin/all', blogsController.getAdminBlogs);

router.post('/', authenticate, setUploadFolder, upload.single('thumbnail'), validateRequest(blogSchema), blogsController.createBlog);
router.put('/:id', authenticate, setUploadFolder, upload.single('thumbnail'), validateRequest(blogSchema), blogsController.updateBlog);
router.delete('/:id', authenticate, blogsController.deleteBlog);

export default router;
