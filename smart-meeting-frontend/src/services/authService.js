// src/services/authService.js
import api from '../api';

export function login({ email, password }) {
  // Sanctum: first hit /sanctum/csrf-cookie() then post to login
  return api.get('/sanctum/csrf-cookie')
    .then(() => api.post('/login', { email, password }))
    .then(res => {
      const { token } = res.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return res;
    });
}

export function logout() {
  return api.post('/logout')
    .finally(() => {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    });
}

export function fetchCurrentUser() {
  return api.get('/user');
}
