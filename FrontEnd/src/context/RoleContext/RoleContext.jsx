/*
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
*/
import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

const STORAGE_KEYS = {
  SELECTED_ROLE: 'candidateOnboardingSelectedRole',
  FORM_DATA: 'candidateOnboardingFormData'
};

export const RoleProvider = ({ children }) => {

  // Initialize selectedRole from sessionStorage (isolated per tab)
  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.SELECTED_ROLE) || null;
    } catch (error) {
      console.error("Error reading selectedRole from sessionStorage:", error);
      return null;
    }
  });

  // Save selectedRole to sessionStorage whenever it changes
  useEffect(() => {
    try {
      if (selectedRole) {
        sessionStorage.setItem(STORAGE_KEYS.SELECTED_ROLE, selectedRole);
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.SELECTED_ROLE);
      }
    } catch (error) {
      console.error("Error saving selectedRole to sessionStorage:", error);
    }
  }, [selectedRole]);

  // Initialize formData from sessionStorage on component mount
  const [formData, setFormData] = useState(() => {
    try {
      const storedFormData = sessionStorage.getItem(STORAGE_KEYS.FORM_DATA);
      if (storedFormData) {
        const parsed = JSON.parse(storedFormData);
        // Ensure education array exists for StepThree compatibility
        if (!parsed.education) {
          parsed.education = [{}];
        }
        return parsed;
      }
      // Return default structure with education array initialized
      return { education: [{}] };
    } catch (error) {
      console.error("Error reading formData from sessionStorage:", error);
      return { education: [{}] };
    }
  });

  // Save formData to sessionStorage whenever it changes
  useEffect(() => {
    try {
      // Only save if formData has content to avoid storing empty objects on mount
      if (Object.keys(formData).length > 0) {
        sessionStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
      }
    } catch (error) {
      console.error("Error saving formData to sessionStorage:", error);
    }
  }, [formData]);
  
  /*const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };*/

  const updateFormData = (newDataOrUpdater) => {
  setFormData((prev) =>
    typeof newDataOrUpdater === "function"
      ? newDataOrUpdater(prev)
      : { ...prev, ...newDataOrUpdater }
  );
};

  
  const updateRole = (role) => {
    setSelectedRole(role);
  };
  
  // Clear only form data (keep role selection)
  const clearFormData = () => {
    setFormData({});
    try {
      sessionStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    } catch (error) {
      console.error("Error removing formData from sessionStorage:", error);
    }
  };

  // Clear everything (role + form data)
  const clearData = () => {
    setSelectedRole(null);
    setFormData({});
    try {
      sessionStorage.removeItem(STORAGE_KEYS.SELECTED_ROLE);
      sessionStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  };

  return (
    <RoleContext.Provider 
      value={{ 
        selectedRole, 
        setSelectedRole: updateRole,
        updateRole, // Export both names for compatibility
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