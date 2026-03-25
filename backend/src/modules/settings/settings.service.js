import settingsModel from './settings.model.js';

class SettingsService {
  async getPublicSettings() {
    const rows = await settingsModel.getPublicSettings();
    const map = {};
    rows.forEach(r => map[r.key_name] = r.value);
    return map;
  }

  async getAllSettings() {
    const rows = await settingsModel.getAllSettings();
    const map = {};
    rows.forEach(r => map[r.key_name] = r.value);
    return map;
  }

  async updateSettings(data) {
    await settingsModel.updateSettingsBulk(data);
    return true;
  }

  async getSocialLinks() {
    return await settingsModel.getSocialLinks();
  }

  async updateSocialLinks(links) {
    await settingsModel.updateSocialLinksBulk(links);
    return true;
  }
}

export default new SettingsService();
