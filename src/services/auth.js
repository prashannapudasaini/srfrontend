// frontend/src/services/auth.js
import api from './api';

export const loginUser = async (credentials) => {
  const response = await api.post('auth/login.php', credentials);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post('auth/register.php', data);
  return response.data;
};

export const logoutUser = async () => {
  // 1. Remove Auth Tokens
  localStorage.removeItem('sitaRamToken');
  localStorage.removeItem('sitaRamUser');
  
  // 2. Clear local cart so it resets to 0 for the next session
  // (The items remain in the user's DB account if backed by an API)
  localStorage.removeItem('cartItems'); 
  localStorage.removeItem('sitaRamCart');
  
  return { success: true, message: "Logged out securely" };
};