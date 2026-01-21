
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('ChatAppUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
       
        if (parsedUser && parsedUser.user && parsedUser.user._id) {
          return parsedUser;
        } else if (parsedUser && parsedUser._id) {
          return { user: parsedUser }; 
        }
      }
    } catch (error) {
      console.error("Failed to parse auth user from localStorage, clearing data:", error);
      localStorage.removeItem('ChatAppUser');
    }
    return null;
  });

  useEffect(() => {
    try {
      if (authUser && authUser.user && authUser.user._id) {
        localStorage.setItem('ChatAppUser', JSON.stringify(authUser));
      } else {
        localStorage.removeItem('ChatAppUser');
      }
    } catch (error) {
      console.error("Failed to save auth user to localStorage:", error);
    }
  }, [authUser]);


  const setAuthUserStable = (newAuthUser) => {
    if (newAuthUser && newAuthUser._id && !newAuthUser.user) {
     
      setAuthUser({ user: newAuthUser });
    } else {
      setAuthUser(newAuthUser);
    }
  };

  return (
    <AuthContext.Provider value={[authUser, setAuthUserStable]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useLegacyAuth  = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};