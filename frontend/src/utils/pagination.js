/**
 * Helper to dynamically generate standardized pagination query strings for API requests
 * Supports injecting active page, limit constraints, search strings, and generic sorting keys natively.
 * 
 * @param {Object} options 
 * @returns {String} URI encoded query string component
 */
export const buildPaginationQuery = ({ page = 1, limit = 10, search = '', sort = 'created_at' } = {}) => {
  const params = new URLSearchParams();
  
  params.append('page', page);
  params.append('limit', limit);
  if (sort) params.append('sort', sort);
  if (search) params.append('search', search);
  
  return `?${params.toString()}`;
};

/**
 * Calculates max pages based on meta tracking total responses
 */
export const calculateTotalPages = (totalItems, limit) => {
  if (!totalItems || !limit) return 1;
  return Math.ceil(totalItems / limit);
};
