import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import authService from './auth.service.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'] || 'Unknown';

  const loginData = await authService.login(email, password, ipAddress, userAgent);

  return successResponse(res, 200, 'Login successful', loginData);
});

export const getMe = asyncHandler(async (req, res) => {
  // req.user is set by authenticate middleware
  return successResponse(res, 200, 'User data retrieved', req.user);
});
