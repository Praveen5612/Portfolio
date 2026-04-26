import pool from '../../config/db.js';

class ExperienceModel {
  async getPublicExperience() {
    const [rows] = await pool.execute('SELECT * FROM work_experience WHERE is_published=1 ORDER BY sort_order ASC, start_date DESC');
    return rows.map(r => ({
      ...r,
      achievements: typeof r.achievements === 'string' ? JSON.parse(r.achievements) : r.achievements,
      tech_stack: typeof r.tech_stack === 'string' ? JSON.parse(r.tech_stack) : r.tech_stack
    }));
  }

  async getAllAdminExperience() {
    const [rows] = await pool.execute('SELECT * FROM work_experience ORDER BY sort_order ASC, start_date DESC');
    return rows.map(r => ({
      ...r,
      achievements: typeof r.achievements === 'string' ? JSON.parse(r.achievements) : r.achievements,
      tech_stack: typeof r.tech_stack === 'string' ? JSON.parse(r.tech_stack) : r.tech_stack
    }));
  }

  async createExperience(data) {
    const [result] = await pool.execute(
      `INSERT INTO work_experience (company, position, location, start_date, end_date, is_current, description, achievements, tech_stack, sort_order, is_published)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [data.company, data.position, data.location, data.start_date, data.end_date || null, data.is_current, data.description, JSON.stringify(data.achievements), JSON.stringify(data.tech_stack), data.sort_order, data.is_published]
    );
    return result.insertId;
  }

  async updateExperience(id, data) {
    await pool.execute(
      `UPDATE work_experience SET company=?, position=?, location=?, start_date=?, end_date=?, is_current=?, description=?, achievements=?, tech_stack=?, sort_order=?, is_published=?, updated_at=NOW() WHERE id=?`,
      [data.company, data.position, data.location, data.start_date, data.end_date || null, data.is_current, data.description, JSON.stringify(data.achievements), JSON.stringify(data.tech_stack), data.sort_order, data.is_published, id]
    );
  }

  async deleteExperience(id) {
    await pool.execute('DELETE FROM work_experience WHERE id=?', [id]);
  }
}

export default new ExperienceModel();
