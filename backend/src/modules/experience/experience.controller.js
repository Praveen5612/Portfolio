import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import experienceService from './experience.service.js';

class ExperienceController {
  getPublicExperience = asyncHandler(async (req, res) => {
    const data = await experienceService.getPublicExperience();
    return successResponse(res, 200, 'Experience retrieved', data);
  });

  getAdminExperience = asyncHandler(async (req, res) => {
    const data = await experienceService.getAllAdminExperience();
    return successResponse(res, 200, 'Admin experience retrieved', data);
  });

  createExperience = asyncHandler(async (req, res) => {
    const id = await experienceService.createExperience(req.body);
    return successResponse(res, 201, 'Experience created', { id });
  });

  updateExperience = asyncHandler(async (req, res) => {
    await experienceService.updateExperience(req.params.id, req.body);
    return successResponse(res, 200, 'Experience updated');
  });

  deleteExperience = asyncHandler(async (req, res) => {
    await experienceService.deleteExperience(req.params.id);
    return successResponse(res, 200, 'Experience deleted');
  });
}

export default new ExperienceController();
