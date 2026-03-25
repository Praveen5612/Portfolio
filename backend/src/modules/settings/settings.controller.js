import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import settingsService from './settings.service.js';

class SettingsController {
  getPublicSettings = asyncHandler(async (req, res) => {
    const data = await settingsService.getPublicSettings();
    return successResponse(res, 200, 'Public settings retrieved', data);
  });

  getAllSettings = asyncHandler(async (req, res) => {
    const data = await settingsService.getAllSettings();
    return successResponse(res, 200, 'All settings retrieved', data);
  });

  updateSettings = asyncHandler(async (req, res) => {
    await settingsService.updateSettings(req.body);
    return successResponse(res, 200, 'Settings updated');
  });

  getSocialLinks = asyncHandler(async (req, res) => {
    const data = await settingsService.getSocialLinks();
    return successResponse(res, 200, 'Social links retrieved', data);
  });

  updateSocialLinks = asyncHandler(async (req, res) => {
    await settingsService.updateSocialLinks(req.body.links);
    return successResponse(res, 200, 'Social links updated');
  });
}

export default new SettingsController();
