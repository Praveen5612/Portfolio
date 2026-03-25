import adminModel from './admin.model.js';
import { comparePassword, hashPassword } from '../../utils/hash.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

class AdminService {
  async getProfile(adminId) {
    const admin = await adminModel.getAdminById(adminId);
    if (!admin) {
      const err = new Error('Admin not found');
      err.statusCode = 404;
      throw err;
    }
    return admin;
  }

  async updateProfile(adminId, data) {
    await adminModel.updateProfile(adminId, data.name, data.email);
    return await this.getProfile(adminId);
  }

  async updatePassword(adminId, currentPassword, newPassword) {
    const hash = await adminModel.getAdminPassword(adminId);
    const isMatch = await comparePassword(currentPassword, hash);
    if (!isMatch) {
      const err = new Error('Current password is incorrect');
      err.statusCode = 400;
      throw err;
    }

    const newHash = await hashPassword(newPassword);
    await adminModel.updatePassword(adminId, newHash);
    return true;
  }

  async getLoginLogs(page, limit, offset) {
    const { logs, total } = await adminModel.getLogs(limit, offset);
    const meta = buildPaginationMeta(total, page, limit);
    return { logs, meta };
  }
}

export default new AdminService();
