import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import settingsService from './settings.service.js';

export const getPublicSettings = asyncHandler(async (req, res) => {
  const data = await settingsService.getPublicSettings();
  return successResponse(res, 200, 'Public settings retrieved', data);
});

export const getAllSettings = asyncHandler(async (req, res) => {
  const data = await settingsService.getAllSettings();
  return successResponse(res, 200, 'All settings retrieved', data);
});

export const updateSettings = asyncHandler(async (req, res) => {
  await settingsService.updateSettings(req.body);
  return successResponse(res, 200, 'Settings updated');
});

export const getSocialLinks = asyncHandler(async (req, res) => {
  const data = await settingsService.getSocialLinks();
  return successResponse(res, 200, 'Social links retrieved', data);
});

export const updateSocialLinks = asyncHandler(async (req, res) => {
  await settingsService.updateSocialLinks(req.body.links);
  return successResponse(res, 200, 'Social links updated');
});
