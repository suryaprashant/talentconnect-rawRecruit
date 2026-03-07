// import { useState, useEffect, useRef, useCallback } from 'react';
// import React from 'react';
// import Button from '@/components/ui/Button';
// import Avatar from '@/components/ui/Avatar';
// import Badge from '@/components/ui/Badge';
// import { FiLinkedin, FiGithub, FiGlobe, FiPlus, FiUploadCloud, FiChevronDown } from 'react-icons/fi';
// import axios from 'axios';
// import { Plus, Upload, X } from 'lucide-react';

// // Memoized child component for performance
// const ExperienceCard = React.memo(({ experience, type, onUpdate, onRemove, canRemove, isProfileEditing }) => {
//   const displayFieldStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[40px] flex items-center";

//   const handleInputChange = (field, value) => {
//     onUpdate(type, experience.id, field, value);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       onUpdate(type, experience.id, 'certificate', file);
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
//       {canRemove && isProfileEditing && (
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={() => onRemove(type, experience.id)}
//             className="p-1 text-gray-400 hover:text-red-500 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       )}
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             {type === 'leadership' ? 'Organization' : 'Company/Organization'}
//           </label>
//           {isProfileEditing ? (
//             <input
//               type="text"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               placeholder={`Enter ${type === 'leadership' ? 'organization' : 'company'} name`}
//               value={(type === 'leadership' ? experience.organization : experience.company) || ''}
//               onChange={(e) => handleInputChange(
//                 type === 'leadership' ? 'organization' : 'company', 
//                 e.target.value
//               )}
//             />
//           ) : (
//             <div className={displayFieldStyle}>
//               {(type === 'leadership' ? experience.organization : experience.company) || "N/A"}
//             </div>
//           )}
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             {type === 'leadership' ? 'Role/Position' : 'Job Role'}
//           </label>
//           {isProfileEditing ? (
//             <input
//               type="text"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               placeholder={`Enter ${type === 'leadership' ? 'role' : 'job role'}`}
//               value={experience.role || ''}
//               onChange={(e) => handleInputChange(
//                 'role',
//                 e.target.value
//               )}
//             />
//           ) : (
//             <div className={displayFieldStyle}>
//               {experience.role || "N/A"}
//             </div>
//           )}
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Start Date
//           </label>
//           {isProfileEditing ? (
//             <input
//               type="date"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               value={experience.startDate || ''}
//               onChange={(e) => handleInputChange('startDate', e.target.value)}
//             />
//           ) : (
//             <div className={displayFieldStyle}>
//               {experience.startDate || "N/A"}
//             </div>
//           )}
//         </div>
        
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             End Date
//           </label>
//           {isProfileEditing ? (
//             <input
//               type="date"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               value={experience.endDate || ''}
//               onChange={(e) => handleInputChange('endDate', e.target.value)}
//             />
//           ) : (
//             <div className={displayFieldStyle}>
//               {experience.endDate || "N/A"}
//             </div>
//           )}
//         </div>
        
//         <div className="md:col-span-2">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Description
//           </label>
//           {isProfileEditing ? (
//             <textarea
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
//               placeholder="Describe your role, responsibilities, and achievements..."
//               rows="4"
//               value={experience.description || ''}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//             />
//           ) : (
//             <div className={`${displayFieldStyle} items-start min-h-[100px]`}>
//               {experience.description || "N/A"}
//             </div>
//           )}
//         </div>
        
//         <div className="md:col-span-2">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Certificate (Optional)
//           </label>
//           {isProfileEditing ? (
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
//               <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
//               <div className="text-sm text-gray-600">
//                 <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
//                   Upload a file
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                     onChange={handleFileChange}
//                   />
//                 </label>
//                 <span className="ml-1">or drag and drop</span>
//               </div>
//               <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
//               {experience.certificate && (
//                 <p className="text-sm text-green-600 mt-2 font-medium">
//                   File uploaded: {typeof experience.certificate === 'string' ? 'Existing Certificate' : experience.certificate.name}
//                 </p>
//               )}
//             </div>
//           ) : (
//             <div className={displayFieldStyle}>
//               {experience.certificate ? (
//                 <a href={typeof experience.certificate === 'string' ? experience.certificate : '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer">
//                   View Certificate
//                 </a>
//               ) : (
//                 "No certificate uploaded"
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// });

// const AwardCard = React.memo(({ award, onUpdate, onRemove, canRemove, isProfileEditing }) => {
//     const displayFieldStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[40px] flex items-center";

//     return (
//       <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
//         {canRemove && isProfileEditing && (
//           <div className="flex justify-end mb-4">
//             <button
//               onClick={() => onRemove('award', award.id)}
//               className="p-1 text-gray-400 hover:text-red-500 transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         )}
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Award Title
//             </label>
//             {isProfileEditing ? (
//               <input
//                 type="text"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Enter award title"
//                 value={award.title || ''}
//                 onChange={(e) => onUpdate('award', award.id, 'title', e.target.value)}
//               />
//             ) : (
//               <div className={displayFieldStyle}>
//                 {award.title || "N/A"}
//               </div>
//             )}
//           </div>
          
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Awarding Organization
//             </label>
//             {isProfileEditing ? (
//               <input
//                 type="text"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Enter organization name"
//                 value={award.organization || ''}
//                 onChange={(e) => onUpdate('award', award.id, 'organization', e.target.value)}
//               />
//             ) : (
//               <div className={displayFieldStyle}>
//                 {award.organization || "N/A"}
//               </div>
//             )}
//           </div>
          
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Start Date
//             </label>
//             {isProfileEditing ? (
//               <input
//                 type="date"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 value={award.startDate || ''}
//                 onChange={(e) => onUpdate('award', award.id, 'startDate', e.target.value)}
//               />
//             ) : (
//               <div className={displayFieldStyle}>
//                 {award.startDate || "N/A"}
//               </div>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               End Date
//             </label>
//             {isProfileEditing ? (
//               <input
//                 type="date"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 value={award.endDate || ''}
//                 onChange={(e) => onUpdate('award', award.id, 'endDate', e.target.value)}
//               />
//             ) : (
//               <div className={displayFieldStyle}>
//                 {award.endDate || "N/A"}
//               </div>
//             )}
//           </div>
          
//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Description
//             </label>
//             {isProfileEditing ? (
//               <textarea
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
//                 placeholder="Describe the award and your achievement..."
//                 rows="3"
//                 value={award.description || ''}
//                 onChange={(e) => onUpdate('award', award.id, 'description', e.target.value)}
//               />
//             ) : (
//               <div className={`${displayFieldStyle} items-start min-h-[80px]`}>
//                 {award.description || "N/A"}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
// });

// function ProfProfile() {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isProfileEditing, setIsProfileEditing] = useState(false);
//   const [hasOnboardingData, setHasOnboardingData] = useState(true);

//   const [profileData, setProfileData] = useState({
//     profileImageUrl: '',
//     backgroundImageUrl: '',
//     resumeUrl: '',
//     fullName: '',
//     email: '',
//     phone: '',
//     about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique...',
//     college: '',
//     degree: '',
//     yearOfGraduation: '',
//     cgpa: '',
//     degreeCertificateUrl: '',
//     industry: [],
//     jobRoles: [],
//     locations: [],
//     lookingFor: '',
//     employmentType: '',
//     expectedSalaryCurrency: '',
//     expectedSalaryAmount: '',
//     currentSalaryCurrency: '',
//     currentSalaryAmount: '',
//     skills: [],
//     linkedin: '',
//     github: '',
//     portfolio: '',
//     certifications: [],
//     projectUrl: '',
//     referralSource: '',
//   });

//   // States for dynamic sections
//   const [workExperiences, setWorkExperiences] = useState([]);
//   const [internationalExperiences, setInternationalExperiences] = useState([]);
//   const [leadershipExperiences, setLeadershipExperiences] = useState([]);
//   const [awards, setAwards] = useState([]);

//   // States for files that upload immediately
//   const [profileImageFile, setProfileImageFile] = useState(null);
//   const [backgroundImageFile, setBackgroundImageFile] = useState(null);
//   const [resumeFile, setResumeFile] = useState(null);

//   // States for files saved with the main "Save" button
//   const [degreeCertificateFile, setDegreeCertificateFile] = useState(null);
//   const [projectFile, setProjectFile] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [isJobRolesDropdownOpen, setIsJobRolesDropdownOpen] = useState(false);
//   const [isLocationsDropdownOpen, setIsLocationsDropdownOpen] = useState(false);

//   const jobRolesDropdownRef = useRef(null);
//   const locationsDropdownRef = useRef(null);

//   const predefinedJobRoles = ['Software Engineer', 'Data Analyst', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Full Stack Developer'];
//   const predefinedLocations = ['Noida', 'Delhi', 'Gurgaon', 'Bangalore', 'Pune', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata', 'Remote'];
//   const predefinedEmploymentTypes = ['part time', 'full time', 'contract'];
//   const predefinedLookingFor = ['Job', 'Internship', 'Both'];
//   const predefinedIndustries = ['IT Industry', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Retail', 'Manufacturing', 'Automotive'];
//   const predefinedCurrencies = ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD"];

//   useEffect(() => {
//     const fetchUserProfileData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const backendUrl = import.meta.env.VITE_Backend_URL;
//         const token = localStorage.getItem('token');

//         const response = await axios.get(`${backendUrl}/api/onboarding/me`, {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         if (response.data) {
//           const fetchedData = response.data;
//           setHasOnboardingData(true);

//           setProfileData(prevData => ({
//             ...prevData,
//             ...fetchedData,
//             fullName: fetchedData.name || '',
//             profileImageUrl: fetchedData.profileImage || '',
//             backgroundImageUrl: fetchedData.backgroundImage || '',
//             resumeUrl: fetchedData.resume || '',
//             degreeCertificateUrl: fetchedData.degreeCertificate || '',
//             projectUrl: fetchedData.project || '',
//             certifications: (fetchedData.certifications && typeof fetchedData.certifications === 'string' && fetchedData.certifications.length > 0)
//               ? fetchedData.certifications.split('; ').map(name => ({ name, url: '' }))
//               : [],
//           }));

