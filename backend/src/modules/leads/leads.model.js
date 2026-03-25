import pool from '../../config/db.js';

class LeadsModel {
  async getLeads(status, limit, offset) {
    let where = '';
    let params = [];
    if (status) {
      where = 'WHERE status = ?';
      params.push(status);
    }

    const [rows] = await pool.execute(`SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(limit), Number(offset)]);
    const [count] = await pool.execute(`SELECT COUNT(*) as total FROM leads ${where}`, params);
    
    return { leads: rows, total: count[0].total };
  }

  async getLeadById(id) {
    const [rows] = await pool.execute('SELECT * FROM leads WHERE id=?', [id]);
    if (!rows.length) return null;
    return rows[0];
  }

  async getLeadNotes(leadId) {
    const [notes] = await pool.execute('SELECT * FROM lead_notes WHERE lead_id=? ORDER BY created_at DESC', [leadId]);
    return notes;
  }

  async createLead(data, ipAddress) {
    const [result] = await pool.execute(
      `INSERT INTO leads (name, email, phone, company, message, reason, source, visitor_id, ip_address) VALUES (?,?,?,?,?,?,?,?,?)`,
      [data.name, data.email, data.phone || null, data.company || null, data.message || null, data.reason || 'other', data.source || 'popup', data.visitor_id || null, ipAddress]
    );
    return result.insertId;
  }

  async updateLeadStatus(id, status) {
    await pool.execute('UPDATE leads SET status=?, updated_at=NOW() WHERE id=?', [status, id]);
  }

  async addNote(leadId, adminId, noteText) {
    await pool.execute('INSERT INTO lead_notes (lead_id, admin_id, note) VALUES (?,?,?)', [leadId, adminId, noteText]);
  }

  async deleteLead(id) {
    // Relying on CASCADE for notes, otherwise clean up manually
    await pool.execute('DELETE FROM lead_notes WHERE lead_id=?', [id]);
    await pool.execute('DELETE FROM leads WHERE id=?', [id]);
  }
}

export default new LeadsModel();
