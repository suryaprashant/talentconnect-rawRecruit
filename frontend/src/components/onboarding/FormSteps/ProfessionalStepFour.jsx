// import React, { useState, useEffect, useRef } from "react";
// import { ProgressIndicator } from "../ProgressIndicator";
// import { ChevronDownIcon, UploadIcon, XIcon, CalendarIcon } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";


// const industryOptions = [
//   { value: "technology", label: "Technology" },
//   { value: "finance", label: "Finance" },
//   { value: "healthcare", label: "Healthcare" },
//   { value: "education", label: "Education" },
//   { value: "manufacturing", label: "Manufacturing" },
//   { value: "consulting", label: "Consulting" },
//   { value: "retail", label: "Retail" },
// ];

// const jobRoleOptions = [
//   { value: "developer", label: "Software Developer" },
//   { value: "designer", label: "UI/UX Designer" },
//   { value: "manager", label: "Project Manager" },
//   { value: "analyst", label: "Data Analyst" },
//   { value: "marketing", label: "Marketing Specialist" },
//   { value: "engineer", label: "Software Engineer" },
//   { value: "architect", label: "Solution Architect" },
//   { value: "executive", label: "Executive" },
// ];

// const locationOptions = [
//   { value: "bangalore", label: "Bangalore" },
//   { value: "mumbai", label: "Mumbai" },
//   { value: "delhi", label: "Delhi" },
//   { value: "hyderabad", label: "Hyderabad" },
//   { value: "pune", label: "Pune" },
//   { value: "remote", label: "Remote" },
//   { value: "chennai", label: "Chennai" },
//   { value: "kolkata", label: "Kolkata" },
// ];

// // --- Reusable Custom Multi-Select Dropdown Component ---
// const CustomMultiSelectDropdown = ({
//   options,
//   label,
//   selectedValues,
//   onSelectionChange,
//   placeholder = "Multiple-select",
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const handleToggle = () => setIsOpen(!isOpen);

//   // Close dropdown on click outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const getLabelForValue = (value) => {
//     const option = options.find((opt) => opt.value === value);
//     return option ? option.label : value;
//   };
  
//   return (
//     <div className="relative" ref={dropdownRef}>
//       <label className="block text-black max-md:max-w-full">{label}</label>
//       <div
//         className="relative flex items-center min-h-12 w-full mt-2 p-3 border border-gray-300 rounded cursor-pointer"
//         onClick={handleToggle}
//       >
//         <div className="flex flex-wrap gap-2 flex-1">
//           {selectedValues.length === 0 ? (
//             <span className="text-[#666]">{placeholder}</span>
//           ) : (
//             selectedValues.map((value) => (
//               <span
//                 key={value}
//                 className="flex items-center gap-1 bg-gray-200 text-black text-sm rounded-md px-2 py-1"
//               >
//                 {getLabelForValue(value)}
//                 <XIcon
//                   className="w-3 h-3 cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent dropdown from toggling
//                     onSelectionChange(value);
//                   }}
//                 />
//               </span>
//             ))
//           )}
//         </div>
//         <ChevronDownIcon
//           className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-transform ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </div>

//       {isOpen && (
//         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//           <ul>
//             {options.map((option) => (
//               <li
//                 key={option.value}
//                 className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => {
//                   onSelectionChange(option.value);
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedValues.includes(option.value)}
//                   readOnly
//                   className="mr-2"
//                 />
//                 {option.label}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };


// const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
//   <div className="relative flex items-center">
//     <input
//       type="text"
//       className="flex min-h-12 w-full p-3 border border-gray-300 rounded text-[#666]"
//       value={value}
//       onClick={onClick}
//       onChange={() => {}}
//       placeholder={placeholder}
//       readOnly
//       ref={ref}
//     />
//     <CalendarIcon className="absolute right-3 w-5 h-5 text-gray-500" />
//   </div>
// ));

