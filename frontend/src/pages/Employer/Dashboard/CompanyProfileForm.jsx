// import { useState } from 'react';
// import { Mail, Phone, Upload, Globe, Linkedin } from 'lucide-react';

// export default function EmployerProfileForm() {
//   const [activeTab, setActiveTab] = useState('Profile');
  
//   return (
//     <div className="flex flex-col w-full bg-gray-50 min-h-screen">
//       {/* Navigation Tabs */}

      
//       {/* Main Content */}
//       <div className="container mx-auto py-6 px-4">
//         {/* About Section */}
//         <div className="mb-6">
//           <h2 className="text-xl font-bold mb-2">About</h2>
//           <p className="text-gray-600 mb-6">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
//           </p>
//         </div>
        
//         {/* Main Form Sections */}
//         <div className="bg-white border rounded-md">
//  {/* Employer Details Section */}
//           <div className="border-b">
//             <div className="grid md:grid-cols-12 gap-4 p-6">
//               <div className="md:col-span-3">
//                 <h3 className="font-bold mb-2">Employer Details</h3>
//                 <p className="text-sm text-gray-600">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
//                 </p>
//               </div>
              
//               <div className="md:col-span-9">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Enter your name <span className="text-red-500">*</span>
//                     </label>
//                     <input 
//                       type="text" 
//                       className="w-full border border-gray-300 p-2 rounded"
//                     />
//                   </div>
                  
             
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Designation <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                         <option>Placeholder</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Enter your work email <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                         <Mail size={16} className="text-gray-500" />
//                       </div>
//                       <input 
//                         type="email" 
//                         className="w-full border border-gray-300 p-2 pl-10 rounded"
//                         placeholder="hello@xyz.com"
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Enter your mobile no. <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                         <Phone size={16} className="text-gray-500" />
//                       </div>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 p-2 pl-10 rounded"
//                         placeholder="1234567890"
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">LinkedIn Profile</label>
//                     <div className="flex">
//                       <div className="bg-gray-100 border border-gray-300 p-2 rounded-l">http://</div>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 p-2 rounded-r"
//                         placeholder="www.resume.io"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end p-4 border-t">
//               <button className="bg-black text-white px-6 py-2">Edit</button>
//             </div>
//           </div>




//           {/* Company Details Section */}
//           <div className="border-b">
//             <div className="grid md:grid-cols-12 gap-4 p-6">
//               <div className="md:col-span-3">
//                 <h3 className="font-bold mb-2">Company Details</h3>
//                 <p className="text-sm text-gray-600">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
//                 </p>
//               </div>
              
//               <div className="md:col-span-9">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Company Name <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                         <option>Placeholder</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
                  
//                   </div>
                  
                 
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Company Type <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                         <option>Placeholder</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Industry Type <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                         <option>Placeholder</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Number of Employees <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                         <option>Placeholder</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Established Year <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                         <option>Placeholder</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Contact Number <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                         <Phone size={16} className="text-gray-500" />
//                       </div>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 p-2 pl-10 rounded"
//                         placeholder="1234567890"
//                       />
//                     </div>
//                   </div>
                
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">
//                       Company Location <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                         <option>Placeholder</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block mb-1 text-sm font-medium">State</label>
//                       <div className="relative">
//                         <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                           <option>Placeholder</option>
//                         </select>
//                         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block mb-1 text-sm font-medium">City</label>
//                       <div className="relative">
//                         <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                           <option>Placeholder</option>
//                         </select>
//                         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block mb-1 text-sm font-medium">Country</label>
//                       <div className="relative">
//                         <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                           <option>Placeholder</option>
//                         </select>
//                         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block mb-1 text-sm font-medium">Pincode</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 p-2 rounded"
//                         placeholder="Placeholder"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end p-4">
//               <button className="bg-black text-white px-6 py-2">Edit</button>
//             </div>
//           </div>
          
          
//           {/* Hiring Preferences Section */}
//           <div className="border-b">
//             <div className="grid md:grid-cols-12 gap-4 p-6">
//               <div className="md:col-span-3">
//                 <h3 className="font-bold mb-2">Hiring Preferences</h3>
//                 <p className="text-sm text-gray-600">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
//                 </p>
//               </div>
              