//           if (fetchedData.experiences && fetchedData.experiences.length > 0) {
//             setWorkExperiences(fetchedData.experiences.map(exp => ({ ...exp, id: exp._id || Date.now() })));
//           }
//           if (fetchedData.internationalExperience && fetchedData.internationalExperience.length > 0) {
//             setInternationalExperiences(fetchedData.internationalExperience.map(exp => ({ ...exp, id: exp._id || Date.now() })));
//           }
//           if (fetchedData.leadership && fetchedData.leadership.length > 0) {
//             setLeadershipExperiences(fetchedData.leadership.map(exp => ({ ...exp, id: exp._id || Date.now() })));
//           }
//           if (fetchedData.awards && fetchedData.awards.length > 0) {
//             setAwards(fetchedData.awards.map(award => ({ ...award, id: award._id || Date.now() })));
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching user profile:', err);
//         if (err.response && err.response.status === 404) {
//           setHasOnboardingData(false);
//         }
//         setError('Failed to load profile data. Please fill out your profile.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserProfileData();
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (jobRolesDropdownRef.current && !jobRolesDropdownRef.current.contains(event.target)) {
//         setIsJobRolesDropdownOpen(false);
//       }
//       if (locationsDropdownRef.current && !locationsDropdownRef.current.contains(event.target)) {
//         setIsLocationsDropdownOpen(false);
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleImmediateFileUpload = async (file, fieldName) => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append(fieldName, file);

//     try {
//       const backendUrl = import.meta.env.VITE_Backend_URL;
//       const endpoint = `${backendUrl}/api/onboarding/update`;
//       const token = localStorage.getItem('token');

//       const response = await axios.put(endpoint, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`
//         },
//         withCredentials: true,
//       });

//       if (response.data && response.data.data) {
//         const savedData = response.data.data;
//         const urlFieldMap = { profileImage: 'profileImageUrl', backgroundImage: 'backgroundImageUrl', resume: 'resumeUrl' };
//         const urlStateField = urlFieldMap[fieldName];

//         if (urlStateField && savedData[fieldName]) {
//           setProfileData(prevData => ({ ...prevData, [urlStateField]: savedData[fieldName] }));
//         }
//       }
//     } catch (err) {
//       console.error(`Error uploading ${fieldName}:`, err);
//       setError(`Failed to upload ${fieldName}. Please try again.`);
//     } finally {
//       if (fieldName === 'profileImage') setProfileImageFile(null);
//       if (fieldName === 'backgroundImage') setBackgroundImageFile(null);
//       if (fieldName === 'resume') setResumeFile(null);
//     }
//   };

//   const addExperience = useCallback((type) => {
//     const newId = Date.now();
//     switch (type) {
//       case 'work':
//         setWorkExperiences(prev => [...prev, { id: newId, company: '', role: '', startDate: '', endDate: '', description: '', certificate: null }]);
//         break;
//       case 'international':
//         setInternationalExperiences(prev => [...prev, { id: newId, company: '', role: '', startDate: '', endDate: '', description: '', certificate: null }]);
//         break;
//       case 'leadership':
//         setLeadershipExperiences(prev => [...prev, { id: newId, organization: '', role: '', startDate: '', endDate: '', description: '', certificate: null }]);
//         break;
//       case 'award':
//         setAwards(prev => [...prev, { id: newId, title: '', organization: '', startDate: '', endDate: '', description: '' }]);
//         break;
//       default: break;
//     }
//   }, []);

//   const removeExperience = useCallback((type, id) => {
//     switch (type) {
//       case 'work':
//         setWorkExperiences(prev => prev.filter(exp => exp.id !== id));
//         break;
//       case 'international':
//         setInternationalExperiences(prev => prev.filter(exp => exp.id !== id));
//         break;
//       case 'leadership':
//         setLeadershipExperiences(prev => prev.filter(exp => exp.id !== id));
//         break;
//       case 'award':
//         setAwards(prev => prev.filter(award => award.id !== id));
//         break;
//       default: break;
//     }
//   }, []);

//   const updateExperience = useCallback((type, id, field, value) => {
//     const updater = (prev) => prev.map(item => item.id === id ? { ...item, [field]: value } : item);
//     switch (type) {
//       case 'work':
//         setWorkExperiences(updater);
//         break;
//       case 'international':
//         setInternationalExperiences(updater);
//         break;
//       case 'leadership':
//         setLeadershipExperiences(updater);
//         break;
//       case 'award':
//         setAwards(updater);
//         break;
//       default: break;
//     }
//   }, []);

//   const handleProfileDataChange = (field, value) => {
//     setProfileData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleFileChange = async (event, fileType) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (fileType === 'profileImage') {
//       setProfileImageFile(file);
//       setProfileData(prev => ({ ...prev, profileImageUrl: URL.createObjectURL(file) }));
//       await handleImmediateFileUpload(file, 'profileImage');
//     } else if (fileType === 'backgroundImage') {
//       setBackgroundImageFile(file);
//       setProfileData(prev => ({ ...prev, backgroundImageUrl: URL.createObjectURL(file) }));
//       await handleImmediateFileUpload(file, 'backgroundImage');
//     } else if (fileType === 'resume') {
//       setResumeFile(file);
//       setProfileData(prev => ({ ...prev, resumeUrl: file.name }));
//       await handleImmediateFileUpload(file, 'resume');
//     } else if (fileType === 'degreeCertificate') {
//       setDegreeCertificateFile(file);
//       setProfileData(prev => ({ ...prev, degreeCertificateUrl: URL.createObjectURL(file) }));
//     } else if (fileType === 'project') {
//       setProjectFile(file);
//       setProfileData(prev => ({ ...prev, projectUrl: URL.createObjectURL(file) }));
//     }
//   };

//   const handleProfileImageClick = () => document.getElementById('profileImageUpload').click();
//   const handleBackgroundImageClick = () => document.getElementById('backgroundImageUpload').click();
//   const handleResumeClick = () => document.getElementById('resume-upload').click();

//   const handleCustomMultiSelectToggle = (field, item) => {
//     setProfileData(prev => {
//       const currentItems = prev[field] || [];
//       const newItems = currentItems.includes(item) ? currentItems.filter(i => i !== item) : [...currentItems, item];
//       return { ...prev, [field]: newItems };
//     });
//   };

//    useEffect(() => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const fromEditProfile = urlParams.get('editProfile');
      
//       if (fromEditProfile === 'true') {
//         setActiveTab('profile');
//         // Clean up the URL
//         const newUrl = window.location.pathname;
//         window.history.replaceState({}, '', newUrl);
//       }
//     }, []);
    

//   const handleSaveChanges = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const backendUrl = import.meta.env.VITE_Backend_URL;
//       const token = localStorage.getItem('token');
//       const formData = new FormData();

//       for (const key in profileData) {
//         const keysToSkip = ['profileImageUrl', 'backgroundImageUrl', 'resumeUrl', 'degreeCertificateUrl', 'projectUrl', '_id', 'experiences', 'internationalExperience', 'leadership', 'awards'];
//         if (!keysToSkip.includes(key)) {
//             const value = profileData[key];
//             if (Array.isArray(value)) {
//                 if (key === 'certifications') {
//                     formData.append(key, value.map(cert => cert.name).join('; '));
//                 } else {
//                     formData.append(key, value.join(','));
//                 }
//             } else if (value !== null) {
//                 formData.append(key, value);
//             }
//         }
//       }
      
//       const cleanExperiences = (exps) => exps.map(({ id, certificate, certificateUrl, experienceCertificateFile, ...rest }) => rest);
      
//       formData.append('experiences', JSON.stringify(cleanExperiences(workExperiences)));
//       formData.append('internationalExperience', JSON.stringify(cleanExperiences(internationalExperiences)));
//       formData.append('leadership', JSON.stringify(cleanExperiences(leadershipExperiences)));
//       formData.append('awards', JSON.stringify(cleanExperiences(awards)));

//       if (degreeCertificateFile) formData.append('degreeCertificate', degreeCertificateFile);
//       if (projectFile) formData.append('project', projectFile);
      
//       workExperiences.forEach(exp => {
//         if (exp.certificate && typeof exp.certificate !== 'string') formData.append('experienceCertificate', exp.certificate);
//       });
//       internationalExperiences.forEach(exp => {
//         if (exp.certificate && typeof exp.certificate !== 'string') formData.append('internationalExperienceCertificate', exp.certificate);
//       });
//       leadershipExperiences.forEach(exp => {
//         if (exp.certificate && typeof exp.certificate !== 'string') formData.append('leadershipCertificate', exp.certificate);
//       });

//       const endpoint = `${backendUrl}/api/onboarding/update`;
//       const response = await axios.put(endpoint, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`
//         },
//         withCredentials: true,
//       });

//       console.log('Form updated/submitted successfully:', response.data);

//       if (response.data && response.data.data) {
//         const fetchedData = response.data.data;

//         setProfileData(prev => ({
//             ...prev,
//             ...fetchedData,
//             profileImageUrl: fetchedData.profileImage || prev.profileImageUrl,
//             backgroundImageUrl: fetchedData.backgroundImage || prev.backgroundImageUrl,
//             resumeUrl: fetchedData.resume || prev.resumeUrl,
//             degreeCertificateUrl: fetchedData.degreeCertificate || prev.degreeCertificateUrl,
//             projectUrl: fetchedData.project || prev.projectUrl,
//             certifications: (fetchedData.certifications && typeof fetchedData.certifications === 'string')
//               ? fetchedData.certifications.split('; ').map(name => ({ name, url: '' })) 
//               : [],
//         }));
        
//         if (fetchedData.experiences && fetchedData.experiences.length > 0) {
//             setWorkExperiences(fetchedData.experiences.map(exp => ({ ...exp, id: exp._id || Date.now(), certificate: exp.experienceCertificate })));
//         } else { setWorkExperiences([]); }
//         if (fetchedData.internationalExperience && fetchedData.internationalExperience.length > 0) {
//             setInternationalExperiences(fetchedData.internationalExperience.map(exp => ({ ...exp, id: exp._id || Date.now() })));
//         } else { setInternationalExperiences([]); }
//         if (fetchedData.leadership && fetchedData.leadership.length > 0) {
//             setLeadershipExperiences(fetchedData.leadership.map(exp => ({ ...exp, id: exp._id || Date.now() })));
//         } else { setLeadershipExperiences([]); }
//         if (fetchedData.awards && fetchedData.awards.length > 0) {
//             setAwards(fetchedData.awards.map(award => ({ ...award, id: award._id || Date.now() })));
//         } else { setAwards([]); }
//       }
      
//       setIsProfileEditing(false);
//       setHasOnboardingData(true);
//       setDegreeCertificateFile(null);
//       setProjectFile(null);

//     } catch (err) {
//       console.error('Error saving profile changes:', err.response ? err.response.data : err.message);
//       setError(`Failed to save changes: ${err.response?.data?.details || err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//  const renderContent = () => {
//     if (loading) return <div className="text-center py-8">Loading profile data...</div>;
//     if (error && !hasOnboardingData) return (
//       <div className="text-center py-8">
//         <p className="text-red-600 mb-4">{error}</p>
//         <Button
//           variant="primary"
//           className="bg-black hover:bg-gray-900"
//           onClick={() => {
//             setActiveTab('profile');
//             setError(null);
//             setIsProfileEditing(true);
//           }}
//         >
//           Go to Profile Section to Fill Data
//         </Button>
//       </div>
//     );
//     if (error && hasOnboardingData) return <div className="text-center py-8 text-red-600">{error}</div>;

//     const displayFieldStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[40px] flex items-center";
//     const displayFieldWrapperStyle = "relative mt-1";
   
//     switch (activeTab) {
//       case 'overview':
//         return (
//           <div className="space-y-6">
//             <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">What recruiters will see</h3>
//               <div className="border-2 border-gray-200 rounded-lg divide-y divide-gray-200">
//                 <div className="p-6">
//                   <div className="flex items-start gap-4">
//                     <Avatar size="lg" name={profileData.fullName} src={profileData.profileImageUrl} />
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
//                         <div>
//                           <h4 className="text-lg font-medium text-gray-900">{profileData.fullName || 'N/A'}</h4>
//                           <p className="text-sm text-gray-600">
//                             {profileData.degree || 'N/A'} at {profileData.college || 'N/A'}, {profileData.yearOfGraduation || 'N/A'}
//                           </p>
//                         </div>
//                         <div className="flex gap-2">
//                           {profileData.linkedin && (
//                             <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
//                               <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
//                                 <FiLinkedin className="w-4 h-4" />
//                               </Button>
//                             </a>
//                           )}
//                           {profileData.github && (
//                             <a href={profileData.github} target="_blank" rel="noopener noreferrer">
//                               <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
//                                 <FiGithub className="w-4 h-4" />
//                               </Button>
//                             </a>
//                           )}
//                           {profileData.portfolio && (
//                             <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer">
//                               <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
//                                 <FiGlobe className="w-4 h-4" />
//                               </Button>
//                             </a>
//                           )}
//                         </div>
//                       </div>

//                       <div className="space-y-6">
//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">About</h5>
//                           <p className="text-gray-600">{profileData.about || 'No information provided.'}</p>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-sm text-gray-500">Email address</p>
//                               <p className="text-gray-900">{profileData.email || 'N/A'}</p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-gray-500">Mobile Number</p>
//                               <p className="text-gray-900">{profileData.phone || 'N/A'}</p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Education</h5>
//                           <p className="text-gray-900">{profileData.degree || 'N/A'}</p>
//                           <p className="text-gray-600">{profileData.college || 'N/A'}, {profileData.yearOfGraduation || 'N/A'}</p>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
//                           <div className="flex flex-wrap gap-2">
//                             {profileData.skills && profileData.skills.length > 0 ? (
//                               profileData.skills.map((skill) => (
//                                 <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">
//                                   {skill}
//                                 </Badge>
//                               ))
//                             ) : (
//                               <span className="text-gray-600">N/A</span>
//                             )}
//                           </div>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Interested Industry Type</h5>
//                           <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.industry && profileData.industry.length > 0 ? profileData.industry[0] : 'N/A'}</Badge>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Interested Job Roles</h5>
//                           <div className="flex flex-wrap gap-2">
//                             {profileData.jobRoles && profileData.jobRoles.length > 0 ? (
//                               profileData.jobRoles.map((role) => (
//                                 <Badge key={role} variant="primary" size="md" className="bg-gray-100 text-gray-800">{role}</Badge>
//                               ))
//                             ) : (
//                               <span className="text-gray-600">N/A</span>
//                             )}
//                           </div>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Preferred Job Locations</h5>
//                           <div className="flex flex-wrap gap-2">
//                             {profileData.locations && profileData.locations.length > 0 ? (
//                               profileData.locations.map((location) => (
//                                 <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
//                                   {location}
//                                 </Badge>
//                               ))
//                             ) : (
//                               <span className="text-gray-600">N/A</span>
//                             )}
//                           </div>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Looking for</h5>
//                           <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.lookingFor || 'N/A'}</Badge>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Employment Type</h5>
//                           <div className="flex gap-2">
//                             {profileData.employmentType ? (
//                               <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.employmentType}</Badge>
//                             ) : (
//                               <span className="text-gray-600">N/A</span>
//                             )}
//                           </div>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Current Salary</h5>
//                           <p className="text-gray-900">{profileData.currentSalaryCurrency || 'N/A'} {profileData.currentSalaryAmount || ''}</p>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Expected Salary</h5>
//                           <p className="text-gray-900">{profileData.expectedSalaryCurrency || 'N/A'} {profileData.expectedSalaryAmount || ''}</p>
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Work Experience</h5>
//                           {profileData.experiences && profileData.experiences.length > 0 ? (
//                             profileData.experiences.map((exp, idx) => (
//                               <div key={idx} className="mb-4 border-b pb-2 last:border-b-0">
//                                 <p className="font-medium text-gray-900">{exp.role || 'N/A'} at {exp.company || 'N/A'}</p>
//                                 <p className="text-sm text-gray-600"><span className='text-black text-sm'>Start Date : </span>{exp.startDate || ''}  </p>
//                                 <p className="text-sm text-gray-600"><span className='text-black text-sm'>End Date : </span>{exp.endDate || 'Present'}  </p>
//                                 <p className="text-sm text-gray-700"><span className='text-black text-sm'>Description :</span>  {exp.description || 'No description provided.'}</p>
//                                 {exp.experienceCertificateUrl && (
//                                   <p className="text-sm text-blue-600 mt-1">
//                                     <a href={exp.experienceCertificateUrl} target="_blank" rel="noopener noreferrer" className="underline">View Certificate</a>
//                                   </p>
//                                 )}
//                               </div>
//                             ))
//                           ) : (
//                             <span className="text-gray-600">No work experience added.</span>
//                           )}
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Certifications</h5>
//                           {profileData.certifications && profileData.certifications.length > 0 ? (
//                             <ul className="list-disc list-inside text-gray-600">
//                               {profileData.certifications.map((cert, idx) => (
//                                 <li key={idx}>
//                                   {cert.name || 'N/A'}
//                                   {cert.url && (
//                                     <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
//                                       (Link)
//                                     </a>
//                                   )}
//                                 </li>
//                               ))}
//                             </ul>
//                           ) : (
//                             <span className="text-gray-600">No certifications added.</span>
//                           )}
//                         </div>

//                         <div className="p-4 border border-gray-200 rounded-lg">
//                           <h5 className="font-medium text-gray-900 mb-2">Referral Source</h5>
//                           <p className="text-gray-900">{profileData.referralSource || 'N/A'}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       case 'profile':
//         return (
//           <div className="space-y-6">
//             {/* About Section */}
//             <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">About</h3>
//                   <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Enter your name *
//                   </label>
//                   {isProfileEditing ? (
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="Enter your name"
//                       value={profileData.fullName}
//                       onChange={(e) => handleProfileDataChange('fullName', e.target.value)}
//                       required
//                     />
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.fullName || "N/A"}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Enter your email *
//                   </label>
//                   <div className={displayFieldWrapperStyle}>
//                     {isProfileEditing && (
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                           <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                           <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                         </svg>
//                       </div>
//                     )}
//                     {isProfileEditing ? (
//                       <input
//                         type="email"
//                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         placeholder="hello@xyz.com"
//                         value={profileData.email}
//                         onChange={(e) => handleProfileDataChange('email', e.target.value)}
//                         required
//                       />
//                     ) : (
//                       <div className={displayFieldStyle + (profileData.email ? " pl-10" : "")}>
//                         {profileData.email && (
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                               <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                               <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                             </svg>
//                           </div>
//                         )}
//                         {profileData.email || "N/A"}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Enter your mobile no. *
//                   </label>
//                   <div className={displayFieldWrapperStyle}>
//                     {isProfileEditing && (
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                           <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.485A1 1 0 017.5 7H4a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-3.5a1 1 0 011-1h1.485a1 1 0 01.836.986l1.485.74a1 1 0 01.52.879V17a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
//                         </svg>
//                       </div>
//                     )}
//                     {isProfileEditing ? (
//                       <input
//                         type="tel"
//                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         placeholder="1234567890"
//                         value={profileData.phone}
//                         onChange={(e) => handleProfileDataChange('phone', e.target.value)}
//                         required
//                       />
//                     ) : (
//                       <div className={displayFieldStyle + (profileData.phone ? " pl-10" : "")}>
//                         {profileData.phone && (
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                               <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.485A1 1 0 017.5 7H4a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-3.5a1 1 0 011-1h1.485a1 1 0 01.836.986l1.485.74a1 1 0 01.52.879V17a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
//                             </svg>
//                           </div>
//                         )}
//                         {profileData.phone || "N/A"}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Educational Background Section */}
//             <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Educational Background</h3>
//                   <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     College/University
//                   </label>
//                   {isProfileEditing ? (
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="Placeholder"
//                       value={profileData.college}
//                       onChange={(e) => handleProfileDataChange('college', e.target.value)}
//                     />
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.college || "N/A"}
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Degree
//                   </label>
//                   {isProfileEditing ? (
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="Placeholder"
//                       value={profileData.degree}
//                       onChange={(e) => handleProfileDataChange('degree', e.target.value)}
//                     />
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.degree || "N/A"}
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Year of Graduation
//                   </label>
//                   {isProfileEditing ? (
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="Placeholder"
//                       value={profileData.yearOfGraduation}
//                       onChange={(e) => handleProfileDataChange('yearOfGraduation', e.target.value)}
//                     />
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.yearOfGraduation || "N/A"}
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Current CGPA/Percentage
//                   </label>
//                   {isProfileEditing ? (
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="Placeholder"
//                       value={profileData.cgpa}
//                       onChange={(e) => handleProfileDataChange('cgpa', e.target.value)}
//                     />
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.cgpa || "N/A"}
//                     </div>
//                   )}
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Degree Certificate (Optional)
//                   </label>
//                   {isProfileEditing ? (
//                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                       <div className="space-y-1 text-center">
//                         <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
//                         <div className="flex text-sm text-gray-600">
//                           <label
//                             htmlFor="degree-certificate-upload"
//                             className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
//                           >
//                             <span>Upload a file</span>
//                             <input
//                               id="degree-certificate-upload"
//                               name="degree-certificate-upload"
//                               type="file"
//                               className="sr-only"
//                               accept=".pdf,.doc,.docx"
//                               onChange={(e) => handleFileChange(e, 'degreeCertificate')}
//                             />
//                           </label>
//                           <p className="pl-1">or drag and drop</p>
//                         </div>
//                         <p className="text-xs text-gray-500">PDF, DOCX, DOC up to 10MB</p>
//                         {profileData.degreeCertificateUrl && (
//                           <p className="text-sm text-green-600 mt-2">
//                             File uploaded: <a href={profileData.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="underline">View Certificate</a>
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.degreeCertificateUrl ? (
//                         <a href={profileData.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                           View Certificate
//                         </a>
//                       ) : (
//                         "No certificate uploaded"
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Career Goals Section */}
//             <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Career Goals</h3>
//                   <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
//                 </div>
//               </div>
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Interested Industry Type
//                   </label>
//                   {isProfileEditing ? (
//                     <select
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       value={profileData.industry && profileData.industry.length > 0 ? profileData.industry[0] : ''} // Get first item if array
//                       onChange={(e) => handleProfileDataChange('industry', [e.target.value])} // Convert to array for schema
//                     >
//                       <option value="">Select Industry</option>
//                       {predefinedIndustries.map(industry => (
//                         <option key={industry} value={industry}>{industry}</option>
//                       ))}
//                     </select>
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.industry && profileData.industry.length > 0 ? profileData.industry[0] : "N/A"}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Interested Job Roles
//                   </label>
//                   {isProfileEditing ? (
//                     <div className="relative" ref={jobRolesDropdownRef}>
//                       <div
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         onClick={() => setIsJobRolesDropdownOpen(!isJobRolesDropdownOpen)}
//                       >
//                         <div className="flex flex-wrap gap-2 pr-6">
//                           {profileData.jobRoles.length > 0 ? (
//                             profileData.jobRoles.map(role => (
//                               <Badge key={role} variant="primary" size="sm" className="bg-gray-200 text-gray-800">
//                                 {role}
//                                 <span
//                                   className="ml-1 cursor-pointer text-gray-600 hover:text-gray-900"
//                                   onClick={(e) => {
//                                     e.stopPropagation(); 
//                                     handleCustomMultiSelectToggle('jobRoles', role);
//                                   }}
//                                 >x</span>
//                               </Badge>
//                             ))
//                           ) : (
//                             <span className="text-gray-500">Multiple-select</span>
//                           )}
//                         </div>
//                         <FiChevronDown className="w-5 h-5 text-gray-400 absolute right-3" />
//                       </div>
//                       {isJobRolesDropdownOpen && (
//                         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                           {predefinedJobRoles.map((role) => (
//                             <div
//                               key={role}
//                               className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
//                                 profileData.jobRoles.includes(role) ? 'bg-blue-50 text-blue-800' : ''
//                               }`}
//                               onClick={() => handleCustomMultiSelectToggle('jobRoles', role)}
//                             >
//                               {role}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.jobRoles && profileData.jobRoles.length > 0 ? (
//                         <div className="flex flex-wrap gap-2 py-1">
//                             {profileData.jobRoles.map(role => (
//                                 <Badge key={role} variant="primary" size="md" className="bg-gray-100 text-gray-800">
//                                     {role}
//                                 </Badge>
//                             ))}
//                         </div>
//                       ) : "N/A"}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Preferred Job Locations
//                   </label>
//                   {isProfileEditing ? (
//                     <div className="relative" ref={locationsDropdownRef}>
//                       <div
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         onClick={() => setIsLocationsDropdownOpen(!isLocationsDropdownOpen)}
//                       >
//                         <div className="flex flex-wrap gap-2 pr-6">
//                           {profileData.locations.length > 0 ? (
//                             profileData.locations.map(location => (
//                               <Badge key={location} variant="primary" size="sm" className="bg-gray-200 text-gray-800">
//                                 {location}
//                                 <span
//                                   className="ml-1 cursor-pointer text-gray-600 hover:text-gray-900"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleCustomMultiSelectToggle('locations', location);
//                                   }}
//                                 >x</span>
//                               </Badge>
//                             ))
//                           ) : (
//                             <span className="text-gray-500">Multiple-select</span>
//                           )}
//                         </div>
//                         <FiChevronDown className="w-5 h-5 text-gray-400 absolute right-3" />
//                       </div>
//                       {isLocationsDropdownOpen && (
//                         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                           {predefinedLocations.map((location) => (
//                             <div
//                               key={location}
//                               className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
//                                 profileData.locations.includes(location) ? 'bg-blue-50 text-blue-800' : ''
//                               }`}
//                               onClick={() => handleCustomMultiSelectToggle('locations', location)}
//                             >
//                               {location}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.locations && profileData.locations.length > 0 ? (
//                         <div className="flex flex-wrap gap-2 py-1">
//                             {profileData.locations.map(location => (
//                                 <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
//                                     {location}
//                                 </Badge>
//                             ))}
//                         </div>
//                       ) : "N/A"}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Looking for
//                   </label>
//                   {isProfileEditing ? (
//                     <div className="flex flex-wrap gap-3">
//                       {predefinedLookingFor.map((option) => (
//                         <Button
//                           key={option}
//                           variant={profileData.lookingFor === option ? 'primary' : 'outline'}
//                           className={profileData.lookingFor === option ? 'bg-black text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
//                           onClick={() => handleProfileDataChange('lookingFor', option)}
//                         >
//                           {option}
//                         </Button>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.lookingFor || "N/A"}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Employment type
//                   </label>
//                   {isProfileEditing ? (
//                     <div className="flex flex-wrap gap-3">
//                       {predefinedEmploymentTypes.map((type) => (
//                         <Button
//                           key={type}
//                           variant={profileData.employmentType === type ? 'primary' : 'outline'}
//                           className={profileData.employmentType === type ? 'bg-black text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
//                           onClick={() => handleProfileDataChange('employmentType', type)}
//                         >
//                           {type}
//                         </Button>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.employmentType || "N/A"}
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Current Salary
//                   </label>
//                   {isProfileEditing ? (
//                     <div className="flex items-center gap-2">
//                       <select
//                         className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         value={profileData.currentSalaryCurrency || ''}
//                         onChange={(e) => handleProfileDataChange('currentSalaryCurrency', e.target.value)}
//                       >
//                         {predefinedCurrencies.map((currency) => (
//                           <option key={currency} value={currency}>{currency}</option>
//                         ))}
//                       </select>
//                       <input
//                         type="number"
//                         className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         placeholder="Enter amount"
//                         value={profileData.currentSalaryAmount || ''}
//                         onChange={(e) => handleProfileDataChange('currentSalaryAmount', e.target.value)}
//                       />
//                     </div>
//                   ) : (
//                     <div className={displayFieldStyle}>
//                       {profileData.currentSalaryCurrency} {profileData.currentSalaryAmount || "N/A"}
//                     </div>
//                   )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Expected Salary
//                     </label>
//                     {isProfileEditing ? (
//                       <div className="flex items-center gap-2">
//                         <select
//                           className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                           value={profileData.expectedSalaryCurrency || ''}
//                           onChange={(e) => handleProfileDataChange('expectedSalaryCurrency', e.target.value)}
//                         >
//                           {predefinedCurrencies.map((currency) => (
//                             <option key={currency} value={currency}>{currency}</option>
//                           ))}
//                         </select>
//                         <input
//                           type="number"
//                           className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                           placeholder="Enter amount"
//                           value={profileData.expectedSalaryAmount || ''}
//                           onChange={(e) => handleProfileDataChange('expectedSalaryAmount', e.target.value)}
//                         />
//                       </div>
//                     ) : (
//                       <div className={displayFieldStyle}>
//                         {profileData.expectedSalaryCurrency} {profileData.expectedSalaryAmount || "N/A"}
//                       </div>
//                     )}
//                   </div>
                 
