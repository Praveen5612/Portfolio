import api from './api.js';

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  getLoginLogs: () => api.get('/auth/login-logs'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/admin';
  }
};
