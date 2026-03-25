import pool from '../../config/db.js';

class ResumeModel {
  async getActiveResume() {
    const [rows] = await pool.execute('SELECT id, file_name, file_path, version, download_count, created_at FROM resumes WHERE is_active=1 AND status="active" LIMIT 1');
    return rows[0] || null;
  }

  async getAllResumes() {
    const [rows] = await pool.execute('SELECT * FROM resumes ORDER BY created_at DESC');
    return rows;
  }

  async getResumeById(id) {
    const [rows] = await pool.execute('SELECT * FROM resumes WHERE id=?', [id]);
    return rows[0] || null;
  }

  async incrementDownloadCount(id) {
    await pool.execute('UPDATE resumes SET download_count=download_count+1 WHERE id=?', [id]);
  }

  async logDownload(visitorId, resumeId, ipAddress) {
    await pool.execute('INSERT INTO resume_downloads (visitor_id, resume_id, ip_address) VALUES (?,?,?)', [visitorId, resumeId, ipAddress]);
  }

  async deactivateAllOtherResumes() {
    await pool.execute('UPDATE resumes SET is_active=0 WHERE is_active=1');
  }

  async createResume(fileData, version) {
    const [result] = await pool.execute(
      'INSERT INTO resumes (file_name, file_path, file_size, version, is_active) VALUES (?,?,?,?,?)',
      [fileData.originalname, `/uploads/resumes/${fileData.filename}`, fileData.size, version || '1.0', 1]
    );
    return result.insertId;
  }

  async deleteResume(id) {
    await pool.execute('DELETE FROM resumes WHERE id=?', [id]);
  }
}

export default new ResumeModel();
