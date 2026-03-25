import joi from 'joi';

export const resumeUploadSchema = joi.object({
  version: joi.string().default('1.0'),
});

export const resumeDownloadSchema = joi.object({
  visitor_id: joi.string().allow('', null),
  session_id: joi.string().allow('', null),
});
