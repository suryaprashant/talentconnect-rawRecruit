// src/context/RoleContext/RoleContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ROLE_KEY = "selectedRole";
const FORM_KEY = "onboardingFormData";

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      return localStorage.getItem(ROLE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState(() => {
    try {
      const stored = localStorage.getItem(FORM_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      if (selectedRole) localStorage.setItem(ROLE_KEY, selectedRole);
      else localStorage.removeItem(ROLE_KEY);
    } catch {
      // ignore
    }
  }, [selectedRole]);

  useEffect(() => {
    try {
      localStorage.setItem(FORM_KEY, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  const updateFormData = (newData) => setFormData((prev) => ({ ...prev, ...newData }));
  const updateRole = (role) => setSelectedRole(role);

  const clearFormData = () => {
    setFormData({});
    try {
      localStorage.removeItem(FORM_KEY);
    } catch {
      // ignore
    }
  };

  const clearData = () => {
    setSelectedRole(null);
    setFormData({});
    try {
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(FORM_KEY);
    } catch {
      // ignore
    }
  };

  const value = { selectedRole, updateRole, formData, updateFormData, clearFormData, clearData };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
