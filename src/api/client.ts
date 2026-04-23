import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json', // Keep JSON as default
  },
});

apiClient.interceptors.request.use((config) => {
  // If we are sending FormData, delete the manual Content-Type 
  // This allows the browser to set the multipart/form-data + boundary automatically
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const user = localStorage.getItem('safestay_user');
  if (user) {
    const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});