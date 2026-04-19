import axios from 'axios';

const api = axios.create({
  // IMPORTANT: Change this to match your XAMPP local server URL
  // If your backend is at http://localhost/sita-ram-dairy/backend/api
  baseURL: 'http://localhost/sita-ram-dairy/backend/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a token interceptor if you are using JWT auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;