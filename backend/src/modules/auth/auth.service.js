import authModel from './auth.model.js';
import { comparePassword } from '../../utils/hash.js';
import { generateToken } from '../../utils/jwt.js';

class AuthService {
  async login(email, password, ipAddress, userAgent) {
    const admin = await authModel.findAdminByEmail(email);

    if (!admin) {
      await authModel.logFailedAttempt(ipAddress, 'failed');
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      await authModel.logLoginAttempt(admin.id, ipAddress, userAgent, 'failed');
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });

    await authModel.updateLastLogin(admin.id);
    await authModel.logLoginAttempt(admin.id, ipAddress, userAgent, 'success');

    const { password: _, ...adminData } = admin;
    return { token, admin: adminData };
  }
}

export default new AuthService();
