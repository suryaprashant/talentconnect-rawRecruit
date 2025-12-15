// import { useState } from "react";

// // pages/CoordinatorDetails.jsx
// const isValidLinkedIn = (url) => {
//   const pattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_]+\/?$/;
//   return pattern.test(url.trim());
// };

// const isValidPhone = (phone) => {
//   const pattern = /^\+?\d{1,3}?[ -]?\d{10,14}$/;
//   return pattern.test(phone.trim());
// };

// export default function CoordinatorDetails({
//   formData,
//   updateFormData,
//   nextStep,
//   prevStep,
// }) {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     updateFormData(name, value);
//   };
//   const [errors, setErrors] = useState({});

//   // Designation options
//   const designations = [
//     "Placement Officer",
//     "Training and Placement Officer",
//     "Placement Coordinator",
//     "Career Services Director",
//     "Head of Placements",
//     "Placement Manager",
//     "Student Placement Coordinator",
//     "Industry Liaison Officer",
//     "Corporate Relations Manager",
//     "Career Development Officer",
//     "Head of Department",
//     "Professor",
//     "Associate Professor",
//     "Assistant Professor",
//     "Dean of Student Affairs",
//   ];

//   return (
//     <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg my-8">
//           <h1 className="text-2xl font-bold mb-6">
//             Placement Coordinator Details
//           </h1>
//           <p className="mb-6">
//             Tell us who will be managing campus recruitment.
//           </p>

//           <div className="space-y-6">
//             <div>
//               <label className="block font-medium mb-1">
//                 Enter your name *
//               </label>
//               <input
//                 type="text"
//                 name="coordinatorName"
//                 value={formData.coordinatorName || ""}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">Designation *</label>
//               <select
//                 name="designation"
//                 value={formData.designation || ""}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 required
//               >
//                 <option value="">Select Designation</option>
//                 {designations.map((designation, index) => (
//                   <option key={index} value={designation}>
//                     {designation}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block font-medium mb-1">Official email *</label>
//               <input
//                 type="email"
//                 name="officialEmail"
//                 value={formData.officialEmail || ""}
//                 onChange={handleChange}
//                 placeholder="hello@xyz.com"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">
//                 Official Phone no. *
//               </label>
//               <input
//                 type="tel"
//                 name="officialMobile"
//                 value={formData.officialMobile || ""}
//                 onChange={handleChange}
//                 placeholder="1234567890"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 required
//               />
//               {errors.officialMobile && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.officialMobile}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block font-medium mb-1">LinkedIn Profile</label>
//               <div className="flex items-center">
//                 <span className="p-2 border border-gray-300 rounded-l-md bg-gray-100">
//                   http://
//                 </span>
//                 <input
//                   type="text"
//                   name="linkedinProfile"
//                   value={formData.linkedinProfile || ""}
//                   onChange={handleChange}
//                   placeholder="www.linkedin.com/in/username"
//                   className="flex-1 p-2 border-t border-b border-r border-gray-300 rounded-r-md"
//                 />
//                 {errors.linkedinProfile && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.linkedinProfile}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end gap-10 mt-8">
//             <button
//               onClick={prevStep}
//               className="px-6 py-2 border border-gray-300 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => {
//                 const newErrors = {};

//                 // Validate LinkedIn (only if user entered something)
//                 if (formData.linkedinProfile) {
//                   const fullUrl = "http://" + formData.linkedinProfile;
//                   if (!isValidLinkedIn(fullUrl)) {
//                     newErrors.linkedinProfile =
//                       "Enter a valid LinkedIn URL (linkedin.com/in/username)";
//                   }
//                 }

//                 // Validate Phone
//                 if (!isValidPhone(formData.officialMobile || "")) {
//                   newErrors.officialMobile =
//                     "Enter a valid phone number (may include country code)";
//                 }

//                 if (Object.keys(newErrors).length > 0) {
//                   setErrors(newErrors);
//                   return;
//                 }

//                 nextStep();
//               }}
//               className="px-6 py-2 bg-black text-white rounded-md"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";

// pages/CoordinatorDetails.jsx
const isValidLinkedIn = (url) => {
  const pattern = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_]+\/?$/;
  return pattern.test(url.trim());
};

const isValidPhone = (phone) => {
  // Checks for exactly 10 digits
  const pattern = /^\d{10}$/;
  return pattern.test(phone.trim());
};

