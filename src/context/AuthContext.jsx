// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, registerUser } from '../services/auth';

// Create context (exported for useAuth hook)
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

  // --- LOGIN ---
  const login = async (loginId, password) => {
    // Admin hardcoded override (matches your original)
    if (loginId === 'adminsitaram@gmail.com' && password === 'adminPASSWORD@') {
      const adminUser = {
        id: 999,
        name: 'Super Admin',
        role: 'admin',
        email: loginId
      };
      const adminToken = 'admin-secure-token-999';
      localStorage.setItem('sitaRamUser', JSON.stringify(adminUser));
      localStorage.setItem('sitaRamToken', adminToken);
      setUser(adminUser);
      return { success: true, role: 'admin' };
    }

    // Regular login via API
    const result = await loginUser({ email: loginId, password });
    if (result.success && result.user) {
      localStorage.setItem('sitaRamUser', JSON.stringify(result.user));
      if (result.token) localStorage.setItem('sitaRamToken', result.token);
      setUser(result.user);
      return { success: true, role: result.user.role };
    }
    return { success: false, error: result.error };
  };

  // --- REGISTER ---
  const register = async (userData) => {
    // userData should contain: name, email, phone, address, password
    const result = await registerUser(userData);
    return result; // already has success, error, fieldErrors, etc.
  };

  // --- LOGOUT ---
  const logout = async () => {
    await logoutUser();
    setUser(null);
    // localStorage cleared inside logoutUser
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};