//               </div>
//             </div>

//             <div className="space-y-8">
//                 <div className="bg-white rounded-2xl p-6 md:p-8 border border-blue-100">
//                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Work Experience</h3>
//                     <div className="space-y-6">
//                         {/* FIX: Added isProfileEditing prop */}
//                         {workExperiences.map((exp) => <ExperienceCard key={exp.id} experience={exp} type="work" onUpdate={updateExperience} onRemove={removeExperience} canRemove={workExperiences.length > 1} isProfileEditing={isProfileEditing} />)}
//                     </div>
//                     {isProfileEditing && (<button onClick={() => addExperience('work')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add Work Experience</button>)}
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 md:p-8 border border-green-100">
//                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">International Experience</h3>
//                     <div className="space-y-6">
//                         {/* FIX: Added isProfileEditing prop */}
//                         {internationalExperiences.map((exp) => <ExperienceCard key={exp.id} experience={exp} type="international" onUpdate={updateExperience} onRemove={removeExperience} canRemove={internationalExperiences.length > 1} isProfileEditing={isProfileEditing} />)}
//                     </div>
//                     {isProfileEditing && (<button onClick={() => addExperience('international')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add International Experience</button>)}
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 md:p-8 border border-purple-100">
//                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Leadership Experience</h3>
//                     <div className="space-y-6">
//                         {/* FIX: Added isProfileEditing prop */}
//                         {leadershipExperiences.map((exp) => <ExperienceCard key={exp.id} experience={exp} type="leadership" onUpdate={updateExperience} onRemove={removeExperience} canRemove={leadershipExperiences.length > 1} isProfileEditing={isProfileEditing} />)}
//                     </div>
//                     {isProfileEditing && (<button onClick={() => addExperience('leadership')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add Leadership Experience</button>)}
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 md:p-8 border border-amber-100">
//                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Awards & Recognition</h3>
//                     <div className="space-y-6">
//                         {/* FIX: Added isProfileEditing prop */}
//                         {awards.map((award) => <AwardCard key={award.id} award={award} onUpdate={updateExperience} onRemove={removeExperience} canRemove={awards.length > 1} isProfileEditing={isProfileEditing} />)}
//                     </div>
//                     {isProfileEditing && (<button onClick={() => addExperience('award')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add Award</button>)}
//                 </div>
//             </div>


