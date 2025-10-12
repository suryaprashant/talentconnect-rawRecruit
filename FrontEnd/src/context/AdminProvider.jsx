import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const userData = localStorage.getItem('adminUser');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        
        // Verify token with backend
        const response = await axios.get(
          `${import.meta.env.VITE_Backend_URL}/api/admin/verify`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          setAdminUser(user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Token is invalid, clear storage
          clearAdminAuth();
        }
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      clearAdminAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/admin/login`,
        { email, password },
        { 
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        localStorage.setItem('userType', 'admin');
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAdminUser(user);
        
        return { success: true, user };
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/admin/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      clearAdminAuth();
    }
  };

  const clearAdminAuth = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('userType');
    delete axios.defaults.headers.common['Authorization'];
    setAdminUser(null);
  };

  const value = {
    adminUser,
    loading,
    login,
    logout,
    isAdmin: !!adminUser
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
