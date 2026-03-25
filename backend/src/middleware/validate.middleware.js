import { errorResponse } from '../global/response.js';

export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return errorResponse(res, 400, 'Validation Error', errorMessage);
    }

    req[source] = value;
    next();
  };
};
