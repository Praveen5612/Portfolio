import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const experienceApi = {
  getAll: (params) => {
    const baseUrl = params?.admin ? '/experience/admin/all' : '/experience';
    const url = `${baseUrl}${buildPaginationQuery(params)}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/experience/${id}`),
  create: (data) => api.post(`/experience`, data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  updateStatus: (id, isPublished) => api.patch(`/experience/${id}/status`, { is_published: isPublished }),
  delete: (id) => api.delete(`/experience/${id}`)
};
