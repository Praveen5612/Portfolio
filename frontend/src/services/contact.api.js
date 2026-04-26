import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const contactApi = {
  getAll: (params) => api.get(`/contact${buildPaginationQuery(params)}`),
  getById: (id) => api.get(`/contact/${id}`),
  create: (data) => api.post(`/contact`, data),
  reply: (id, data) => api.post(`/contact/${id}/reply`, data),
  updateStatus: (id, data) => api.patch(`/contact/${id}/status`, data),
  markRead: (id) => api.patch(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`)
};
