import joi from 'joi';

export const projectSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  long_description: joi.string().allow('', null),
  tech_stack: joi.string().allow('', null), // Received as JSON string from form-data
  live_url: joi.string().uri().allow('', null),
  github_url: joi.string().uri().allow('', null),
  is_featured: joi.boolean().truthy('1', 1).falsy('0', 0).default(false),
  sort_order: joi.number().default(0),
  meta_title: joi.string().allow('', null),
  meta_description: joi.string().allow('', null),
  status: joi.string().valid('published', 'draft', 'archived').default('published'),
  is_published: joi.boolean().truthy('1', 1).falsy('0', 0).default(true),
});

export const publishSchema = joi.object({
  status: joi.string().valid('published', 'draft', 'archived').optional(),
  is_published: joi.boolean().truthy('1', 1).falsy('0', 0).optional(),
}).or('status', 'is_published');
