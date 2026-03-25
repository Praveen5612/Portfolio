import { CONSTANTS } from '../global/constants.js';

export const getPaginationData = (req) => {
  const page = parseInt(req.query.page, 10) || CONSTANTS.PAGINATION_DEFAULT_PAGE;
  const limit = parseInt(req.query.limit, 10) || CONSTANTS.PAGINATION_DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

export const buildPaginationMeta = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
