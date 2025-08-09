// src/authApi.js

import axios from 'axios';

const authApi = axios.create({
  // ───────────────────────────────────────────────────────
  // Point at your Laravel backend on "localhost", not 127.0.0.1
  // This ensures the browser will send the same-site cookies.
  // ───────────────────────────────────────────────────────
  baseURL: import.meta.env.VITE_BACKEND_URL, // e.g. "http://localhost:8000"

  // ───────────────────────────────────────────────────────
  // Always include cookies (laravel_session & XSRF-TOKEN)
  // ───────────────────────────────────────────────────────
  withCredentials: true,

  // ───────────────────────────────────────────────────────
  // Tell Axios where to read/write the CSRF token
  // ───────────────────────────────────────────────────────
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  headers: {
    'Content-Type': 'application/json',
    'Accept':        'application/json',
  },
});

// ─────────────────────────────────────────────────────────
// Expose for quick debugging in your browser console:
//   > console.log(window.authApi.defaults.baseURL)
// ─────────────────────────────────────────────────────────
window.authApi = authApi;

export default authApi;
