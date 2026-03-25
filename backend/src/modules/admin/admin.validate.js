import joi from 'joi';

export const updateProfileSchema = joi.object({
  name: joi.string().min(2).required(),
  email: joi.string().email().required(),
});

export const updatePasswordSchema = joi.object({
  currentPassword: joi.string().required(),
  newPassword: joi.string().min(6).required(),
});