// // --- Main ProfessionalStepFour Component ---
// export const ProfessionalStepFour = ({ onNext, onBack, formData, onChange }) => {
//   const [localFormData, setLocalFormData] = useState({
//     industryType: formData?.industryType || [],
//     jobRoles: formData?.jobRoles || [],
//     locations: formData?.locations || [],
//     currentSalaryAmount: formData?.currentSalaryAmount || "",
//     currentSalaryCurrency: formData?.currentSalaryCurrency || "USD",
//     expectedSalaryAmount: formData?.expectedSalaryAmount || "",
//     expectedSalaryCurrency: formData?.expectedSalaryCurrency || "USD",
//     employmentType: formData?.employmentType || "full-time",
//     experiences: formData?.experiences || [
//       {
//         company: "",
//         jobRole: "",
//         startDate: "",
//         endDate: "",
//         description: "",
//         certificate: null,
//       },
//     ],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleMultiSelectChange = (field, value) => {
//     setLocalFormData((prev) => {
//       const currentSelection = prev[field] || [];
//       const newSelection = currentSelection.includes(value)
//         ? currentSelection.filter((item) => item !== value) // Deselect
//         : [...currentSelection, value]; // Select
//       return { ...prev, [field]: newSelection };
//     });
//   };

//   const handleRadioChange = (field, value) => {
//     setLocalFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleExperienceChange = (index, field, value) => {
//     const updatedExperiences = [...localFormData.workExperiences];
//     updatedExperiences[index] = {
//       ...updatedExperiences[index],
//       [field]: value,
//     };
//     setLocalFormData((prev) => ({
//       ...prev,
//       workExperiences: updatedExperiences,
//     }));
//   };

//   const handleDateChange = (index, field, date) => {
//     const formattedDate = date ? date.toISOString().split('T')[0] : "";
//     handleExperienceChange(index, field, formattedDate);
//   };

//   const handleFileChange = (index, e) => {
//     if (e.target.files && e.target.files[0]) {
//       handleExperienceChange(index, "certificate", e.target.files[0]);
//     }
//   };

//   const handleAddExperience = () => {
//     setLocalFormData((prev) => ({
//       ...prev,
//       workExperiences: [
//         ...prev.workExperiences,
//         {
//           company: "",
//           jobRole: "",
//           startDate: "",
//           endDate: "",
//           description: "",
//           certificate: null,
//         },
//       ],
//     }));
//   };

//   const handleRemoveExperience = (index) => {
//     if (localFormData.workExperiences.length > 1) {
//       const updatedExperiences = [...localFormData.workExperiences];
//       updatedExperiences.splice(index, 1);
//       setLocalFormData((prev) => ({
//         ...prev,
//         workExperiences: updatedExperiences,
//       }));
//     }
//   };

//   const handleNext = () => {
//     onChange({ ...formData, ...localFormData });
//     onNext();
//   };

//   return (
//     <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
//       <ProgressIndicator currentStep={4} totalSteps={5} />

//       <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
//         <div className="w-full text-black max-md:max-w-full">
//           <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
//             Awesome! Let's define your career goals and skills!
//           </h2>
//           <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
//             Let us know your job interests, experience, and preferred locations
//             so we can recommend the best opportunities for you.
//           </p>
//         </div>

//         <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
//           <div className="w-full max-md:max-w-full">
//              <CustomMultiSelectDropdown
//                 label="Interested Industry Type"
//                 options={industryOptions}
//                 selectedValues={localFormData.industryType}
//                 onSelectionChange={(value) => handleMultiSelectChange("industryType", value)}
//             />
//           </div>

//           <div className="w-full mt-6 max-md:max-w-full">
//             <CustomMultiSelectDropdown
//                 label="Interested Job Roles"
//                 options={jobRoleOptions}
//                 selectedValues={localFormData.jobRoles}
//                 onSelectionChange={(value) => handleMultiSelectChange("jobRoles", value)}
//             />
//           </div>

