import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Public API calls
export const getBrands = () => api.get('/brands');
export const getModels = (brand) => api.get(`/models?brand=${brand}`);
export const getEngines = (brand, model) => api.get(`/engines?brand=${brand}&model=${model}`);
export const getStages = (brand, model, engine) => 
  api.get(`/stages?brand=${brand}&model=${model}&engine=${engine}`);
export const getPowerData = (brand, model, engine, stage) =>
  api.get(`/power?brand=${brand}&model=${model}&engine=${engine}&stage=${stage}`);

// Auth API calls
export const login = (email, password) => 
  axios.post(`${API_URL}/auth/login`, { email, password });
export const verifyToken = () => 
  axios.post(`${API_URL}/auth/verify`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

// Admin API calls
export const getData = () => api.post('/data');
export const saveData = (data) => api.post('/save', data);
export const getBackups = () => api.get('/backups');

export default api;
