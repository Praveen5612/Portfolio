import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import pool from '../../config/db.js';

export const uploadProfileAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    const err = new Error('No file uploaded'); err.statusCode = 400; throw err;
  }
  const path = `/uploads/profile/${req.file.filename}`;
  // Update admin avatar (assuming only 1 admin for portfolio)
  await pool.execute('UPDATE admins SET avatar=? WHERE id=?', [path, req.user.id]);
  
  return successResponse(res, 200, 'Avatar updated', { path });
});

export const uploadGenericFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    const err = new Error('No file uploaded'); err.statusCode = 400; throw err;
  }
  const path = `/uploads/misc/${req.file.filename}`;
  return successResponse(res, 201, 'File uploaded', { path });
});
