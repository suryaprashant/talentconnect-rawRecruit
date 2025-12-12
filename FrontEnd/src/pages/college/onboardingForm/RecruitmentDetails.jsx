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

export default function RecruitmentDetails({ formData, updateFormData, nextStep, prevStep }) {
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
        <label className="block font-medium mb-2">{label}</label>
        
        {/* Selected items chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {currentValues.map((item, index) => (
            <span key={index} className="flex items-center bg-gray-200 text-sm text-black px-3 py-1.5 rounded-full">
              {item}
              <button 
                type="button" 
                onClick={() => removeSelectedItem(field, item)} 
                className="ml-2 text-gray-600 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        
        <div
          className="flex items-center justify-between p-3 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 bg-white"
          onClick={() => toggleDropdown(dropdownType)}
        >
          <span className="text-gray-500">
            {placeholder}
          </span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${dropdownOpen[dropdownType] ? "rotate-180" : ""}`} />
        </div>
        
        {dropdownOpen[dropdownType] && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-72 overflow-auto">
            {/* Custom input section */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput[dropdownType]}
                  onChange={(e) => handleCustomInputChange(dropdownType, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, field, dropdownType)}
                  placeholder={`Add custom ${dropdownType === 'programs' ? 'program' : dropdownType === 'courses' ? 'course' : 'company'}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className={`px-4 py-2 rounded-md font-medium ${
                    customInput[dropdownType].trim() 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Predefined options */}
            <div className="p-1">
              {options.map(option => (
                <div
                  key={option}
                  onClick={() => handleMultiSelect(field, option)}
                  className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between rounded-md mx-1 my-1 ${
                    currentValues.includes(option) ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <span>{option}</span>
                  {currentValues.includes(option) && (
                    <span className="text-blue-500 font-bold">✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Divider if there are both custom items and predefined options */}
            {currentValues.filter(item => !options.includes(item)).length > 0 && options.length > 0 && (
              <div className="border-t border-gray-200 mx-3 my-2"></div>
            )}

           
            {currentValues
              .filter(item => !options.includes(item))
              .map(customItem => (
                <div
                  key={customItem}
                  onClick={() => handleMultiSelect(field, customItem)}
                  className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between rounded-md mx-1 my-1 ${
                    currentValues.includes(customItem) ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-black">•</span>
                    <span>{customItem}</span>
                    <span className="text-xs text-gray-500 italic">(custom)</span>
                  </div>
                  {currentValues.includes(customItem) && (
                    <span className="text-blue-500 font-bold">✓</span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="relative w-full max-w-lg">
          {isAnyDropdownOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => {
                setDropdownOpen({ programs: false, courses: false, companies: false });
                setCustomInput({ programs: '', courses: '', companies: '' });
              }}
            />
          )}

          <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Placement & Recruitment Details</h1>
            <p className="mb-6">Define your hiring partnerships and recruitment process.</p>

            <div className="space-y-6">
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
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium mb-4">Recruitment Services Required?</h3>
                <div className="flex gap-4 h-13">
                  {['Job Fairs', 'Internship Support', 'Company Tie-ups'].map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`px-6 py-2.5 rounded-md border transition-all duration-300 ${
                        selectedServices.includes(service) 
                          ? 'bg-black text-white border-black shadow-md' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Section */}
              <div className="border-gray-200 pt-6">
                <h3 className="font-medium mb-4">Upload College Brochure</h3>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="block rounded-md border w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-black hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">Upload PDF</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-10 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2.5 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors duration-300 shadow-sm"
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