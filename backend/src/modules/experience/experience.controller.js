import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import experienceService from './experience.service.js';

export const getPublicExperience = asyncHandler(async (req, res) => {
  const data = await experienceService.getPublicExperience();
  return successResponse(res, 200, 'Experience retrieved', data);
});

export const getAdminExperience = asyncHandler(async (req, res) => {
  const data = await experienceService.getAllAdminExperience();
  return successResponse(res, 200, 'Admin experience retrieved', data);
});

export const createExperience = asyncHandler(async (req, res) => {
  const id = await experienceService.createExperience(req.body);
  return successResponse(res, 201, 'Experience created', { id });
});

export const updateExperience = asyncHandler(async (req, res) => {
  await experienceService.updateExperience(req.params.id, req.body);
  return successResponse(res, 200, 'Experience updated');
});

export const deleteExperience = asyncHandler(async (req, res) => {
  await experienceService.deleteExperience(req.params.id);
  return successResponse(res, 200, 'Experience deleted');
});
