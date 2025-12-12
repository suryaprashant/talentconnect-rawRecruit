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

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg my-8">
          <h1 className="text-2xl font-bold mb-6">
            Placement Coordinator Details
          </h1>
          <p className="mb-6">
            Tell us who will be managing campus recruitment.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">
                Enter your name *
              </label>
              <input
                type="text"
                name="coordinatorName"
                value={formData.coordinatorName || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.coordinatorName ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.coordinatorName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coordinatorName}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Designation *</label>
              <select
                name="designation"
                value={formData.designation || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.designation ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select Designation</option>
                {designations.map((designation, index) => (
                  <option key={index} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
              {errors.designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.designation}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Official email *</label>
              <input
                type="email"
                name="officialEmail"
                value={formData.officialEmail || ""}
                onChange={handleChange}
                placeholder="hello@xyz.com"
                className={`w-full p-2 border rounded-md ${
                  errors.officialEmail ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.officialEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.officialEmail}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">
                Official Phone no. *
              </label>
              <input
                type="tel"
                name="officialMobile"
                value={formData.officialMobile || ""}
                onChange={handleChange}
                placeholder="9876543210"
                className={`w-full p-2 border rounded-md ${
                  errors.officialMobile ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.officialMobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.officialMobile}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">LinkedIn Profile</label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="linkedinProfile"
                  value={formData.linkedinProfile || ""}
                  onChange={handleChange}
                  placeholder="www.linkedin.com/in/username"
                  className={`w-full p-2 border rounded-md ${
                    errors.linkedinProfile
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {errors.linkedinProfile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.linkedinProfile}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-10 mt-8">
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-md"
            >
              Cancel
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
              className="px-6 py-2 bg-black text-white rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}