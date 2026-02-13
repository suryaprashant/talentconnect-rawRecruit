import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";

const AuthContext = createContext(null);

export const AuthContextRole = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore auth on page refresh
  
    const fetchMe = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          // User is not logged in → this is OK
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    fetchMe();
  }, []);

  // 🔐 Login handler
  const login = (userData) => {
    setUser(userData);
  };

  // 🚪 Logout handler
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.userType,
        loading,
        login,
        logout,
        refreshUser: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
