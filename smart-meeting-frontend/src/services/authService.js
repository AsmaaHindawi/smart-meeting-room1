// src/services/authService.js

import api     from '../api';      // your existing /api Axios instance
import authApi from '../authApi';  // your existing root-level Axios instance

// 1. Login via Sanctum cookie + manual XSRF header
export function login({ email, password }) {
  return authApi
    // 1a) get the CSRF cookie from Sanctum
    .get('/sanctum/csrf-cookie')
    .then(() => {
      // 1b) pull raw XSRF-TOKEN value out of document.cookie
      const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
      const xsrfToken = match
        ? decodeURIComponent(match[1])
        : '';

      // 1c) send login with explicit X-XSRF-TOKEN header
      return authApi.post(
        '/login',
        { email, password },
        {
          headers: {
            'X-XSRF-TOKEN': xsrfToken,
          },
        }
      );
    })
    // 1d) on success, store token for future /api calls
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