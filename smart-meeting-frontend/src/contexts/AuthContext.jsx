/* eslint-disable react-refresh/only-export-components */
// src/contexts/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import { login, logout, fetchCurrentUser } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // on mount, see if user already logged in
  useEffect(() => {
    fetchCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signIn = (creds) =>
    login(creds)
      .then(() => fetchCurrentUser())
      .then(res => setUser(res.data));

  const signOut = () =>
    logout().then(() => setUser(null));

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
// import React, { createContext, useEffect, useMemo, useState } from 'react';
// import api from '../api';          // your /api axios instance
// import authApi from '../authApi';  // your root axios instance
// import { login as svcLogin, logout as svcLogout, fetchCurrentUser } from '../services/authService';

// export const AuthContext = createContext({
//   user: null,
//   loading: true,
//   signIn: async (_creds) => {},
//   signOut: async () => {},
// });

// function setAuthHeaderFromStorage() {
//   const token = localStorage.getItem('token');
//   if (token) {
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common['Authorization'];
//   }
// }

// // IMPORTANT for Sanctum cookie flow if SPA runs on a different origin:
// authApi.defaults.withCredentials = true; // send/receive cookies (XSRF-TOKEN, session)

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // On first load, try to hydrate auth state from localStorage
//   useEffect(() => {
//     setAuthHeaderFromStorage();
//     fetchCurrentUser()
//       .then(res => setUser(res.data))
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, []);

//   const signIn = async ({ email, password }) => {
//     const res = await svcLogin({ email, password });
//     // after login, we now have a token stored; fetch current user
//     const me = await fetchCurrentUser();
//     setUser(me.data);
//     return me.data; // return user so caller can decide where to navigate
//   };

//   const signOut = async () => {
//     try {
//       await svcLogout();
//     } finally {
//       setUser(null);
//     }
//   };

//   const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
