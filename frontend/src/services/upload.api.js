import api from './api.js';

const uploadConfig = {
  headers: { 'Content-Type': 'multipart/form-data' }
};

export const uploadApi = {
  uploadProjectImage: (data) => api.post('/upload/misc', data, uploadConfig),
  uploadResume: (data) => api.post('/resume/upload', data, uploadConfig),
  uploadBlogImage: (data) => api.post('/upload/misc', data, uploadConfig),
  uploadProfileImage: (data) => api.post('/upload/profile', data, uploadConfig)
};
