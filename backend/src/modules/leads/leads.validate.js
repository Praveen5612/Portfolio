import joi from 'joi';

export const leadSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().allow('', null),
  company: joi.string().allow('', null),
  message: joi.string().allow('', null),
  reason: joi.string().default('other'),
  source: joi.string().default('popup'),
  visitor_id: joi.string().allow('', null),
});

export const leadStatusSchema = joi.object({
  status: joi.string().valid('new', 'contacted', 'qualified', 'lost').required(), // Example statuses
});

export const leadNoteSchema = joi.object({
  note: joi.string().required(),
});
