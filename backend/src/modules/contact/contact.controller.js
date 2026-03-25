import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import contactService from './contact.service.js';
import { getPaginationData } from '../../utils/pagination.js';

export const createMessage = asyncHandler(async (req, res) => {
  const id = await contactService.createMessage(req.body, req.ip);
  return successResponse(res, 201, "Message sent successfully! I'll get back to you within 24 hours.", { id });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPaginationData(req);
  const { status } = req.query;
  const { data, meta } = await contactService.getMessages(status, page, limit, offset);
  return successResponse(res, 200, 'Messages retrieved', data, meta);
});

export const getMessage = asyncHandler(async (req, res) => {
  const message = await contactService.getMessage(req.params.id);
  return successResponse(res, 200, 'Message retrieved', message);
});

export const replyToMessage = asyncHandler(async (req, res) => {
  const { reply_text } = req.body;
  const emailSent = await contactService.replyToMessage(req.params.id, req.user.id, reply_text);
  return successResponse(res, 200, 'Reply sent', { emailSent });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  await contactService.updateStatus(req.params.id, status);
  return successResponse(res, 200, 'Status updated');
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await contactService.deleteMessage(req.params.id);
  return successResponse(res, 200, 'Message deleted');
});
