import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import dashboardService from './dashboard.service.js';

class DashboardController {
  getStats = asyncHandler(async (req, res) => {
    const data = await dashboardService.getShortStats();
    return successResponse(res, 200, 'Stats retrieved', data);
  });

  getVisitorsChart = asyncHandler(async (req, res) => {
    const data = await dashboardService.getVisitorsChart();
    return successResponse(res, 200, 'Chart data retrieved', data);
  });

  getCountries = asyncHandler(async (req, res) => {
    const data = await dashboardService.getTopCountries();
    return successResponse(res, 200, 'Country data retrieved', data);
  });

  getDevices = asyncHandler(async (req, res) => {
    const data = await dashboardService.getDeviceStats();
    return successResponse(res, 200, 'Device data retrieved', data);
  });

  getTopPages = asyncHandler(async (req, res) => {
    const data = await dashboardService.getTopPages();
    return successResponse(res, 200, 'Top pages retrieved', data);
  });

  getRecentLeads = asyncHandler(async (req, res) => {
    const data = await dashboardService.getRecentLeads();
    return successResponse(res, 200, 'Recent leads retrieved', data);
  });

  getRecentMessages = asyncHandler(async (req, res) => {
    const data = await dashboardService.getRecentMessages();
    return successResponse(res, 200, 'Recent messages retrieved', data);
  });

  getTrafficSources = asyncHandler(async (req, res) => {
    const data = await dashboardService.getTrafficSources();
    return successResponse(res, 200, 'Traffic sources retrieved', data);
  });
}

export default new DashboardController();
