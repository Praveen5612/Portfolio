import api from './api.js';
import { buildPaginationQuery } from '../utils/pagination.js';

export const blogsApi = {
  getAll: (params) => {
    const adminRoute = params?.admin ? '/admin/all' : '';
    const url = `/blogs${adminRoute}${buildPaginationQuery(params)}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/blogs/${id}`),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post(`/blogs`, data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  updateStatus: (id, isPublished) => api.patch(`/blogs/${id}/status`, { is_published: isPublished }),
  delete: (id) => api.delete(`/blogs/${id}`)
};
