// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useRole } from "@/context/RoleContext/RoleContext";

// export const Confirmation = ({ onSubmit, onCancel }) => {
//   const [agreed, setAgreed] = useState(false);
//   const navigate = useNavigate();
//   const { selectedRole, setSelectedRole } = useRole();

//   // Ensure we have the role in component state for backup
//   const [roleBackup, setRoleBackup] = useState(null);

//   // Store backup of the role when component mounts or role changes
//   useEffect(() => {
//     if (selectedRole) {
//       setRoleBackup(selectedRole);
//     } else {
//       // Try to get from localStorage directly if context doesn't have it
//       const storedRole = localStorage.getItem('selectedRole');
//       if (storedRole) {
//         setRoleBackup(storedRole);
//         // Update the context if needed
//         setSelectedRole(storedRole);
//       }
//     }
//   }, [selectedRole, setSelectedRole]);

//   const handleCheckboxChange = () => {
//     setAgreed(!agreed);
//   };

//   const handleSubmit = (e) => {
//     // Prevent default form submission behavior
//     if (e) e.preventDefault();

//     // Store current state before doing anything
//     const storedRole = localStorage.getItem('selectedRole') || roleBackup;
//     const storedFormData = localStorage.getItem('formData');

//     // Call the onSubmit prop if it exists
//     if (onSubmit) {
//       onSubmit();
//     }

//     // Ensure the role still exists in localStorage - restore if needed
//     if (!localStorage.getItem('selectedRole') && storedRole) {
//       localStorage.setItem('selectedRole', storedRole);
//       // Also update context
//       setSelectedRole(storedRole);
//     }

//     // Ensure form data still exists - restore if needed
//     if (!localStorage.getItem('formData') && storedFormData) {
//       localStorage.setItem('formData', storedFormData);
//     }

//     // Short timeout to ensure localStorage updates before navigation
//     setTimeout(() => {
//       // Set the role one more time right before navigating
//       if (storedRole) {
//         localStorage.setItem('selectedRole', storedRole);
//       }
//       navigate('/welcome', { replace: false });
//     }, 10);
//   };

//   return (
//     <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[1144px] my-auto pb-6 max-md:max-w-full">
//       <div className="flex min-h-6 w-full items-stretch gap-[15px] justify-center flex-wrap mt-5 max-md:max-w-full">
//         <div className="flex items-center gap-2.5 justify-center h-full w-6">
//           <input
//             type="checkbox"
//             id="terms"
//             checked={agreed}
//             onChange={handleCheckboxChange}
//             className="w-6 h-6 cursor-pointer"
//           />
//         </div>
//         <label
//           htmlFor="terms"
//           className="self-stretch min-w-60 min-h-6 gap-2.5 text-base text-black font-normal text-center my-auto cursor-pointer"
//         >
//           I agree to the Terms & Conditions and Privacy Policy.
//         </label>
//       </div>
//       {/* Show current role if available (for debugging) */}
//       {(selectedRole || roleBackup) && (
//         <div className="text-center mt-2">
//           <p>Profile type: <strong>{selectedRole || roleBackup}</strong></p>
//         </div>
//       )}
//       <div className="self-center flex items-center gap-4 text-base font-normal mt-6">
//         <div className="self-stretch flex min-w-60 gap-4 my-auto">
//           <button
//             onClick={onCancel}
//             className="self-stretch gap-2 border rounded-md text-black whitespace-nowrap px-6 py-3 max-md:px-5 cursor-pointer"
//             type="button"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!agreed}
//             className={`self-stretch gap-2 text-white px-6 border rounded-md py-3 max-md:px-5 cursor-pointer ${
//               agreed ? "bg-black" : "bg-gray-400"
//             }`}
//             type="button"
//           >
//             Get Started
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };





import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext/RoleContext";
import axios from 'axios'; // Import Axios

