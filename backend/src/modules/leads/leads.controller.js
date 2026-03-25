import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import leadsService from './leads.service.js';
import { getPaginationData } from '../../utils/pagination.js';

export const createLead = asyncHandler(async (req, res) => {
  const id = await leadsService.createLead(req.body, req.ip);
  return successResponse(res, 201, "Thank you! I'll be in touch soon.", { id });
});

export const getLeads = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPaginationData(req);
  const { status } = req.query;
  const { data, meta } = await leadsService.getLeads(status, page, limit, offset);
  return successResponse(res, 200, 'Leads retrieved', data, meta);
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await leadsService.getLead(req.params.id);
  return successResponse(res, 200, 'Lead retrieved', lead);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  await leadsService.updateLeadStatus(req.params.id, status);
  return successResponse(res, 200, 'Lead status updated');
});

export const addNote = asyncHandler(async (req, res) => {
  const { note } = req.body;
  await leadsService.addNote(req.params.id, req.user.id, note);
  return successResponse(res, 201, 'Note added');
});

export const deleteLead = asyncHandler(async (req, res) => {
  await leadsService.deleteLead(req.params.id);
  return successResponse(res, 200, 'Lead deleted');
});
