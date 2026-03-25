import { transporter } from '../config/mail.js';
import { env } from '../config/env.js';
import logger from '../global/logger.js';

export const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const mailOptions = {
      from: `"${env.admin.name}" <${env.gmail.user}>`,
      to,
      subject,
      html,
    };
    
    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    return false;
  }
};
