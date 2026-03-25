import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const visitorsApi = {
  getAll: (params) => api.get(`/visitors${buildPaginationQuery(params)}`),
  getStats: () => api.get('/visitors/stats'),
  delete: (id) => api.delete(`/visitors/${id}`)
};
