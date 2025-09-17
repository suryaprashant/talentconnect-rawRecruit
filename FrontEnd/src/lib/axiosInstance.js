// src/lib/axiosInstance.js
import axios from 'axios';

// This is the central Axios instance for your whole app
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_Backend_URL}/api`, // Correctly becomes 'http://localhost:5000/api'
  withCredentials: true,
});

// Automatically adds your auth token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Your Resume Upload Function is in the same file ---

export const uploadAndParseResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file); // 'resume' must match the backend key

    // Use the axiosInstance we configured above
    const response = await axiosInstance.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;

  } catch (error) {
    console.error("Error in resume upload function:", error);
    throw error;
  }
};

export default axiosInstance;