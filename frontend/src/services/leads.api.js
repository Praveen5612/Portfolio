import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const leadsApi = {
  getAll: (params) => api.get(`/leads${buildPaginationQuery(params)}`),
  getById: (id) => api.get(`/leads/${id}`),
  updateStatus: (id, status) => api.patch(`/leads/${id}/status`, { status }),
  delete: (id) => api.delete(`/leads/${id}`)
};
