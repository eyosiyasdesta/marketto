import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { showToast } = useToast();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sw_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sw_token') || null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem('sw_token', data.token);
      const userData = { name: data.fullName, email: data.email, role: data.role };
      localStorage.setItem('sw_user', JSON.stringify(userData));
      setToken(data.token);
      setUser(userData);
      setAuthModalOpen(false);
      showToast(`Welcome back, ${data.fullName}!`);
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Login failed.', 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (fullName, email, password) => {
    try {
      await authApi.register({ fullName, email, password });
      showToast('Account created successfully! Please sign in.');
      setAuthMode('login');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('sw_token');
    localStorage.removeItem('sw_user');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.');
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => setAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        authModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
