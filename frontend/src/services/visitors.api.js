import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const visitorsApi = {
  getAll: (params) => api.get(`/visitors${buildPaginationQuery(params)}`),
  getDetails: (visitorId) => api.get(`/visitors/${visitorId}`)
};

