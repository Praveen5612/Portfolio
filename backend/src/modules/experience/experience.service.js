import experienceModel from './experience.model.js';

class ExperienceService {
  _parseJsonField(str) {
    try { return str ? JSON.parse(str) : []; } catch { return []; }
  }

  _formatRows(rows) {
    return rows.map(r => ({
      ...r,
      achievements: this._parseJsonField(r.achievements),
      tech_stack: this._parseJsonField(r.tech_stack)
    }));
  }

  async getPublicExperience() {
    const rows = await experienceModel.getPublicExperience();
    return this._formatRows(rows);
  }

  async getAllAdminExperience() {
    const rows = await experienceModel.getAllAdminExperience();
    return this._formatRows(rows);
  }

  async createExperience(data) {
    return await experienceModel.createExperience(data);
  }

  async updateExperience(id, data) {
    await experienceModel.updateExperience(id, data);
    return true;
  }

  async deleteExperience(id) {
    await experienceModel.deleteExperience(id);
    return true;
  }
}

export default new ExperienceService();
