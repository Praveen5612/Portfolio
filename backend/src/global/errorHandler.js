import { errorResponse } from './response.js';
import logger from './logger.js';
export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, 404, 'API endpoint not found.');
};

export const globalErrorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}\n${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Handle specific DB errors gracefully if needed
  if (err.code === 'ER_DUP_ENTRY') {
    return errorResponse(res, 409, 'Duplicate entry found', err);
  }

  // Joi validation errors usually are thrown manually, but just in case
  if (err.isJoi) {
    return errorResponse(res, 400, 'Validation Error', err.details[0].message);
  }

  return errorResponse(res, statusCode, message, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
