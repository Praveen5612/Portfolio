import joi from 'joi';

export const skillSchema = joi.object({
  name: joi.string().required(),
  category: joi.string().required(),
  proficiency: joi.number().min(0).max(100).default(80),
  icon: joi.string().allow('', null),
  sort_order: joi.number().default(0),
  status: joi.string().valid('active', 'inactive').default('active'),
  is_active: joi.boolean().truthy('1', 1).falsy('0', 0).default(true),
});
