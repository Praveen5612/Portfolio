import joi from 'joi';

export const experienceSchema = joi.object({
  company: joi.string().required(),
  position: joi.string().required(),
  location: joi.string().allow('', null),
  start_date: joi.date().required(),
  end_date: joi.date().allow(null),
  is_current: joi.boolean().default(false),
  description: joi.string().allow('', null),
  achievements: joi.array().items(joi.string()).default([]),
  tech_stack: joi.array().items(joi.string()).default([]),
  sort_order: joi.number().default(0),
  status: joi.string().valid('active', 'inactive').default('active'),
  is_published: joi.boolean().default(true),
});
