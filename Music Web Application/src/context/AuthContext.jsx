import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const USERS_KEY = 'mwa_users_v1';
const SESSION_KEY = 'mwa_session_v1';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = async ({ name, email, password }) => {
    if (!email || !password || !name) {
      throw new Error('Missing fields');
    }
    const saved = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (saved.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    saved.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(saved));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
    // Force a small delay to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 10));
    return newUser;
  };

  const login = async ({ email, password }) => {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const found = saved.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');
    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    setUser(found);
    // Force a small delay to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 10));
    return found;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
