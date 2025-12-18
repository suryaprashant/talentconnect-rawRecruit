import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const USER_KEY = "ChatAppUser"; // stores ONLY user object
const TOKEN_KEY = "token";      // stores token string

const AuthContext = createContext(null);

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readStoredAuth() {
  const rawUser = localStorage.getItem(USER_KEY);
  const rawToken = localStorage.getItem(TOKEN_KEY);

  const parsedUser = rawUser ? safeJsonParse(rawUser) : null;
  if (parsedUser?._id) return { user: parsedUser, token: rawToken || null };

  // legacy shape support if any older value existed:
  if (parsedUser?.user?._id) return { user: parsedUser.user, token: parsedUser.token || rawToken || null };

  return null;
}

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => readStoredAuth());

  useEffect(() => {
    try {
      if (authUser?.user?._id) {
        localStorage.setItem(USER_KEY, JSON.stringify(authUser.user));
        if (authUser.token) localStorage.setItem(TOKEN_KEY, authUser.token);
      } else {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [authUser]);

  const setAuthUserStable = useMemo(() => {
    return (next) => {
      if (!next) return setAuthUser(null);

      // preferred: { user, token }
      if (next?.user?._id) {
        const token = next.token || localStorage.getItem(TOKEN_KEY) || null;
        return setAuthUser({ user: next.user, token });
      }

      // allow bare user object
      if (next?._id) {
        const token = localStorage.getItem(TOKEN_KEY) || null;
        return setAuthUser({ user: next, token });
      }

      return setAuthUser(null);
    };
  }, []);

  return (
    <AuthContext.Provider value={[authUser, setAuthUserStable]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
