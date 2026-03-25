import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import adminService from './admin.service.js';
import { getPaginationData } from '../../utils/pagination.js';

export const getProfile = asyncHandler(async (req, res) => {
  const admin = await adminService.getProfile(req.user.id);
  return successResponse(res, 200, 'Profile fetched', admin);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedAdmin = await adminService.updateProfile(req.user.id, req.body);
  return successResponse(res, 200, 'Profile updated', updatedAdmin);
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await adminService.updatePassword(req.user.id, currentPassword, newPassword);
  return successResponse(res, 200, 'Password updated successfully');
});

export const getLogs = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPaginationData(req);
  const { logs, meta } = await adminService.getLoginLogs(page, limit, offset);
  return successResponse(res, 200, 'Login logs fetched', logs, meta);
});
