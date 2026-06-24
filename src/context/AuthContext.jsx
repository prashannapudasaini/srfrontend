// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // 🔥 Import your API instance directly

export const AuthContext = createContext();

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    const hydrateAuth = () => {
      try {
        const savedUser = localStorage.getItem('sitaRamUser');
        const token = localStorage.getItem('sitaRamToken');
        
        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('sitaRamUser');
        localStorage.removeItem('sitaRamToken');
      } finally {
        setLoading(false);
      }
    };
    hydrateAuth();
  }, []);

  // 🔥 NEW: Helper to manually set auth data (used after 2FA is successful)
  const setAuthData = (userData, token) => {
    localStorage.setItem('sitaRamUser', JSON.stringify(userData));
    localStorage.setItem('sitaRamToken', token);
    setUser(userData);
  };

  // --- LOGIN ---
  const login = async (loginId, password) => {
    try {
      const response = await api.post('auth/login.php', { loginId, password });

      // 1. Standard Login Success (Standard Users)
      if (response.data.status === 'success') {
        const { user: userData, token } = response.data.data;
        setAuthData(userData, token);
        return { success: true, role: userData.role };
      } 
      // 2. 🔥 Catch Admin 2FA Interception
      else if (response.data.status === '2fa_required') {
        return { 
          success: false, // Don't log them in yet!
          requires2FA: true, 
          userId: response.data.data.user_id, 
          message: response.data.message 
        };
      }

      return { success: false, error: response.data.message };

    } catch (error) {
      // Handles 401 Invalid Credentials & 429 Account Lockout
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  // --- REGISTER ---
  const register = async (userData) => {
    try {
      const response = await api.post('auth/register.php', userData);
      if (response.data.status === 'success') {
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      // Handle strict backend validation errors (e.g., missing address)
      if (error.response?.status === 422) {
         return { success: false, fieldErrors: error.response.data.errors };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      // Ping backend to destroy token if you have a logout endpoint
      // await api.post('auth/logout.php'); 
    } catch (e) {
      console.error("Logout error", e);
    }
    
    // Completely wipe local session
    localStorage.removeItem('sitaRamUser');
    localStorage.removeItem('sitaRamToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    setAuthData, // 🔥 Exported so LoginPage can use it after 2FA verification
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};