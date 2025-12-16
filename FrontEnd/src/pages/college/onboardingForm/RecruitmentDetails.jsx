// import React, { useState, useRef, useEffect } from 'react';
// import { ChevronDownIcon } from 'lucide-react';

// export default function RecruitmentDetails({ formData, updateFormData, nextStep, prevStep }) {
  
//   const initializeArrayField = (fieldName) => {
//     if (!formData[fieldName]) return [];
//     return Array.isArray(formData[fieldName]) ? formData[fieldName] : [formData[fieldName]];
//   };

//   const [selectedServices, setSelectedServices] = useState(initializeArrayField('recruitmentServicesRequired'));
//   const [dropdownOpen, setDropdownOpen] = useState({
//     programs: false,
//     courses: false,
//     companies: false
//   });

//   const programsRef = useRef(null);
//   const coursesRef = useRef(null);
//   const companiesRef = useRef(null);

//   const programOptions = ["Engineering", "Business", "Arts", "Science"];
//   const courseOptions = ["Computer Science", "Mechanical Engineering", "MBA", "Electrical Engineering"];
//   const companyOptions = ["Google", "Microsoft", "Amazon", "TCS"];

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (programsRef.current && !programsRef.current.contains(event.target)) {
//         setDropdownOpen(prev => ({ ...prev, programs: false }));
//       }
//       if (coursesRef.current && !coursesRef.current.contains(event.target)) {
//         setDropdownOpen(prev => ({ ...prev, courses: false }));
//       }
//       if (companiesRef.current && !companiesRef.current.contains(event.target)) {
//         setDropdownOpen(prev => ({ ...prev, companies: false }));
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleDropdown = (dropdown) => {
//     setDropdownOpen(prev => {
//       const isOpening = !prev[dropdown];
//       return {
//         programs: false,
//         courses: false,
//         companies: false,
//         [dropdown]: isOpening
//       };
//     });
//   };

//   const handleMultiSelect = (field, value) => {
//     // Ensure we're working with an array
//     const currentValues = initializeArrayField(field);
//     let newValues;
    
//     if (currentValues.includes(value)) {
//       // Remove if already selected
//       newValues = currentValues.filter(item => item !== value);
//     } else {
//       // Add if not selected
//       newValues = [...currentValues, value];
//     }
    
//     updateFormData(field, newValues);
//   };

//   const removeSelectedItem = (field, value) => {
//     const currentValues = initializeArrayField(field);
//     const newValues = currentValues.filter(item => item !== value);
//     updateFormData(field, newValues);
//   };

//   const handleServiceToggle = (service) => {
//     const currentServices = selectedServices || [];
//     let newServices;
    
//     if (currentServices.includes(service)) {
//       // Remove if already selected
//       newServices = currentServices.filter(s => s !== service);
//     } else {
//       // Add if not selected
//       newServices = [...currentServices, service];
//     }
    
//     setSelectedServices(newServices);
//     updateFormData('recruitmentServicesRequired', newServices);
//   };

//   const handleFileUpload = (e) => {
//     updateFormData('collegeBrochure', e.target.files[0]);
//   };

//   const isAnyDropdownOpen = Object.values(dropdownOpen).some(Boolean);

//   return (
//     <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-full p-4">
//         <div className="relative w-full max-w-lg">
//           {isAnyDropdownOpen && (
//             <div
//               className="fixed inset-0 z-0"
//               onClick={() => setDropdownOpen({ programs: false, courses: false, companies: false })}
//             />
//           )}

//           <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg">
//             <h1 className="text-2xl font-bold mb-6">Placement & Recruitment Details</h1>
//             <p className="mb-6">Define your hiring partnerships and recruitment process.</p>

//             <div className="space-y-5">
//               {/* Programs Offered Dropdown */}
//               <div ref={programsRef} className="relative">
//                 <label className="block font-medium mb-2">Programs Offered</label>
                
//                 {/* Selected programs chips */}
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {initializeArrayField('programsOffered').map((program, index) => (
//                     <span key={index} className="flex items-center bg-gray-200 text-sm text-black px-3 py-1 rounded-full">
//                       {program}
//                       <button 
//                         type="button" 
//                         onClick={() => removeSelectedItem('programsOffered', program)} 
//                         className="ml-2 text-gray-600 hover:text-black"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))}
//                 </div>
                
//                 <div
//                   className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
//                   onClick={() => toggleDropdown('programs')}
//                 >
//                   <span className="text-gray-500">
//                     Select programs
//                   </span>
//                   <ChevronDownIcon className={`w-5 h-5 transition-transform ${dropdownOpen.programs ? "rotate-180" : ""}`} />
//                 </div>
//                 {dropdownOpen.programs && (
//                   <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                     {programOptions.map(program => (
//                       <div
//                         key={program}
//                         onClick={() => handleMultiSelect('programsOffered', program)}
//                         className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
//                           initializeArrayField('programsOffered').includes(program) ? "bg-gray-100 font-medium" : ""
//                         }`}
//                       >
//                         {program}
//                         {initializeArrayField('programsOffered').includes(program) && <span className="ml-2 text-gray-500">✓</span>}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Popular Courses for Recruitment */}
//               <div ref={coursesRef} className="relative">
//                 <label className="block font-medium mb-2">Popular Courses for Recruitment</label>
                
//                 {/* Selected courses chips */}
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {initializeArrayField('popularCoursesForRecruitment').map((course, index) => (
//                     <span key={index} className="flex items-center bg-gray-200 text-sm text-black px-3 py-1 rounded-full">
//                       {course}
//                       <button 
//                         type="button" 
//                         onClick={() => removeSelectedItem('popularCoursesForRecruitment', course)} 
//                         className="ml-2 text-gray-600 hover:text-black"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))}
//                 </div>
                
//                 <div
//                   className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
//                   onClick={() => toggleDropdown('courses')}
//                 >
//                   <span className="text-gray-500">
//                     Select courses
//                   </span>
//                   <ChevronDownIcon className={`w-5 h-5 transition-transform ${dropdownOpen.courses ? "rotate-180" : ""}`} />
//                 </div>
//                 {dropdownOpen.courses && (
//                   <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                     {courseOptions.map(course => (
//                       <div
//                         key={course}
//                         onClick={() => handleMultiSelect('popularCoursesForRecruitment', course)}
//                         className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
//                           initializeArrayField('popularCoursesForRecruitment').includes(course) ? "bg-gray-100 font-medium" : ""
//                         }`}
//                       >
//                         {course}
//                         {initializeArrayField('popularCoursesForRecruitment').includes(course) && <span className="ml-2 text-gray-500">✓</span>}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Preferred Hiring Companies */}
//               <div ref={companiesRef} className="relative">
//                 <label className="block font-medium mb-2">Preferred Hiring Companies</label>
                
//                 {/* Selected companies chips */}
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {initializeArrayField('preferredHiringCompanies').map((company, index) => (
//                     <span key={index} className="flex items-center bg-gray-200 text-sm text-black px-3 py-1 rounded-full">
//                       {company}
//                       <button 
//                         type="button" 
//                         onClick={() => removeSelectedItem('preferredHiringCompanies', company)} 
//                         className="ml-2 text-gray-600 hover:text-black"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))}
//                 </div>
                
//                 <div
//                   className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
//                   onClick={() => toggleDropdown('companies')}
//                 >
//                   <span className="text-gray-500">
//                     Select companies
//                   </span>
//                   <ChevronDownIcon className={`w-5 h-5 transition-transform ${dropdownOpen.companies ? "rotate-180" : ""}`} />
//                 </div>
//                 {dropdownOpen.companies && (
//                   <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                     {companyOptions.map(company => (
//                       <div
//                         key={company}
//                         onClick={() => handleMultiSelect('preferredHiringCompanies', company)}
//                         className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
//                           initializeArrayField('preferredHiringCompanies').includes(company) ? "bg-gray-100 font-medium" : ""
//                         }`}
//                       >
//                         {company}
//                         {initializeArrayField('preferredHiringCompanies').includes(company) && <span className="ml-2 text-gray-500">✓</span>}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Recruitment Services */}
//               <div className="border-t border-gray-200 pt-6">
//                 <h3 className="font-medium mb-4">Recruitment Services Required?</h3>
//                 <div className="flex gap-4 h-13">
//                   {['Job Fairs', 'Internship Support', 'Company Tie-ups'].map((service) => (
//                     <button
//                       key={service}
//                       onClick={() => handleServiceToggle(service)}
//                       className={`px-6 py-2 rounded-md border ${selectedServices.includes(service) ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} transition-colors duration-300`}
//                     >
//                       {service}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Upload Section */}
//               <div className="border-gray-200 pt-6">
//                 <h3 className="font-medium mb-4">Upload College Brochure</h3>
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   onChange={handleFileUpload}
//                   className="block rounded-md border w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-black hover:file:bg-blue-100"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">Upload PDF</p>
//               </div>
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex justify-end gap-10 mt-8">
//               <button
//                 onClick={prevStep}
//                 className="px-6 py-2 border border-gray-300 rounded-md"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={nextStep}
//                 className="px-6 py-2 bg-black text-white rounded-md"
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




import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, X } from 'lucide-react';

export default function RecruitmentDetails({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep,
  currentStep,
  totalSteps 
}) {
  // Initialize multi-select fields as arrays if they're not already
  const initializeArrayField = (fieldName) => {
    if (!formData[fieldName]) return [];
    return Array.isArray(formData[fieldName]) ? formData[fieldName] : [formData[fieldName]];
  };

  const [selectedServices, setSelectedServices] = useState(initializeArrayField('recruitmentServicesRequired'));
  const [dropdownOpen, setDropdownOpen] = useState({
    programs: false,
    courses: false,
    companies: false
  });

  const [customInput, setCustomInput] = useState({
    programs: '',
    courses: '',
    companies: ''
  });

  const programsRef = useRef(null);
  const coursesRef = useRef(null);
  const companiesRef = useRef(null);

  const programOptions = ["Engineering", "Business", "Arts", "Science"];
  const courseOptions = ["Computer Science", "Mechanical Engineering", "MBA", "Electrical Engineering"];
  const companyOptions = ["Google", "Microsoft", "Amazon", "TCS"];

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (programsRef.current && !programsRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, programs: false }));
      }
      if (coursesRef.current && !coursesRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, courses: false }));
      }
      if (companiesRef.current && !companiesRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, companies: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(prev => {
      const isOpening = !prev[dropdown];
      return {
        programs: false,
        courses: false,
        companies: false,
        [dropdown]: isOpening
      };
    });
    // Clear custom input when closing dropdown
    if (dropdownOpen[dropdown]) {
      setCustomInput(prev => ({ ...prev, [dropdown]: '' }));
    }
  };

  const handleMultiSelect = (field, value) => {
    // Ensure we're working with an array
    const currentValues = initializeArrayField(field);
    let newValues;
    
    if (currentValues.includes(value)) {
      // Remove if already selected
      newValues = currentValues.filter(item => item !== value);
    } else {
      // Add if not selected
      newValues = [...currentValues, value];
    }
    
    updateFormData(field, newValues);
  };

  const removeSelectedItem = (field, value) => {
    const currentValues = initializeArrayField(field);
    const newValues = currentValues.filter(item => item !== value);
    updateFormData(field, newValues);
  };

  const handleAddCustomItem = (field, dropdownType) => {
    const customValue = customInput[dropdownType].trim();
    if (!customValue) return;

    const currentValues = initializeArrayField(field);
    
    // Check if already exists
    if (!currentValues.includes(customValue)) {
      const newValues = [...currentValues, customValue];
      updateFormData(field, newValues);
    }
    
    // Clear input and close dropdown
    setCustomInput(prev => ({ ...prev, [dropdownType]: '' }));
    setDropdownOpen(prev => ({ ...prev, [dropdownType]: false }));
  };

  const handleCustomInputChange = (dropdownType, value) => {
    setCustomInput(prev => ({ ...prev, [dropdownType]: value }));
  };

  const handleKeyPress = (e, field, dropdownType) => {
    if (e.key === 'Enter' && customInput[dropdownType].trim()) {
      e.preventDefault();
      handleAddCustomItem(field, dropdownType);
    }
  };

  const handleServiceToggle = (service) => {
    const currentServices = selectedServices || [];
    let newServices;
    
    if (currentServices.includes(service)) {
      // Remove if already selected
      newServices = currentServices.filter(s => s !== service);
    } else {
      // Add if not selected
      newServices = [...currentServices, service];
    }
    
    setSelectedServices(newServices);
    updateFormData('recruitmentServicesRequired', newServices);
  };

  const handleFileUpload = (e) => {
    updateFormData('collegeBrochure', e.target.files[0]);
  };

  const isAnyDropdownOpen = Object.values(dropdownOpen).some(Boolean);

  const renderDropdown = (dropdownType, field, label, options, placeholder) => {
    const currentValues = initializeArrayField(field);
    
    return (
      <div ref={dropdownType === 'programs' ? programsRef : dropdownType === 'courses' ? coursesRef : companiesRef} className="relative">
        <label className="block font-medium mb-3 text-gray-700 text-lg">{label}</label>
        
        {/* Selected items chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {currentValues.map((item, index) => (
            <span key={index} className="flex items-center bg-gray-100/80 backdrop-blur-sm text-base text-black px-4 py-2 rounded-xl border border-gray-200/80">
              {item}
              <button 
                type="button" 
                onClick={() => removeSelectedItem(field, item)} 
                className="ml-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        
        <div
          className="flex items-center justify-between p-4 w-full bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl cursor-pointer hover:border-[#93c5fd] transition-all duration-200"
          onClick={() => toggleDropdown(dropdownType)}
        >
          <span className="text-gray-500 text-lg">
            {placeholder}
          </span>
          <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${dropdownOpen[dropdownType] ? "rotate-180" : ""}`} />
        </div>
        
        {dropdownOpen[dropdownType] && (
          <div className="absolute z-20 mt-2 w-full bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-xl shadow-xl shadow-blue-50/30 max-h-80 overflow-auto">
            {/* Custom input section */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customInput[dropdownType]}
                  onChange={(e) => handleCustomInputChange(dropdownType, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, field, dropdownType)}
                  placeholder={`Add custom ${dropdownType === 'programs' ? 'program' : dropdownType === 'courses' ? 'course' : 'company'}`}
                  className="flex-1 px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent text-lg transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddCustomItem(field, dropdownType);
                  }}
                  disabled={!customInput[dropdownType].trim()}
                  className={`px-6 py-3 rounded-xl font-medium text-lg transition-all duration-300 ${
                    customInput[dropdownType].trim() 
                      ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white hover:shadow-lg hover:shadow-[#93c5fd]/40' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Predefined options */}
            <div className="p-2">
              {options.map(option => (
                <div
                  key={option}
                  onClick={() => handleMultiSelect(field, option)}
                  className={`px-4 py-3 hover:bg-gray-50/50 cursor-pointer flex items-center justify-between rounded-lg mx-1 my-1 transition-all duration-200 ${
                    currentValues.includes(option) 
                      ? "bg-gradient-to-r from-[#e0f2fe] to-[#dbeafe] text-[#1d4ed8] border border-blue-100" 
                      : ""
                  }`}
                >
                  <span className="text-lg">{option}</span>
                  {currentValues.includes(option) && (
                    <span className="text-[#3b82f6] font-bold text-lg">✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Divider if there are both custom items and predefined options */}
            {currentValues.filter(item => !options.includes(item)).length > 0 && options.length > 0 && (
              <div className="border-t border-gray-200/50 mx-4 my-2"></div>
            )}

            {/* Custom items */}
            {currentValues
              .filter(item => !options.includes(item))
              .map(customItem => (
                <div
                  key={customItem}
                  onClick={() => handleMultiSelect(field, customItem)}
                  className={`px-4 py-3 hover:bg-gray-50/50 cursor-pointer flex items-center justify-between rounded-lg mx-1 my-1 transition-all duration-200 ${
                    currentValues.includes(customItem) 
                      ? "bg-gradient-to-r from-[#e0f2fe] to-[#dbeafe] text-[#1d4ed8] border border-blue-100" 
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#3b82f6] text-lg">•</span>
                    <span className="text-lg">{customItem}</span>
                    <span className="text-sm text-gray-500 italic">(custom)</span>
                  </div>
                  {currentValues.includes(customItem) && (
                    <span className="text-[#3b82f6] font-bold text-lg">✓</span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7] via-[#d4e8f9] to-[#cff7ea]">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Card with blur border effect - Same large size */}
        <div className="relative w-full max-w-4xl">
          {/* Blur border - positioned around the card */}
          <div className="absolute -inset-6 bg-gradient-to-br from-[#fbcfe8]/20 via-[#93c5fd]/20 to-[#a7f3d0]/20 rounded-4xl blur-2xl -z-10"></div>
          
          {/* Optional corner accent blurs */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#fbcfe8]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#93c5fd]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c7d2fe]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#a7f3d0]/30 rounded-full blur-3xl -z-10"></div>
          
          {/* Main Card - Same large size */}
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/70 rounded-3xl shadow-xl shadow-blue-50/50 p-10">
            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
                <span className="text-base font-medium text-gray-600">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="h-2.5 bg-gray-200/50 backdrop-blur-sm rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-6">
              Placement & Recruitment Details
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Define your hiring partnerships and recruitment process.
            </p>

            <div className="space-y-8">
              {/* Programs Offered Dropdown */}
              {renderDropdown(
                'programs',
                'programsOffered',
                'Programs Offered',
                programOptions,
                'Select or add programs'
              )}

              {/* Popular Courses for Recruitment */}
              {renderDropdown(
                'courses',
                'popularCoursesForRecruitment',
                'Popular Courses for Recruitment',
                courseOptions,
                'Select or add courses'
              )}

              {/* Preferred Hiring Companies */}
              {renderDropdown(
                'companies',
                'preferredHiringCompanies',
                'Preferred Hiring Companies',
                companyOptions,
                'Select or add companies'
              )}

              {/* Recruitment Services */}
              <div className="border-t border-gray-200/50 pt-8">
                <h3 className="font-medium text-lg mb-6 text-gray-700">Recruitment Services Required?</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {['Job Fairs', 'Internship Support', 'Company Tie-ups'].map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`px-8 py-4 rounded-xl border transition-all duration-300 text-lg font-medium ${
                        selectedServices.includes(service) 
                          ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-lg shadow-[#93c5fd]/30 hover:shadow-[#93c5fd]/50' 
                          : 'bg-white/70 backdrop-blur-sm border-gray-200/80 text-gray-700 hover:bg-white/90 hover:border-[#93c5fd] hover:shadow-md'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Section */}
              <div className="border-t border-gray-200/50 pt-8">
                <h3 className="font-medium text-lg mb-6 text-gray-700">Upload College Brochure</h3>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="block rounded-xl border border-gray-200/80 w-full text-lg text-gray-500 bg-white/70 backdrop-blur-sm 
                             file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-lg file:font-medium 
                             file:bg-gradient-to-r file:from-[#e0f2fe] file:to-[#dbeafe] file:text-[#1d4ed8] 
                             hover:file:bg-gradient-to-r hover:file:from-[#dbeafe] hover:file:to-[#c7d2fe] 
                             transition-all duration-300"
                  />
                  <p className="text-sm text-gray-500 mt-3 ml-2">Upload PDF format only</p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 mt-12 pt-8 border-t border-white/50">
              <button
                type="button"
                onClick={prevStep}
                className="px-10 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl hover:bg-white/90 hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-lg"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
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