//           <div className="w-full mt-6 max-md:max-w-full">
//             <CustomMultiSelectDropdown
//                 label="Preferred Job Locations"
//                 options={locationOptions}
//                 selectedValues={localFormData.locations}
//                 onSelectionChange={(value) => handleMultiSelectChange("locations", value)}
//             />
//           </div>
          
//           {/* Current Salary */}
//           <div className="w-full mt-6 max-md:max-w-full">
//             <label
//               htmlFor="currentSalary"
//               className="block text-black max-md:max-w-full"
//             >
//               Current Salary
//             </label>
//             <div className="flex items-center gap-2 mt-2">
//               <div className="relative w-24">
//                 <select
//                   id="currentSalaryCurrency"
//                   name="currentSalaryCurrency"
//                   value={localFormData.currentSalaryCurrency}
//                   onChange={handleChange}
//                   className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
//                 >
//                   <option value="USD">USD</option>
//                   <option value="INR">INR</option>
//                   <option value="EUR">EUR</option>
//                   <option value="GBP">GBP</option>
//                 </select>
//                 <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
//               </div>
//               <div className="flex-1">
//                 <input
//                   id="currentSalaryAmount"
//                   name="currentSalaryAmount"
//                   type="text"
//                   value={localFormData.currentSalaryAmount}
//                   onChange={handleChange}
//                   placeholder="Enter current salary"
//                   className="w-full min-h-12 p-3 border border-gray-300 rounded"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Expected Salary */}
//           <div className="w-full mt-6 max-md:max-w-full">
//             <label
//               htmlFor="expectedSalary"
//               className="block text-black max-md:max-w-full"
//             >
//               Expected Salary
//             </label>
//             <div className="flex items-center gap-2 mt-2">
//               <div className="relative w-24">
//                 <select
//                   id="expectedSalaryCurrency"
//                   name="expectedSalaryCurrency"
//                   value={localFormData.expectedSalaryCurrency}
//                   onChange={handleChange}
//                   className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
//                 >
//                   <option value="USD">USD</option>
//                   <option value="INR">INR</option>
//                   <option value="EUR">EUR</option>
//                   <option value="GBP">GBP</option>
//                 </select>
//                 <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
//               </div>
//               <div className="flex-1">
//                 <input
//                   id="expectedSalaryAmount"
//                   name="expectedSalaryAmount"
//                   type="text"
//                   value={localFormData.expectedSalaryAmount}
//                   onChange={handleChange}
//                   placeholder="Enter expected salary"
//                   className="w-full min-h-12 p-3 border border-gray-300 rounded"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="w-full mt-6 max-md:max-w-full">
//             <label className="block text-black max-md:max-w-full">
//               Employment type
//             </label>
//             <div className="flex w-full gap-4 text-black whitespace-nowrap flex-wrap mt-2 max-md:max-w-full">
//               <button
//                 type="button"
//                 className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
//                   localFormData.employmentType === "part time"
//                     ? "bg-black text-white"
//                     : "bg-white text-black"
//                 }`}
//                 onClick={() => handleRadioChange("employmentType", "part time")}
//               >
//                 Part-time
//               </button>
//               <button
//                 type="button"
//                 className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
//                   localFormData.employmentType === "full time"
//                     ? "bg-black text-white"
//                     : "bg-white text-black"
//                 }`}
//                 onClick={() => handleRadioChange("employmentType", "full time")}
//               >
//                 Full-time
//               </button>
//               <button
//                 type="button"
//                 className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
//                   localFormData.employmentType === "contract"
//                     ? "bg-black text-white"
//                     : "bg-white text-black"
//                 }`}
//                 onClick={() => handleRadioChange("employmentType", "contract")}
//               >
//                 Contract
//               </button>
//             </div>
//           </div>

