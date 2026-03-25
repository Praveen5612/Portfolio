import joi from 'joi';

export const updateSettingsSchema = joi.object().pattern(joi.string(), joi.string().allow('', null));

export const updateSocialLinksSchema = joi.object({
  links: joi.array().items(
    joi.object({
      platform: joi.string().required(),
      url: joi.string().uri().required(),
      icon: joi.string().required(),
      sort_order: joi.number().default(0),
      is_active: joi.boolean().default(true),
    })
  ).required()
});
