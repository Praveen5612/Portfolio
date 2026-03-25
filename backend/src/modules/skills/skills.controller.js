import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import skillsService from './skills.service.js';

export const getPublicSkills = asyncHandler(async (req, res) => {
  const data = await skillsService.getPublicSkills();
  return successResponse(res, 200, 'Skills retrieved', data);
});

export const getAdminSkills = asyncHandler(async (req, res) => {
  const data = await skillsService.getAllAdminSkills();
  return successResponse(res, 200, 'Admin skills retrieved', data);
});

export const createSkill = asyncHandler(async (req, res) => {
  const id = await skillsService.createSkill(req.body);
  return successResponse(res, 201, 'Skill created', { id });
});

export const updateSkill = asyncHandler(async (req, res) => {
  await skillsService.updateSkill(req.params.id, req.body);
  return successResponse(res, 200, 'Skill updated');
});

export const deleteSkill = asyncHandler(async (req, res) => {
  await skillsService.deleteSkill(req.params.id);
  return successResponse(res, 200, 'Skill deleted');
});
