import axios from 'axios';

// Ensure API URL always ends with /api
let apiUrl = import.meta.env.VITE_API_URL || '/api';
if (apiUrl && !apiUrl.endsWith('/api')) {
  // If it's a full URL without /api, add it
  apiUrl = apiUrl.endsWith('/') ? apiUrl + 'api' : apiUrl + '/api';
}

const API_BASE_URL = apiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

