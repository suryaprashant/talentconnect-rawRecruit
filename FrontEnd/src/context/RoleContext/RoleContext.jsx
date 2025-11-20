
import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {

  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      return localStorage.getItem('selectedRole') || null;
    } catch (error) {
      console.error("Error reading selectedRole from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (selectedRole) {
        localStorage.setItem('selectedRole', selectedRole);
      } else {
        localStorage.removeItem('selectedRole');
      }
    } catch (error) {
      console.error("Error saving selectedRole to localStorage:", error);
    }
  }, [selectedRole]);

  // --- FIX: Persist formData in localStorage ---
  // 1. Initialize formData from localStorage on component mount.
  const [formData, setFormData] = useState(() => {
    try {
      const storedFormData = localStorage.getItem('onboardingFormData');
      // Parse the stored JSON, or return an empty object if nothing is stored.
      return storedFormData ? JSON.parse(storedFormData) : {};
    } catch (error) {
      console.error("Error reading formData from localStorage:", error);
      return {};
    }
  });

 
  useEffect(() => {
    try {
 
      localStorage.setItem('onboardingFormData', JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving formData to localStorage:", error);
    }
  }, [formData]);
  
 
  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };
  
  const updateRole = (role) => {
    setSelectedRole(role);
  };
  

  const clearFormData = () => {
    setFormData({});
    try {
      localStorage.removeItem('onboardingFormData');
    } catch (error) {
      console.error("Error removing formData from localStorage:", error);
    }
  };

  
  const clearData = () => {
    setSelectedRole(null);
    setFormData({});
    try {
      localStorage.removeItem('selectedRole');
      localStorage.removeItem('onboardingFormData');
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  return (
    <RoleContext.Provider 
      value={{ 
        selectedRole, 
        setSelectedRole: updateRole,
        formData, 
        updateFormData,
        clearData,
        clearFormData
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