export const Confirmation = ({ onSubmit, onCancel }) => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { selectedRole, setSelectedRole, formData, clearData } = useRole();

  // Role backup logic (kept for robustness, as per your context)
  const [roleBackup, setRoleBackup] = useState(null);
  useEffect(() => {
    if (selectedRole) {
      setRoleBackup(selectedRole);
    } else {
      const storedRole = localStorage.getItem('selectedRole');
      if (storedRole) {
        setRoleBackup(storedRole);
        setSelectedRole(storedRole);
      }
    }
  }, [selectedRole, setSelectedRole]);

  const handleCheckboxChange = () => {
    setAgreed(!agreed);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!agreed) {
      alert("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    const dataToSend = new FormData();
    const tempFormData = { ...formData };
    delete tempFormData.profileType;

    for (const key in tempFormData) {
      const value = tempFormData[key];
      if (Array.isArray(value)) {
        if (['skills', 'industry', 'jobRoles', 'locations'].includes(key)) {
          dataToSend.append(key, value.join(','));
        } else if (key === 'experiences') {
          dataToSend.append(key, JSON.stringify(value));
        } else {
          dataToSend.append(key, JSON.stringify(value));
        }
      } else if (value instanceof File) {
        dataToSend.append(key, value);
      } else if (value !== null && value !== undefined) {
        dataToSend.append(key, value.toString());
      }
    }

    if (selectedRole) {
      dataToSend.append('profileType', selectedRole);
    } else {
      console.warn("selectedRole is null, but profileType is a required field. This might cause a schema validation error.");
      alert("Profile type not selected. Please go back and select a profile type.");
      return; // Prevent submission if role is missing
    }

    console.log("Submitting FormData to backend via Axios. Inspect network tab for payload details.");


    console.log("Submitting FormData to backend via Axios. Inspect network tab for payload details.");

    try {
      const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/onboarding`, dataToSend, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      console.log("Response from backend:", response.data);
      // Clear form data and role context after successful submission                 
      // if (onSubmit) {
      //   onSubmit();
      // }
      alert('Candidate profile created successfully!');

      const userTypeFromDb = response.data.profileType || response.data.userType;

      // Clear form data and role context AFTER successful submission and before navigation
      // clearData();
      // localStorage.removeItem('selectedRole');

      if (userTypeFromDb) {
        const lowerCaseUserType = userTypeFromDb.toLowerCase(); // Store for clarity
        console.log("User type from backend (original):", userTypeFromDb);
        console.log("User type for switch (lowercase):", lowerCaseUserType); // Debugging step

        switch (lowerCaseUserType) {
          case 'professional':
            navigate('/profhome', { replace: true });
            break;
          case 'fresher':
            navigate('/fresherhome', { replace: true });
            break;
          case 'student': // Ensure this matches exactly "student"
            navigate('/home', { replace: true });
            break;
          // Add more cases if you have other specific routes
          // case 'employer':
          //   navigate('/employerhome', { replace: true });
          //   break;
          default:
            // This 'default' will catch anything not explicitly handled above
            console.warn(`Unknown user type "${userTypeFromDb}" (lowercase: "${lowerCaseUserType}"). Navigating to general home.`);
            navigate('/home', { replace: true });
            break;
        }
      } else {
        console.warn("User type not found in backend response. Navigating to general home as fallback.");
        navigate('/home', { replace: true });
      }
      // clearData(); // Clear all form data and role from context and localStorage
      // localStorage.removeItem('selectedRole'); // Clear role from localStorage
      //navigate('/home', { replace: true });
    } catch (error) {
      console.error("Network or backend submission error:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        alert(`Submission failed: ${error.response.data.message || error.response.data.error || 'An unknown error occurred.'}`);
      } else if (error.request) {
        console.error("Error Request (No response received):", error.request);
        alert("Network error: No response from server. Please check your connection or server status.");
      } else {
        console.error("Error Message:", error.message);
        alert(`An error occurred: ${error.message}`);
      }
    }
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
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!agreed}
            className={`self-stretch gap-2 text-white px-6 border rounded-md py-3 max-md:px-5 cursor-pointer ${agreed ? "bg-black" : "bg-gray-400"
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