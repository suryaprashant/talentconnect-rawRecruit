

// import React from "react";
// import { ProgressIndicator } from "../ProgressIndicator";
// import { MailIcon, PhoneIcon, ChevronDownIcon } from "lucide-react";


// export const StepTwo = ({ onNext, onCancel, onProfileTypeSelect, formData, onChange }) => {
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onChange({ ...formData, [name]: value }); 
//   };

//   const handleProfileTypeChange = (e) => {
//     const selectedProfileType = e.target.value;
//     onChange({ ...formData, profileType: selectedProfileType }); // Update parent's
//     if (onProfileTypeSelect) {
//       onProfileTypeSelect(selectedProfileType);
//     }
//   };

//   const handleNextClick = () => {
//     if (!formData.email || !formData.phone || !formData.profileType) {
//       alert("Please fill in all required fields: Email, Phone, and Profile Type.");
//       return;
//     }
//     onNext();
//   };

//   return (
//     <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
//       <ProgressIndicator currentStep={2} totalSteps={5} />

//       <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
//         <div className="w-full text-black max-md:max-w-full">
//           <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
//             Basic Information
//           </h2>
//           <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
//             This information will be visible to recruiters.
//           </p>
//         </div>

//         {/* Your Name Input */}
//         <div className="w-full mt-6 max-md:max-w-full">
//           <label htmlFor="name" className="text-black max-md:max-w-full block">
//             Your Name
//           </label>
//           <div className="flex items-center min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded">
//             <input
//               type="text"
//               id="name"
//               name="name"
//               placeholder="Your Name"
//               className="w-full bg-transparent border-none focus:outline-none"
//               value={formData.name || ""} // Controlled component
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* Email ID Input */}
//         <div className="w-full mt-6 max-md:max-w-full">
//           <label htmlFor="email" className="text-black max-md:max-w-full block">
//             Email ID <span className="text-red-500">*</span>
//           </label>
//           <div className="flex items-center min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded">
//             <MailIcon className="self-stretch w-6 shrink-0 h-6 my-auto" />
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="name@email.com"
//               className="w-full bg-transparent border-none focus:outline-none"
//               value={formData.email || ""} // Controlled component
//               onChange={handleChange}
//               required 
//             />
//           </div>
//         </div>

//         {/* Phone Number Input */}
//         <div className="w-full mt-6 max-md:max-w-full">
//           <label htmlFor="phone" className="text-black max-md:max-w-full block">
//             Phone Number <span className="text-red-500">*</span>
//           </label>
//           <div className="flex items-center min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded">
//             <PhoneIcon className="self-stretch w-6 shrink-0 h-6 my-auto" />
//             <input
//               type="tel" // Use type="tel" for phone numbers
//               id="phone"
//               name="phone"
//               placeholder="e.g. +91 9876543210"
//               className="w-full bg-transparent border-none focus:outline-none"
//               value={formData.phone || ""} // Controlled component
//               onChange={handleChange}
//               required // HTML5 validation for frontend feedback
//             />
//           </div>
//         </div>

//         {/* Profile Type Select */}
//         <div className="w-full mt-6 max-md:max-w-full relative">
//           <label htmlFor="profileType" className="text-black max-md:max-w-full block">
//             Profile Type <span className="text-red-500">*</span>
//           </label>
//           <div className="relative">
//             <select
//               id="profileType"
//               name="profileType"
//               value={formData.profileType || ""} // Controlled component
//               onChange={handleProfileTypeChange}
//               required // HTML5 validation for frontend feedback
//               className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded"
//             >
//               <option value="" disabled>
//                 Select
//               </option>

//               <option value="student">student</option>
//               <option value="fresher">fresher</option>
//               <option value="professional">professional</option>
//             </select>
//             <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
//           </div>
//         </div>

       
//         <div className="flex min-h-12 w-full gap-2.5 whitespace-nowrap mt-6 max-md:max-w-full">
//           <div className="flex gap-4">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="self-stretch gap-2 text-black px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleNextClick}
//               className="self-stretch bg-black gap-2 text-white px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
             
//               disabled={!formData.email || !formData.phone || !formData.profileType}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// src/components/Onboarding/FormSteps/StepTwo.js
import React from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { MailIcon, PhoneIcon, ChevronDownIcon } from "lucide-react";

export const StepTwo = ({ onNext, onBack, onProfileTypeSelect, formData, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  // ✅ FIX: This handler now updates both the selected role (for logic)
  // and the formData (for persistence) immediately on change.
  const handleProfileTypeChange = (e) => {
    const selectedProfileType = e.target.value;
    onProfileTypeSelect(selectedProfileType); // This updates the `selectedRole` in the context.
    onChange({ profileType: selectedProfileType }); // This updates the `formData` in the context.
  };

  const handleNextClick = () => {
    if (!formData.email || !formData.phone || !formData.profileType) {
      alert("Please fill in all required fields: Email, Phone, and Profile Type.");
      return;
    }
    onNext();
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={2} totalSteps={5} />
      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <h2 className="text-[32px] font-bold leading-[42px]">Basic Information</h2>
        <p className="text-base font-normal leading-6 mt-2">This information will be visible to recruiters.</p>

        {/* Name, Email, Phone Inputs (No changes needed here) */}
        <div className="w-full mt-6">
          <label htmlFor="name" className="block text-black">Your Name</label>
          <div className="flex items-center min-h-12 w-full mt-2 p-3 border rounded">
            <input type="text" id="name" name="name" placeholder="Your Name" className="w-full bg-transparent border-none focus:outline-none" value={formData.name || ""} onChange={handleChange}/>
          </div>
        </div>
        <div className="w-full mt-6">
          <label htmlFor="email" className="block text-black">Email ID <span className="text-red-500">*</span></label>
          <div className="flex items-center min-h-12 w-full mt-2 p-3 border rounded">
            <MailIcon className="w-6 h-6" />
            <input type="email" id="email" name="email" placeholder="name@email.com" className="w-full bg-transparent border-none focus:outline-none ml-2" value={formData.email || ""} onChange={handleChange} required/>
          </div>
        </div>
        <div className="w-full mt-6">
          <label htmlFor="phone" className="block text-black">Phone Number <span className="text-red-500">*</span></label>
          <div className="flex items-center min-h-12 w-full mt-2 p-3 border rounded">
            <PhoneIcon className="w-6 h-6" />
            <input type="tel" id="phone" name="phone" placeholder="e.g. +91 9876543210" className="w-full bg-transparent border-none focus:outline-none ml-2" value={formData.phone || ""} onChange={handleChange} required/>
          </div>
        </div>

        {/* Profile Type Select */}
        <div className="w-full mt-6 relative">
          <label htmlFor="profileType" className="block text-black">
            Profile Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="profileType"
              name="profileType"
              value={formData.profileType || ""} 
              onChange={handleProfileTypeChange}
              required
              className="items-center appearance-none flex min-h-12 w-full mt-2 p-3 border rounded"
            >
              <option value="" disabled>Select a profile type</option>
              <option value="student">Student</option>
              <option value="fresher">Fresher</option>
              <option value="professional">Professional</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex min-h-12 w-full gap-4 mt-6">
          <button type="button" onClick={onBack} className="text-black px-6 py-3 border rounded-md">Back</button>
          <button
            type="button"
            onClick={handleNextClick}
            className="bg-black text-white px-6 py-3 border rounded-md"
            disabled={!formData.email || !formData.phone || !formData.profileType}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};