export default function CoordinatorDetails({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  const [errors, setErrors] = useState({});

  // Designation options
  const designations = [
    "Placement Officer",
    "Training and Placement Officer",
    "Placement Coordinator",
    "Career Services Director",
    "Head of Placements",
    "Placement Manager",
    "Student Placement Coordinator",
    "Industry Liaison Officer",
    "Corporate Relations Manager",
    "Career Development Officer",
    "Head of Department",
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Dean of Student Affairs",
  ];

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7] via-[#d4e8f9] to-[#cff7ea]">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Card with blur border effect */}
        <div className="relative w-full max-w-4xl">
          {/* Blur border */}
          <div className="absolute -inset-6 bg-gradient-to-br from-[#fbcfe8]/20 via-[#93c5fd]/20 to-[#a7f3d0]/20 rounded-4xl blur-2xl -z-10"></div>
          
          {/* Optional corner accent blurs */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#fbcfe8]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#93c5fd]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c7d2fe]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#a7f3d0]/30 rounded-full blur-3xl -z-10"></div>
          
          {/* Main Card */}
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/70 rounded-3xl shadow-xl shadow-blue-50/50 p-10">

            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-6">
              Placement Coordinator Details
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Tell us who will be managing campus recruitment.
            </p>

            <div className="space-y-8">
              {/* Coordinator Name */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  Enter your name *
                </label>
                <input
                  type="text"
                  name="coordinatorName"
                  value={formData.coordinatorName || ""}
                  onChange={handleChange}
                  className={`w-full p-4 bg-white/70 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg ${
                    errors.coordinatorName 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-gray-200/80'
                  }`}
                  required
                />
                {errors.coordinatorName && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.coordinatorName}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  Designation *
                </label>
                <select
                  name="designation"
                  value={formData.designation || ""}
                  onChange={handleChange}
                  className={`w-full p-4 bg-white/70 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg ${
                    errors.designation 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-gray-200/80'
                  }`}
                  required
                >
                  <option value="" className="text-gray-400 text-lg">Select Designation</option>
                  {designations.map((designation, index) => (
                    <option key={index} value={designation} className="text-lg">
                      {designation}
                    </option>
                  ))}
                </select>
                {errors.designation && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.designation}
                  </p>
                )}
              </div>

              {/* Official Email */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  Official email *
                </label>
                <input
                  type="email"
                  name="officialEmail"
                  value={formData.officialEmail || ""}
                  onChange={handleChange}
                  placeholder="hello@xyz.com"
                  className={`w-full p-4 bg-white/70 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg ${
                    errors.officialEmail 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-gray-200/80'
                  }`}
                  required
                />
                {errors.officialEmail && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.officialEmail}
                  </p>
                )}
              </div>

              {/* Official Phone */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  Official Phone no. *
                </label>
                <input
                  type="tel"
                  name="officialMobile"
                  value={formData.officialMobile || ""}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`w-full p-4 bg-white/70 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg ${
                    errors.officialMobile 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-gray-200/80'
                  }`}
                  required
                />
                {errors.officialMobile && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.officialMobile}
                  </p>
                )}
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  name="linkedinProfile"
                  value={formData.linkedinProfile || ""}
                  onChange={handleChange}
                  placeholder="www.linkedin.com/in/username"
                  className={`w-full p-4 bg-white/70 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg ${
                    errors.linkedinProfile 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-gray-200/80'
                  }`}
                />
                {errors.linkedinProfile && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.linkedinProfile}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 mt-12">
              <button
                onClick={prevStep}
                className="px-10 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl hover:bg-white/90 hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-lg"
              >
                Back
              </button>
              <button
                onClick={() => {
                  const newErrors = {};

                  // Validate Required Fields
                  if (!formData.coordinatorName?.trim()) {
                    newErrors.coordinatorName = "Name is required";
                  }

                  if (!formData.designation?.trim()) {
                    newErrors.designation = "Designation is required";
                  }

                  if (!formData.officialEmail?.trim()) {
                    newErrors.officialEmail = "Email is required";
                  }

                  // Validate Phone
                  if (!formData.officialMobile?.trim()) {
                    newErrors.officialMobile = "Phone number is required";
                  } else if (!isValidPhone(formData.officialMobile)) {
                    newErrors.officialMobile = "Enter a valid 10-digit phone number";
                  }

                  // Validate LinkedIn (only if user entered something)
                  if (formData.linkedinProfile?.trim()) {
                    if (!isValidLinkedIn(formData.linkedinProfile)) {
                      newErrors.linkedinProfile =
                        "Enter a valid LinkedIn URL (e.g. linkedin.com/in/username)";
                    }
                  }

                  if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                  }

                  nextStep();
                }}
                className="px-10 py-4 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 font-medium text-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}