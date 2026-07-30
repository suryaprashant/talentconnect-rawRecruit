// import { useState } from "react";

// export default function ProfileAchievements({
//   formData,
//   updateFormData,
//   nextStep,
//   prevStep,
//   currentStep,
//   totalSteps,
// }) {
//   const [workshop, setWorkshop] = useState({
//     name: "",
//     startDate: "",
//     endDate: "",
//     executor: "", 
//   });

//   const [volunteering, setVolunteering] = useState({
//     name: "",
//     startDate: "",
//     endDate: "",
//     executor: "", // This will map to 'description' in backend
//   });

//   const [award, setAward] = useState({
//     name: "", // This will map to 'awardTitle' in backend
//     startDate: "",
//     endDate: "",
//     organization: "", // This will map to 'awardingOrganization' in backend
//   });

//   // Calculate progress percentage
//   const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

//   const isValidURL = (url) => {
//     if (!url) return false;
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const handleNext = () => {
//     const website = formData.collegeWebsite || "";
//     const linkedin = formData.unicefinProfile || "";

//     // Validate Mandatory * Fields
//     if (!website.trim()) {
//       alert("College Website is required");
//       return;
//     }
//     if (!isValidURL(website)) {
//       alert("Please enter a valid College Website URL (e.g., http://example.com)");
//       return;
//     }

//     if (!linkedin.trim()) {
//       alert("LinkedIn Profile is required");
//       return;
//     }
//     if (!isValidURL(linkedin)) {
//       alert("Please enter a valid LinkedIn Profile URL");
//       return;
//     }

//     nextStep(); // proceed ONLY if valid
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     updateFormData(name, value);
//   };

//   // --- Workshop Logic ---
//   const handleWorkshopChange = (e) => {
//     const { name, value } = e.target;
//     setWorkshop({
//       ...workshop,
//       [name]: value,
//     });
//   };

//   const addWorkshop = () => {
//     // Validate only Asterisk (*) fields
//     if (!workshop.name.trim()) {
//       alert("Please enter the Workshop Name");
//       return;
//     }

//     // Prepare object: If optional fields are empty, set to "NA"
//     const newWorkshop = {
//       name: workshop.name,
//       startDate: workshop.startDate || "NA",
//       endDate: workshop.endDate || "NA",
//       executor: workshop.executor || "NA",
//     };

//     updateFormData("workshops", [...(formData.workshops || []), newWorkshop]);
    
//     // Reset form
//     setWorkshop({
//       name: "",
//       startDate: "",
//       endDate: "",
//       executor: "",
//     });
//   };

//   // --- Volunteering Logic ---
//   const handleVolunteeringChange = (e) => {
//     const { name, value } = e.target;
//     setVolunteering({
//       ...volunteering,
//       [name]: value,
//     });
//   };

//   const addVolunteering = () => {
//     // Validate only Asterisk (*) fields
//     if (!volunteering.name.trim()) {
//       alert("Please enter the Event Name");
//       return;
//     }

//     // Prepare object: If optional fields are empty, set to "NA"
//     const newVolunteering = {
//       name: volunteering.name,
//       startDate: volunteering.startDate || "NA",
//       endDate: volunteering.endDate || "NA",
//       executor: volunteering.executor || "NA",
//     };

//     updateFormData("volunteering", [
//       ...(formData.volunteering || []),
//       newVolunteering,
//     ]);

//     // Reset form
//     setVolunteering({
//       name: "",
//       startDate: "",
//       endDate: "",
//       executor: "",
//     });
//   };

//   // --- Award Logic ---
//   const handleAwardChange = (e) => {
//     const { name, value } = e.target;
//     setAward({
//       ...award,
//       [name]: value,
//     });
//   };

//   const addAward = () => {
//     // Validate Asterisk (*) fields: Name AND Organization
//     if (!award.name.trim()) {
//       alert("Please enter the Award Name");
//       return;
//     }
//     if (!award.organization.trim()) {
//       alert("Please enter the Awarding Organization");
//       return;
//     }

//     // Prepare object: If optional fields are empty, set to "NA"
//     const newAward = {
//       name: award.name,
//       organization: award.organization,
//       startDate: award.startDate || "NA",
//       endDate: award.endDate || "NA",
//     };

//     updateFormData("awards", [...(formData.awards || []), newAward]);

//     // Reset form
//     setAward({
//       name: "",
//       startDate: "",
//       endDate: "",
//       organization: "",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7] via-[#d4e8f9] to-[#cff7ea]">
//       <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
//         {/* Card with blur border effect */}
//         <div className="relative w-full max-w-4xl">
//           {/* Blur border - positioned around the card */}
//           <div className="absolute -inset-6 bg-gradient-to-br from-[#fbcfe8]/20 via-[#143694]/20 to-[#a7f3d0]/20 rounded-4xl blur-2xl -z-10"></div>
          
//           {/* Optional corner accent blurs */}
//           <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#fbcfe8]/30 rounded-full blur-3xl -z-10"></div>
//           <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#143694]/30 rounded-full blur-3xl -z-10"></div>
//           <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c7d2fe]/30 rounded-full blur-3xl -z-10"></div>
//           <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#a7f3d0]/30 rounded-full blur-3xl -z-10"></div>
          
//           {/* Main Card */}
//           <div className="relative bg-white/95 backdrop-blur-xl border border-white/70 rounded-3xl shadow-xl shadow-blue-50/50 p-10">

//             <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent mb-6">
//               College Profile & Achievements
//             </h1>
//             <p className="text-gray-600 text-lg mb-8">
//               Showcase your institution's key highlights, achievements, and online presence!
//             </p>

//             <div className="space-y-8">
//               {/* College Website */}
//               <div>
//                 <label className="block font-medium mb-3 text-gray-700 text-lg">
//                   College Website *
//                 </label>
//                 <input
//                   type="url"
//                   name="collegeWebsite"
//                   value={formData.collegeWebsite || ""}
//                   onChange={handleChange}
//                   placeholder="http://www.nature.io"
//                   className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
//                   required
//                 />
//               </div>

//               {/* LinkedIn Profile */}
//               <div>
//                 <label className="block font-medium mb-3 text-gray-700 text-lg">
//                   LinkedIn Profile *
//                 </label>
//                 <input
//                   type="url"
//                   name="unicefinProfile"
//                   value={formData.unicefinProfile || ""}
//                   onChange={handleChange}
//                   placeholder="http://www.linkedin.com/your-college"
//                   className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
//                   required
//                 />
//               </div>

//               {/* --- Workshops Section --- */}
//               <div className="border-t border-gray-200/50 pt-8">
//                 <h3 className="font-bold text-xl mb-6 text-gray-800">Workshops & Training Programs</h3>
                
//                 {/* Display added workshops */}
//                 {formData.workshops && formData.workshops.length > 0 && (
//                   <div className="mb-6 p-5 bg-gradient-to-r from-gray-50/50 to-blue-50/30 backdrop-blur-sm border border-gray-200/50 rounded-xl">
//                     <h4 className="text-lg font-semibold mb-3 text-gray-700">
//                       Added Workshops:
//                     </h4>
//                     <ul className="space-y-2">
//                       {formData.workshops.map((item, index) => (
//                         <li key={index} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50">
//                           <div className="w-2 h-2 mt-2 rounded-full bg-[#1e4ed8] flex-shrink-0"></div>
//                           <div>
//                             <strong className="text-gray-800">{item.name}</strong> 
//                             <div className="text-sm text-gray-600 mt-1">
//                               <span>From: {item.startDate}</span> | 
//                               <span> To: {item.endDate}</span> | 
//                               <span> By: {item.executor}</span>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="space-y-6 bg-gradient-to-r from-gray-50/30 to-blue-50/10 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50">
//                   <div>
//                     <label className="block font-medium mb-3 text-gray-700 text-lg">
//                       Workshop Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={workshop.name}
//                       onChange={handleWorkshopChange}
//                       placeholder="Enter workshop name"
//                       className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-6">
//                     <div>
//                       <label className="block font-medium mb-3 text-gray-700">Start Date</label>
//                       <input
//                         type="date"
//                         name="startDate"
//                         value={workshop.startDate}
//                         onChange={handleWorkshopChange}
//                         className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-medium mb-3 text-gray-700">End Date</label>
//                       <input
//                         type="date"
//                         name="endDate"
//                         value={workshop.endDate}
//                         onChange={handleWorkshopChange}
//                         className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block font-medium mb-3 text-gray-700">Executor</label>
//                     <input
//                       type="text"
//                       name="executor"
//                       value={workshop.executor}
//                       onChange={handleWorkshopChange}
//                       placeholder="e.g., Google, Microsoft"
//                       className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
//                     />
//                   </div>

//                   <button
//                     onClick={addWorkshop}
//                     className="px-8 py-4 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-300 font-medium text-lg"
//                   >
//                     Add Workshop
//                   </button>
//                 </div>
//               </div>

//               {/* --- Volunteering Section --- */}
//               <div className="border-t border-gray-200/50 pt-8">
//                 <h3 className="font-bold text-xl mb-6 text-gray-800">
//                   Volunteering & Community Engagement
//                 </h3>
                
//                 {/* Display added volunteering */}
//                 {formData.volunteering && formData.volunteering.length > 0 && (
//                   <div className="mb-6 p-5 bg-gradient-to-r from-gray-50/50 to-green-50/30 backdrop-blur-sm border border-gray-200/50 rounded-xl">
//                     <h4 className="text-lg font-semibold mb-3 text-gray-700">
//                       Added Volunteering Experiences:
//                     </h4>
//                     <ul className="space-y-2">
//                       {formData.volunteering.map((item, index) => (
//                         <li key={index} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50">
//                           <div className="w-2 h-2 mt-2 rounded-full bg-[#10b981] flex-shrink-0"></div>
//                           <div>
//                             <strong className="text-gray-800">{item.name}</strong>
//                             <div className="text-sm text-gray-600 mt-1">
//                               <span>From: {item.startDate}</span> | 
//                               <span> To: {item.endDate}</span> | 
//                               <span> By: {item.executor}</span>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="space-y-6 bg-gradient-to-r from-gray-50/30 to-green-50/10 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50">
//                   <div>
//                     <label className="block font-medium mb-3 text-gray-700 text-lg">
//                       Event Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={volunteering.name}
//                       onChange={handleVolunteeringChange}
//                       placeholder="Enter event name"
//                       className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-6">
//                     <div>
//                       <label className="block font-medium mb-3 text-gray-700">Start Date</label>
//                       <input
//                         type="date"
//                         name="startDate"
//                         value={volunteering.startDate}
//                         onChange={handleVolunteeringChange}
//                         className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-medium mb-3 text-gray-700">End Date</label>
//                       <input
//                         type="date"
//                         name="endDate"
//                         value={volunteering.endDate}
//                         onChange={handleVolunteeringChange}
//                         className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block font-medium mb-3 text-gray-700">Executor</label>
//                     <input
//                       type="text"
//                       name="executor"
//                       value={volunteering.executor}
//                       onChange={handleVolunteeringChange}
//                       placeholder="e.g., Local Community Group"
//                       className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
//                     />
//                   </div>

//                   <button
//                     onClick={addVolunteering}
//                     className="px-8 py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-xl hover:shadow-lg hover:shadow-[#10b981]/40 transition-all duration-300 font-medium text-lg"
//                   >
//                     Add Volunteering Experience
//                   </button>
//                 </div>
//               </div>

//               {/* --- Awards Section --- */}
//               <div className="border-t border-gray-200/50 pt-8">
//                 <h3 className="font-bold text-xl mb-6 text-gray-800">Awards & Recognitions</h3>
                
//                 {/* Display added awards */}
//                 {formData.awards && formData.awards.length > 0 && (
//                   <div className="mb-6 p-5 bg-gradient-to-r from-gray-50/50 to-purple-50/30 backdrop-blur-sm border border-gray-200/50 rounded-xl">
//                     <h4 className="text-lg font-semibold mb-3 text-gray-700">Added Awards:</h4>
//                     <ul className="space-y-2">
//                       {formData.awards.map((item, index) => (
//                         <li key={index} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50">
//                           <div className="w-2 h-2 mt-2 rounded-full bg-[#1e40af] flex-shrink-0"></div>
//                           <div>
//                             <strong className="text-gray-800">{item.name}</strong>
//                             <div className="text-sm text-gray-600 mt-1">
//                               <span>By: {item.organization}</span> | 
//                               <span> From: {item.startDate}</span> | 
//                               <span> To: {item.endDate}</span>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="space-y-6 bg-gradient-to-r from-gray-50/30 to-purple-50/10 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50">
//                   <div>
//                     <label className="block font-medium mb-3 text-gray-700 text-lg">
//                       Award Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={award.name}
//                       onChange={handleAwardChange}
//                       placeholder="Enter award name"
//                       className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-6">
//                     <div>
//                       <label className="block font-medium mb-3 text-gray-700">Start Date</label>
//                       <input
//                         type="date"
//                         name="startDate"
//                         value={award.startDate}
//                         onChange={handleAwardChange}
//                         className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-medium mb-3 text-gray-700">End Date</label>
//                       <input
//                         type="date"
//                         name="endDate"
//                         value={award.endDate}
//                         onChange={handleAwardChange}
//                         className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block font-medium mb-3 text-gray-700 text-lg">
//                       Awarding Organizations *
//                     </label>
//                     <input
//                       type="text"
//                       name="organization"
//                       value={award.organization}
//                       onChange={handleAwardChange}
//                       placeholder="e.g., National Science Foundation"
//                       className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
//                     />
//                   </div>

//                   <button
//                     onClick={addAward}
//                     className="px-8 py-4 bg-gradient-to-r from-[#1e40af] to-[#7c3aed] text-white rounded-xl hover:shadow-lg hover:shadow-[#1e40af]/40 transition-all duration-300 font-medium text-lg"
//                   >
//                     Add Award
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex flex-col sm:flex-row justify-between gap-6 mt-12 pt-8 border-t border-white/50">
//               <button
//                 onClick={prevStep}
//                 className="px-10 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl hover:bg-white/90 hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-lg"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="px-10 py-4 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 font-medium text-lg"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfileAchievements({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) {
  const [workshop, setWorkshop] = useState({
    name: "",
    startDate: "",
    endDate: "",
    executor: "",
  });

  const [volunteering, setVolunteering] = useState({
    name: "",
    startDate: "",
    endDate: "",
    executor: "", // This will map to 'description' in backend
  });

  const [award, setAward] = useState({
    name: "", // This will map to 'awardTitle' in backend
    startDate: "",
    endDate: "",
    organization: "", // This will map to 'awardingOrganization' in backend
  });

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const isValidURL = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Helper function to format date locally to prevent UTC "day back" shift
  const formatDateLocal = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleNext = () => {
    const website = formData.collegeWebsite || "";
    const linkedin = formData.unicefinProfile || "";

    // Validate Mandatory * Fields
    if (!website.trim()) {
      alert("College Website is required");
      return;
    }
    if (!isValidURL(website)) {
      alert("Please enter a valid College Website URL (e.g., http://example.com)");
      return;
    }

    if (!linkedin.trim()) {
      alert("LinkedIn Profile is required");
      return;
    }
    if (!isValidURL(linkedin)) {
      alert("Please enter a valid LinkedIn Profile URL");
      return;
    }

    nextStep(); // proceed ONLY if valid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  // --- Workshop Logic ---
  const handleWorkshopDateChange = (date, field) => {
    const formattedDate = formatDateLocal(date);
    setWorkshop((prev) => ({ ...prev, [field]: formattedDate }));
  };

  const addWorkshop = () => {
    // Validate only Asterisk (*) fields
    if (!workshop.name.trim()) {
      alert("Please enter the Workshop Name");
      return;
    }

    // Prepare object: If optional fields are empty, set to "NA"
    const newWorkshop = {
      name: workshop.name,
      startDate: workshop.startDate || "NA",
      endDate: workshop.endDate || "NA",
      executor: workshop.executor || "NA",
    };

    updateFormData("workshops", [...(formData.workshops || []), newWorkshop]);

    // Reset form
    setWorkshop({
      name: "",
      startDate: "",
      endDate: "",
      executor: "",
    });
  };

  // --- Volunteering Logic ---
  const handleVolunteeringDateChange = (date, field) => {
    const formattedDate = formatDateLocal(date);
    setVolunteering((prev) => ({ ...prev, [field]: formattedDate }));
  };

  const addVolunteering = () => {
    // Validate only Asterisk (*) fields
    if (!volunteering.name.trim()) {
      alert("Please enter the Event Name");
      return;
    }

    // Prepare object: If optional fields are empty, set to "NA"
    const newVolunteering = {
      name: volunteering.name,
      startDate: volunteering.startDate || "NA",
      endDate: volunteering.endDate || "NA",
      executor: volunteering.executor || "NA",
    };

    updateFormData("volunteering", [
      ...(formData.volunteering || []),
      newVolunteering,
    ]);

    // Reset form
    setVolunteering({
      name: "",
      startDate: "",
      endDate: "",
      executor: "",
    });
  };

  // --- Award Logic ---
  const handleAwardDateChange = (date, field) => {
    const formattedDate = formatDateLocal(date);
    setAward((prev) => ({ ...prev, [field]: formattedDate }));
  };

  const addAward = () => {
    // Validate Asterisk (*) fields: Name AND Organization
    if (!award.name.trim()) {
      alert("Please enter the Award Name");
      return;
    }
    if (!award.organization.trim()) {
      alert("Please enter the Awarding Organization");
      return;
    }

    // Prepare object: If optional fields are empty, set to "NA"
    const newAward = {
      name: award.name,
      organization: award.organization,
      startDate: award.startDate || "NA",
      endDate: award.endDate || "NA",
    };

    updateFormData("awards", [...(formData.awards || []), newAward]);

    // Reset form
    setAward({
      name: "",
      startDate: "",
      endDate: "",
      organization: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7] via-[#d4e8f9] to-[#cff7ea]">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Card with blur border effect */}
        <div className="relative w-full max-w-4xl">
          {/* Blur border - positioned around the card */}
          <div className="absolute -inset-6 bg-gradient-to-br from-[#fbcfe8]/20 via-[#143694]/20 to-[#a7f3d0]/20 rounded-4xl blur-2xl -z-10"></div>

          {/* Optional corner accent blurs */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#fbcfe8]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#143694]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c7d2fe]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#a7f3d0]/30 rounded-full blur-3xl -z-10"></div>

          {/* Main Card */}
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/70 rounded-3xl shadow-xl shadow-blue-50/50 p-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent mb-6">
              College Profile
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Showcase your institution's online presence!
            </p>

            <div className="space-y-8">
              {/* College Website */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  College Website <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="collegeWebsite"
                  value={formData.collegeWebsite || ""}
                  onChange={handleChange}
                  placeholder="http://www.nature.io"
                  className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
                  required
                />
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  LinkedIn Profile <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="unicefinProfile"
                  value={formData.unicefinProfile || ""}
                  onChange={handleChange}
                  placeholder="http://www.linkedin.com/your-college"
                  className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
                  required
                />
              </div>

              {/* --- Workshops Section ---
              <div className="border-t border-gray-200/50 pt-8">
                <h3 className="font-bold text-xl mb-6 text-gray-800">
                  Workshops & Training Programs
                </h3>

                {/* Display added workshops 
                {formData.workshops && formData.workshops.length > 0 && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-gray-50/50 to-blue-50/30 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">
                      Added Workshops:
                    </h4>
                    <ul className="space-y-2">
                      {formData.workshops.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50"
                        >
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#1e4ed8] flex-shrink-0"></div>
                          <div>
                            <strong className="text-gray-800">{item.name}</strong>
                            <div className="text-sm text-gray-600 mt-1">
                              <span>From: {item.startDate}</span> |{" "}
                              <span> To: {item.endDate}</span> |{" "}
                              <span> By: {item.executor}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-6 bg-gradient-to-r from-gray-50/30 to-blue-50/10 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50">
                  <div>
                    <label className="block font-medium mb-3 text-gray-700 text-lg">
                      Workshop Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={workshop.name}
                      onChange={(e) =>
                        setWorkshop({ ...workshop, name: e.target.value })
                      }
                      placeholder="Enter workshop name"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">
                        Start Date
                      </label>
                      <DatePicker
                        selected={
                          workshop.startDate ? new Date(workshop.startDate) : null
                        }
                        onChange={(date) =>
                          handleWorkshopDateChange(date, "startDate")
                        }
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select start date"
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
                        wrapperClassName="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">
                        End Date
                      </label>
                      <DatePicker
                        selected={
                          workshop.endDate ? new Date(workshop.endDate) : null
                        }
                        onChange={(date) =>
                          handleWorkshopDateChange(date, "endDate")
                        }
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select end date"
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
                        wrapperClassName="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-3 text-gray-700">
                      Executor
                    </label>
                    <input
                      type="text"
                      name="executor"
                      value={workshop.executor}
                      onChange={(e) =>
                        setWorkshop({ ...workshop, executor: e.target.value })
                      }
                      placeholder="e.g., Google, Microsoft"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <button
                    onClick={addWorkshop}
                    className="px-8 py-4 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-300 font-medium text-lg"
                  >
                    Add Workshop
                  </button>
                </div>
              </div> */}

              {/* --- Volunteering Section --- 
              <div className="border-t border-gray-200/50 pt-8">
                <h3 className="font-bold text-xl mb-6 text-gray-800">
                  Volunteering & Community Engagement
                </h3>

                {/* Display added volunteering 
                {formData.volunteering && formData.volunteering.length > 0 && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-gray-50/50 to-green-50/30 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">
                      Added Volunteering Experiences:
                    </h4>
                    <ul className="space-y-2">
                      {formData.volunteering.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50"
                        >
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#10b981] flex-shrink-0"></div>
                          <div>
                            <strong className="text-gray-800">{item.name}</strong>
                            <div className="text-sm text-gray-600 mt-1">
                              <span>From: {item.startDate}</span> |{" "}
                              <span> To: {item.endDate}</span> |{" "}
                              <span> By: {item.executor}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-6 bg-gradient-to-r from-gray-50/30 to-green-50/10 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50">
                  <div>
                    <label className="block font-medium mb-3 text-gray-700 text-lg">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={volunteering.name}
                      onChange={(e) =>
                        setVolunteering({ ...volunteering, name: e.target.value })
                      }
                      placeholder="Enter event name"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">
                        Start Date
                      </label>
                      <DatePicker
                        selected={
                          volunteering.startDate
                            ? new Date(volunteering.startDate)
                            : null
                        }
                        onChange={(date) =>
                          handleVolunteeringDateChange(date, "startDate")
                        }
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select start date"
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
                        wrapperClassName="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">
                        End Date
                      </label>
                      <DatePicker
                        selected={
                          volunteering.endDate
                            ? new Date(volunteering.endDate)
                            : null
                        }
                        onChange={(date) =>
                          handleVolunteeringDateChange(date, "endDate")
                        }
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select end date"
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
                        wrapperClassName="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-3 text-gray-700">
                      Executor
                    </label>
                    <input
                      type="text"
                      name="executor"
                      value={volunteering.executor}
                      onChange={(e) =>
                        setVolunteering({
                          ...volunteering,
                          executor: e.target.value,
                        })
                      }
                      placeholder="e.g., Local Community Group"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <button
                    onClick={addVolunteering}
                    className="px-8 py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-xl hover:shadow-lg hover:shadow-[#10b981]/40 transition-all duration-300 font-medium text-lg"
                  >
                    Add Volunteering Experience
                  </button>
                </div>
              </div>

              {/* --- Awards Section --- 
              <div className="border-t border-gray-200/50 pt-8">
                <h3 className="font-bold text-xl mb-6 text-gray-800">
                  Awards & Recognitions
                </h3>

                {/* Display added awards 
                {formData.awards && formData.awards.length > 0 && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-gray-50/50 to-purple-50/30 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">
                      Added Awards:
                    </h4>
                    <ul className="space-y-2">
                      {formData.awards.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50"
                        >
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#1e40af] flex-shrink-0"></div>
                          <div>
                            <strong className="text-gray-800">{item.name}</strong>
                            <div className="text-sm text-gray-600 mt-1">
                              <span>By: {item.organization}</span> |{" "}
                              <span> From: {item.startDate}</span> |{" "}
                              <span> To: {item.endDate}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-6 bg-gradient-to-r from-gray-50/30 to-purple-50/10 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50">
                  <div>
                    <label className="block font-medium mb-3 text-gray-700 text-lg">
                      Award Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={award.name}
                      onChange={(e) =>
                        setAward({ ...award, name: e.target.value })
                      }
                      placeholder="Enter award name"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">
                        Start Date
                      </label>
                      <DatePicker
                        selected={
                          award.startDate ? new Date(award.startDate) : null
                        }
                        onChange={(date) =>
                          handleAwardDateChange(date, "startDate")
                        }
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select start date"
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
                        wrapperClassName="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">
                        End Date
                      </label>
                      <DatePicker
                        selected={award.endDate ? new Date(award.endDate) : null}
                        onChange={(date) => handleAwardDateChange(date, "endDate")}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select end date"
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200"
                        wrapperClassName="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-3 text-gray-700 text-lg">
                      Awarding Organizations *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={award.organization}
                      onChange={(e) =>
                        setAward({ ...award, organization: e.target.value })
                      }
                      placeholder="e.g., National Science Foundation"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <button
                    onClick={addAward}
                    className="px-8 py-4 bg-gradient-to-r from-[#1e40af] to-[#7c3aed] text-white rounded-xl hover:shadow-lg hover:shadow-[#1e40af]/40 transition-all duration-300 font-medium text-lg"
                  >
                    Add Award
                  </button>
                </div>
              </div>
            </div> */}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 mt-12 pt-8 border-t border-white/50">
              <button
                onClick={prevStep}
                className="px-10 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl hover:bg-white/90 hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-lg"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-10 py-4 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 font-medium text-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}