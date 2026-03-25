import joi from 'joi';

export const trackVisitorSchema = joi.object({
  referrer: joi.string().allow('', null),
  utm_source: joi.string().allow('', null),
  utm_medium: joi.string().allow('', null),
  utm_campaign: joi.string().allow('', null),
  visitor_id: joi.string().allow('', null),
  session_id: joi.string().allow('', null),
  page: joi.string().allow('', null),
});

export const pageViewSchema = joi.object({
  visitor_id: joi.string().required(),
  session_id: joi.string().required(),
  page_path: joi.string().required(),
  page_title: joi.string().allow('', null),
  time_on_page: joi.number().default(0),
});

export const eventSchema = joi.object({
  visitor_id: joi.string().required(),
  session_id: joi.string().required(),
  event_type: joi.string().required(),
  event_data: joi.any().default({}),
  page_path: joi.string().allow('', null),
});

export const projectClickSchema = joi.object({
  visitor_id: joi.string().required(),
  project_id: joi.number().required(),
  click_type: joi.string().default('view'),
});

export const sessionEndSchema = joi.object({
  session_id: joi.string().required(),
  time_spent: joi.number().default(0),
});
