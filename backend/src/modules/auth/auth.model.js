import pool from '../../config/db.js';

class AuthModel {
  async findAdminByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  async logLoginAttempt(adminId, ipAddress, userAgent, status) {
    await pool.execute(
      'INSERT INTO login_logs (admin_id, ip_address, user_agent, status) VALUES (?,?,?,?)',
      [adminId, ipAddress, userAgent, status]
    );
  }

  async logFailedAttempt(ipAddress, status) {
    await pool.execute(
      'INSERT INTO login_logs (ip_address, status) VALUES (?,?)',
      [ipAddress, status]
    );
  }

  async updateLastLogin(adminId) {
    await pool.execute(
      'UPDATE admins SET last_login=NOW() WHERE id=?',
      [adminId]
    );
  }
}

export default new AuthModel();
