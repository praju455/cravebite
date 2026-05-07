import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useAdminStore } from '../store/adminStore';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = axios.create({ baseURL: BASE });

// User API — attaches user JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Admin API — attaches admin JWT for /stats/* calls
export const adminApi = axios.create({ baseURL: BASE });

adminApi.interceptors.request.use((config) => {
  const token = useAdminStore.getState().token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
