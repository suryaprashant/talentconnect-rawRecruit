// import React, { createContext, useContext, useState } from "react";
// import Cookies from "js-cookie";
// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//   const initialUserState =
//     Cookies.get("jwt") || localStorage.getItem("ChatApp");

//   // parse the user data and storing in state.
//   const [authUser, setAuthUser] = useState(
//     initialUserState ? JSON.parse(initialUserState) : undefined
//   );
//   return (
//     <AuthContext.Provider value={[authUser, setAuthUser]}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    try {
      // Initialize from localStorage with a consistent key
      const storedAuth = localStorage.getItem('ChatAppUser');
      return storedAuth ? JSON.parse(storedAuth) : null;
    } catch (error) {
      console.error("Failed to parse auth user from localStorage:", error);
      return null;
    }
  });

  // Effect to update localStorage whenever authUser changes
  useEffect(() => {
    try {
      if (authUser) {
        localStorage.setItem('ChatAppUser', JSON.stringify(authUser));
      } else {
        localStorage.removeItem('ChatAppUser');
      }
    } catch (error) {
      console.error("Failed to save auth user to localStorage:", error);
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);