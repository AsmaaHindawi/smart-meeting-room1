// src/services/authService.js
import api from '../api';

export function login({ email, password }) {
  // Sanctum: first hit /sanctum/csrf-cookie() then post to login
  return api.get('/sanctum/csrf-cookie')
    .then(() => api.post('/login', { email, password }));
}

export function logout() {
  return api.post('/logout');
}

export function fetchCurrentUser() {
  return api.get('/user');
}
