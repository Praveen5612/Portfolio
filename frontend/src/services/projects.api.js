import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const projectsApi = {
  getAll: (params) => {
    const baseUrl = params?.admin ? '/projects/admin/all' : '/projects';
    return api.get(`${baseUrl}${buildPaginationQuery(params)}`);
  },
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post(`/projects`, data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  updateStatus: (id, isPublished) => api.patch(`/projects/${id}/status`, { is_published: isPublished }),
  delete: (id) => api.delete(`/projects/${id}`)
};
