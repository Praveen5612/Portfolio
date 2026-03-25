import axios from 'axios';
import toast from 'react-hot-toast';

// In production (Vercel), frontend and backend share the same domain.
// Use relative /api path so no CORS issues or hardcoded URLs are needed.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token & globally handle loading state initiation if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unwrap global formatting { success, message, data, meta }
api.interceptors.response.use(
  (response) => {
    const resData = response.data;
    
    // Automatically unpack backend success envelope format
    if (resData && resData.success !== undefined) {
      if (resData.success) {
        return {
          data: resData.data,
          meta: resData.meta,
          message: resData.message
        };
      }
      
      // If success is explicitly false, throw gracefully
      throw new Error(resData.message || 'API request failed');
    }

    // Fallback for endpoints not matching the format (e.g. blobs, 3rd party APIs)
    return response.data;
  },
  (error) => {
    // Determine standardized error message from backend
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Server error occurred';
    const status = error.response?.status;

    // Handle Global HTTP response cascades natively via Toast alarms
    if (status === 400) {
      toast.error(`Validation Error: ${errorMessage}`);
    } else if (status === 401) {
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('token');
      // Graceful window redirect avoiding react-router lifecycle binding issues
      window.location.href = '/admin'; 
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      toast.error('The requested resource could not be found.');
    } else if (status >= 500) {
      toast.error('A critical server error occurred. Please try again later.');
    } else {
      toast.error(`Error: ${errorMessage}`);
    }

    // Propagate rejection so specific UI components can hide spinners
    return Promise.reject(error);
  }
);

export default api;
