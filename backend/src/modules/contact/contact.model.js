import pool from '../../config/db.js';

class ContactModel {
  async createMessage(data, ipAddress) {
    const [result] = await pool.execute(
      `INSERT INTO contact_messages (name, email, phone, subject, message, visitor_id, ip_address) VALUES (?,?,?,?,?,?,?)`,
      [data.name, data.email, data.phone || null, data.subject || null, data.message, data.visitor_id || null, ipAddress]
    );
    return result.insertId;
  }

  async getMessages(status, limit, offset) {
    let where = '';
    let params = [];
    if (status) {
      where = 'WHERE status = ?';
      params.push(status);
    }

    const l = String(Number(limit) || 10);
    const o = String(Number(offset) || 0);
    const [rows] = await pool.execute(`SELECT * FROM contact_messages ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, l, o]);
    const [count] = await pool.execute(`SELECT COUNT(*) as total FROM contact_messages ${where}`, params);
    
    return { messages: rows, total: count[0].total };
  }

  async getMessageById(id) {
    const [rows] = await pool.execute('SELECT * FROM contact_messages WHERE id=?', [id]);
    if (!rows.length) return null;
    return rows[0];
  }

  async markAsRead(id) {
    await pool.execute("UPDATE contact_messages SET is_read=1, status=IF(status='new','read',status) WHERE id=?", [id]);
  }

  async getReplies(messageId) {
    const [replies] = await pool.execute('SELECT * FROM message_replies WHERE message_id=? ORDER BY sent_at ASC', [messageId]);
    return replies;
  }

  async createReply(messageId, adminId, replyText) {
    await pool.execute('INSERT INTO message_replies (message_id, admin_id, reply_text) VALUES (?,?,?)', [messageId, adminId, replyText]);
    await pool.execute("UPDATE contact_messages SET status='replied', updated_at=NOW() WHERE id=?", [messageId]);
  }

  async updateStatus(id, status) {
    await pool.execute('UPDATE contact_messages SET status=?, updated_at=NOW() WHERE id=?', [status, id]);
  }

  async deleteMessage(id) {
    await pool.execute('DELETE FROM message_replies WHERE message_id=?', [id]);
    await pool.execute('DELETE FROM contact_messages WHERE id=?', [id]);
  }
}

export default new ContactModel();
