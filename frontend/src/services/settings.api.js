import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const settingsApi = {
  getPublic: () => api.get('/settings/public'),
  getSocialLinks: () => api.get('/settings/social-links'),
  getAll: (params) => api.get(`/settings${buildPaginationQuery(params)}`),
  getById: (id) => api.get(`/settings/${id}`),
  updateAll: (data) => api.put('/settings', data),
  updateSocialLinks: (data) => api.put('/settings/social-links', data),
  create: (data) => api.post(`/settings`, data),
  update: (id, data) => api.put(`/settings/${id}`, data),
  delete: (id) => api.delete(`/settings/${id}`)
};
