import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost/sitaram/backend/api', // (For local testing)
  baseURL: 'https://sitaramdudh.com/backend/api',
  headers: {
    'Content-Type': 'application/json',
    // 🔥 FIX: Removed Cache-Control and Pragma headers to prevent CORS blocking!
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
  
  // 2. The Ultimate Cache Buster for GET requests
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: new Date().getTime(),
    };
  }
  
  return config;
});

export default api;