//           {/* Work Experience Section */}
//           <div className="w-full mt-8 max-md:max-w-full">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-black">
//                 Work Experience
//               </h3>
//             </div>

//             {localFormData.workExperiences.map((experience, index) => (
//               <div
//                 key={index}
//                 className="mt-6 p-4 border border-gray-200 rounded-md"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h4 className="font-medium">Experience {index + 1}</h4>
//                   {localFormData.workExperiences.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveExperience(index)}
//                       className="text-red-500 text-sm"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>

//                 {/* Company */}
//                 <div className="mb-4">
//                   <label className="block text-black mb-1">Company</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={experiences.company}
//                       onChange={(e) =>
//                         handleExperienceChange(index, "company", e.target.value)
//                       }
//                       className="flex min-h-12 w-full p-3 border border-gray-300 rounded"
//                       placeholder="Enter company name"
//                     />
//                   </div>
//                 </div>

//                 {/* Job Role */}
//                 <div className="mb-4">
//                   <label className="block text-black mb-1">Job Role</label>
//                    <div className="relative">
//                     <input
//                       type="text"
//                       value={experiences.jobRole}
//                       onChange={(e) =>
//                         handleExperienceChange(index, "jobRole", e.target.value)
//                       }
//                       className="flex min-h-12 w-full p-3 border border-gray-300 rounded"
//                       placeholder="Enter job role"
//                     />
//                   </div>
//                 </div>

//                 {/* Date Range */}
//                 <div className="flex gap-4 mb-4">
//                   <div className="flex-1">
//                     <label className="block text-black mb-1">Start Date</label>
//                     <DatePicker
//                       selected={experiences.startDate ? new Date(experiences.startDate) : null}
//                       onChange={(date) => handleDateChange(index, "startDate", date)}
//                       dateFormat="MM/yyyy"
//                       showMonthYearPicker
//                       customInput={<CustomDateInput placeholder="Select start date" />}
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <label className="block text-black mb-1">End Date</label>
//                     <DatePicker
//                       selected={experiences.endDate ? new Date(experiences.endDate) : null}
//                       onChange={(date) => handleDateChange(index, "endDate", date)}
//                       dateFormat="MM/yyyy"
//                       showMonthYearPicker
//                       customInput={<CustomDateInput placeholder="Select end date" />}
//                       minDate={experiences.startDate ? new Date(experiences.startDate) : null}
//                     />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="mb-4">
//                   <label className="block text-black mb-1">Description</label>
//                   <textarea
//                     value={experiences.description}
//                     onChange={(e) =>
//                       handleExperienceChange(
//                         index,
//                         "description",
//                         e.target.value
//                       )
//                     }
//                     className="flex min-h-24 w-full gap-2 text-[#666] p-3 border border-gray-300 rounded"
//                     placeholder="Describe your responsibilities and achievements..."
//                   ></textarea>
//                 </div>

//                 {/* Certificate Upload */}
//                 <div>
//                   <label className="block text-black mb-1">
//                     Experience Certificate (Optional)
//                   </label>
//                   <label className="flex items-center justify-between p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
//                     <span className="text-[#666] truncate">
//                       {experiences.certificate
//                         ? typeof experiences.certificate === "string"
//                           ? experiences.certificate
//                           : experiences.certificate.name
//                         : "Upload Experience Certificate"}
//                     </span>
//                     <UploadIcon className="w-5 h-5 text-gray-500" />
//                     <input
//                       type="file"
//                       accept=".pdf,.jpg,.jpeg,.png"
//                       className="hidden"
//                       onChange={(e) => handleFileChange(index, e)}
//                     />
//                   </label>
//                 </div>
//               </div>
//             ))}

//             {/* Add Experience Button */}
//             <div className="flex justify-end mt-4">
//               <button
//                 type="button"
//                 onClick={handleAddExperience}
//                 className="text-blue-600 cursor-pointer"
//               >
//                 Add experience +
//               </button>
//             </div>
//           </div>

