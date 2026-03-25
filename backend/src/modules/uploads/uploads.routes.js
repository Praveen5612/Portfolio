import { Router } from 'express';
import { uploadProfileAvatar, uploadGenericFile } from './uploads.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { upload } from '../../config/multer.js';

const router = Router();

router.use(authenticate);

// Middleware to specify subfolder for multer
const setFolder = (folder) => (req, res, next) => {
  req.uploadFolder = folder;
  next();
};

router.post('/profile', setFolder('profile'), upload.single('avatar'), uploadProfileAvatar);
router.post('/misc', setFolder('misc'), upload.single('file'), uploadGenericFile);

export default router;
