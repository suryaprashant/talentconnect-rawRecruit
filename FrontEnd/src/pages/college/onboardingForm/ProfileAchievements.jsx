// import { useState } from "react";

// export default function ProfileAchievements({
//   formData,
//   updateFormData,
//   nextStep,
//   prevStep,
// }) {
//   const [workshop, setWorkshop] = useState({
//     name: "",
//     startDate: "",
//     endDate: "",
//     executor: "", // This will map to 'description' in backend
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

//   const isValidURL = (url) => {
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

//     if (!isValidURL(website)) {
//       alert("Please enter a valid College Website URL");
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

//   const handleWorkshopChange = (e) => {
//     const { name, value } = e.target;
//     setWorkshop({
//       ...workshop,
//       [name]: value,
//     });
//   };

//   const addWorkshop = () => {
//     if (
//       workshop.name &&
//       workshop.startDate &&
//       workshop.endDate &&
//       workshop.executor
//     ) {
//       updateFormData("workshops", [...(formData.workshops || []), workshop]);
//       setWorkshop({
//         name: "",
//         startDate: "",
//         endDate: "",
//         executor: "",
//       });
//     } else {
//       alert("Please fill all workshop fields before adding.");
//     }
//   };

//   const handleVolunteeringChange = (e) => {
//     const { name, value } = e.target;
//     setVolunteering({
//       ...volunteering,
//       [name]: value,
//     });
//   };

//   const addVolunteering = () => {
//     if (
//       volunteering.name &&
//       volunteering.startDate &&
//       volunteering.endDate &&
//       volunteering.executor
//     ) {
//       updateFormData("volunteering", [
//         ...(formData.volunteering || []),
//         volunteering,
//       ]);
//       setVolunteering({
//         name: "",
//         startDate: "",
//         endDate: "",
//         executor: "",
//       });
//     } else {
//       alert("Please fill all volunteering fields before adding.");
//     }
//   };

//   const handleAwardChange = (e) => {
//     const { name, value } = e.target;
//     setAward({
//       ...award,
//       [name]: value,
//     });
//   };

//   const addAward = () => {
//     if (award.name && award.startDate && award.endDate && award.organization) {
//       updateFormData("awards", [...(formData.awards || []), award]);
//       setAward({
//         name: "",
//         startDate: "",
//         endDate: "",
//         organization: "",
//       });
//     } else {
//       alert("Please fill all award fields before adding.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen p-4">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl my-8">
//           <h1 className="text-2xl font-bold mb-6">
//             College Profile & Achievements
//           </h1>
//           <p className="mb-6">
//             Showcase your institution's key highlights, achievements, and online
//             presence!
//           </p>

//           <div className="space-y-8">
//             <div>
//               <label className="block font-medium mb-1">
//                 College Website *
//               </label>
//               <input
//                 type="url"
//                 name="collegeWebsite"
//                 value={formData.collegeWebsite || ""}
//                 onChange={handleChange}
//                 placeholder="http://www.nature.io"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">
//                 LinkedIn Profile *
//               </label>
//               <input
//                 type="url"
//                 name="unicefinProfile" // This name needs to be consistent with formData state
//                 value={formData.unicefinProfile || ""}
//                 onChange={handleChange}
//                 placeholder="http://www.linkedin.com/your-college"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>

//             <div className="border-t border-gray-200 pt-8">
//               <h3 className="font-bold mb-4">Workshops & Training Programs</h3>
//               {/* Display added workshops */}
//               {formData.workshops && formData.workshops.length > 0 && (
//                 <div className="mb-4">
//                   <h4 className="text-lg font-semibold mb-2">
//                     Added Workshops:
//                   </h4>
//                   <ul className="list-disc list-inside space-y-1">
//                     {formData.workshops.map((item, index) => (
//                       <li key={index} className="text-gray-700">
//                         <strong>{item.name}</strong> from {item.startDate} to{" "}
//                         {item.endDate} (by {item.executor})
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block font-medium mb-1">
//                     Workshop Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={workshop.name}
//                     onChange={handleWorkshopChange}
//                     placeholder="Placeholder"
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-medium mb-1">Start Date</label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={workshop.startDate}
//                       onChange={handleWorkshopChange}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-medium mb-1">End Date</label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={workshop.endDate}
//                       onChange={handleWorkshopChange}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block font-medium mb-1">Executor</label>
//                   <input
//                     type="text"
//                     name="executor"
//                     value={workshop.executor}
//                     onChange={handleWorkshopChange}
//                     placeholder="e.g., Google, Microsoft"
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>

