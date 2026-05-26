import axios from 'axios';

// Configures base URL from environment variables or defaults to localhost Spring Boot port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor injecting the secure JWT token into the request headers
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

// Interceptor capturing API response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Wipe stale session cache
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if we are inside protected routers
      if (
        window.location.pathname !== '/login' && 
        window.location.pathname !== '/signup'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
