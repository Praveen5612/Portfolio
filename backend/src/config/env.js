import joi from 'joi';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = joi.object({
  PORT: joi.number().default(5000),
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  FRONTEND_URL: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().default(25902),
  DB_USER: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_SSL: joi.string().default('true'),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.string().default('7d'),
  GMAIL_USER: joi.string().required(),
  GMAIL_APP_PASSWORD: joi.string().required(),
  ADMIN_EMAIL: joi.string().required(),
  ADMIN_NAME: joi.string().required(),
  MAX_FILE_SIZE: joi.number().default(5242880),
  UPLOAD_PATH: joi.string().default('uploads'),
  PORTFOLIO_URL: joi.string().required(),
  RESUME_URL: joi.string().required(),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  corsOrigin: envVars.FRONTEND_URL,
  frontendUrl: envVars.FRONTEND_URL,
  db: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    name: envVars.DB_NAME,
    ssl: envVars.DB_SSL === 'true',
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  gmail: {
    user: envVars.GMAIL_USER,
    password: envVars.GMAIL_APP_PASSWORD,
  },
  admin: {
    email: envVars.ADMIN_EMAIL,
    name: envVars.ADMIN_NAME,
  },
  upload: {
    maxSize: envVars.MAX_FILE_SIZE,
    path: envVars.UPLOAD_PATH,
  },
  urls: {
    portfolio: envVars.PORTFOLIO_URL,
    resume: envVars.RESUME_URL,
  }
};
