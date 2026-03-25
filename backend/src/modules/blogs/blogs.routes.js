import { Router } from 'express';
import {
  getPublicBlogs,
  getBlogDetails,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus
} from './blogs.controller.js';
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
router.get('/', getPublicBlogs);
router.get('/:slug', getBlogDetails);

// Admin endpoints
router.use('/admin', authenticate);
router.get('/admin/all', getAdminBlogs);

router.post('/', authenticate, setUploadFolder, upload.single('thumbnail'), validateRequest(blogSchema), createBlog);
router.put('/:id', authenticate, setUploadFolder, upload.single('thumbnail'), validateRequest(blogSchema), updateBlog);
router.patch('/:id/status', authenticate, toggleBlogStatus); // frontend uses this
router.delete('/:id', authenticate, deleteBlog);

export default router;

