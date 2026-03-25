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
import pool from './config/db.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust Vercel's reverse proxy — required for express-rate-limit and IP detection
app.set('trust proxy', 1);

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

// Health Check
app.get('/api', (req, res) => {
  res.status(200).json({ success: true, message: 'API Running' });
});

// DB Connection Test
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 AS ok, NOW() AS ts');
    res.status(200).json({ success: true, message: 'Database connected', data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database connection failed', error: err.message });
  }
});


// API Routes Entry
app.use('/api', routes);

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
