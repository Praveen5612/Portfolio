import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const contactApi = {
  getAll: (params) => api.get(`/contact${buildPaginationQuery(params)}`),
  getById: (id) => api.get(`/contact/${id}`),
  markRead: (id) => api.patch(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`)
};
