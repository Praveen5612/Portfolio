import pool from '../../config/db.js';

class SettingsModel {
  async getPublicSettings() {
    const [rows] = await pool.execute(`SELECT key_name, value FROM settings WHERE group_name NOT IN ('admin')`);
    return rows;
  }

  async getAllSettings() {
    const [rows] = await pool.execute('SELECT key_name, value FROM settings ORDER BY group_name, key_name');
    return rows;
  }

  async updateSettingsBulk(updatesObj) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const [key, value] of Object.entries(updatesObj)) {
        await conn.execute(
          `INSERT INTO settings (key_name, value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=?, updated_at=NOW()`,
          [key, value, value]
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async getSocialLinks() {
    const [rows] = await pool.execute('SELECT * FROM social_links WHERE is_active=1 ORDER BY sort_order ASC');
    return rows;
  }

  async updateSocialLinksBulk(linksArray) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute('DELETE FROM social_links');
      
      for (const link of linksArray) {
        await conn.execute(
          'INSERT INTO social_links (platform, url, icon, sort_order, is_active) VALUES (?,?,?,?,?)',
          [link.platform, link.url, link.icon, link.sort_order, link.is_active ? 1 : 0]
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

export default new SettingsModel();
