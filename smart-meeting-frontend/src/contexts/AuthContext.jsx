/* eslint-disable react-refresh/only-export-components */
// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useMemo } from 'react';
import api from '../api'; // ensure Authorization header is set on refresh
import { login, logout, fetchCurrentUser } from '../services/authService';

export const AuthContext = createContext({
  user: null,
  loading: true,
  // no unused param here (was: async (_creds) => {})
  signIn: async () => {},
  signOut: async () => {},
});

function setAuthHeaderFromStorage() {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore Authorization header and try to fetch the current user
  useEffect(() => {
    setAuthHeaderFromStorage();
    fetchCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Return the actual user so Login.jsx can navigate by role
  const signIn = async (creds) => {
    await login(creds); // sets token + Authorization header
    const me = await fetchCurrentUser();
    setUser(me.data);
    return me.data;
  };

  const signOut = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      setAuthHeaderFromStorage(); // clears Authorization if token removed
    }
  };

  const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