//               <div className="md:col-span-9">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">Job Roles You Hire For</label>
//                     <div className="relative">
//                       <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                         <option>Multiple-select</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">Preferred Hiring Locations</label>
//                     <div className="relative">
//                       <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
//                         <option>Multiple-select</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">Looking for</label>
//                     <div className="flex gap-2">
//                       <button className="border border-gray-300 px-4 py-1 text-sm">Job</button>
//                       <button className="bg-black text-white px-4 py-1 text-sm">Internship</button>
//                       <button className="border border-gray-300 px-4 py-1 text-sm">Both</button>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium">Employment type</label>
//                     <div className="flex gap-2">
//                       <button className="border border-gray-300 px-4 py-1 text-sm">Part-time</button>
//                       <button className="bg-black text-white px-4 py-1 text-sm">Full-time</button>
//                       <button className="border border-gray-300 px-4 py-1 text-sm">Contract</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end p-4">
//               <button className="bg-black text-white px-6 py-2">Edit</button>
//             </div>
//           </div>
        
 
         

     
//             </div>
    
//           </div>
        
      
//     </div>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Mail, Phone, Globe, Linkedin } from 'lucide-react'; // Import icons

// // Helper function to convert form data to JSON and FormData for files
// const buildFormData = (data, files) => {
//   const formData = new FormData();

//   formData.append('employerDetails', JSON.stringify(data.employerDetails));
//   formData.append('companyDetails', JSON.stringify(data.companyDetails));
//   formData.append('hiringPreferences', JSON.stringify(data.hiringPreferences));

//   if (files.profileImage) {
//     formData.append('profileImage', files.profileImage);
//   }
//   if (files.backgroundImage) {
//     formData.append('backgroundImage', files.backgroundImage);
//   }
//   return formData;
// };

// export default function EmployerProfileForm({ employerData, onProfileUpdated }) {
//   const [formData, setFormData] = useState({
//     employerDetails: {
//       name: '',
//       designation: '',
//       workEmail: '',
//       mobile: '',
//       linkedIn: '',
//       profileImageUrl: '',
//       backgroundImageUrl: '',
//     },
//     companyDetails: {
//       companyName: '',
//       location: '',
//       state: '',
//       city: '',
//       country: '',
//       pincode: '',
//       companyType: '',
//       industryType: '',
//       establishedYear: '',
//       contactNumber: '',
//       description: '',
//       companyWebsite: '', // Added this field, assuming it might exist
//     },
//     hiringPreferences: {
//       jobRoles: [],
//       hiringLocations: [],
//       lookingFor: '',
//       employmentTypes: [],
//     },
//   });

//   const [files, setFiles] = useState({
//     profileImage: null,
//     backgroundImage: null,
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [isEditing, setIsEditing] = useState(false); // New state for edit mode

//   // Populate form data when employerData prop changes (on initial fetch or external update)
//   useEffect(() => {
//     if (employerData) {
//       setFormData({
//         employerDetails: employerData.employerDetails || {},
//         companyDetails: employerData.companyDetails || {},
//         hiringPreferences: employerData.hiringPreferences || {},
//       });
//       setIsEditing(false); // Ensure non-editable when data is loaded
//     } else {
//       // If no employerData, assume creating a new profile, make it editable by default
//       setIsEditing(true);
//     }
//   }, [employerData]);

//   const handleEmployerDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       employerDetails: {
//         ...prev.employerDetails,
//         [name]: value,
//       },
//     }));
//   };

//   const handleCompanyDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       companyDetails: {
//         ...prev.companyDetails,
//         [name]: value,
//       },
//     }));
//   };

