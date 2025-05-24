import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext/RoleContext";

export const Confirmation = ({ onSubmit, onCancel }) => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { selectedRole, setSelectedRole } = useRole();
  
  // Ensure we have the role in component state for backup
  const [roleBackup, setRoleBackup] = useState(null);
  
  // Store backup of the role when component mounts or role changes
  useEffect(() => {
    if (selectedRole) {
      setRoleBackup(selectedRole);
    } else {
      // Try to get from localStorage directly if context doesn't have it
      const storedRole = localStorage.getItem('selectedRole');
      if (storedRole) {
        setRoleBackup(storedRole);
        // Update the context if needed
        setSelectedRole(storedRole);
      }
    }
  }, [selectedRole, setSelectedRole]);

  const handleCheckboxChange = () => {
    setAgreed(!agreed);
  };

  const handleSubmit = (e) => {
    // Prevent default form submission behavior
    if (e) e.preventDefault();
    
    // Store current state before doing anything
    const storedRole = localStorage.getItem('selectedRole') || roleBackup;
    const storedFormData = localStorage.getItem('formData');
    
    // Call the onSubmit prop if it exists
    if (onSubmit) {
      onSubmit();
    }
    
    // Ensure the role still exists in localStorage - restore if needed
    if (!localStorage.getItem('selectedRole') && storedRole) {
      localStorage.setItem('selectedRole', storedRole);
      // Also update context
      setSelectedRole(storedRole);
    }
    
    // Ensure form data still exists - restore if needed
    if (!localStorage.getItem('formData') && storedFormData) {
      localStorage.setItem('formData', storedFormData);
    }
    
    // Short timeout to ensure localStorage updates before navigation
    setTimeout(() => {
      // Set the role one more time right before navigating
      if (storedRole) {
        localStorage.setItem('selectedRole', storedRole);
      }
      navigate('/welcome', { replace: false });
    }, 10);
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[1144px] my-auto pb-6 max-md:max-w-full">
      <div className="flex min-h-6 w-full items-stretch gap-[15px] justify-center flex-wrap mt-5 max-md:max-w-full">
        <div className="flex items-center gap-2.5 justify-center h-full w-6">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={handleCheckboxChange}
            className="w-6 h-6 cursor-pointer"
          />
        </div>
        <label
          htmlFor="terms"
          className="self-stretch min-w-60 min-h-6 gap-2.5 text-base text-black font-normal text-center my-auto cursor-pointer"
        >
          I agree to the Terms & Conditions and Privacy Policy.
        </label>
      </div>
      {/* Show current role if available (for debugging) */}
      {(selectedRole || roleBackup) && (
        <div className="text-center mt-2">
          <p>Profile type: <strong>{selectedRole || roleBackup}</strong></p>
        </div>
      )}
      <div className="self-center flex items-center gap-4 text-base font-normal mt-6">
        <div className="self-stretch flex min-w-60 gap-4 my-auto">
          <button
            onClick={onCancel}
            className="self-stretch gap-2 border rounded-md text-black whitespace-nowrap px-6 py-3 max-md:px-5 cursor-pointer"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!agreed}
            className={`self-stretch gap-2 text-white px-6 border rounded-md py-3 max-md:px-5 cursor-pointer ${
              agreed ? "bg-black" : "bg-gray-400"
            }`}
            type="button"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};