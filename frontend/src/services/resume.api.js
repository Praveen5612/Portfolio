import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const resumeApi = {
  getAll: (params) => api.get(`/resume${buildPaginationQuery(params)}`),
  getById: (id) => api.get(`/resume/${id}`),
  getActive: () => api.get('/resume/active'),
  download: (id, params) => api.get(`/resume/download/${id}`, { params }),
  create: (data) => api.post(`/resume`, data),
  update: (id, data) => api.put(`/resume/${id}`, data),
  updateStatus: (id, isActive) => api.patch(`/resume/${id}/status`, { is_active: isActive }),
  delete: (id) => api.delete(`/resume/${id}`)
};
