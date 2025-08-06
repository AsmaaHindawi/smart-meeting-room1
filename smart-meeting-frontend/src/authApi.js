import axios from 'axios';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // http://127.0.0.1:8000
  withCredentials: true,                     // cookies for Sanctum
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    'Accept':        'application/json',
  },
});

export default authApi;
