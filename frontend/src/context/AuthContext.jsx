import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser as apiLogin, logoutUser as apiLogout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const res = await getCurrentUser();
      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    if (res.data && res.data.user) {
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
    }
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuthStatus, updateUserState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
