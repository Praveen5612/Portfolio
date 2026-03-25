import nodemailer from 'nodemailer';
import { env } from './env.js';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.gmail.user,
    pass: env.gmail.password,
  },
});

export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('✅ Mail server ready');
  } catch (error) {
    console.error('❌ Mail server connection failed:', error.message);
  }
};
