import axios from 'axios';

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // Cloud & production fallback (e.g. Vercel deployment)
  if (
    import.meta.env.PROD ||
    (typeof window !== 'undefined' &&
      window.location?.hostname &&
      (window.location.hostname.includes('vercel.app') ||
        (!/^(\d{1,3}\.){3}\d{1,3}$/.test(window.location.hostname) &&
          window.location.hostname !== 'localhost' &&
          window.location.hostname !== '127.0.0.1')))
  ) {
    return 'https://biteflow-backend.vercel.app/api';
  }

  // Local private LAN IP access (e.g. 192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  if (
    typeof window !== 'undefined' &&
    window.location?.hostname &&
    /^192\.168\.\d+\.\d+$|^10\.\d+\.\d+\.\d+$|^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(
      window.location.hostname
    )
  ) {
    return `http://${window.location.hostname}:5000/api`;
  }

  // Default local development
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('biteflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
