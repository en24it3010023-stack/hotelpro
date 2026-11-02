import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hotelpro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hotelpro_token') || null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await axiosClient.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('hotelpro_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('hotelpro_token', res.token);
      localStorage.setItem('hotelpro_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await axiosClient.post('/auth/register', userData);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('hotelpro_token', res.token);
      localStorage.setItem('hotelpro_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = async () => {
    try {
      if (token) {
        await axiosClient.post('/auth/logout');
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('hotelpro_token');
      localStorage.removeItem('hotelpro_user');
    }
  };

  // Quick Demo Login Helper for presentation / evaluation
  const demoLogin = async (role) => {
    const demoCredentials = {
      admin: { email: 'admin@hotelpro.com', password: 'Admin@123' },
      manager: { email: 'manager@hotelpro.com', password: 'Manager@123' },
      staff: { email: 'staff@hotelpro.com', password: 'Staff@123' },
      guest: { email: 'guest@hotelpro.com', password: 'Guest@123' },
    };

    const creds = demoCredentials[role] || demoCredentials.guest;
    return await login(creds.email, creds.password);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('hotelpro_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        demoLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
