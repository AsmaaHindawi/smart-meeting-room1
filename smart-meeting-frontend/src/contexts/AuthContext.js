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
