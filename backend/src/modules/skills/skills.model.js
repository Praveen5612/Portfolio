import pool from '../../config/db.js';

class SkillsModel {
  async getPublicSkills() {
    const [rows] = await pool.execute('SELECT * FROM skills WHERE is_active=1 ORDER BY sort_order ASC, created_at DESC');
    return rows;
  }

  async getAllAdminSkills() {
    const [rows] = await pool.execute('SELECT * FROM skills ORDER BY sort_order ASC, created_at DESC');
    return rows;
  }

  async createSkill(data) {
    const [result] = await pool.execute(
      'INSERT INTO skills (name, category, proficiency, icon, sort_order) VALUES (?,?,?,?,?)',
      [data.name, data.category, data.proficiency, data.icon, data.sort_order]
    );
    return result.insertId;
  }

  async updateSkill(id, data) {
    await pool.execute(
      'UPDATE skills SET name=?, category=?, proficiency=?, icon=?, sort_order=?, is_active=?, updated_at=NOW() WHERE id=?',
      [data.name, data.category, data.proficiency, data.icon, data.sort_order, data.is_active, id]
    );
  }

  async deleteSkill(id) {
    await pool.execute('DELETE FROM skills WHERE id=?', [id]);
  }
}

export default new SkillsModel();