//                 <button
//                   onClick={addWorkshop}
//                   className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
//                 >
//                   Add workshop
//                 </button>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 pt-8">
//               <h3 className="font-bold mb-4">
//                 Volunteering & Community Engagement
//               </h3>
//               {/* Display added volunteering */}
//               {formData.volunteering && formData.volunteering.length > 0 && (
//                 <div className="mb-4">
//                   <h4 className="text-lg font-semibold mb-2">
//                     Added Volunteering Experiences:
//                   </h4>
//                   <ul className="list-disc list-inside space-y-1">
//                     {formData.volunteering.map((item, index) => (
//                       <li key={index} className="text-gray-700">
//                         <strong>{item.name}</strong> from {item.startDate} to{" "}
//                         {item.endDate} (by {item.executor})
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block font-medium mb-1">Event Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={volunteering.name}
//                     onChange={handleVolunteeringChange}
//                     placeholder="Placeholder"
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-medium mb-1">Start Date</label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={volunteering.startDate}
//                       onChange={handleVolunteeringChange}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-medium mb-1">End Date</label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={volunteering.endDate}
//                       onChange={handleVolunteeringChange}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block font-medium mb-1">Executor</label>
//                   <input
//                     type="text"
//                     name="executor"
//                     value={volunteering.executor}
//                     onChange={handleVolunteeringChange}
//                     placeholder="e.g., Local Community Group"
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>

//                 <button
//                   onClick={addVolunteering}
//                   className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
//                 >
//                   Add volunteering experience
//                 </button>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 pt-8">
//               <h3 className="font-bold mb-4">Awards & Recognitions</h3>
//               {/* Display added awards */}
//               {formData.awards && formData.awards.length > 0 && (
//                 <div className="mb-4">
//                   <h4 className="text-lg font-semibold mb-2">Added Awards:</h4>
//                   <ul className="list-disc list-inside space-y-1">
//                     {formData.awards.map((item, index) => (
//                       <li key={index} className="text-gray-700">
//                         <strong>{item.name}</strong> from {item.startDate} to{" "}
//                         {item.endDate} (by {item.organization})
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block font-medium mb-1">Award Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={award.name}
//                     onChange={handleAwardChange}
//                     placeholder="Placeholder"
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-medium mb-1">Start Date</label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={award.startDate}
//                       onChange={handleAwardChange}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-medium mb-1">End Date</label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={award.endDate}
//                       onChange={handleAwardChange}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block font-medium mb-1">
//                     Awarding Organizations *
//                   </label>
//                   <input
//                     type="text"
//                     name="organization"
//                     value={award.organization}
//                     onChange={handleAwardChange}
//                     placeholder="e.g., National Science Foundation"
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     required
//                   />
//                 </div>

