import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";

const AuthContext = createContext(null);

export const AuthContextRole = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Detect prerender
  const isPrerender =
    typeof navigator !== "undefined" &&
    navigator.userAgent === "ReactSnap";

  // 🔁 Restore auth on page refresh
  const fetchMe = async () => {
    console.log('fetchMe START');
    try {
      const res = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      console.log(res.data.user)
      console.log('fetchMe RESULT', res.data.user);
      setUser(res.data.user);
    } catch (err) {
      console.log('fetchMe ERROR', err.response?.status);
      if (err.response?.status === 401) {
        setUser(null);
      }
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🚫 Skip API during prerender
    if (isPrerender) {
      setLoading(false);
      return;
    }

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
  // console.log(ctx)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};