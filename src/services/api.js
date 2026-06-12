import axios from 'axios';

const api = axios.create({
  // 🔥 FIXED: Changed from localhost to your live production server
  baseURL: 'https://sitaramdudh.com/backend/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Standard User Token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Admin Security Token (Automatically attaches if an Admin is logged in)
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) {
    config.headers['X-Admin-Token'] = adminToken;
  }
  
  return config;
});

export default api;