import multer from 'multer';
import path from 'path';
import { env } from './env.js';
import fs from 'fs';

// Ensure upload directories exist
const createFolders = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = env.upload.path; // default 'uploads'
    
    // Determine subdirectory based on fieldname or route logic
    // We allow override via req.uploadFolder middleware
    if (req.uploadFolder) {
        folder = path.join(env.upload.path, req.uploadFolder);
    }
    
    createFolders(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: env.upload.maxSize },
});
