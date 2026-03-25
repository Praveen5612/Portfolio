import joi from 'joi';

export const blogSchema = joi.object({
  title: joi.string().required(),
  excerpt: joi.string().allow('', null),
  content: joi.string().required(),
  tags: joi.string().allow('', null), // JSON string parsing in service
  is_published: joi.alternatives().try(joi.boolean(), joi.string(), joi.number()).default(true),
  meta_title: joi.string().allow('', null),
  meta_description: joi.string().allow('', null),
});

export const publishBlogSchema = joi.object({
  is_published: joi.boolean().required(),
});