//                 <button
//                   onClick={addAward}
//                   className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
//                 >
//                   Add award
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-between mt-8">
//             <button
//               onClick={prevStep}
//               className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleNext}
//               className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
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
    executor: "", // This will map to 'description' in backend
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
  const handleWorkshopChange = (e) => {
    const { name, value } = e.target;
    setWorkshop({
      ...workshop,
      [name]: value,
    });
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
  const handleVolunteeringChange = (e) => {
    const { name, value } = e.target;
    setVolunteering({
      ...volunteering,
      [name]: value,
    });
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
  const handleAwardChange = (e) => {
    const { name, value } = e.target;
    setAward({
      ...award,
      [name]: value,
    });
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
          <div className="absolute -inset-6 bg-gradient-to-br from-[#fbcfe8]/20 via-[#93c5fd]/20 to-[#a7f3d0]/20 rounded-4xl blur-2xl -z-10"></div>
          
          {/* Optional corner accent blurs */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#fbcfe8]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#93c5fd]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c7d2fe]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#a7f3d0]/30 rounded-full blur-3xl -z-10"></div>
          
          {/* Main Card */}
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/70 rounded-3xl shadow-xl shadow-blue-50/50 p-10">

            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-6">
              College Profile & Achievements
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Showcase your institution's key highlights, achievements, and online presence!
            </p>

            <div className="space-y-8">
              {/* College Website */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  College Website *
                </label>
                <input
                  type="url"
                  name="collegeWebsite"
                  value={formData.collegeWebsite || ""}
                  onChange={handleChange}
                  placeholder="http://www.nature.io"
                  className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
                  required
                />
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  LinkedIn Profile *
                </label>
                <input
                  type="url"
                  name="unicefinProfile"
                  value={formData.unicefinProfile || ""}
                  onChange={handleChange}
                  placeholder="http://www.linkedin.com/your-college"
                  className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
                  required
                />
              </div>

              {/* --- Workshops Section --- */}
              <div className="border-t border-gray-200/50 pt-8">
                <h3 className="font-bold text-xl mb-6 text-gray-800">Workshops & Training Programs</h3>
                
                {/* Display added workshops */}
                {formData.workshops && formData.workshops.length > 0 && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-gray-50/50 to-blue-50/30 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">
                      Added Workshops:
                    </h4>
                    <ul className="space-y-2">
                      {formData.workshops.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#3b82f6] flex-shrink-0"></div>
                          <div>
                            <strong className="text-gray-800">{item.name}</strong> 
                            <div className="text-sm text-gray-600 mt-1">
                              <span>From: {item.startDate}</span> | 
                              <span> To: {item.endDate}</span> | 
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
                      onChange={handleWorkshopChange}
                      placeholder="Enter workshop name"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={workshop.startDate}
                        onChange={handleWorkshopChange}
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={workshop.endDate}
                        onChange={handleWorkshopChange}
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-3 text-gray-700">Executor</label>
                    <input
                      type="text"
                      name="executor"
                      value={workshop.executor}
                      onChange={handleWorkshopChange}
                      placeholder="e.g., Google, Microsoft"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <button
                    onClick={addWorkshop}
                    className="px-8 py-4 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-300 font-medium text-lg"
                  >
                    Add Workshop
                  </button>
                </div>
              </div>

              {/* --- Volunteering Section --- */}
              <div className="border-t border-gray-200/50 pt-8">
                <h3 className="font-bold text-xl mb-6 text-gray-800">
                  Volunteering & Community Engagement
                </h3>
                
                {/* Display added volunteering */}
                {formData.volunteering && formData.volunteering.length > 0 && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-gray-50/50 to-green-50/30 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">
                      Added Volunteering Experiences:
                    </h4>
                    <ul className="space-y-2">
                      {formData.volunteering.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#10b981] flex-shrink-0"></div>
                          <div>
                            <strong className="text-gray-800">{item.name}</strong>
                            <div className="text-sm text-gray-600 mt-1">
                              <span>From: {item.startDate}</span> | 
                              <span> To: {item.endDate}</span> | 
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
                      onChange={handleVolunteeringChange}
                      placeholder="Enter event name"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={volunteering.startDate}
                        onChange={handleVolunteeringChange}
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={volunteering.endDate}
                        onChange={handleVolunteeringChange}
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-3 text-gray-700">Executor</label>
                    <input
                      type="text"
                      name="executor"
                      value={volunteering.executor}
                      onChange={handleVolunteeringChange}
                      placeholder="e.g., Local Community Group"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
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

              {/* --- Awards Section --- */}
              <div className="border-t border-gray-200/50 pt-8">
                <h3 className="font-bold text-xl mb-6 text-gray-800">Awards & Recognitions</h3>
                
                {/* Display added awards */}
                {formData.awards && formData.awards.length > 0 && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-gray-50/50 to-purple-50/30 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">Added Awards:</h4>
                    <ul className="space-y-2">
                      {formData.awards.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#8b5cf6] flex-shrink-0"></div>
                          <div>
                            <strong className="text-gray-800">{item.name}</strong>
                            <div className="text-sm text-gray-600 mt-1">
                              <span>By: {item.organization}</span> | 
                              <span> From: {item.startDate}</span> | 
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
                      onChange={handleAwardChange}
                      placeholder="Enter award name"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={award.startDate}
                        onChange={handleAwardChange}
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-3 text-gray-700">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={award.endDate}
                        onChange={handleAwardChange}
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
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
                      onChange={handleAwardChange}
                      placeholder="e.g., National Science Foundation"
                      className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <button
                    onClick={addAward}
                    className="px-8 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white rounded-xl hover:shadow-lg hover:shadow-[#8b5cf6]/40 transition-all duration-300 font-medium text-lg"
                  >
                    Add Award
                  </button>
                </div>
              </div>
            </div>

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