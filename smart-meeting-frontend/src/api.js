// src/api.js
import axios from 'axios';

// Ensure the base URL always points to the API root (…/api)
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const baseURL = rawBase.endsWith('/api')
  ? rawBase
  : `${rawBase.replace(/\/+$/,'')}/api`;

const api = axios.create({
  baseURL, // → e.g., http://localhost:8000/api
  withCredentials: true,            // keep your original idea
  xsrfCookieName: 'XSRF-TOKEN',     // keep your original idea
  xsrfHeaderName: 'X-XSRF-TOKEN',   // keep your original idea
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Persist/clear token and keep axios defaults in sync
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
}

// Attach Authorization on every request (stays updated if token changes)
api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t) config.headers['Authorization'] = `Bearer ${t}`;
  return config;
});

// Graceful 401 handling (token expired/invalid)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setAuthToken(null);
      // avoid redirect loop if already on /signin
      if (typeof window !== 'undefined' && !location.pathname.startsWith('/signin')) {
        location.href = '/signin';
      }
    }
    return Promise.reject(err);
  }
);

// Bootstrap Authorization header on refresh
(() => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
})();

// Expose for console debugging
if (typeof window !== 'undefined') {
  window.api = api;
}

export default api;