//           <div className="flex min-h-12 w-full gap-2.5 whitespace-nowrap mt-8 max-md:max-w-full">
//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={onBack}
//                 className="self-stretch gap-2 text-black px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
//               >
//                 Back
//               </button>
//               <button
//                 type="button"
//                 onClick={handleNext}
//                 className="self-stretch bg-black gap-2 text-white px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };



import React, { useState, useEffect, useRef } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, UploadIcon, XIcon, CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// --- Data for the dropdowns ---
const industryOptions = [
 { value: "technology", label: "Technology" },
 { value: "finance", label: "Finance" },
 { value: "healthcare", label: "Healthcare" },
 { value: "education", label: "Education" },
 { value: "manufacturing", label: "Manufacturing" },
 { value: "consulting", label: "Consulting" },
 { value: "retail", label: "Retail" },
];

const jobRoleOptions = [
 { value: "developer", label: "Software Developer" },
 { value: "designer", label: "UI/UX Designer" },
 { value: "manager", label: "Project Manager" },
 { value: "analyst", label: "Data Analyst" },
 { value: "marketing", label: "Marketing Specialist" },
 { value: "engineer", label: "Software Engineer" },
 { value: "architect", label: "Solution Architect" },
 { value: "executive", label: "Executive" },
];

const locationOptions = [
 { value: "bangalore", label: "Bangalore" },
 { value: "mumbai", label: "Mumbai" },
 { value: "delhi", label: "Delhi" },
 { value: "hyderabad", label: "Hyderabad" },
 { value: "pune", label: "Pune" },
 { value: "remote", label: "Remote" },
 { value: "chennai", label: "Chennai" },
 { value: "kolkata", label: "Kolkata" },
];

