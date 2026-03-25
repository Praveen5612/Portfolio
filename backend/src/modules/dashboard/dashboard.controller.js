import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import dashboardService from './dashboard.service.js';

export const getStats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getShortStats();
  return successResponse(res, 200, 'Stats retrieved', data);
});

export const getVisitorsChart = asyncHandler(async (req, res) => {
  const data = await dashboardService.getVisitorsChart();
  return successResponse(res, 200, 'Chart data retrieved', data);
});

export const getCountries = asyncHandler(async (req, res) => {
  const data = await dashboardService.getTopCountries();
  return successResponse(res, 200, 'Country data retrieved', data);
});

export const getDevices = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDeviceStats();
  return successResponse(res, 200, 'Device data retrieved', data);
});

export const getTopPages = asyncHandler(async (req, res) => {
  const data = await dashboardService.getTopPages();
  return successResponse(res, 200, 'Top pages retrieved', data);
});

export const getRecentLeads = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentLeads();
  return successResponse(res, 200, 'Recent leads retrieved', data);
});

export const getRecentMessages = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentMessages();
  return successResponse(res, 200, 'Recent messages retrieved', data);
});

export const getTrafficSources = asyncHandler(async (req, res) => {
  const data = await dashboardService.getTrafficSources();
  return successResponse(res, 200, 'Traffic sources retrieved', data);
});
