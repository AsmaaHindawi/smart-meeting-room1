import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,    // now: http://127.0.0.1:8000/api
  headers: {
    'Content-Type': 'application/json',
    'Accept':        'application/json',
  },
});

// if a token is already saved (page refresh), attach it
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
