import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import resumeService from './resume.service.js';

export const getActiveResume = asyncHandler(async (req, res) => {
  const data = await resumeService.getActiveResume();
  // Return null gracefully — frontend shows "Resume will be available soon"
  return successResponse(res, 200, 'Active resume retrieved', data ?? null);
});


export const downloadResume = asyncHandler(async (req, res) => {
  const { visitor_id, session_id } = req.query;
  const ip = req.ip;
  const data = await resumeService.downloadResume(req.params.id, visitor_id, session_id, ip);
  return successResponse(res, 200, 'Resume downloaded', data);
});

export const getAllResumes = asyncHandler(async (req, res) => {
  const data = await resumeService.getAllResumes();
  return successResponse(res, 200, 'All resumes retrieved', data);
});

export const uploadResume = asyncHandler(async (req, res) => {
  const { version } = req.body;
  const id = await resumeService.uploadResume(req.file, version);
  return successResponse(res, 201, 'Resume uploaded', { id });
});

export const deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(req.params.id);
  return successResponse(res, 200, 'Resume deleted');
});
