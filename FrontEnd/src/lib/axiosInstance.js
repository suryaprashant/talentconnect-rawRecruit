

import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_Backend_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt') || localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor (ADD BELOW)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthMe =
      error.config?.url?.includes("/api/auth/me") &&
      error.response?.status === 401;

    if (isAuthMe) {
      // Silent failure for guest users
      return Promise.reject(error);
    }

    console.error(error);
    return Promise.reject(error);
  }
);


export default axiosInstance;
