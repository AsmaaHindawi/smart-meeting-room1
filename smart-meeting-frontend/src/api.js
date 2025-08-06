import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://127.0.0.1:8000/api
  withCredentials: true,
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

export default api;