// --- Reusable Custom Components (No changes needed here) ---
const CustomMultiSelectDropdown = ({
 options,
 label,
 selectedValues,
 onSelectionChange,
 placeholder = "Multiple-select",
}) => {
 const [isOpen, setIsOpen] = useState(false);
 const dropdownRef = useRef(null);

 const handleToggle = () => setIsOpen(!isOpen);

 useEffect(() => {
   const handleClickOutside = (event) => {
     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
       setIsOpen(false);
     }
   };
   document.addEventListener("mousedown", handleClickOutside);
   return () => {
     document.removeEventListener("mousedown", handleClickOutside);
   };
 }, []);

 const getLabelForValue = (value) => {
   const option = options.find((opt) => opt.value === value);
   return option ? option.label : value;
 };
 
 return (
   <div className="relative" ref={dropdownRef}>
     <label className="block text-black max-md:max-w-full">{label}</label>
     <div
       className="relative flex items-center min-h-12 w-full mt-2 p-3 border border-gray-300 rounded cursor-pointer"
       onClick={handleToggle}
     >
       <div className="flex flex-wrap gap-2 flex-1">
         {selectedValues.length === 0 ? (
           <span className="text-[#666]">{placeholder}</span>
         ) : (
           selectedValues.map((value) => (
             <span
               key={value}
               className="flex items-center gap-1 bg-gray-200 text-black text-sm rounded-md px-2 py-1"
             >
               {getLabelForValue(value)}
               <XIcon
                 className="w-3 h-3 cursor-pointer"
                 onClick={(e) => {
                   e.stopPropagation();
                   onSelectionChange(value);
                 }}
               />
             </span>
           ))
         )}
       </div>
       <ChevronDownIcon
         className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-transform ${
           isOpen ? "rotate-180" : ""
         }`}
       />
     </div>
     {isOpen && (
       <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
         <ul>
           {options.map((option) => (
             <li
               key={option.value}
               className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
               onClick={() => onSelectionChange(option.value)}
             >
               <input type="checkbox" checked={selectedValues.includes(option.value)} readOnly className="mr-2"/>
               {option.label}
             </li>
           ))}
         </ul>
       </div>
     )}
   </div>
 );
};

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
 <div className="relative flex items-center">
   <input
     type="text"
     className="flex min-h-12 w-full p-3 border border-gray-300 rounded text-[#666]"
     value={value}
     onClick={onClick}
     onChange={() => {}}
     placeholder={placeholder}
     readOnly
     ref={ref}
   />
   <CalendarIcon className="absolute right-3 w-5 h-5 text-gray-500" />
 </div>
));

// --- Main ProfessionalStepFour Component ---
export const ProfessionalStepFour = ({ onNext, onBack, formData, onChange }) => {
  //  Removed local state (`useState`). All data is now read directly from the `formData` prop
  // and all changes are sent to the parent component via the `onChange` prop.

  // Generic handler for simple input fields
  const handleFieldChange = (name, value) => {
    onChange({ ...formData, [name]: value });
  };

  // Handler for custom multi-select components
  const handleMultiSelectChange = (field, value) => {
    const currentSelection = formData[field] || [];
    const newSelection = currentSelection.includes(value)
      ? currentSelection.filter((item) => item !== value)
      : [...currentSelection, value];
    onChange({ ...formData, [field]: newSelection });
  };

  //  Handler now correctly modifies `formData.experiences` array.
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...(formData.experiences || [])];
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
    onChange({ ...formData, experiences: updatedExperiences });
  };
  
  const handleDateChange = (index, field, date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : "";
    handleExperienceChange(index, field, formattedDate);
  };

  const handleFileChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      // The field name is now 'experienceCertificate' to match the schema.
      handleExperienceChange(index, "experienceCertificate", e.target.files[0]);
    }
  };

  const handleAddExperience = () => {
    const newExperiences = [
      ...(formData.experiences || []),
      //  The new experience object has the correct field names: `role` and `experienceCertificate`.
      { company: "", role: "", startDate: "", endDate: "", description: "", experienceCertificate: null },
    ];
    onChange({ ...formData, experiences: newExperiences });
  };

  const handleRemoveExperience = (index) => {
    if (formData.experiences && formData.experiences.length > 1) {
      const updatedExperiences = formData.experiences.filter((_, i) => i !== index);
      onChange({ ...formData, experiences: updatedExperiences });
    }
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={4} totalSteps={5} />
      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        {/* Header Text */}
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Awesome! Let's define your career goals and skills!
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Let us know your job interests, experience, and preferred locations
            so we can recommend the best opportunities for you.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          {/*  Field name is now "industry" to match the schema */}
          <CustomMultiSelectDropdown
            label="Interested Industry Type"
            options={industryOptions}
            selectedValues={formData.industry || []}
            onSelectionChange={(value) => handleMultiSelectChange("industry", value)}
          />

          <div className="w-full mt-6 max-md:max-w-full">
            <CustomMultiSelectDropdown
              label="Interested Job Roles"
              options={jobRoleOptions}
              selectedValues={formData.jobRoles || []}
              onSelectionChange={(value) => handleMultiSelectChange("jobRoles", value)}
            />
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <CustomMultiSelectDropdown
              label="Preferred Job Locations"
              options={locationOptions}
              selectedValues={formData.locations || []}
              onSelectionChange={(value) => handleMultiSelectChange("locations", value)}
            />
          </div>
          
          {/*  Correct field names for Current Salary */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label className="block text-black">Current Salary</label>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative w-24">
                <select name="currentSalaryCurrency" value={formData.currentSalaryCurrency || "INR"} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} className="items-center appearance-none flex min-h-12 w-full p-3 border border-gray-300 rounded">
                  <option value="USD">USD</option><option value="INR">INR</option><option value="EUR">EUR</option><option value="GBP">GBP</option>
                </select>
              </div>
              <div className="flex-1">
                <input name="currentSalaryAmount" type="text" value={formData.currentSalaryAmount || ""} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} placeholder="Enter amount" className="w-full min-h-12 p-3 border border-gray-300 rounded"/>
              </div>
            </div>
          </div>

          {/*  Correct field names for Expected Salary */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label className="block text-black">Expected Salary</label>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative w-24">
                <select name="expectedSalaryCurrency" value={formData.expectedSalaryCurrency || "INR"} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} className="items-center appearance-none flex min-h-12 w-full p-3 border border-gray-300 rounded">
                  <option value="USD">USD</option><option value="INR">INR</option><option value="EUR">EUR</option><option value="GBP">GBP</option>
                </select>
              </div>
              <div className="flex-1">
                <input name="expectedSalaryAmount" type="text" value={formData.expectedSalaryAmount || ""} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} placeholder="Enter amount" className="w-full min-h-12 p-3 border border-gray-300 rounded"/>
              </div>
            </div>
          </div>
          
          {/* ... Employment Type Section ... */}

          {/*  We now map over `formData.experiences` */}
          <div className="w-full mt-8 max-md:max-w-full">
            <h3 className="text-lg font-semibold text-black">Work Experience</h3>
            {(formData.experiences || []).map((experience, index) => (
              <div key={index} className="mt-6 p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Experience {index + 1}</h4>
                  {(formData.experiences || []).length > 1 && (
                    <button type="button" onClick={() => handleRemoveExperience(index)} className="text-red-500 text-sm">Remove</button>
                  )}
                </div>
                
                {/*  All values now correctly reference the `experience` object from the map */}
                <div className="mb-4">
                  <label className="block text-black mb-1">Company</label>
                  <input value={experience.company || ''} onChange={(e) => handleExperienceChange(index, "company", e.target.value)} className="flex min-h-12 w-full p-3 border border-gray-300 rounded"/>
                </div>

                {/*  Field name is 'role' */}
                <div className="mb-4">
                  <label className="block text-black mb-1">Job Role</label>
                  <input value={experience.role || ''} onChange={(e) => handleExperienceChange(index, "role", e.target.value)} className="flex min-h-12 w-full p-3 border border-gray-300 rounded"/>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-black mb-1">Start Date</label>
                    <DatePicker selected={experience.startDate ? new Date(experience.startDate) : null} onChange={(date) => handleDateChange(index, "startDate", date)} customInput={<CustomDateInput placeholder="Select start date" />} showMonthYearPicker dateFormat="MM/yyyy" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-black mb-1">End Date</label>
                    <DatePicker selected={experience.endDate ? new Date(experience.endDate) : null} onChange={(date) => handleDateChange(index, "endDate", date)} customInput={<CustomDateInput placeholder="Select end date" />} showMonthYearPicker dateFormat="MM/yyyy" minDate={experience.startDate ? new Date(experience.startDate) : null} />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-black mb-1">Description</label>
                  <textarea value={experience.description || ''} onChange={(e) => handleExperienceChange(index, "description", e.target.value)} className="flex min-h-24 w-full p-3 border border-gray-300 rounded"></textarea>
                </div>

                {/*   Field is 'experienceCertificate' */}
                <div>
                  <label className="block text-black mb-1">Experience Certificate (Optional)</label>
                  <label className="flex items-center justify-between p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                    <span className="text-[#666] truncate">{experience.experienceCertificate?.name || "Upload Experience Certificate"}</span>
                    <UploadIcon className="w-5 h-5 text-gray-500"/>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(index, e)}/>
                  </label>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button type="button" onClick={handleAddExperience} className="text-blue-600 cursor-pointer">Add experience +</button>
            </div>
          </div>
          
          <div className="flex min-h-12 w-full gap-4 mt-8">
            <button type="button" onClick={onBack} className="self-stretch gap-2 text-black px-6 py-3 border rounded-md">Back</button>
            <button type="button" onClick={onNext} className="self-stretch bg-black gap-2 text-white px-6 py-3 border rounded-md">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};