import app from './app.js';
import { env } from './config/env.js';
import pool from './config/db.js';
import logger from './global/logger.js';

async function startServer() {
  try {
    // Validate database connection before starting the server
    await pool.query('SELECT 1');
    logger.info('MySQL Database Connected Successfully.');

    app.listen(env.port, () => {
      logger.info(`Server is running in ${env.nodeEnv} mode on port ${env.port}`);
    });
  } catch (error) {
    logger.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
}

// Global exception trackers for unhandled closures
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION!');
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION!');
  console.error(err);
  process.exit(1);
});

startServer();
