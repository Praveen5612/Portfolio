import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { errorResponse } from '../global/response.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Unauthorized', 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded; // Assuming standard token payload
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Unauthorized', 'Token expired');
    }
    return errorResponse(res, 401, 'Unauthorized', 'Invalid token');
  }
};