//             {/* Skills Section */}
//             <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Skills</h3>
//                   <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Skills
//                 </label>
//                 {isProfileEditing ? (
//                   <textarea
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     rows="3"
//                     placeholder="Enter your skills (comma separated)"
//                     value={profileData.skills.join(', ')}
//                     onChange={(e) => handleProfileDataChange('skills', e.target.value.split(',').map(s => s.trim()))}
//                   ></textarea>
//                 ) : (
//                   <div className={displayFieldStyle + " h-24 overflow-auto"}>
//                     {profileData.skills.length > 0 ? (
//                       <div className="flex flex-wrap gap-2 py-1">
//                           {profileData.skills.map(skill => (
//                               <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">
//                                   {skill}
//                               </Badge>
//                           ))}
//                       </div>
//                     ) : "N/A"}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Social Profiles Section */}
//             <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Social Profiles</h3>
//                   <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     LinkedIn
//                   </label>
//                   <div className="flex">
//                     <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
//                       http://
//                     </span>
//                     {isProfileEditing ? (
//                       <input
//                         type="text"
//                         className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
//                         placeholder="www.linkedin.com/in/yourprofile"
//                         value={profileData.linkedin.replace(/^(https?:\/\/)?(www\.)?/i, '')}
//                         onChange={(e) => handleProfileDataChange('linkedin', `http://${e.target.value}`)}
//                       />
//                     ) : (
//                       <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
//                         {profileData.linkedin ? (
//                           <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                             {profileData.linkedin}
//                           </a>
//                         ) : "N/A"}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Github
//                   </label>
//                   <div className="flex">
//                     <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
//                       http://
//                     </span>
//                     {isProfileEditing ? (
//                       <input
//                         type="text"
//                         className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
//                         placeholder="github.com/yourprofile"
//                         value={profileData.github.replace(/^(https?:\/\/)?(www\.)?/i, '')}
//                         onChange={(e) => handleProfileDataChange('github', `http://${e.target.value}`)}
//                       />
//                     ) : (
//                       <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
//                         {profileData.github ? (
//                           <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                             {profileData.github}
//                           </a>
//                         ) : "N/A"}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Portfolio Website
//                   </label>
//                   <div className="flex">
//                     <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
//                       http://
//                     </span>
//                     {isProfileEditing ? (
//                       <input
//                         type="text"
//                         className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
//                         placeholder="www.yourwebsite.com"
//                         value={profileData.portfolio.replace(/^(https?:\/\/)?(www\.)?/i, '')}
//                         onChange={(e) => handleProfileDataChange('portfolio', `http://${e.target.value}`)}
//                       />
//                     ) : (
//                       <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
//                         {profileData.portfolio ? (
//                           <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                             {profileData.portfolio}
//                           </a>
//                         ) : "N/A"}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Certifications Section */}
//             <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
//                   <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
//                 </div>
//               </div>
//               {profileData.certifications.map((cert, index) => (
//                 <div key={index} className="space-y-4 mb-4 p-4 border border-gray-200 rounded-lg">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Certification Name
//                     </label>
//                     {isProfileEditing ? (
//                       <input
//                         type="text"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                         value={cert.name}
//                         onChange={(e) => {
//                           const newCerts = [...profileData.certifications];
//                           newCerts[index].name = e.target.value;
//                           handleProfileDataChange('certifications', newCerts);
//                         }}
//                       />
//                     ) : (
//                       <div className={displayFieldStyle}>
//                         {cert.name || "N/A"}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Certification URL
//                     </label>
//                     <div className="flex">
//                       <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
//                         http://
//                       </span>
//                       {isProfileEditing ? (
//                         <input
//                           type="text"
//                           className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
//                           placeholder="www.example.com"
//                           value={cert.url.replace(/^(https?:\/\/)?(www\.)?/i, '')}
//                           onChange={(e) => {
//                             const newCerts = [...profileData.certifications];
//                             newCerts[index].url = `http://${e.target.value}`;
//                             handleProfileDataChange('certifications', newCerts);
//                           }}
//                         />
//                       ) : (
//                         <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
//                           {cert.url ? (
//                             <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                               {cert.url}
//                             </a>
//                           ) : "N/A"}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {isProfileEditing && (
//                 <Button variant="outline" size="sm" onClick={() => handleProfileDataChange('certifications', [...profileData.certifications, { name: '', url: '' }])}>
//                   <FiPlus className="w-4 h-4 mr-2" /> Add Certification
//                 </Button>
//               )}
//             </div>
           
//             <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center mb-4">  
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Languages</h3>
//                   <p className="text-sm mt-2 text-gray-600">{profileData.language || "English"}</p>
//                 </div>      
//               </div>
              
//             </div>       
//             {/* Save Changes / Edit Profile Button for Profile Tab */}
//             <div className="flex justify-end p-6 bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
//               <Button
//                 variant="primary"
//                 className="bg-black hover:bg-gray-900"
//                 onClick={isProfileEditing ? handleSaveChanges : () => setIsProfileEditing(true)}
//                 disabled={loading}
//               >
//                 {loading ? 'Saving...' : (isProfileEditing ? 'Save Changes' : 'Edit Profile')}
//               </Button>
//             </div>
//           </div>
//         );
//   case 'resume':
//   return (
//     <div className="space-y-6">
//       <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Upload your resume/CV</h3>
        
//         {(profileData.resumeUrl || resumeFile) && (
//           <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center">
//             <div>
//               <p className="text-sm font-medium text-gray-900">
//                 {resumeFile ? 'New Resume' : 'Current Resume'}
//               </p>
//               {resumeFile ? (
//                 <p className="text-sm text-gray-600">{resumeFile.name}</p>
//               ) : (
//                 <a 
//                   href={profileData.resumeUrl} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   View Resume
//                 </a>
//               )}
//             </div>
//             <button
//               onClick={handleResumeClick}
//               className="text-sm text-red-600 hover:text-red-800"
//             >
//               Replace
//             </button>
//           </div>
//         )}

//         <div 
//           className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
//           onClick={handleResumeClick}
//         >
//           <input
//             type="file"
//             className="hidden"
//             id="resume-upload"
//             accept=".pdf,.doc,.docx"
//             onChange={(e) => handleFileChange(e, 'resume')}
//           />
//           <div className="flex flex-col items-center justify-center">
//             <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-2" />
//             <p className="text-sm text-gray-600">
//               {profileData.resumeUrl || resumeFile ? 'Click to upload new resume' : 'Click to upload or drag and drop'}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//               Supported formats: PDF, DOC, DOCX
//             </p>
//           </div>
//         </div>

//         {resumeFile && (
//           <div className="mt-6 flex justify-end">
//             <Button
//               variant="primary"
//               onClick={handleSaveChanges}
//               disabled={loading}
//               className="bg-black hover:bg-gray-900"
//             >
//               {loading ? 'Saving...' : 'Save Changes'}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );   default:
//         return null;
//     }
//   };

// return (
// <div className="flex flex-col w-full bg-gray-100 min-h-screen">
//       <div
//         className="w-full h-32 bg-gray-300 relative bg-cover bg-center cursor-pointer"
//         style={{ 
//             backgroundImage: `url(${
//             backgroundImageFile ? 
//             URL.createObjectURL(backgroundImageFile) : 
//             profileData.backgroundImageUrl
//             })` 
//         }}
//         onClick={handleBackgroundImageClick}
//         >
//         <input
//           id="backgroundImageUpload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => handleFileChange(e, 'backgroundImage')}
//         />
//         {!profileData.backgroundImageUrl && !backgroundImageFile && (
//           <div className="absolute inset-0 flex items-center justify-center text-gray-500">
//             <FiUploadCloud className="w-8 h-8 mr-2" />
//             <span>Upload Background Image</span>
//           </div>
//         )}
//       </div>

//       <div className="bg-white pb-4">
//         <div className="relative px-4">
//           <div 
//             className="absolute -top-16 left-4 cursor-pointer"
//             onClick={handleProfileImageClick}
//           >
//             <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white overflow-hidden">
//               {profileData.profileImageUrl ? (
//                 <img 
//                   src={profileData.profileImageUrl} 
//                   alt="Profile" 
//                   className="w-full h-full object-cover" 
//                 />
//               ) : (
//                 <div className="text-gray-400 flex flex-col items-center">
//                   <FiUploadCloud className="h-8 w-8 mb-1" />
//                   <span className="text-xs">Upload</span>
//                 </div>
//               )}
//             </div>
//             <input
//               id="profileImageUpload"
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={(e) => handleFileChange(e, 'profileImage')}
//             />
//           </div>
//         </div>          

//         <div className="px-6 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">{profileData.fullName || 'Name Surname'}</h2>
//             <p className="text-gray-600">{profileData.email || 'hello@gmail.com'}</p>
//           </div>
        
//         </div>

//         <div className="flex border-b mt-4">
//           {['overview', 'profile', 'resume'].map((tab) => (
//             <button
//               key={tab}
//               className={`px-6 py-2 ${activeTab === tab ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1).replace('resume', 'Resume / CV')}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="p-4 flex-1">
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

// export default ProfProfile;





