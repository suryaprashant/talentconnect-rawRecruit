// src/context/RoleContext/RoleContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  // Initialize state from localStorage with more robust checks
  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem('selectedRole');
      return savedRole || null;
    } catch (error) {
      console.error("Error reading selectedRole from localStorage:", error);
      return null;
    }
  });
  
  const [formData, setFormData] = useState(() => {
    try {
      const savedFormData = localStorage.getItem('formData');
      return savedFormData ? JSON.parse(savedFormData) : {};
    } catch (error) {
      console.error("Error reading formData from localStorage:", error);
      return {};
    }
  });
  
  // Update localStorage whenever selectedRole changes with error handling
  useEffect(() => {
    try {
      if (selectedRole) {
        localStorage.setItem('selectedRole', selectedRole);
      } 
      // Don't remove from localStorage when null - this helps with persistence
      // Only remove when explicitly called via clearData
    } catch (error) {
      console.error("Error saving selectedRole to localStorage:", error);
    }
  }, [selectedRole]);
  
  // Update localStorage whenever formData changes with error handling
  useEffect(() => {
    try {
      if (Object.keys(formData).length > 0) {
        localStorage.setItem('formData', JSON.stringify(formData));
      }
      // Don't remove from localStorage when empty - this helps with persistence
      // Only remove when explicitly called via clearData
    } catch (error) {
      console.error("Error saving formData to localStorage:", error);
    }
  }, [formData]);
  
  // Function to update form data and maintain persistence
  const updateFormData = (newData) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      return updated;
    });
  };
  
  // Function to update role with explicit persistence
  const updateRole = (role) => {
    setSelectedRole(role);
    try {
      localStorage.setItem('selectedRole', role);
    } catch (error) {
      console.error("Error saving role directly to localStorage:", error);
    }
  };
  
  // Function to clear all saved data (for logout or form completion)
  // Only use this when you explicitly want to clear everything
  const clearData = () => {
    setSelectedRole(null);
    setFormData({});
    try {
      localStorage.removeItem('selectedRole');
      localStorage.removeItem('formData');
    } catch (error) {
      console.error("Error clearing data from localStorage:", error);
    }
  };

  return (
    <RoleContext.Provider 
      value={{ 
        selectedRole, 
        setSelectedRole,
        updateRole, // New function for safer role updates
        formData, 
        updateFormData,
        clearData 
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);