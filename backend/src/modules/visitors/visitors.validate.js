import joi from 'joi';

export const visitorsQuerySchema = joi.object({
  page: joi.number().min(1).default(1),
  limit: joi.number().min(1).max(100).default(20),
  country: joi.string().allow('', null),
  device_type: joi.string().allow('', null),
});