//   const handleHiringPreferencesChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'jobRoles' || name === 'hiringLocations' || name === 'employmentTypes') {
//       setFormData((prev) => ({
//         ...prev,
//         hiringPreferences: {
//           ...prev.hiringPreferences,
//           [name]: value.split(',').map(item => item.trim()).filter(item => item !== ''),
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         hiringPreferences: {
//           ...prev.hiringPreferences,
//           [name]: value,
//         },
//       }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     setFiles((prev) => ({
//       ...prev,
//       [name]: selectedFiles[0],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       const dataToSend = buildFormData(formData, files);
//       const url = `${import.meta.env.VITE_Backend_URL}/api/dashboard/update-employer`; // Corrected API endpoint

//       const response = await axios.put(
//         url,
//         dataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           withCredentials: true,
//         }
//       );
//       setSuccess(true);
//       setFiles({ profileImage: null, backgroundImage: null }); // Clear file inputs after successful upload
//       setIsEditing(false); // Exit edit mode after successful save

//       if (onProfileUpdated) {
//         onProfileUpdated(response.data.profile); // Pass updated profile back to parent
//       }
//     } catch (err) {
//       console.error('Error updating employer profile:', err);
//       setError(err.response?.data?.message || 'Failed to update profile.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//     setSuccess(false); // Clear success message when entering edit mode
//     setError(null); // Clear error message when entering edit mode
//   };

//   const handleCancelClick = () => {
//     setIsEditing(false);
//     // Reset form data to original employerData if available
//     if (employerData) {
//       setFormData({
//         employerDetails: employerData.employerDetails || {},
//         companyDetails: employerData.companyDetails || {},
//         hiringPreferences: employerData.hiringPreferences || {},
//       });
//     }
//     setFiles({ profileImage: null, backgroundImage: null }); // Clear selected files
//     setError(null);
//     setSuccess(false);
//   };

//   // Helper for input className based on edit mode
//   const inputClass = `mt-1 block w-full border rounded-md shadow-sm p-2 ${
//     isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-700'
//   }`;
//   const selectClass = `mt-1 block w-full border rounded-md shadow-sm p-2 pr-8 appearance-none ${
//     isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-700'
//   }`;
//   const fileInputClass = `mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
//     isEditing ? 'file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' : 'file:bg-gray-100 file:text-gray-500 cursor-not-allowed'
//   }`;

//   return (
//     <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//       <h2 className="text-2xl font-bold mb-6">Edit Employer Profile</h2>

//       {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Profile updated successfully!</div>}
//       {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">Error: {error}</div>}

//       <form onSubmit={handleSubmit}>
//         {/* Employer Details */}
//         <section className="mb-8 p-4 border rounded-md">
//           <h3 className="text-xl font-semibold mb-4">Your Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.employerDetails.name || ''}
//                 onChange={handleEmployerDetailsChange}
//                 className={inputClass}
//                 required
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
//               <input
//                 type="text"
//                 id="designation"
//                 name="designation"
//                 value={formData.employerDetails.designation || ''}
//                 onChange={handleEmployerDetailsChange}
//                 className={inputClass}
//                 required
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="workEmail" className="block text-sm font-medium text-gray-700">Work Email</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Mail size={16} className="text-gray-500" />
//                 </div>
//                 <input
//                   type="email"
//                   id="workEmail"
//                   name="workEmail"
//                   value={formData.employerDetails.workEmail || ''}
//                   onChange={handleEmployerDetailsChange}
//                   className={`${inputClass} pl-10`} // Added pl-10 for icon
//                   required
//                   readOnly={!isEditing}
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Phone size={16} className="text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   id="mobile"
//                   name="mobile"
//                   value={formData.employerDetails.mobile || ''}
//                   onChange={handleEmployerDetailsChange}
//                   className={`${inputClass} pl-10`} // Added pl-10 for icon
//                   required
//                   readOnly={!isEditing}
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
//               <div className="relative">
//                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <Linkedin size={16} className="text-gray-500" />
//                  </div>
//                  <input
//                     type="url"
//                     id="linkedIn"
//                     name="linkedIn"
//                     value={formData.employerDetails.linkedIn || ''}
//                     onChange={handleEmployerDetailsChange}
//                     className={`${inputClass} pl-10`} // Added pl-10 for icon
//                     readOnly={!isEditing}
//                  />
//               </div>
//             </div>
           
          
//           </div>
//         </section>

//         {/* Company Details */}
//         <section className="mb-8 p-4 border rounded-md">
//           <h3 className="text-xl font-semibold mb-4">Company Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
//               <input
//                 type="text"
//                 id="companyName"
//                 name="companyName"
//                 value={formData.companyDetails.companyName || ''}
//                 onChange={handleCompanyDetailsChange}
//                 className={inputClass}
//                 required
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="location" className="block text-sm font-medium text-gray-700">Company Location (e.g., street address)</label>
//               <input
//                 type="text"
//                 id="location"
//                 name="location"
//                 value={formData.companyDetails.location || ''}
//                 onChange={handleCompanyDetailsChange}
//                 className={inputClass}
//                 required
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
//               <input
//                 type="text"
//                 id="state"
//                 name="state"
//                 value={formData.companyDetails.state || ''}
//                 onChange={handleCompanyDetailsChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
//               <input
//                 type="text"
//                 id="city"
//                 name="city"
//                 value={formData.companyDetails.city || ''}
//                 onChange={handleCompanyDetailsChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
//               <input
//                 type="text"
//                 id="country"
//                 name="country"
//                 value={formData.companyDetails.country || ''}
//                 onChange={handleCompanyDetailsChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
//               <input
//                 type="text"
//                 id="pincode"
//                 name="pincode"
//                 value={formData.companyDetails.pincode || ''}
//                 onChange={handleCompanyDetailsChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="companyType" className="block text-sm font-medium text-gray-700">Company Type</label>
//               <input
//                 type="text"
//                 id="companyType"
//                 name="companyType"
//                 value={formData.companyDetails.companyType || ''}
//                 onChange={handleCompanyDetailsChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="industryType" className="block text-sm font-medium text-gray-700">Industry Type</label>
//               <input
//                 type="text"
//                 id="industryType"
//                 name="industryType"
//                 value={formData.companyDetails.industryType || ''}
//                 onChange={handleCompanyDetailsChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="establishedYear" className="block text-sm font-medium text-gray-700">Established Year</label>
//               <input
//                 type="text"
//                 id="establishedYear"
//                 name="establishedYear"
//                 value={formData.companyDetails.establishedYear || ''}
//                 onChange={handleCompanyDetailsChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Phone size={16} className="text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   id="contactNumber"
//                   name="contactNumber"
//                   value={formData.companyDetails.contactNumber || ''}
//                   onChange={handleCompanyDetailsChange}
//                   className={`${inputClass} pl-10`}
//                   readOnly={!isEditing}
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">Company Website URL</label>
//               <div className="relative">
//                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <Globe size={16} className="text-gray-500" />
//                  </div>
//                  <input
//                     type="url"
//                     id="companyWebsite"
//                     name="companyWebsite"
//                     value={formData.companyDetails.companyWebsite || ''}
//                     onChange={handleCompanyDetailsChange}
//                     className={`${inputClass} pl-10`}
//                     readOnly={!isEditing}
//                  />
//               </div>
//             </div>
//             <div className="md:col-span-2">
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700">Company Description</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.companyDetails.description || ''}
//                 onChange={handleCompanyDetailsChange}
//                 rows="4"
//                 className={inputClass}
//                 readOnly={!isEditing}
//               ></textarea>
//             </div>
//           </div>
//         </section>

//         {/* Hiring Preferences */}
//         <section className="mb-8 p-4 border rounded-md">
//           <h3 className="text-xl font-semibold mb-4">Hiring Preferences</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="jobRoles" className="block text-sm font-medium text-gray-700">Job Roles (comma-separated)</label>
//               <input
//                 type="text"
//                 id="jobRoles"
//                 name="jobRoles"
//                 value={formData.hiringPreferences.jobRoles.join(', ') || ''}
//                 onChange={handleHiringPreferencesChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="hiringLocations" className="block text-sm font-medium text-gray-700">Hiring Locations (comma-separated)</label>
//               <input
//                 type="text"
//                 id="hiringLocations"
//                 name="hiringLocations"
//                 value={formData.hiringPreferences.hiringLocations.join(', ') || ''}
//                 onChange={handleHiringPreferencesChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700">Looking for</label>
//               <select
//                 id="lookingFor"
//                 name="lookingFor"
//                 value={formData.hiringPreferences.lookingFor || ''}
//                 onChange={handleHiringPreferencesChange}
//                 className={selectClass}
//                 disabled={!isEditing}
//               >
//                 <option value="">Select</option>
//                 <option value="Job">Job</option>
//                 <option value="Internship">Internship</option>
//                 <option value="Both">Both</option>
//               </select>
//             </div>
//             <div>
//               <label htmlFor="employmentTypes" className="block text-sm font-medium text-gray-700">Employment Types (comma-separated)</label>
//               <input
//                 type="text"
//                 id="employmentTypes"
//                 name="employmentTypes"
//                 value={formData.hiringPreferences.employmentTypes.join(', ') || ''}
//                 onChange={handleHiringPreferencesChange}
//                 className={inputClass}
//                 readOnly={!isEditing}
//               />
//             </div>
//           </div>
//         </section>

//         <div className="flex justify-end gap-4 mt-6">
//           {isEditing ? (
//             <>
//               <button
//                 type="button"
//                 onClick={handleCancelClick}
//                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
//                 disabled={loading}
//               >
//                 {loading ? 'Saving...' : 'Save Changes'}
//               </button>
//             </>
//           ) : (
//             <button
//               type="button"
//               onClick={handleEditClick}
//               className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
//             >
//               Edit Profile
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Globe, Linkedin } from 'lucide-react';

