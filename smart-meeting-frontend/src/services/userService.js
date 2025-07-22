// src/services/userService.js
import api from '../api';

export function updateProfile(data) {
  return api.put('/user', data);
}

export function listUsers() {
  return api.get('/users');
}

export function addUser(data) {
  return api.post('/users', data);
}
