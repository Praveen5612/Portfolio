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
      'INSERT INTO skills (name, category, proficiency, icon, sort_order, is_active) VALUES (?,?,?,?,?,?)',
      [
        data.name ?? null, 
        data.category ?? null, 
        data.proficiency ?? null, 
        data.icon ?? null, 
        data.sort_order ?? null,
        data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1
      ]
    );
    return result.insertId;
  }

  async updateSkill(id, data) {
    await pool.execute(
      'UPDATE skills SET name=?, category=?, proficiency=?, icon=?, sort_order=?, is_active=?, updated_at=NOW() WHERE id=?',
      [
        data.name ?? null, 
        data.category ?? null, 
        data.proficiency ?? null, 
        data.icon ?? null, 
        data.sort_order ?? null, 
        data.is_active ?? null, 
        id
      ]
    );
  }

  async deleteSkill(id) {
    await pool.execute('DELETE FROM skills WHERE id=?', [id]);
  }
}

export default new SkillsModel();
