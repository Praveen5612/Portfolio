import fs from 'fs';
import path from 'path';
import logger from '../global/logger.js';
import { env } from '../config/env.js';

export const deleteFile = (filePath) => {
  if (!filePath) return;
  const fullPath = path.resolve(env.upload.path, filePath);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger.info(`Deleted file: ${fullPath}`);
    }
  } catch (error) {
    logger.error(`Failed to delete file: ${fullPath} - ${error.message}`);
  }
};
