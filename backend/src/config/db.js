import mysql from 'mysql2/promise';
import { env } from './env.js';

const poolConfig = {
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

if (env.db.ssl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

let pool;

if (!global.pool) {
  pool = mysql.createPool(poolConfig);
  global.pool = pool;
} else {
  pool = global.pool;
}

export const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    // Don't exit in serverless, just throw
    throw err;
  }
};

export default pool;
