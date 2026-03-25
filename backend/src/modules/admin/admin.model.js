import pool from '../../config/db.js';

class AdminModel {
  async getAdminById(id) {
    const [rows] = await pool.execute('SELECT id, name, email, role, is_active, last_login, created_at, updated_at FROM admins WHERE id = ?', [id]);
    return rows[0];
  }

  async getAdminPassword(id) {
    const [rows] = await pool.execute('SELECT password FROM admins WHERE id = ?', [id]);
    return rows[0]?.password;
  }

  async updateProfile(id, name, email) {
    await pool.execute('UPDATE admins SET name=?, email=?, updated_at=NOW() WHERE id=?', [name, email, id]);
  }

  async updatePassword(id, hashedPassword) {
    await pool.execute('UPDATE admins SET password=?, updated_at=NOW() WHERE id=?', [hashedPassword, id]);
  }

  async getLogs(limit = 50, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT ll.*, a.name as admin_name 
       FROM login_logs ll 
       LEFT JOIN admins a ON ll.admin_id=a.id 
       ORDER BY ll.created_at DESC 
       LIMIT ? OFFSET ?`,
      [String(limit), String(offset)] // Execute requires string for limits in some versions or direct numbers
    );
    
    // Get total
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM login_logs');
    return { logs: rows, total: countRows[0].total };
  }
}

export default new AdminModel();
