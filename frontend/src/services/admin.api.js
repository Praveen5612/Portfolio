import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const adminApi = {
  getAll: (params) => api.get(`/admin${buildPaginationQuery(params)}`),
  getById: (id) => api.get(`/admin/${id}`),
  create: (data) => api.post(`/admin`, data),
  update: (id, data) => api.put(`/admin/${id}`, data),
  delete: (id) => api.delete(`/admin/${id}`)
};
