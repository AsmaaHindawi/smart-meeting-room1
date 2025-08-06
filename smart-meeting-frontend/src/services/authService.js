// src/services/authService.js
import api     from '../api';      // your existing /api Axios instance
import authApi from '../authApi';  // your existing root-level Axios instance

// 1. Login via Sanctum cookie
export function login({ email, password }) {
  return authApi
    .get('/sanctum/csrf-cookie')              // ← NEW: fetch CSRF cookie first
    .then(() =>
      authApi.post('/login', {                // then login on web route
        email,
        password
      })
    )
    // store the token (returned in JSON) for /api calls
    .then(res => {
      const { token } = res.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return res;
    });
}

// 2. Logout also on root
export function logout() {
  return authApi
    .post('/logout')
    .finally(() => {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    });
}

// 3. Fetch current user via /api
export function fetchCurrentUser() {
  return api.get('/user');
}
