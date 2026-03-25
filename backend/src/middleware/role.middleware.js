import { errorResponse } from '../global/response.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 403, 'Forbidden', 'User role not found');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Forbidden', 'Requires higher privileges');
    }

    next();
  };
};
