import contactModel from './contact.model.js';
import { sendEmail } from '../../utils/email.js';
import { env } from '../../config/env.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

class ContactService {
  async createMessage(data, ip) {
    const id = await contactModel.createMessage(data, ip);

    // Send admin notification
    sendEmail({
      to: env.admin.email,
      subject: `New Contact: ${data.subject || 'No Subject'}`,
      html: `<h3>New Message from ${data.name}</h3><p>Email: ${data.email}</p><p>${data.message}</p>`,
      replyTo: data.email
    }).catch(err => console.error("Email notification failed:", err));

    return id;
  }

  async getMessages(status, page, limit, offset) {
    const { messages, total } = await contactModel.getMessages(status, limit, offset);
    return { data: messages, meta: buildPaginationMeta(total, page, limit) };
  }

  async getMessage(id) {
    const msg = await contactModel.getMessageById(id);
    if (!msg) {
      const err = new Error('Message not found'); err.statusCode = 404; throw err;
    }
    
    await contactModel.markAsRead(id);
    const replies = await contactModel.getReplies(id);
    
    return { ...msg, replies };
  }

  async replyToMessage(id, adminId, replyText) {
    const msg = await contactModel.getMessageById(id);
    if (!msg) {
      const err = new Error('Message not found'); err.statusCode = 404; throw err;
    }

    await contactModel.createReply(id, adminId, replyText);

    const emailSent = await sendEmail({
      to: msg.email,
      subject: `Re: ${msg.subject || 'Your contact message'}`,
      html: `<p>${replyText}</p><br><hr><small>In reply to your message:</small><blockquote>${msg.message}</blockquote>`
    });

    return emailSent;
  }

  async updateStatus(id, status) {
    await contactModel.updateStatus(id, status);
    return true;
  }

  async deleteMessage(id) {
    await contactModel.deleteMessage(id);
    return true;
  }
}

export default new ContactService();
