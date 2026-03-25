import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const skillsApi = {
  getAll: (params) => {
    const baseUrl = params?.admin ? '/skills/admin/all' : '/skills';
    return api.get(`${baseUrl}${buildPaginationQuery(params)}`);
  },
  getById: (id) => api.get(`/skills/${id}`),
  create: (data) => api.post(`/skills`, data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  updateStatus: (id, isActive) => api.patch(`/skills/${id}/status`, { is_active: isActive }),
  delete: (id) => api.delete(`/skills/${id}`)
};
