import api from './api.js';

export const trackingApi = {
  trackVisitorStart: (data) => api.post('/analytics/track', data),
  trackPageView: (data) => api.post('/analytics/pageview', data),
  trackEvent: (data) => api.post('/analytics/event', data),
  trackProjectClick: (data) => api.post('/analytics/project-click', data),
  endSession: (data) => api.post('/analytics/session-end', data)
};
