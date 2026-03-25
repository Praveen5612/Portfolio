import skillsModel from './skills.model.js';

class SkillsService {
  async getPublicSkills() {
    const skills = await skillsModel.getPublicSkills();
    return skills;
  }

  async getAllAdminSkills() {
    const skills = await skillsModel.getAllAdminSkills();
    return skills;
  }

  async createSkill(data) {
    const id = await skillsModel.createSkill(data);
    return id;
  }

  async updateSkill(id, data) {
    await skillsModel.updateSkill(id, data);
    return true;
  }

  async deleteSkill(id) {
    await skillsModel.deleteSkill(id);
    return true;
  }
}

export default new SkillsService();
