import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { env } from './config/env.js';
import routes from './routes/index.js';
import { globalErrorHandler, notFoundHandler } from './global/errorHandler.js';
import logger from './global/logger.js';
import { globalLimiter } from './middleware/rateLimit.middleware.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

// Rate limiting
app.use(globalLimiter);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup unified morgan logger format pointing to winston
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Ensure uploads directory exists globally before mapping it statically
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Log routes for debugging
// API Routes Entry
app.use('/api', routes);

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
