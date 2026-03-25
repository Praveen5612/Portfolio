import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadBase = path.join(__dirname, '../../uploads');

const createStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(uploadBase, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

export const uploadProjectImage = multer({
  storage: createStorage('projects'),
  fileFilter: imageFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }
});

export const uploadResume = multer({
  storage: createStorage('resumes'),
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadProfile = multer({
  storage: createStorage('profile'),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

export const uploadBlogImage = multer({
  storage: createStorage('blogs'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
