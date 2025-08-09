// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // → http://localhost:8000/api
  withCredentials: true,
  xsrfCookieName:    'XSRF-TOKEN',
  xsrfHeaderName:    'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    'Accept':        'application/json',
  },
});

// Persist token across refreshes
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// expose for console debugging
window.api = api;

export default api;
