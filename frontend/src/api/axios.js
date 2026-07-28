import axios from 'axios';

// In development, Vite proxies "/api" to localhost:5000 (see vite.config.js).
// In production, set VITE_API_URL to your deployed backend, e.g.
// https://your-app.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the correct token depending on whether the request is for the
// student area or the admin area (based on the URL prefix).
api.interceptors.request.use((config) => {
  const isAdminRoute = config.url?.startsWith('/admin');
  const token = isAdminRoute ? localStorage.getItem('adminToken') : localStorage.getItem('studentToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAdminRoute = error.config?.url?.startsWith('/admin');

    if (status === 401) {
      if (isAdminRoute) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      } else {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
