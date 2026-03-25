import api from './api.js';

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getVisitorsChart: () => api.get('/dashboard/visitors-chart'),
  getCountries: () => api.get('/dashboard/countries'),
  getDevices: () => api.get('/dashboard/devices'),
  getTopPages: () => api.get('/dashboard/top-pages'),
  getRecentLeads: () => api.get('/dashboard/recent-leads'),
  getRecentMessages: () => api.get('/dashboard/recent-messages'),
  getTrafficSources: () => api.get('/dashboard/traffic-sources')
};
