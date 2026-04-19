// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser as apiLoginUser, 
  logoutUser as apiLogoutUser,
  registerUser as apiRegisterUser
} from '../services/auth';

// 1. FIXED: Added 'export' so useAuth.js can find it
export const AuthContext = createContext();

// 2. Custom Hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 3. Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- HYDRATION: Check for active session on page load ---
  useEffect(() => {
    const hydrateAuth = () => {
      try {
        const savedUser = localStorage.getItem('sitaRamUser');
        const token = localStorage.getItem('sitaRamToken');
        
        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from local storage", error);
        localStorage.removeItem('sitaRamUser');
        localStorage.removeItem('sitaRamToken');
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();
  }, []);

  // --- LOGIN LOGIC ---
  const login = async (email, password) => {
    try {
      // 1. EXCLUSIVE ADMIN OVERRIDE
      if (email === 'adminsitaram@gmail.com' && password === 'adminPASSWORD@') {
        const adminUser = { 
          id: 999, 
          name: 'Super Admin', 
          role: 'admin', 
          email: email 
        };
        const adminToken = 'admin-secure-token-999';
        
        localStorage.setItem('sitaRamUser', JSON.stringify(adminUser));
        localStorage.setItem('sitaRamToken', adminToken);
        
        setUser(adminUser);
        return { success: true, role: 'admin' };
      }

      // 2. STANDARD CUSTOMER LOGIN
      const data = await apiLoginUser({ email, password });
      
      if (data?.success && data?.user) {
        localStorage.setItem('sitaRamUser', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('sitaRamToken', data.token);
        }
        
        setUser(data.user);
        return { success: true, role: data.user.role };
      }
      
      return { 
        success: false, 
        error: data?.error || 'Invalid email or password' 
      };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please check your credentials.' 
      };
    }
  };

  // --- REGISTRATION LOGIC ---
  const register = async (userData) => {
    try {
      return await apiRegisterUser(userData);
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  };

  // --- LOGOUT LOGIC ---
  const logout = async () => {
    try {
      await apiLogoutUser();
    } catch (e) {
      console.warn("Backend logout failed, forcing local logout.");
    } finally {
      setUser(null);
      localStorage.removeItem('sitaRamUser');
      localStorage.removeItem('sitaRamToken');
      localStorage.removeItem('sitaRamCart');
      localStorage.removeItem('cartItems');
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};