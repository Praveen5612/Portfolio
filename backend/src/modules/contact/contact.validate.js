import joi from 'joi';

export const contactSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().allow('', null),
  subject: joi.string().allow('', null),
  message: joi.string().required(),
  visitor_id: joi.string().allow('', null),
});

export const replySchema = joi.object({
  reply_text: joi.string().required(),
});

export const contactStatusSchema = joi.object({
  status: joi.string().valid('new', 'read', 'replied').required(),
});