import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { FiLinkedin, FiGithub, FiGlobe, FiPlus, FiUploadCloud, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';
import { Plus, Upload, X } from 'lucide-react';

// Memoized child component for performance
const ExperienceCard = React.memo(({ experience, type, onUpdate, onRemove, canRemove, isProfileEditing }) => {
    const displayFieldStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[40px] flex items-center";

    const handleInputChange = (field, value) => {
        onUpdate(type, experience.id, field, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpdate(type, experience.id, 'certificate', file);
        }
    };

    const getOrgFieldLabel = () => {
        if (type === 'leadership') return 'Organization';
        if (type === 'international') return 'Country';
        return 'Company/Organization';
    };

    const getOrgFieldKey = () => {
        if (type === 'leadership') return 'organization';
        if (type === 'international') return 'country';
        return 'company';
    };

    const orgFieldKey = getOrgFieldKey();
    const orgFieldValue = experience[orgFieldKey];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            {canRemove && isProfileEditing && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => onRemove(type, experience.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {getOrgFieldLabel()}
                    </label>
                    {isProfileEditing ? (
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={`Enter ${getOrgFieldLabel().toLowerCase()} name`}
                            value={orgFieldValue || ''}
                            onChange={(e) => handleInputChange(orgFieldKey, e.target.value)}
                        />
                    ) : (
                        <div className={displayFieldStyle}>
                            {orgFieldValue || "N/A"}
                        </div>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {type === 'leadership' ? 'Role/Position' : 'Job Role'}
                    </label>
                    {isProfileEditing ? (
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={`Enter ${type === 'leadership' ? 'role' : 'job role'}`}
                            value={experience.role || ''}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                        />
                    ) : (
                        <div className={displayFieldStyle}>
                            {experience.role || "N/A"}
                        </div>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date
                    </label>
                    {isProfileEditing ? (
                        <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={experience.startDate || ''}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                        />
                    ) : (
                        <div className={displayFieldStyle}>
                            {experience.startDate || "N/A"}
                        </div>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date
                    </label>
                    {isProfileEditing ? (
                        <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={experience.endDate || ''}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                        />
                    ) : (
                        <div className={displayFieldStyle}>
                            {experience.endDate || "N/A"}
                        </div>
                    )}
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>
                    {isProfileEditing ? (
                        <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Describe your role, responsibilities, and achievements..."
                            rows="4"
                            value={experience.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    ) : (
                        <div className={`${displayFieldStyle} items-start min-h-[100px]`}>
                            {experience.description || "N/A"}
                        </div>
                    )}
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Certificate (Optional)
                    </label>
                    {isProfileEditing ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                            <div className="text-sm text-gray-600">
                                <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                                    Upload a file
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <span className="ml-1">or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                            {experience.certificate && (
                                <p className="text-sm text-green-600 mt-2 font-medium">
                                    File uploaded: {typeof experience.certificate === 'string' ? 'Existing Certificate' : experience.certificate.name}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className={displayFieldStyle}>
                            {experience.certificate ? (
                                <a href={typeof experience.certificate === 'string' ? experience.certificate : '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer">
                                    View Certificate
                                </a>
                            ) : (
                                "No certificate uploaded"
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

const AchievementCard = React.memo(({ achievement, onUpdate, onRemove, canRemove, isProfileEditing }) => {
    const displayFieldStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[40px] flex items-center";

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            {canRemove && isProfileEditing && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => onRemove('achievement', achievement.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Achievement Title
                    </label>
                    {isProfileEditing ? (
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., Won 1st place"
                            value={achievement.title || ''}
                            onChange={(e) => onUpdate('achievement', achievement.id, 'title', e.target.value)}
                        />
                    ) : (
                        <div className={displayFieldStyle}>
                            {achievement.title || "N/A"}
                        </div>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event / Competition
                    </label>
                    {isProfileEditing ? (
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., National Hackathon 2024"
                            value={achievement.event || ''}
                            onChange={(e) => onUpdate('achievement', achievement.id, 'event', e.target.value)}
                        />
                    ) : (
                        <div className={displayFieldStyle}>
                            {achievement.event || "N/A"}
                        </div>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date
                    </label>
                    {isProfileEditing ? (
                        <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={achievement.date || ''}
                            onChange={(e) => onUpdate('achievement', achievement.id, 'date', e.target.value)}
                        />
                    ) : (
                        <div className={displayFieldStyle}>
                            {achievement.date || "N/A"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

const AwardCard = React.memo(({ award, onUpdate, onRemove, canRemove, isProfileEditing }) => {
    const displayFieldStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[40px] flex items-center";
    const handleInputChange = (field, value) => {
        onUpdate('award', award.id, field, value);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            {canRemove && isProfileEditing && (
                <div className="flex justify-end mb-4">
                    <button onClick={() => onRemove('award', award.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Award Title</label>
                    {isProfileEditing ? (
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Employee of the Month" value={award.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} />
                    ) : ( <div className={displayFieldStyle}>{award.title || "N/A"}</div> )}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
                    {isProfileEditing ? (
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Company Name" value={award.organization || ''} onChange={(e) => handleInputChange('organization', e.target.value)} />
                    ) : ( <div className={displayFieldStyle}>{award.organization || "N/A"}</div> )}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    {isProfileEditing ? (
                        <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={award.startDate || ''} onChange={(e) => handleInputChange('startDate', e.target.value)} />
                    ) : ( <div className={displayFieldStyle}>{award.startDate || "N/A"}</div> )}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    {isProfileEditing ? (
                        <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={award.endDate || ''} onChange={(e) => handleInputChange('endDate', e.target.value)} />
                    ) : ( <div className={displayFieldStyle}>{award.endDate || "N/A"}</div> )}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    {isProfileEditing ? (
                        <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Describe the award" value={award.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} />
                    ) : ( <div className={`${displayFieldStyle} items-start min-h-[80px]`}>{award.description || "N/A"}</div> )}
                </div>
            </div>
        </div>
    );
});

const PublicationCard = React.memo(({ publication, onUpdate, onRemove, canRemove, isProfileEditing }) => {
    const displayFieldStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[40px] flex items-center";
    const handleInputChange = (field, value) => {
        onUpdate('publication', publication.id, field, value);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            {canRemove && isProfileEditing && (
                <div className="flex justify-end mb-4">
                    <button onClick={() => onRemove('publication', publication.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Publication Title</label>
                    {isProfileEditing ? (
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., The Future of AI" value={publication.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} />
                    ) : ( <div className={displayFieldStyle}>{publication.title || "N/A"}</div> )}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Publication URL</label>
                    {isProfileEditing ? (
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://example.com/publication" value={publication.url || ''} onChange={(e) => handleInputChange('url', e.target.value)} />
                    ) : (
                        <div className={displayFieldStyle}>
                            {publication.url ? <a href={publication.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{publication.url}</a> : "N/A"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

function ProfProfile() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const [hasOnboardingData, setHasOnboardingData] = useState(true);

    const [profileData, setProfileData] = useState({
        profileImageUrl: '',
        backgroundImageUrl: '',
        resumeUrl: '',
        fullName: '',
        email: '',
        phone: '',
        about: '',
        profileType: '',
        dob: '',
        gender: '',
        ethnicity: '',
        maritalStatus: '',
        visaStatus: '',
        college: '',
        degree: '',
        specialization: '',
        semester: '',
        yearOfGraduation: '',
        cgpa: '',
        degreeCertificateUrl: '',
        industry: [],
        jobRoles: [],
        locations: [],
        lookingFor: '',
        employmentType: '',
        openToShift: '',
        clientLocation: '',
        expectedSalaryCurrency: '',
        expectedSalaryAmount: '',
        currentSalaryCurrency: '',
        currentSalaryAmount: '',
        currentCompany: '',
        noticePeriod: '',
        servingNoticePeriod: false,
        noticePeriodStartDate: '',
        totalYearsOfExperience: '',
        skills: [],
        toolsAndPlatforms: [],
        domainKnowledge: [],
        languagesKnown: [],
        linkedin: '',
        github: '',
        portfolio: '',
        certifications: [],
        projectUrl: '',
        referralSource: '',
    });

    // States for dynamic sections
    const [workExperiences, setWorkExperiences] = useState([]);
    const [internationalExperiences, setInternationalExperiences] = useState([]);
    const [leadershipExperiences, setLeadershipExperiences] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [awards, setAwards] = useState([]);
    const [publications, setPublications] = useState([]);
    const [projectsHandled, setProjectsHandled] = useState({
        numberOfProjects: '',
        budget: '',
        impact: '',
    });


    // States for files that upload immediately
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);

    // States for files saved with the main "Save" button
    const [degreeCertificateFile, setDegreeCertificateFile] = useState(null);
    const [projectFile, setProjectFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isJobRolesDropdownOpen, setIsJobRolesDropdownOpen] = useState(false);
    const [isLocationsDropdownOpen, setIsLocationsDropdownOpen] = useState(false);

    const jobRolesDropdownRef = useRef(null);
    const locationsDropdownRef = useRef(null);

    const predefinedJobRoles = ['Software Engineer', 'Data Analyst', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Full Stack Developer'];
    const predefinedLocations = ['Noida', 'Delhi', 'Gurgaon', 'Bangalore', 'Pune', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata', 'Remote'];
    const predefinedEmploymentTypes = ['part time', 'full time', 'contract'];
    const predefinedLookingFor = ['Job', 'Internship', 'Both'];
    const predefinedIndustries = ['IT Industry', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Retail', 'Manufacturing', 'Automotive'];
    const predefinedCurrencies = ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD"];
    const predefinedMaritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'];
    const predefinedEthnicities = ['Asian', 'Black or African American', 'Hispanic or Latino', 'Native American or Alaska Native', 'White', 'Two or More Races', 'Prefer not to say'];
    const predefinedVisaStatuses = ['Citizen', 'Permanent Resident', 'Work Visa (e.g., H1B)', 'Student Visa (e.g., F1)', 'Not Authorized to Work', 'Other'];
    const predefinedProfileTypes = ["student", "fresher", "professional"];

    useEffect(() => {
        const fetchUserProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                const backendUrl = import.meta.env.VITE_Backend_URL;
                const token = localStorage.getItem('token');

                const response = await axios.get(`${backendUrl}/api/onboarding/me`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data) {
                    const fetchedData = response.data;
                    setHasOnboardingData(true);

                    const parseArrayField = (field) => {
                        if (Array.isArray(field)) return field;
                        if (typeof field === 'string' && field.length > 0) return field.split(',').map(s => s.trim());
                        return [];
                    };

                    setProfileData(prevData => ({
                        ...prevData,
                        ...fetchedData,
                        fullName: fetchedData.name || '',
                        servingNoticePeriod: fetchedData.servingNoticePeriod || false,
                        profileImageUrl: fetchedData.profileImage || '',
                        backgroundImageUrl: fetchedData.backgroundImage || '',
                        resumeUrl: fetchedData.resume || '',
                        degreeCertificateUrl: fetchedData.degreeCertificate || '',
                        projectUrl: fetchedData.project || '',
                        certifications: (fetchedData.certifications && typeof fetchedData.certifications === 'string' && fetchedData.certifications.length > 0)
                            ? fetchedData.certifications.split('; ').map(name => ({ name, url: '' }))
                            : [],
                        toolsAndPlatforms: parseArrayField(fetchedData.toolsAndPlatforms),
                        languagesKnown: parseArrayField(fetchedData.languagesKnown),
                        domainKnowledge: parseArrayField(fetchedData.domainKnowledge),
                        skills: parseArrayField(fetchedData.skills),
                        jobRoles: parseArrayField(fetchedData.jobRoles),
                        locations: parseArrayField(fetchedData.locations),
                        industry: parseArrayField(fetchedData.industry),
                    }));

                    if (fetchedData.experiences && fetchedData.experiences.length > 0) {
                        setWorkExperiences(fetchedData.experiences.map(exp => ({ ...exp, id: exp._id || Date.now() })));
                    }
                    if (fetchedData.internationalExperience && fetchedData.internationalExperience.length > 0) {
                        setInternationalExperiences(fetchedData.internationalExperience.map(exp => ({ ...exp, id: exp._id || Date.now() })));
                    }
                    if (fetchedData.leadership && fetchedData.leadership.length > 0) {
                        setLeadershipExperiences(fetchedData.leadership.map(exp => ({ ...exp, id: exp._id || Date.now() })));
                    }
                    if (fetchedData.achievements && fetchedData.achievements.length > 0) {
                        setAchievements(fetchedData.achievements.map(ach => ({ ...ach, id: ach._id || Date.now() })));
                    }
                    if (fetchedData.awards && fetchedData.awards.length > 0) {
                        setAwards(fetchedData.awards.map(award => ({ ...award, id: award._id || Date.now() })));
                    }
                    if (fetchedData.publications && fetchedData.publications.length > 0) {
                        setPublications(fetchedData.publications.map(pub => ({ ...pub, id: pub._id || Date.now() })));
                    }
                    if (fetchedData.projectsHandled) {
                        setProjectsHandled(fetchedData.projectsHandled);
                    }
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
                if (err.response && err.response.status === 404) {
                    setHasOnboardingData(false);
                }
                setError('Failed to load profile data. Please fill out your profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfileData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (jobRolesDropdownRef.current && !jobRolesDropdownRef.current.contains(event.target)) {
                setIsJobRolesDropdownOpen(false);
            }
            if (locationsDropdownRef.current && !locationsDropdownRef.current.contains(event.target)) {
                setIsLocationsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleImmediateFileUpload = async (file, fieldName) => {
        if (!file) return;

        const formData = new FormData();
        formData.append(fieldName, file);

        try {
            const backendUrl = import.meta.env.VITE_Backend_URL;
            const endpoint = `${backendUrl}/api/onboarding/update`;
            const token = localStorage.getItem('token');

            const response = await axios.put(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });

            if (response.data && response.data.data) {
                const savedData = response.data.data;
                const urlFieldMap = { profileImage: 'profileImageUrl', backgroundImage: 'backgroundImageUrl', resume: 'resumeUrl' };
                const urlStateField = urlFieldMap[fieldName];

                if (urlStateField && savedData[fieldName]) {
                    setProfileData(prevData => ({ ...prevData, [urlStateField]: savedData[fieldName] }));
                }
            }
        } catch (err) {
            console.error(`Error uploading ${fieldName}:`, err);
            setError(`Failed to upload ${fieldName}. Please try again.`);
        } finally {
            if (fieldName === 'profileImage') setProfileImageFile(null);
            if (fieldName === 'backgroundImage') setBackgroundImageFile(null);
            if (fieldName === 'resume') setResumeFile(null);
        }
    };

    const addExperience = useCallback((type) => {
        const newId = Date.now();
        switch (type) {
            case 'work':
                setWorkExperiences(prev => [...prev, { id: newId, company: '', role: '', startDate: '', endDate: '', description: '', certificate: null }]);
                break;
            case 'international':
                setInternationalExperiences(prev => [...prev, { id: newId, country: '', role: '', startDate: '', endDate: '', description: '', certificate: null }]);
                break;
            case 'leadership':
                setLeadershipExperiences(prev => [...prev, { id: newId, organization: '', role: '', startDate: '', endDate: '', description: '', certificate: null }]);
                break;
            case 'achievement':
                setAchievements(prev => [...prev, { id: newId, title: '', event: '', date: '' }]);
                break;
            case 'award':
                setAwards(prev => [...prev, { id: newId, title: '', organization: '', startDate: '', endDate: '', description: '' }]);
                break;
            case 'publication':
                setPublications(prev => [...prev, { id: newId, title: '', url: '' }]);
                break;
            default: break;
        }
    }, []);

    const removeExperience = useCallback((type, id) => {
        switch (type) {
            case 'work':
                setWorkExperiences(prev => prev.filter(exp => exp.id !== id));
                break;
            case 'international':
                setInternationalExperiences(prev => prev.filter(exp => exp.id !== id));
                break;
            case 'leadership':
                setLeadershipExperiences(prev => prev.filter(exp => exp.id !== id));
                break;
            case 'achievement':
                setAchievements(prev => prev.filter(ach => ach.id !== id));
                break;
            case 'award':
                setAwards(prev => prev.filter(item => item.id !== id));
                break;
            case 'publication':
                setPublications(prev => prev.filter(item => item.id !== id));
                break;
            default: break;
        }
    }, []);

    const updateExperience = useCallback((type, id, field, value) => {
        const updater = (prev) => prev.map(item => item.id === id ? { ...item, [field]: value } : item);
        switch (type) {
            case 'work':
                setWorkExperiences(updater);
                break;
            case 'international':
                setInternationalExperiences(updater);
                break;
            case 'leadership':
                setLeadershipExperiences(updater);
                break;
            case 'achievement':
                setAchievements(updater);
                break;
            case 'award':
                setAwards(updater);
                break;
            case 'publication':
                setPublications(updater);
                break;
            default: break;
        }
    }, []);

    const handleProjectsHandledChange = (field, value) => {
        setProjectsHandled(prev => ({ ...prev, [field]: value }));
    };

    const handleProfileDataChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = async (event, fileType) => {
        const file = event.target.files[0];
        if (!file) return;

        if (fileType === 'profileImage') {
            setProfileImageFile(file);
            setProfileData(prev => ({ ...prev, profileImageUrl: URL.createObjectURL(file) }));
            await handleImmediateFileUpload(file, 'profileImage');
        } else if (fileType === 'backgroundImage') {
            setBackgroundImageFile(file);
            setProfileData(prev => ({ ...prev, backgroundImageUrl: URL.createObjectURL(file) }));
            await handleImmediateFileUpload(file, 'backgroundImage');
        } else if (fileType === 'resume') {
            setResumeFile(file);
            setProfileData(prev => ({ ...prev, resumeUrl: file.name }));
            await handleImmediateFileUpload(file, 'resume');
        } else if (fileType === 'degreeCertificate') {
            setDegreeCertificateFile(file);
            setProfileData(prev => ({ ...prev, degreeCertificateUrl: URL.createObjectURL(file) }));
        } else if (fileType === 'project') {
            setProjectFile(file);
            setProfileData(prev => ({ ...prev, projectUrl: URL.createObjectURL(file) }));
        }
    };

    const handleProfileImageClick = () => document.getElementById('profileImageUpload').click();
    const handleBackgroundImageClick = () => document.getElementById('backgroundImageUpload').click();
    const handleResumeClick = () => document.getElementById('resume-upload').click();

    const handleCustomMultiSelectToggle = (field, item) => {
        setProfileData(prev => {
            const currentItems = prev[field] || [];
            const newItems = currentItems.includes(item) ? currentItems.filter(i => i !== item) : [...currentItems, item];
            return { ...prev, [field]: newItems };
        });
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const fromEditProfile = urlParams.get('editProfile');
        
        if (fromEditProfile === 'true') {
            setActiveTab('profile');
            // Clean up the URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);
    

    const handleSaveChanges = async () => {
        setLoading(true);
        setError(null);
        try {
            const backendUrl = import.meta.env.VITE_Backend_URL;
            const token = localStorage.getItem('token');
            const formData = new FormData();

            for (const key in profileData) {
                const keysToSkip = ['profileImageUrl', 'backgroundImageUrl', 'resumeUrl', 'degreeCertificateUrl', 'projectUrl', '_id', 'experiences', 'internationalExperience', 'leadership', 'achievements', 'awards', 'publications', 'projectsHandled'];
                if (!keysToSkip.includes(key)) {
                    const value = profileData[key];

                    if (key === 'employmentType' && value === '') {
                      continue;
                    }
                    
                    if (key === 'lookingFor' && value === '') {
                      formData.append('lookingFor', 'Job');
                      continue;
                    }

                    if (Array.isArray(value)) {
                        if (key === 'certifications') {
                            formData.append(key, value.map(cert => cert.name).join('; '));
                        } else {
                            formData.append(key, value.join(','));
                        }
                    } else if (value !== null) {
                        formData.append(key, value);
                    }
                }
            }
            
            const cleanArray = (arr) => arr.map(({ id, certificate, ...rest }) => rest);
            
            formData.append('experiences', JSON.stringify(cleanArray(workExperiences)));
            formData.append('internationalExperience', JSON.stringify(cleanArray(internationalExperiences)));
            formData.append('leadership', JSON.stringify(cleanArray(leadershipExperiences)));
            formData.append('achievements', JSON.stringify(cleanArray(achievements)));
            formData.append('awards', JSON.stringify(cleanArray(awards)));
            formData.append('publications', JSON.stringify(cleanArray(publications)));
            formData.append('projectsHandled', JSON.stringify(projectsHandled));

            if (degreeCertificateFile) formData.append('degreeCertificate', degreeCertificateFile);
            if (projectFile) formData.append('project', projectFile);
            
            workExperiences.forEach(exp => {
                if (exp.certificate && typeof exp.certificate !== 'string') formData.append('experienceCertificate', exp.certificate);
            });
            internationalExperiences.forEach(exp => {
                if (exp.certificate && typeof exp.certificate !== 'string') formData.append('internationalExperienceCertificate', exp.certificate);
            });
            leadershipExperiences.forEach(exp => {
                if (exp.certificate && typeof exp.certificate !== 'string') formData.append('leadershipCertificate', exp.certificate);
            });

            const endpoint = `${backendUrl}/api/onboarding/update`;
            const response = await axios.put(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });

            console.log('Form updated/submitted successfully:', response.data);

            if (response.data && response.data.data) {
                const fetchedData = response.data.data;
                const parseArrayField = (field) => {
                    if (Array.isArray(field)) return field;
                    if (typeof field === 'string' && field.length > 0) return field.split(',').map(s => s.trim());
                    return [];
                };

                setProfileData(prev => ({
                    ...prev,
                    ...fetchedData,
                    servingNoticePeriod: fetchedData.servingNoticePeriod || false,
                    profileImageUrl: fetchedData.profileImage || prev.profileImageUrl,
                    backgroundImageUrl: fetchedData.backgroundImage || prev.backgroundImageUrl,
                    resumeUrl: fetchedData.resume || prev.resumeUrl,
                    degreeCertificateUrl: fetchedData.degreeCertificate || prev.degreeCertificateUrl,
                    projectUrl: fetchedData.project || prev.projectUrl,
                    certifications: (fetchedData.certifications && typeof fetchedData.certifications === 'string')
                        ? fetchedData.certifications.split('; ').map(name => ({ name, url: '' })) 
                        : [],
                    toolsAndPlatforms: parseArrayField(fetchedData.toolsAndPlatforms),
                    languagesKnown: parseArrayField(fetchedData.languagesKnown),
                    domainKnowledge: parseArrayField(fetchedData.domainKnowledge),
                    skills: parseArrayField(fetchedData.skills),
                    jobRoles: parseArrayField(fetchedData.jobRoles),
                    locations: parseArrayField(fetchedData.locations),
                    industry: parseArrayField(fetchedData.industry),
                }));
                
                if (fetchedData.experiences && fetchedData.experiences.length > 0) {
                    setWorkExperiences(fetchedData.experiences.map(exp => ({ ...exp, id: exp._id || Date.now(), certificate: exp.experienceCertificate })));
                } else { setWorkExperiences([]); }
                if (fetchedData.internationalExperience && fetchedData.internationalExperience.length > 0) {
                    setInternationalExperiences(fetchedData.internationalExperience.map(exp => ({ ...exp, id: exp._id || Date.now() })));
                } else { setInternationalExperiences([]); }
                if (fetchedData.leadership && fetchedData.leadership.length > 0) {
                    setLeadershipExperiences(fetchedData.leadership.map(exp => ({ ...exp, id: exp._id || Date.now() })));
                } else { setLeadershipExperiences([]); }
                if (fetchedData.achievements && fetchedData.achievements.length > 0) {
                    setAchievements(fetchedData.achievements.map(ach => ({ ...ach, id: ach._id || Date.now() })));
                } else { setAchievements([]); }
                if (fetchedData.awards && fetchedData.awards.length > 0) {
                    setAwards(fetchedData.awards.map(award => ({ ...award, id: award._id || Date.now() })));
                } else { setAwards([]); }
                if (fetchedData.publications && fetchedData.publications.length > 0) {
                    setPublications(fetchedData.publications.map(pub => ({ ...pub, id: pub._id || Date.now() })));
                } else { setPublications([]); }
                if (fetchedData.projectsHandled) {
                    setProjectsHandled(fetchedData.projectsHandled);
                } else { setProjectsHandled({ numberOfProjects: '', budget: '', impact: '' }); }
            }
            
            setIsProfileEditing(false);
            setHasOnboardingData(true);
            setDegreeCertificateFile(null);
            setProjectFile(null);

        } catch (err) {
            console.error('Error saving profile changes:', err.response ? err.response.data : err.message);
            setError(`Failed to save changes: ${err.response?.data?.details || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) return <div className="text-center py-8">Loading profile data...</div>;
        if (error && !hasOnboardingData) return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                    variant="primary"
                    className="bg-black hover:bg-gray-900"
                    onClick={() => {
                        setActiveTab('profile');
                        setError(null);
                        setIsProfileEditing(true);
                    }}
                >
                    Go to Profile Section to Fill Data
                </Button>
            </div>
        );
        if (error && hasOnboardingData) return <div className="text-center py-8 text-red-600">{error}</div>;

        const displayFieldStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[40px] flex items-center";
        const displayFieldWrapperStyle = "relative mt-1";
        
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">What recruiters will see</h3>
                            <div className="border-2 border-gray-200 rounded-lg divide-y divide-gray-200">
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Avatar size="lg" name={profileData.fullName} src={profileData.profileImageUrl} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                                <div>
                                                    <h4 className="text-lg font-medium text-gray-900">{profileData.fullName || 'N/A'}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {profileData.degree || 'N/A'} at {profileData.college || 'N/A'}, {profileData.yearOfGraduation || 'N/A'}
                                                    </p>
                                                   
                                                   
                                                </div>
                                                <div className="flex gap-2">
                                                    {profileData.linkedin && (
                                                        <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                                                                <FiLinkedin className="w-4 h-4" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {profileData.github && (
                                                        <a href={profileData.github} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                                                                <FiGithub className="w-4 h-4" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {profileData.portfolio && (
                                                        <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                                                                <FiGlobe className="w-4 h-4" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                               
                         <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      About
                    </h5>
                                                    <p className="text-gray-600">{profileData.about || 'No information provided.'}</p>
                                                </div>

                                                
                         <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Contact Information
                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Email address</p>
                                                            <p className="text-gray-900">{profileData.email || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Mobile Number</p>
                                                            <p className="text-gray-900">{profileData.phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
     <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Personal Information
                    </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Date of Birth</p>
                              <p className="text-gray-900">{profileData.dob || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="text-gray-900">{profileData.gender || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Marital Status</p>
                              <p className="text-gray-900">{profileData.maritalStatus || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Ethnicity</p>
                              <p className="text-gray-900">{profileData.ethnicity || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Visa / Work Authorization</p>
                              <p className="text-gray-900">{profileData.visaStatus || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Academic Background
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      {/* Degree & Specialization */}
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-gray-500">Degree & Specialization</p>
                        <p className="font-semibold text-gray-900">
                          {profileData.degree || 'N/A'} / {profileData.specialization || 'N/A'}
                        </p>
                      </div>

                      {/* CGPA / Percentage */}
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-gray-500">CGPA / Percentage</p>
                        <p className="font-semibold text-gray-900">{profileData.cgpa || 'N/A'}</p>
                      </div>

                      {/* Institution */}
                      <div className="col-span-2">
                        <p className="text-gray-500">Institution</p>
                        <p className="font-semibold text-gray-900">{profileData.college || 'N/A'}</p>
                      </div>
                      
                      {/* Graduation Date */}
                      <div className="col-span-2">
                        <p className="text-gray-500">Graduation Year</p>
                        <p className="font-semibold text-green-600">
                          {profileData.yearOfGraduation || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                                                 <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Skills
                    </h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {profileData.skills && profileData.skills.length > 0 ? (
                                                            profileData.skills.map((skill) => (
                                                                <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                                                    {skill}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-600">N/A</span>
                                                        )}
                                                    </div>
                                                </div>

                                                 <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Tools & Platforms
                    </h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {profileData.toolsAndPlatforms && profileData.toolsAndPlatforms.length > 0 ? (
                                                            profileData.toolsAndPlatforms.map((tool) => (
                                                                <Badge key={tool} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                                                    {tool}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-600">N/A</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Domain Knowledge
                    </h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {profileData.domainKnowledge && profileData.domainKnowledge.length > 0 ? (
                                                            profileData.domainKnowledge.map((domain) => (
                                                                <Badge key={domain} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                                                    {domain}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-600">N/A</span>
                                                        )}
                                                    </div>
                                                </div>

                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
    <h5 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
        Current Employment Status
    </h5>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
        
        {/* --- Column 1: Company & Experience --- */}
        <div>
            <p className="text-sm text-gray-500">Current Company</p>
            <p className="text-base font-semibold text-gray-900">
                {profileData.currentCompany || 'N/A'}
            </p>
        </div>
        
        <div>
            <p className="text-sm text-gray-500">Total Experience</p>
            <p className="text-base font-semibold text-gray-900">
                {profileData.totalYearsOfExperience ? `${profileData.totalYearsOfExperience}` : 'N/A'}
            </p>
        </div>
        
        {/* --- Column 2: Notice Period Details --- */}
        <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Notice Period Required</p>
            <p className="text-base font-semibold text-gray-900">
                {profileData.noticePeriod ? `${profileData.noticePeriod} days` : 'N/A'}
            </p>
        </div>
        
        <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Serving Notice?</p>
            <p className={`text-base font-semibold ${profileData.servingNoticePeriod ? 'text-red-600' : 'text-green-600'}`}>
                {profileData.servingNoticePeriod ? (
                    <>
                        Yes <span className="font-normal text-sm text-gray-700">(Since {profileData.noticePeriodStartDate || 'N/A'})</span>
                    </>
                ) : (
                    'No'
                )}
            </p>
        </div>
    </div>
</div>


                                                 <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Career Preferences
                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Interested Industry</p>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {profileData.industry && profileData.industry.length > 0 ? (
                                                                profileData.industry.map((role) => (
                                                                    <Badge key={role} variant="primary" size="md" className="bg-gray-100 text-gray-800">{role}</Badge>
                                                                ))
                                                                ) : (
                                                                <span className="text-gray-600">N/A</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Looking For</p>
                                                            <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.lookingFor || 'N/A'}</Badge>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Employment Type</p>
                                                            <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.employmentType || 'N/A'}</Badge>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Open to Shifts</p>
                                                            <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.openToShift || 'N/A'}</Badge>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <p className="text-sm text-gray-500">Interested Job Roles</p>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {profileData.jobRoles && profileData.jobRoles.length > 0 ? (
                                                                profileData.jobRoles.map((role) => (
                                                                    <Badge key={role} variant="primary" size="md" className="bg-gray-100 text-gray-800">{role}</Badge>
                                                                ))
                                                                ) : (
                                                                <span className="text-gray-600">N/A</span>
                                                                )}
                                                            </div>      
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <p className="text-sm text-gray-500">Preferred Locations</p>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {profileData.locations && profileData.locations.length > 0 ? (
                                                                profileData.locations.map((location) => (
                                                                    <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                                                        {location}
                                                                    </Badge>
                                                                ))
                                                                ) : (
                                                                <span className="text-gray-600">N/A</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                

                                                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Salary Information
                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Current Salary</p>
                                                            <p className="text-gray-900">{profileData.currentSalaryCurrency || ''} {profileData.currentSalaryAmount || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Expected Salary</p>
                                                            <p className="text-gray-900">{profileData.expectedSalaryCurrency || ''} {profileData.expectedSalaryAmount || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Work Experiences
                    </h5>
                                                    {workExperiences && workExperiences.length > 0 ? (
                                                        workExperiences.map((exp, idx) => (
                                                            <div key={idx} className="mb-4 border-b pb-2 last:border-b-0">
                                                                <p className="font-medium text-gray-900">{exp.role || 'N/A'} at {exp.company || 'N/A'}</p>
                                                                <p className="text-sm text-gray-600"><span className='text-black text-sm'>Start Date : </span>{exp.startDate || ''}  </p>
                                                                <p className="text-sm text-gray-600"><span className='text-black text-sm'>End Date : </span>{exp.endDate || 'Present'}  </p>
                                                                <p className="text-sm text-gray-700"><span className='text-black text-sm'>Description :</span>  {exp.description || 'No description provided.'}</p>
                                                                {exp.experienceCertificateUrl && (
                                                                    <p className="text-sm text-blue-600 mt-1">
                                                                        <a href={exp.experienceCertificateUrl} target="_blank" rel="noopener noreferrer" className="underline">View Certificate</a>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-600">No work experience added.</span>
                                                    )}
                                                </div>

                                               <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Achievement
                    </h5>
                                                    {achievements && achievements.length > 0 ? (
                                                        achievements.map((ach, idx) => (
                                                            <div key={idx} className="mb-4 border-b pb-2 last:border-b-0">
                                                                <p className="font-medium text-gray-900">{ach.title || 'N/A'}</p>
                                                                <p className="text-sm text-gray-600">{ach.event || 'N/A'} - {ach.date || 'N/A'}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-600">No achievements added.</span>
                                                    )}
                                                </div>

                                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Awards & Recognition
                    </h5>
                                                    {awards && awards.length > 0 ? (
                                                        awards.map((award, idx) => (
                                                            <div key={idx} className="mb-4 border-b pb-2 last:border-b-0">
                                                                <p className="font-medium text-gray-900">{award.title || 'N/A'} at {award.organization || 'N/A'}</p>
                                                                <p className="text-sm text-gray-600">{award.startDate} to {award.endDate || 'Present'}</p>
                                                                <p className="text-sm text-gray-700 mt-1">{award.description || 'No description provided.'}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-600">No awards added.</span>
                                                    )}
                                                </div>

                                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Published Articles/Blogs
                    </h5>
                                                    {publications && publications.length > 0 ? (
                                                        <ul className="list-disc list-inside text-gray-600">
                                                            {publications.map((pub, idx) => (
                                                                <li key={idx}>
                                                                    {pub.title || 'N/A'}
                                                                    {pub.url && (
                                                                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                                                                            (Link)
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-gray-600">No publications added.</span>
                                                    )}
                                                </div>

                                                 <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Project Handled
                    </h5>
                                                    {projectsHandled && projectsHandled.numberOfProjects ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <p className="text-sm text-gray-500">Number of Projects</p>
                                                                <p className="text-gray-900">{projectsHandled.numberOfProjects}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Budget</p>
                                                                <p className="text-gray-900">{projectsHandled.budget}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Impact</p>
                                                                <p className="text-gray-900">{projectsHandled.impact}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-600">No project details added.</span>
                                                    )}
                                                </div>

                                                 <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Certification
                    </h5>
                                                    {profileData.certifications && profileData.certifications.length > 0 ? (
                                                        <ul className="list-disc list-inside text-gray-600">
                                                            {profileData.certifications.map((cert, idx) => (
                                                                <li key={idx}>
                                                                    {cert.name || 'N/A'}
                                                                    {cert.url && (
                                                                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                                                                            (Link)
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-gray-600">No certifications added.</span>
                                                    )}
                                                </div>
                                                
                                                 <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Known Languages
                    </h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {profileData.languagesKnown && profileData.languagesKnown.length > 0 ? (
                                                        profileData.languagesKnown.map((lang) => (
                                                            <Badge key={lang} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                                                {lang}
                                                            </Badge>
                                                        ))
                                                        ) : (
                                                        <span className="text-gray-600">N/A</span>
                                                        )}
                                                    </div>
                                                </div>

                                                 <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <h5 className="text-lg font-bold text-gray-800 mb-4">
                      Referral Sources
                    </h5>
                                                    <p className="text-gray-900">{profileData.referralSource || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="space-y-6">
                        {/* About Section */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">About</h3>
                                    <p className="text-sm text-gray-600">Tell us a bit about yourself and your personal details.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter your name *
                                    </label>
                                    {isProfileEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Enter your name"
                                            value={profileData.fullName}
                                            onChange={(e) => handleProfileDataChange('fullName', e.target.value)}
                                            required
                                        />
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.fullName || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter your email *
                                    </label>
                                    <div className={displayFieldWrapperStyle}>
                                        {isProfileEditing && (
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                            </div>
                                        )}
                                        {isProfileEditing ? (
                                            <input
                                                type="email"
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="hello@xyz.com"
                                                value={profileData.email}
                                                onChange={(e) => handleProfileDataChange('email', e.target.value)}
                                                required
                                            />
                                        ) : (
                                            <div className={displayFieldStyle + (profileData.email ? " pl-10" : "")}>
                                                {profileData.email && (
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {profileData.email || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter your mobile no. *
                                    </label>
                                    <div className={displayFieldWrapperStyle}>
                                        {isProfileEditing && (
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.485A1 1 0 017.5 7H4a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-3.5a1 1 0 011-1h1.485a1 1 0 01.836.986l1.485.74a1 1 0 01.52.879V17a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
                                                </svg>
                                            </div>
                                        )}
                                        {isProfileEditing ? (
                                            <input
                                                type="tel"
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="1234567890"
                                                value={profileData.phone}
                                                onChange={(e) => handleProfileDataChange('phone', e.target.value)}
                                                required
                                            />
                                        ) : (
                                            <div className={displayFieldStyle + (profileData.phone ? " pl-10" : "")}>
                                                {profileData.phone && (
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.485A1 1 0 017.5 7H4a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-3.5a1 1 0 011-1h1.485a1 1 0 01.836.986l1.485.74a1 1 0 01.52.879V17a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {profileData.phone || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Type</label>
                                    {isProfileEditing ? (
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" value={profileData.profileType} onChange={(e) => handleProfileDataChange('profileType', e.target.value)}>
                                            <option value="">Select Profile Type</option>
                                            {predefinedProfileTypes.map(type => <option key={type} value={type} className="capitalize">{type}</option>)}
                                        </select>
                                    ) : (<div className="capitalize ">{profileData.profileType || "N/A"}</div>)}
                                </div> */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                                    {isProfileEditing ? (
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows="4"
                                            placeholder="Write a brief summary about yourself..."
                                            value={profileData.about}
                                            onChange={(e) => handleProfileDataChange('about', e.target.value)}
                                        />
                                    ) : (
                                        <div className={`${displayFieldStyle} items-start min-h-[100px]`}>{profileData.about || "N/A"}</div>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
                                <p className="text-sm text-gray-600">Provide some personal information.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    {isProfileEditing ? (
                                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" value={profileData.dob} onChange={(e) => handleProfileDataChange('dob', e.target.value)} />
                                    ) : (<div className={displayFieldStyle}>{profileData.dob || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    {isProfileEditing ? (
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" value={profileData.gender} onChange={(e) => handleProfileDataChange('gender', e.target.value)}>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    ) : (<div className={displayFieldStyle}>{profileData.gender || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                    {isProfileEditing ? (
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" value={profileData.maritalStatus} onChange={(e) => handleProfileDataChange('maritalStatus', e.target.value)}>
                                            <option value="">Select Status</option>
                                            {predefinedMaritalStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                        </select>
                                    ) : (<div className={displayFieldStyle}>{profileData.maritalStatus || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                                    {isProfileEditing ? (
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" value={profileData.ethnicity} onChange={(e) => handleProfileDataChange('ethnicity', e.target.value)}>
                                            <option value="">Select Ethnicity</option>
                                            {predefinedEthnicities.map(ethnicity => <option key={ethnicity} value={ethnicity}>{ethnicity}</option>)}
                                        </select>
                                    ) : (<div className={displayFieldStyle}>{profileData.ethnicity || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Visa Status / Work Authorization</label>
                                    {isProfileEditing ? (
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" value={profileData.visaStatus} onChange={(e) => handleProfileDataChange('visaStatus', e.target.value)}>
                                            <option value="">Select Status</option>
                                            {predefinedVisaStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                        </select>
                                    ) : (<div className={displayFieldStyle}>{profileData.visaStatus || "N/A"}</div>)}
                                </div>
                            </div>
                        </div>

                        {/* Educational Background Section */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Educational Background</h3>
                                    <p className="text-sm text-gray-600">Provide details about your education.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        College/University
                                    </label>
                                    {isProfileEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="e.g., University of Technology"
                                            value={profileData.college}
                                            onChange={(e) => handleProfileDataChange('college', e.target.value)}
                                        />
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.college || "N/A"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Degree
                                    </label>
                                    {isProfileEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="e.g., Bachelor of Science"
                                            value={profileData.degree}
                                            onChange={(e) => handleProfileDataChange('degree', e.target.value)}
                                        />
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.degree || "N/A"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                    {isProfileEditing ? (
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Computer Science" value={profileData.specialization} onChange={(e) => handleProfileDataChange('specialization', e.target.value)} />
                                    ) : (<div className={displayFieldStyle}>{profileData.specialization || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
                                    {isProfileEditing ? (
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 6th" value={profileData.semester} onChange={(e) => handleProfileDataChange('semester', e.target.value)} />
                                    ) : (<div className={displayFieldStyle}>{profileData.semester || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Year of Graduation
                                    </label>
                                    {isProfileEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="e.g., 2025"
                                            value={profileData.yearOfGraduation}
                                            onChange={(e) => handleProfileDataChange('yearOfGraduation', e.target.value)}
                                        />
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.yearOfGraduation || "N/A"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current CGPA/Percentage
                                    </label>
                                    {isProfileEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="e.g., 8.5 or 85%"
                                            value={profileData.cgpa}
                                            onChange={(e) => handleProfileDataChange('cgpa', e.target.value)}
                                        />
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.cgpa || "N/A"}
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Degree Certificate (Optional)
                                    </label>
                                    {isProfileEditing ? (
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="degree-certificate-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="degree-certificate-upload"
                                                            name="degree-certificate-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => handleFileChange(e, 'degreeCertificate')}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PDF, DOCX, DOC up to 10MB</p>
                                                {profileData.degreeCertificateUrl && (
                                                    <p className="text-sm text-green-600 mt-2">
                                                        File uploaded: <a href={profileData.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="underline">View Certificate</a>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.degreeCertificateUrl ? (
                                                <a href={profileData.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    View Certificate
                                                </a>
                                            ) : (
                                                "No certificate uploaded"
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Current Employment Section */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Employment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                                    {isProfileEditing ? (
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={profileData.currentCompany} onChange={(e) => handleProfileDataChange('currentCompany', e.target.value)} />
                                    ) : (<div className={displayFieldStyle}>{profileData.currentCompany || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Years of Experience</label>
                                    {isProfileEditing ? (
                                        <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={profileData.totalYearsOfExperience} onChange={(e) => handleProfileDataChange('totalYearsOfExperience', e.target.value)} />
                                    ) : (<div className={displayFieldStyle}>{profileData.totalYearsOfExperience || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                                    {isProfileEditing ? (
                                        <input type="text" placeholder="e.g., 30 days" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={profileData.noticePeriod} onChange={(e) => handleProfileDataChange('noticePeriod', e.target.value)} />
                                    ) : (<div className={displayFieldStyle}>{profileData.noticePeriod || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Serving Notice Period?</label>
                                    {isProfileEditing ? (
                                        <div className="flex items-center space-x-4 mt-2">
                                            <label><input type="radio" name="servingNotice" value="yes" checked={profileData.servingNoticePeriod === true} onChange={() => handleProfileDataChange('servingNoticePeriod', true)} /> Yes</label>
                                            <label><input type="radio" name="servingNotice" value="no" checked={profileData.servingNoticePeriod === false} onChange={() => handleProfileDataChange('servingNoticePeriod', false)} /> No</label>
                                        </div>
                                    ) : (<div className={displayFieldStyle}>{profileData.servingNoticePeriod ? 'Yes' : 'No'}</div>)}
                                </div>
                                {profileData.servingNoticePeriod && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period Start Date</label>
                                        {isProfileEditing ? (
                                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={profileData.noticePeriodStartDate} onChange={(e) => handleProfileDataChange('noticePeriodStartDate', e.target.value)} />
                                        ) : (<div className={displayFieldStyle}>{profileData.noticePeriodStartDate || "N/A"}</div>)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Career Goals Section */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Career Goals</h3>
                                    <p className="text-sm text-gray-600">Help us understand your career preferences.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Interested Industry Type
                                    </label>
                                    {isProfileEditing ? (
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            value={profileData.industry && profileData.industry.length > 0 ? profileData.industry[0] : ''} // Get first item if array
                                            onChange={(e) => handleProfileDataChange('industry', [e.target.value])} // Convert to array for schema
                                        >
                                            <option value="">Select Industry</option>
                                            {predefinedIndustries.map(industry => (
                                                <option key={industry} value={industry}>{industry}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.industry && profileData.industry.length > 0 ? profileData.industry[0] : "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Interested Job Roles
                                    </label>
                                    {isProfileEditing ? (
                                        <div className="relative" ref={jobRolesDropdownRef}>
                                            <div
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                onClick={() => setIsJobRolesDropdownOpen(!isJobRolesDropdownOpen)}
                                            >
                                                <div className="flex flex-wrap gap-2 pr-6">
                                                    {profileData.jobRoles.length > 0 ? (
                                                        profileData.jobRoles.map(role => (
                                                            <Badge key={role} variant="primary" size="sm" className="bg-gray-200 text-gray-800">
                                                                {role}
                                                                <span
                                                                    className="ml-1 cursor-pointer text-gray-600 hover:text-gray-900"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); 
                                                                        handleCustomMultiSelectToggle('jobRoles', role);
                                                                    }}
                                                                >x</span>
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500">Multiple-select</span>
                                                    )}
                                                </div>
                                                <FiChevronDown className="w-5 h-5 text-gray-400 absolute right-3" />
                                            </div>
                                            {isJobRolesDropdownOpen && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {predefinedJobRoles.map((role) => (
                                                        <div
                                                            key={role}
                                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                                                profileData.jobRoles.includes(role) ? 'bg-blue-50 text-blue-800' : ''
                                                            }`}
                                                            onClick={() => handleCustomMultiSelectToggle('jobRoles', role)}
                                                        >
                                                            {role}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.jobRoles && profileData.jobRoles.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 py-1">
                                                    {profileData.jobRoles.map(role => (
                                                        <Badge key={role} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                                            {role}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Preferred Job Locations
                                    </label>
                                    {isProfileEditing ? (
                                        <div className="relative" ref={locationsDropdownRef}>
                                            <div
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                onClick={() => setIsLocationsDropdownOpen(!isLocationsDropdownOpen)}
                                            >
                                                <div className="flex flex-wrap gap-2 pr-6">
                                                    {profileData.locations.length > 0 ? (
                                                        profileData.locations.map(location => (
                                                            <Badge key={location} variant="primary" size="sm" className="bg-gray-200 text-gray-800">
                                                                {location}
                                                                <span
                                                                    className="ml-1 cursor-pointer text-gray-600 hover:text-gray-900"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCustomMultiSelectToggle('locations', location);
                                                                    }}
                                                                >x</span>
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500">Multiple-select</span>
                                                    )}
                                                </div>
                                                <FiChevronDown className="w-5 h-5 text-gray-400 absolute right-3" />
                                            </div>
                                            {isLocationsDropdownOpen && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {predefinedLocations.map((location) => (
                                                        <div
                                                            key={location}
                                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                                                profileData.locations.includes(location) ? 'bg-blue-50 text-blue-800' : ''
                                                            }`}
                                                            onClick={() => handleCustomMultiSelectToggle('locations', location)}
                                                        >
                                                            {location}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.locations && profileData.locations.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 py-1">
                                                    {profileData.locations.map(location => (
                                                        <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                                            {location}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Looking for
                                    </label>
                                    {isProfileEditing ? (
                                        <div className="flex flex-wrap gap-3">
                                            {predefinedLookingFor.map((option) => (
                                                <Button
                                                    key={option}
                                                    variant={profileData.lookingFor === option ? 'primary' : 'outline'}
                                                    className={profileData.lookingFor === option ? 'bg-black text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                                                    onClick={() => handleProfileDataChange('lookingFor', option)}
                                                >
                                                    {option}
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.lookingFor || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Employment type
                                    </label>
                                    {isProfileEditing ? (
                                        <div className="flex flex-wrap gap-3">
                                            {predefinedEmploymentTypes.map((type) => (
                                                <Button
                                                    key={type}
                                                    variant={profileData.employmentType === type ? 'primary' : 'outline'}
                                                    className={`capitalize ${profileData.employmentType === type ? 'bg-black text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                                    onClick={() => handleProfileDataChange('employmentType', type)}
                                                >
                                                    {type}
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={`${displayFieldStyle} capitalize`}>
                                            {profileData.employmentType || "N/A"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shift Preference</label>
                                    {isProfileEditing ? (
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={profileData.openToShift}
                                            onChange={(e) => handleProfileDataChange('openToShift', e.target.value)}
                                        >
                                            <option value="">Select Shift Preference</option>
                                            <option value="Day">Day</option>
                                            <option value="Night">Night</option>
                                            <option value="Rotational">Rotational</option>
                                        </select>
                                    ) : (
                                        <div className={displayFieldStyle}>{profileData.openToShift || "N/A"}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Open to Relocate (Client Location)</label>
                                    {isProfileEditing ? (
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Yes, within USA" value={profileData.clientLocation} onChange={(e) => handleProfileDataChange('clientLocation', e.target.value)} />
                                    ) : (<div className={displayFieldStyle}>{profileData.clientLocation || "N/A"}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Salary
                                    </label>
                                    {isProfileEditing ? (
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                value={profileData.currentSalaryCurrency || ''}
                                                onChange={(e) => handleProfileDataChange('currentSalaryCurrency', e.target.value)}
                                            >
                                                {predefinedCurrencies.map((currency) => (
                                                    <option key={currency} value={currency}>{currency}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Enter amount"
                                                value={profileData.currentSalaryAmount || ''}
                                                onChange={(e) => handleProfileDataChange('currentSalaryAmount', e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.currentSalaryCurrency} {profileData.currentSalaryAmount || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expected Salary
                                    </label>
                                    {isProfileEditing ? (
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                value={profileData.expectedSalaryCurrency || ''}
                                                onChange={(e) => handleProfileDataChange('expectedSalaryCurrency', e.target.value)}
                                            >
                                                {predefinedCurrencies.map((currency) => (
                                                    <option key={currency} value={currency}>{currency}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Enter amount"
                                                value={profileData.expectedSalaryAmount || ''}
                                                onChange={(e) => handleProfileDataChange('expectedSalaryAmount', e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div className={displayFieldStyle}>
                                            {profileData.expectedSalaryCurrency} {profileData.expectedSalaryAmount || "N/A"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-blue-100">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Work Experience</h3>
                                <div className="space-y-6">
                                    {workExperiences.map((exp) => <ExperienceCard key={exp.id} experience={exp} type="work" onUpdate={updateExperience} onRemove={removeExperience} canRemove={workExperiences.length > 0} isProfileEditing={isProfileEditing} />)}
                                </div>
                                {isProfileEditing && (<button onClick={() => addExperience('work')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add Work Experience</button>)}
                            </div>

                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-green-100">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">International Experience</h3>
                                <div className="space-y-6">
                                    {internationalExperiences.map((exp) => <ExperienceCard key={exp.id} experience={exp} type="international" onUpdate={updateExperience} onRemove={removeExperience} canRemove={internationalExperiences.length > 0} isProfileEditing={isProfileEditing} />)}
                                </div>
                                {isProfileEditing && (<button onClick={() => addExperience('international')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add International Experience</button>)}
                            </div>

                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-purple-100">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Leadership Experience</h3>
                                <div className="space-y-6">
                                    {leadershipExperiences.map((exp) => <ExperienceCard key={exp.id} experience={exp} type="leadership" onUpdate={updateExperience} onRemove={removeExperience} canRemove={leadershipExperiences.length > 0} isProfileEditing={isProfileEditing} />)}
                                </div>
                                {isProfileEditing && (<button onClick={() => addExperience('leadership')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add Leadership Experience</button>)}
                            </div>

                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-amber-100">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Achievements</h3>
                                <div className="space-y-6">
                                    {achievements.map((ach) => <AchievementCard key={ach.id} achievement={ach} onUpdate={updateExperience} onRemove={removeExperience} canRemove={achievements.length > 0} isProfileEditing={isProfileEditing} />)}
                                </div>
                                {isProfileEditing && (<button onClick={() => addExperience('achievement')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add Achievement</button>)}
                            </div>

                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-red-100">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Awards</h3>
                                <div className="space-y-6">
                                    {awards.map((award) => <AwardCard key={award.id} award={award} onUpdate={updateExperience} onRemove={removeExperience} canRemove={awards.length > 0} isProfileEditing={isProfileEditing} />)}
                                </div>
                                {isProfileEditing && (<button onClick={() => addExperience('award')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add Award</button>)}
                            </div>

                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-indigo-100">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Publications</h3>
                                <div className="space-y-6">
                                    {publications.map((pub) => <PublicationCard key={pub.id} publication={pub} onUpdate={updateExperience} onRemove={removeExperience} canRemove={publications.length > 0} isProfileEditing={isProfileEditing} />)}
                                </div>
                                {isProfileEditing && (<button onClick={() => addExperience('publication')} className="mt-6 py-3 px-6 text-blue-600 rounded-lg flex items-center gap-2 font-medium"><Plus size={20} /> Add Publication</button>)}
                            </div>

                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-teal-100">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Projects Handled</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Projects</label>
                                        {isProfileEditing ? (
                                            <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg" value={projectsHandled.numberOfProjects || ''} onChange={(e) => handleProjectsHandledChange('numberOfProjects', e.target.value)} />
                                        ) : (<div className={displayFieldStyle}>{projectsHandled.numberOfProjects || 'N/A'}</div>)}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Handled</label>
                                        {isProfileEditing ? (
                                            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="e.g., $1 Million" value={projectsHandled.budget || ''} onChange={(e) => handleProjectsHandledChange('budget', e.target.value)} />
                                        ) : (<div className={displayFieldStyle}>{projectsHandled.budget || 'N/A'}</div>)}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Impact</label>
                                        {isProfileEditing ? (
                                            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="e.g., Increased revenue by 20%" value={projectsHandled.impact || ''} onChange={(e) => handleProjectsHandledChange('impact', e.target.value)} />
                                        ) : (<div className={displayFieldStyle}>{projectsHandled.impact || 'N/A'}</div>)}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Skills & Tools Section */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Skills & Expertise</h3>
                                    <p className="text-sm text-gray-600">Highlight your professional skills, tools, and languages.</p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Skills</label>
                                    {isProfileEditing ? (
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows="3"
                                            placeholder="Enter your skills (comma separated)"
                                            value={profileData.skills.join(', ')}
                                            onChange={(e) => handleProfileDataChange('skills', e.target.value.split(',').map(s => s.trim()))}
                                        ></textarea>
                                    ) : (
                                        <div className={displayFieldStyle + " h-auto"}>
                                            {profileData.skills.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 py-1">
                                                    {profileData.skills.map(skill => (
                                                        <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">{skill}</Badge>
                                                    ))}
                                                </div>
                                            ) : "N/A"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tools and Platforms</label>
                                    {isProfileEditing ? (
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows="3"
                                            placeholder="Enter tools and platforms (comma separated)"
                                            value={profileData.toolsAndPlatforms.join(', ')}
                                            onChange={(e) => handleProfileDataChange('toolsAndPlatforms', e.target.value.split(',').map(s => s.trim()))}
                                        ></textarea>
                                    ) : (
                                        <div className={displayFieldStyle + " h-auto"}>
                                            {profileData.toolsAndPlatforms.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 py-1">
                                                    {profileData.toolsAndPlatforms.map(tool => (
                                                        <Badge key={tool} variant="primary" size="md" className="bg-gray-100 text-gray-800">{tool}</Badge>
                                                    ))}
                                                </div>
                                            ) : "N/A"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain Knowledge</label>
                                    {isProfileEditing ? (
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            rows="3"
                                            placeholder="Enter domain knowledge (comma separated)"
                                            value={profileData.domainKnowledge.join(', ')}
                                            onChange={(e) => handleProfileDataChange('domainKnowledge', e.target.value.split(',').map(s => s.trim()))}
                                        ></textarea>
                                    ) : (
                                        <div className={displayFieldStyle + " h-auto"}>
                                            {profileData.domainKnowledge.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 py-1">
                                                    {profileData.domainKnowledge.map(domain => (<Badge key={domain} className="bg-gray-100 text-gray-800">{domain}</Badge>))}
                                                </div>
                                            ) : "N/A"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages Known</label>
                                    {isProfileEditing ? (
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows="2"
                                            placeholder="e.g., English, Spanish, French"
                                            value={profileData.languagesKnown.join(', ')}
                                            onChange={(e) => handleProfileDataChange('languagesKnown', e.target.value.split(',').map(s => s.trim()))}
                                        ></textarea>
                                    ) : (
                                        <div className={displayFieldStyle + " h-auto"}>
                                            {profileData.languagesKnown.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 py-1">
                                                    {profileData.languagesKnown.map(lang => (
                                                        <Badge key={lang} variant="primary" size="md" className="bg-gray-100 text-gray-800">{lang}</Badge>
                                                    ))}
                                                </div>
                                            ) : "N/A"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Social Profiles Section */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Social Profiles</h3>
                                    <p className="text-sm text-gray-600">Add links to your professional profiles.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        LinkedIn
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                            http://
                                        </span>
                                        {isProfileEditing ? (
                                            <input
                                                type="text"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
                                                placeholder="www.linkedin.com/in/yourprofile"
                                                value={profileData.linkedin.replace(/^(https?:\/\/)?(www\.)?/i, '')}
                                                onChange={(e) => handleProfileDataChange('linkedin', `http://${e.target.value}`)}
                                            />
                                        ) : (
                                            <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
                                                {profileData.linkedin ? (
                                                    <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {profileData.linkedin}
                                                    </a>
                                                ) : "N/A"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Github
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                            http://
                                        </span>
                                        {isProfileEditing ? (
                                            <input
                                                type="text"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
                                                placeholder="github.com/yourprofile"
                                                value={profileData.github.replace(/^(https?:\/\/)?(www\.)?/i, '')}
                                                onChange={(e) => handleProfileDataChange('github', `http://${e.target.value}`)}
                                            />
                                        ) : (
                                            <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
                                                {profileData.github ? (
                                                    <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {profileData.github}
                                                    </a>
                                                ) : "N/A"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Portfolio Website
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                            http://
                                        </span>
                                        {isProfileEditing ? (
                                            <input
                                                type="text"
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
                                                placeholder="www.yourwebsite.com"
                                                value={profileData.portfolio.replace(/^(https?:\/\/)?(www\.)?/i, '')}
                                                onChange={(e) => handleProfileDataChange('portfolio', `http://${e.target.value}`)}
                                            />
                                        ) : (
                                            <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
                                                {profileData.portfolio ? (
                                                    <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {profileData.portfolio}
                                                    </a>
                                                ) : "N/A"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Certifications Section */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Credentials</h3>
                                    <p className="text-sm text-gray-600">List your certifications.</p>
                                </div>
                            </div>
                            
                            {/* Certifications */}
                            {profileData.certifications.map((cert, index) => (
                                <div key={index} className="space-y-4 mb-4 p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                                        {isProfileEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                value={cert.name}
                                                onChange={(e) => {
                                                    const newCerts = [...profileData.certifications];
                                                    newCerts[index].name = e.target.value;
                                                    handleProfileDataChange('certifications', newCerts);
                                                }}
                                            />
                                        ) : (<div className={displayFieldStyle}>{cert.name || "N/A"}</div>)}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Certification URL</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">http://</span>
                                            {isProfileEditing ? (
                                                <input
                                                    type="text"
                                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
                                                    placeholder="www.example.com"
                                                    value={cert.url.replace(/^(https?:\/\/)?(www\.)?/i, '')}
                                                    onChange={(e) => {
                                                        const newCerts = [...profileData.certifications];
                                                        newCerts[index].url = `http://${e.target.value}`;
                                                        handleProfileDataChange('certifications', newCerts);
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
                                                    {cert.url ? (<a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{cert.url}</a>) : "N/A"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isProfileEditing && (
                                <Button variant="outline" size="sm" onClick={() => handleProfileDataChange('certifications', [...profileData.certifications, { name: '', url: '' }])}>
                                    <FiPlus className="w-4 h-4 mr-2" /> Add Certification
                                </Button>
                            )}
                        </div>
                        
                        
                        <div className="flex justify-end p-6 bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
                            <Button
                                variant="primary"
                                className="bg-black hover:bg-gray-900"
                                onClick={isProfileEditing ? handleSaveChanges : () => setIsProfileEditing(true)}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (isProfileEditing ? 'Save Changes' : 'Edit Profile')}
                            </Button>
                        </div>
                    </div>
                );
            case 'resume':
                return (
                    <div className="space-y-6">
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload your resume/CV</h3>
                            
                            {(profileData.resumeUrl || resumeFile) && (
                                <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {resumeFile ? 'New Resume' : 'Current Resume'}
                                        </p>
                                        {resumeFile ? (
                                            <p className="text-sm text-gray-600">{resumeFile.name}</p>
                                        ) : (
                                            <a 
                                                href={`/fresher-resume-preview?url=${encodeURIComponent(profileData.resumeUrl)}`}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleResumeClick}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Replace
                                    </button>
                                </div>
                            )}

                            <div 
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={handleResumeClick}
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    id="resume-upload"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => handleFileChange(e, 'resume')}
                                />
                                <div className="flex flex-col items-center justify-center">
                                    <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">
                                        {profileData.resumeUrl || resumeFile ? 'Click to upload new resume' : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Supported formats: PDF, DOC, DOCX
                                    </p>
                                </div>
                            </div>

                            {resumeFile && (
                                <div className="mt-6 flex justify-end">
                                    <Button
                                        variant="primary"
                                        onClick={handleSaveChanges}
                                        disabled={loading}
                                        className="bg-black hover:bg-gray-900"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                );  default:
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full bg-gray-100 min-h-screen">
            <div
                className="w-full h-32 bg-gray-300 relative bg-cover bg-center cursor-pointer"
                style={{ 
                    backgroundImage: `url(${
                        backgroundImageFile ? 
                        URL.createObjectURL(backgroundImageFile) : 
                        profileData.backgroundImageUrl
                        })` 
                }}
                onClick={handleBackgroundImageClick}
                >
                <input
                    id="backgroundImageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'backgroundImage')}
                />
                {!profileData.backgroundImageUrl && !backgroundImageFile && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <FiUploadCloud className="w-8 h-8 mr-2" />
                        <span>Upload Background Image</span>
                    </div>
                )}
            </div>

            <div className="bg-white pb-4">
                <div className="relative px-4">
                    <div 
                        className="absolute -top-16 left-4 cursor-pointer"
                        onClick={handleProfileImageClick}
                    >
                        <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white overflow-hidden">
                            {profileData.profileImageUrl ? (
                                <img 
                                    src={profileData.profileImageUrl} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <FiUploadCloud className="h-8 w-8 mb-1" />
                                    <span className="text-xs">Upload</span>
                                </div>
                            )}
                        </div>
                        <input
                            id="profileImageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'profileImage')}
                        />
                    </div>
                </div>        

                <div className="px-6 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{profileData.fullName || 'Name Surname'}</h2>
                        <p className="text-gray-600">{profileData.email || 'hello@gmail.com'}</p>
                    </div>
                
                </div>

                <div className="flex border-b mt-4">
                    {['overview', 'profile', 'resume'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-6 py-2 ${activeTab === tab ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('resume', 'Resume / CV')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 flex-1">
                {renderContent()}
            </div>
        </div>
    );
}

export default ProfProfile;