// Helper function to convert form data to JSON and FormData for files
const buildFormData = (data, files) => {
  const formData = new FormData();

  formData.append('employerDetails', JSON.stringify(data.employerDetails));
  formData.append('companyDetails', JSON.stringify(data.companyDetails));
  formData.append('hiringPreferences', JSON.stringify(data.hiringPreferences));

  // ONLY append files if they are actually selected in this form
  if (files.profileImage) {
    formData.append('profileImage', files.profileImage);
  }
  if (files.backgroundImage) {
    formData.append('backgroundImage', files.backgroundImage);
  }
  return formData;
};

export default function EmployerProfileForm({ employerData, onProfileUpdated }) {
  const [formData, setFormData] = useState({
    employerDetails: {
      name: '',
      designation: '',
      workEmail: '',
      mobile: '',
      linkedIn: '',
      profileImageUrl: '', // Managed by separate upload now, but kept for consistency
      backgroundImageUrl: '', // Managed by separate upload now, but kept for consistency
    },
    companyDetails: {
      companyName: '',
      location: '',
      state: '',
      city: '',
      country: '',
      pincode: '',
      companyType: '',
      industryType: '',
      establishedYear: '',
      contactNumber: '',
      description: '',
      companyWebsite: '',
    },
    hiringPreferences: {
      jobRoles: [],
      hiringLocations: [],
      lookingFor: '',
      employmentTypes: [],
    },
  });

  const [files, setFiles] = useState({
    profileImage: null,
    backgroundImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (employerData) {
      setFormData({
        employerDetails: employerData.employerDetails || {},
        companyDetails: employerData.companyDetails || {},
        hiringPreferences: employerData.hiringPreferences || {},
      });
      setIsEditing(false); // Ensure non-editable when data is loaded
    } else {
      // If no employerData, assume creating a new profile, make it editable by default
      setIsEditing(true);
    }
  }, [employerData]);

  const handleEmployerDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      employerDetails: {
        ...prev.employerDetails,
        [name]: value,
      },
    }));
  };

  const handleCompanyDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        [name]: value,
      },
    }));
  };

  const handleHiringPreferencesChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jobRoles' || name === 'hiringLocations' || name === 'employmentTypes') {
      setFormData((prev) => ({
        ...prev,
        hiringPreferences: {
          ...prev.hiringPreferences,
          [name]: value.split(',').map(item => item.trim()).filter(item => item !== ''),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        hiringPreferences: {
          ...prev.hiringPreferences,
          [name]: value,
        },
      }));
    }
  };

  // Files inputs here are only for fallback or if you still want to handle them here.
  // The main image upload is now via EmployerProfile.jsx direct click.
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const dataToSend = buildFormData(formData, files);
      let response;
      if (employerData) {
        // Update existing profile
        response = await axios.put(
          `${import.meta.env.VITE_Backend_URL}/api/dashboard/update-employer`,
          dataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          }
        );
      } else {
        // Create new profile
        response = await axios.post(
          `${import.meta.env.VITE_Backend_URL}/api/dashboard/employerOnboarding`,
          dataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          }
        );
      }

      setSuccess(true);
      setFiles({ profileImage: null, backgroundImage: null });
      setIsEditing(false); // Exit edit mode after successful save

      if (onProfileUpdated) {
        onProfileUpdated(response.data.profile);
      }
    } catch (err) {
      console.error('Error saving employer profile:', err);
      setError(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSuccess(false);
    setError(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (employerData) {
      setFormData({
        employerDetails: employerData.employerDetails || {},
        companyDetails: employerData.companyDetails || {},
        hiringPreferences: employerData.hiringPreferences || {},
      });
    } else {
        // If creating new and canceling, reset to empty
        setFormData({
            employerDetails: { name: '', designation: '', workEmail: '', mobile: '', linkedIn: '', profileImageUrl: '', backgroundImageUrl: '' },
            companyDetails: { companyName: '', location: '', state: '', city: '', country: '', pincode: '', companyType: '', industryType: '', establishedYear: '', contactNumber: '', description: '', companyWebsite: '' },
            hiringPreferences: { jobRoles: [], hiringLocations: [], lookingFor: '', employmentTypes: [] },
        });
    }
    setFiles({ profileImage: null, backgroundImage: null });
    setError(null);
    setSuccess(false);
  };

  const inputClass = `mt-1 block w-full border rounded-md shadow-sm p-2 ${
    isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-700'
  }`;
  const selectClass = `mt-1 block w-full border rounded-md shadow-sm p-2 pr-8 appearance-none ${
    isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-700'
  }`;
  const fileInputClass = `mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
    isEditing ? 'file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' : 'file:bg-gray-100 file:text-gray-500 cursor-not-allowed'
  }`;

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">{employerData ? 'Edit Employer Profile' : 'Create Employer Profile'}</h2>

      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Profile saved successfully!</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">Error: {error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Employer Details */}
        <section className="mb-8 p-4 border rounded-md">
          <h3 className="text-xl font-semibold mb-4">Your Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.employerDetails.name || ''}
                onChange={handleEmployerDetailsChange}
                className={inputClass}
                required
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.employerDetails.designation || ''}
                onChange={handleEmployerDetailsChange}
                className={inputClass}
                required
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="workEmail" className="block text-sm font-medium text-gray-700">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={16} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  id="workEmail"
                  name="workEmail"
                  value={formData.employerDetails.workEmail || ''}
                  onChange={handleEmployerDetailsChange}
                  className={`${inputClass} pl-10`}
                  required
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.employerDetails.mobile || ''}
                  onChange={handleEmployerDetailsChange}
                  className={`${inputClass} pl-10`}
                  required
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div>
              <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Linkedin size={16} className="text-gray-500" />
                 </div>
                 <input
                    type="url"
                    id="linkedIn"
                    name="linkedIn"
                    value={formData.employerDetails.linkedIn || ''}
                    onChange={handleEmployerDetailsChange}
                    className={`${inputClass} pl-10`}
                    readOnly={!isEditing}
                 />
              </div>
            </div>
            {/* Removed profileImage and backgroundImage inputs here, as they are handled in EmployerProfile.jsx */}
          </div>
        </section>

        {/* Company Details */}
        <section className="mb-8 p-4 border rounded-md">
          <h3 className="text-xl font-semibold mb-4">Company Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyDetails.companyName || ''}
                onChange={handleCompanyDetailsChange}
                className={inputClass}
                required
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Company Location (e.g., street address)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.companyDetails.location || ''}
                onChange={handleCompanyDetailsChange}
                className={inputClass}
                required
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.companyDetails.state || ''}
                onChange={handleCompanyDetailsChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.companyDetails.city || ''}
                onChange={handleCompanyDetailsChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.companyDetails.country || ''}
                onChange={handleCompanyDetailsChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.companyDetails.pincode || ''}
                onChange={handleCompanyDetailsChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="companyType" className="block text-sm font-medium text-gray-700">Company Type</label>
              <input
                type="text"
                id="companyType"
                name="companyType"
                value={formData.companyDetails.companyType || ''}
                onChange={handleCompanyDetailsChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="industryType" className="block text-sm font-medium text-gray-700">Industry Type</label>
              <input
                type="text"
                id="industryType"
                name="industryType"
                value={formData.companyDetails.industryType || ''}
                onChange={handleCompanyDetailsChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="establishedYear" className="block text-sm font-medium text-gray-700">Established Year</label>
              <input
                type="text"
                id="establishedYear"
                name="establishedYear"
                value={formData.companyDetails.establishedYear || ''}
                onChange={handleCompanyDetailsChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.companyDetails.contactNumber || ''}
                  onChange={handleCompanyDetailsChange}
                  className={`${inputClass} pl-10`}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div>
              <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">Company Website URL</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Globe size={16} className="text-gray-500" />
                 </div>
                 <input
                    type="url"
                    id="companyWebsite"
                    name="companyWebsite"
                    value={formData.companyDetails.companyWebsite || ''}
                    onChange={handleCompanyDetailsChange}
                    className={`${inputClass} pl-10`}
                    readOnly={!isEditing}
                 />
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Company Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.companyDetails.description || ''}
                onChange={handleCompanyDetailsChange}
                rows="4"
                className={inputClass}
                readOnly={!isEditing}
              ></textarea>
            </div>
          </div>
        </section>

        {/* Hiring Preferences */}
        <section className="mb-8 p-4 border rounded-md">
          <h3 className="text-xl font-semibold mb-4">Hiring Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="jobRoles" className="block text-sm font-medium text-gray-700">Job Roles (comma-separated)</label>
              <input
                type="text"
                id="jobRoles"
                name="jobRoles"
                value={formData.hiringPreferences.jobRoles.join(', ') || ''}
                onChange={handleHiringPreferencesChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="hiringLocations" className="block text-sm font-medium text-gray-700">Hiring Locations (comma-separated)</label>
              <input
                type="text"
                id="hiringLocations"
                name="hiringLocations"
                value={formData.hiringPreferences.hiringLocations.join(', ') || ''}
                onChange={handleHiringPreferencesChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700">Looking for</label>
              <select
                id="lookingFor"
                name="lookingFor"
                value={formData.hiringPreferences.lookingFor || ''}
                onChange={handleHiringPreferencesChange}
                className={selectClass}
                disabled={!isEditing}
              >
                <option value="">Select</option>
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label htmlFor="employmentTypes" className="block text-sm font-medium text-gray-700">Employment Types (comma-separated)</label>
              <input
                type="text"
                id="employmentTypes"
                name="employmentTypes"
                value={formData.hiringPreferences.employmentTypes.join(', ') || ''}
                onChange={handleHiringPreferencesChange}
                className={inputClass}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 mt-6">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? 'Saving...' : employerData ? 'Save Changes' : 'Create Profile'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEditClick}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}