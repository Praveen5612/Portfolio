import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import analyticsService from './analytics.service.js';

export const trackVisitor = asyncHandler(async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
  const uaString = req.headers['user-agent'] || '';
  
  const result = await analyticsService.trackVisitor(ip, uaString, req.body);
  return successResponse(res, 200, 'Tracked', result);
});

export const trackPageView = asyncHandler(async (req, res) => {
  const { visitor_id, session_id, page_path, page_title, time_on_page } = req.body;
  await analyticsService.trackPageView(visitor_id, session_id, page_path, page_title, time_on_page);
  return successResponse(res, 200, 'Page view tracked');
});

export const trackEvent = asyncHandler(async (req, res) => {
  const { visitor_id, session_id, event_type, event_data, page_path } = req.body;
  await analyticsService.trackEvent(visitor_id, session_id, event_type, event_data, page_path);
  return successResponse(res, 200, 'Event tracked');
});

export const trackProjectClick = asyncHandler(async (req, res) => {
  const { visitor_id, project_id, click_type } = req.body;
  await analyticsService.trackProjectClick(visitor_id, project_id, click_type);
  return successResponse(res, 200, 'Project click tracked');
});

export const endSession = asyncHandler(async (req, res) => {
  const { session_id, time_spent } = req.body;
  await analyticsService.endSession(session_id, time_spent);
  return successResponse(res, 200, 'Session ended');
});
