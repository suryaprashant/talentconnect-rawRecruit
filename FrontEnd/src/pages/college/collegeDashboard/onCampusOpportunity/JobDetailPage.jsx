// import { ApplyForOnCampus, getCompanyPostingForOncampusDetail, SaveOppurtunity } from '@/lib/College_AxiosIntance';
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';

// // Utility function to format date
// const formatDate = (dateString) => {
//   if (!dateString || dateString === 'Not Specified') return 'Not Specified';

//   try {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   } catch (error) {
//     console.error("Error formatting date:", error);
//     return 'Not Specified';
//   }
// };

// const JobDetailPage = () => {
//   const { id } = useParams();
//   const [job, setJob] = useState(null);
//   const [isSaved, setIsSaved] = useState(false);
//   const [error, setError] = useState(null);

//   const loadJobDetail = async () => {
//     try {
//       const response = await getCompanyPostingForOncampusDetail(id);
//       const backendData = response.data;

//       const mappedJob = {
//         _id: backendData._id,
//         company: backendData.companyPosted?.companyDetails?.companyName || 'Not Specified',
//         startDate: formatDate(backendData.startDate) || 'Not Specified',
//         endDate: formatDate(backendData.endDate) || 'Not Specified',
//         isHybridEvent: false,
//         jobType: backendData.jobType,

//         companyInfo: {
//           website: backendData.companyPosted?.companyDetails?.collegeWebsite || 'Not Specified',
//           about: backendData.description || backendData.companyPosted?.companyDetails?.description || 'Not Specified',
//           stats: {
//             employees: backendData.companyPosted?.companyDetails?.numberOfEmployees || 'Not Specified',
//             revenue: 'Not Specified',
//             industries: backendData.companyPosted?.companyDetails?.industryType || 'Not Specified',
//             countries: backendData.country || backendData.companyPosted?.companyDetails?.country || 'Not Specified',
//           },
//         },

//         programDetails: {
//           eligibleDegrees: (backendData.degree && backendData.degree.length > 0) ? backendData.degree : ['Not Specified'],
//           cutoff: 'Not Specified',
//           locations: (backendData.location && backendData.location.length > 0) ? backendData.location : ['Not Specified'],
//           compensation: {
//             amount: backendData.minPackage?.amount ? `${backendData.minPackage.currency} ${backendData.minPackage.amount}` : 'Not Specified',
//             details: 'As per company standards',
//           },
//         },

//         description: backendData.description || 'Not Specified',

//         jobDetails: {
//           jobTitle: backendData.jobTitle || 'Not Specified',
//           jobCategory: backendData.jobCategory || 'Not Specified',
//           role: (backendData.jobRoles && backendData.jobRoles.length > 0) ? backendData.jobRoles.join(', ') : 'Not Specified',
//           industry: backendData.companyPosted?.companyDetails?.industryType || 'Not Specified',
//           employmentType: backendData.employmentType || 'Not Specified',
//           workMode: backendData.workMode || 'Not Specified',
//           locations: (backendData.location && backendData.location.length > 0) ? backendData.location : ['Not Specified'],
//         },

//         eligibility: {
//           degrees: (backendData.degree && backendData.degree.length > 0) ? backendData.degree : ['Not Specified'],
//           studentStreams: (backendData.studentStreams && backendData.studentStreams.length > 0) ? backendData.studentStreams : ['Not Specified'],
//           minEducation: backendData.minEducation || 'Not Specified',
//           yearsOfExperience: backendData.yearsOfExperience || 'Not Specified',
//           requiredSkills: (backendData.skills && backendData.skills.length > 0) ? backendData.skills : ['Not Specified'],
//         },

//         benefits: ['Health Insurance', 'Paid Time Off', 'Professional Development'], // Hardcoded or add to backend

//         selectionProcess: {
//           steps: (backendData.selectionProcess && backendData.selectionProcess.length > 0) ? backendData.selectionProcess : ['Not Specified'],
//           rounds: (backendData.rounds && backendData.rounds.length > 0) ? backendData.rounds : ['Not Specified'],
//           dates: {
//             registrationDeadline: formatDate(backendData.endDate) || 'Not Specified',
//           },
//         },
//         requiredDocuments: ['Resume', 'Transcripts', 'Government ID'],

//         contactInfo: {
//           name: backendData.contactPerson?.name || 'Not Specified',
//           designation: backendData.contactPerson?.designation || 'Not Specified',
//           email: backendData.contactPerson?.email || 'Not Specified',
//           mobile: backendData.contactPerson?.mobile || 'Not Specified',
//           linkedin: backendData.contactPerson?.linkedin || 'Not Specified',
//         },
//       };

//       setJob(mappedJob);
//       setError(null);
//     } catch (error) {
//       console.error("Error loading job detail: ", error);
//       setError("Failed to load job details. Please try again later.");
//       setJob(null);
//     }
//   };

//   useEffect(() => {
//     loadJobDetail();
//   }, [id]);

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: `${job?.jobDetails?.jobTitle || 'Job'} at ${job?.company}`,
//         text: `Check out this opportunity for a ${job?.jobDetails?.jobTitle || 'job'} at ${job?.company}!`,
//         url: window.location.href,
//       })
//         .catch((error) => console.log('Error sharing', error));
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//         .then(() => alert('Link copied to clipboard!'))
//         .catch(() => alert('Failed to copy link'));
//     }
//   };

//   const handleApply = async () => {
//     try {
//       const response = await ApplyForOnCampus(id);
//       // console.log("apply res: ", response);

//       if (response.data?.success === true) alert("Applied");
//       // }
//       else alert(response?.response.data.msg);
//     } catch (error) {
//       console.log("Error: ", error);
//       alert(`Something went wrong`);
//     }
//   };

//   const handleSave = async (jobId, jobType) => {
//     // console.log("Save: ", jobId, jobType);

//     try {
//       const response = await SaveOppurtunity(jobId, jobType);
//       if (response.data.success === true) alert("Saved");
//       // }
//       // else alert("Application Closed!")
//     } catch (error) {
//       console.log("Error: ", error);
//       alert("Error!");
//     }
//   };

//   // useEffect(() => {
//   //   console.log("job", job);
//   // }, [job]);

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="mt-4 text-red-600">{error}</p>
//           <button
//             onClick={loadJobDetail}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading registration details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Link to="/college-dashboard/on-campus-opportunities" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//           </svg>
//           Back to opportunities
//         </Link>

//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Header Section */}
//           <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
//             <div className="text-sm text-blue-600 font-medium">Registrations Open</div>
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2">
//               <h1 className="text-2xl font-bold text-gray-900"> {job?.company}</h1>
//               <div className="flex items-center mt-2 md:mt-0">
//                 <a
//                   href={job?.companyInfo?.website ? `https://${job.companyInfo.website.startsWith('http') ? '' : ''}${job.companyInfo.website}` : '#'}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800 text-sm mr-6"
//                 >
//                   {job?.companyInfo?.website}
//                 </a>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-between mt-4">
//               <div className="flex items-center text-sm text-gray-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span>{job.startDate} - {job.endDate}</span>
//               </div>
//               <div className="flex items-center mt-2 sm:mt-0 text-sm text-gray-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 <span>{job.programDetails.locations.join(', ')}</span>
//               </div>
//             </div>

//             <div className="flex space-x-2 mt-4">
//               <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none" onClick={()=>handleApply()}>
//                 Register Now
//               </button>
//               <button
//                 onClick={() => handleSave(job._id, job.jobType)}
//                 className={`inline-flex items-center justify-center px-4 py-2 border ${isSaved ? 'border-gray-300 bg-gray-50' : 'border-gray-300 bg-white'} text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none`}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className={`h-5 w-5 mr-1 ${isSaved ? 'text-blue-600 fill-current' : 'text-gray-400'}`}
//                   viewBox="0 0 20 20"
//                   fill={isSaved ? 'currentColor' : 'none'}
//                   stroke="currentColor"
//                 >
//                   <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
//                 </svg>
//                 {isSaved ? 'Saved' : 'Save'}
//               </button>
//               <button
//                 onClick={handleShare}
//                 className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
//                 </svg>
//                 Share
//               </button>
//             </div>
//           </div>

//           {/* About Section */}
//           <div className="px-6 py-6">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">About {job?.company}</h2>
//             <p className="text-gray-700 mb-6">{job?.companyInfo.about}</p>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="text-2xl font-bold text-gray-900">{job.companyInfo.stats.employees}</div>
//                 <div className="text-sm text-gray-600">Employees</div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="text-2xl font-bold text-gray-900">{job.companyInfo.stats.revenue}</div>
//                 <div className="text-sm text-gray-600">Revenue</div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="text-2xl font-bold text-gray-900">{job.companyInfo.stats.industries}</div>
//                 <div className="text-sm text-gray-600">Industries</div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="text-2xl font-bold text-gray-900">{job.companyInfo.stats.countries}</div>
//                 <div className="text-sm text-gray-600">Countries</div>
//               </div>
//             </div>
//           </div>

//           {/* Program Details */}
//           <div className="px-6 py-6 border-t border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Program Details</h2>
//             <div className="space-y-4">
//               <div className="flex items-start">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <div>
//                   <div className="font-medium text-gray-900">{job.programDetails.eligibleDegrees.join(', ')}</div>
//                   <div className="text-sm text-gray-500">Eligible Degrees</div>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//                 <div>
//                   <div className="font-medium text-gray-900">{job.eligibility.studentStreams.join(', ')}</div>
//                   <div className="text-sm text-gray-500">Eligible Streams</div>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 <div>
//                   <div className="font-medium text-gray-900">{job.programDetails.locations.join(', ')}</div>
//                   <div className="text-sm text-gray-500">Job Locations</div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6">
//               <h3 className="font-medium text-gray-900">Compensation</h3>
//               <div className="mt-2 px-4 py-3 bg-gray-50 rounded-lg">
//                 <div className="text-xl font-bold text-gray-900">{job.programDetails.compensation.amount}</div>
//                 <div className="text-sm text-gray-600">{job.programDetails.compensation.details}</div>
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="px-6 py-6 border-t border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
//             <div className="prose max-w-none text-gray-700">
//               <p className="mb-4">{job.description}</p>
//             </div>
//           </div>

//           {/* Job Details */}
//           <div className="px-6 py-6 border-t border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Job Title</div>
//                 <div className="mt-1 text-base text-gray-900">{job.jobDetails.jobTitle}</div>
//               </div>
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Job Category</div>
//                 <div className="mt-1 text-base text-gray-900">{job.jobDetails.jobCategory}</div>
//               </div>
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Job Roles</div>
//                 <div className="mt-1 text-base text-gray-900">{job.jobDetails.role}</div>
//               </div>
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Employment Type</div>
//                 <div className="mt-1 text-base text-gray-900">{job.jobDetails.employmentType}</div>
//               </div>
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Work Mode</div>
//                 <div className="mt-1 text-base text-gray-900">{job.jobDetails.workMode}</div>
//               </div>
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Job Location</div>
//                 <div className="mt-1 text-base text-gray-900">{job.jobDetails.locations.join(', ')}</div>
//               </div>
//             </div>
//           </div>

//           {/* Eligibility Criteria */}
//           <div className="px-6 py-6 border-t border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Minimum Education</div>
//                 <div className="mt-1 text-base text-gray-900">{job.eligibility.minEducation}</div>
//               </div>
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Eligible Degrees</div>
//                 <div className="mt-1 text-base text-gray-900">{job.eligibility.degrees.join(' / ')}</div>
//               </div>
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Eligible Streams</div>
//                 <div className="mt-1 text-base text-gray-900">{job.eligibility.studentStreams.join(', ')}</div>
//               </div>
//               <div>
//                 <div className="text-sm font-medium text-gray-500">Experience</div>
//                 <div className="mt-1 text-base text-gray-900">{job.eligibility.yearsOfExperience}</div>
//               </div>
//             </div>
//           </div>

//           {/* Skills & Certifications */}
//           <div className="px-6 py-6 border-t border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
//             <ul className="list-disc pl-5 space-y-1 text-gray-700">
//               {job.eligibility.requiredSkills.map((skill, index) => (
//                 <li key={index}>{skill}</li>
//               ))}
//             </ul>
//           </div>

//           {/* Selection Process */}
//           <div className="px-6 py-6 border-t border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Selection Process</h2>

//             {job.selectionProcess.rounds.length > 0 && (
//               <div className="mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">Rounds</h3>
//                 <ul className="list-disc pl-5 space-y-1 text-gray-700">
//                   {job.selectionProcess.rounds.map((round, index) => (
//                     <li key={index}>{round}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="border border-gray-300 rounded p-4">
//                 <div className="text-center">
//                   <div className="text-sm font-medium text-gray-500">Registration Deadline</div>
//                   <div className="mt-1 text-lg font-medium text-gray-900">{job.selectionProcess.dates.registrationDeadline}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* How to Apply */}
//           <div className="px-6 py-6 border-t border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">How to Apply</h2>
//             <p className="text-gray-700 mb-4">
//               Students can apply through the <span className="text-blue-600">TalentConnect Portal</span> or their college placement cell.
//               Make sure to complete your profile and upload all necessary documents before the deadline.
//             </p>

//             <div className="mt-6">
//               <h3 className="font-medium text-gray-900 mb-2">Contact Person:</h3>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex items-start">
//                   <div className="mr-3 flex-shrink-0">
//                     <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-base font-medium text-gray-900">{job.contactInfo.name} <span className='text-sm text-gray-500 '>({job.contactInfo.designation})</span></div>
//                     {job.contactInfo.email && (
//                       <div className="flex items-center mt-1">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                         </svg>
//                         <a href={`mailto:${job.contactInfo.email}`} className="text-blue-600 hover:text-blue-800 text-sm">{job.contactInfo.email}</a>
//                       </div>
//                     )}
//                     {job.contactInfo.mobile && (
//                       <div className="flex items-center mt-1">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                         </svg>
//                         <a href={`tel:${job.contactInfo.mobile}`} className="text-blue-600 hover:text-blue-800 text-sm">{job.contactInfo.mobile}</a>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

          // {/* Additional Resources */}
          // <div className="px-6 py-6 border-t border-gray-200">
          //   <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h2>
          //   <div className="space-y-3">
          //     <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
          //       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          //       </svg>
          //       Download Job Brochure (PDF)
          //     </a>
          //     <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
          //       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          //       </svg>
          //       Watch Day in the Life at {job.company}
          //     </a>
          //     <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
          //       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          //       </svg>
          //       Glassdoor Reviews
          //     </a>
          //   </div>
          // </div>

//           {/* Note to Students */}
//           <div className="px-6 py-6 border-t border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Note to Students</h2>
//             <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-blue-700">
//                     Please keep your TalentConnect profile updated and check your registered email for test links and interview schedules. No communication will be sent via SMS or WhatsApp.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default JobDetailPage;



import { ApplyForOnCampus, getCompanyPostingForOncampusDetail, SaveOppurtunity } from '@/lib/College_AxiosIntance';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString || dateString === 'Not Specified') return 'Not Specified';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Not Specified';
  }
};

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  const loadJobDetail = async () => {
    try {
      const response = await getCompanyPostingForOncampusDetail(id);
      setJob(response.data);
      setError(null);
    } catch (error) {
      console.error("Error loading job detail: ", error);
      setError("Failed to load job details. Please try again later.");
      setJob(null);
    }
  };

  useEffect(() => {
    loadJobDetail();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job?.jobTitle || 'Job'} at ${job?.companyPosted?.companyDetails?.companyName}`,
        text: `Check out this opportunity for a ${job?.jobTitle || 'job'} at ${job?.companyPosted?.companyDetails?.companyName}!`,
        url: window.location.href,
      })
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link'));
    }
  };

  const handleApply = async () => {
    try {
      const response = await ApplyForOnCampus(id);
      if (response.data?.success === true) {
        alert("Applied");
      } else {
        alert(response?.data?.msg || "Could not apply.");
      }
    } catch (error) {
      console.log("Error: ", error);
      alert(error?.response?.data?.msg || `Something went wrong`);
    }
  };

  const handleSave = async (jobId, jobType) => {
    if (!jobId || !jobType) return;
    try {
      const response = await SaveOppurtunity(jobId, jobType);
      if (response.data.success === true) {
        alert("Saved");
        setIsSaved(true);
      }
    } catch (error) {
      console.log("Error: ", error);
      alert("Error!");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-red-600">{error}</p>
          <button
            onClick={loadJobDetail}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/college-dashboard/on-campus-opportunities" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to opportunities
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="text-sm text-blue-600 font-medium">Registrations Open</div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2">
              <h1 className="text-2xl font-bold text-gray-900">{job?.companyPosted?.companyDetails?.companyName || 'Not Specified'}</h1>
              <div className="flex items-center mt-2 md:mt-0">
                <a
                  href={job?.companyPosted?.companyDetails?.collegeWebsite ? `https://${job.companyPosted.companyDetails.collegeWebsite.replace(/^https?:\/\//, '')}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm mr-6"
                  title="Visit Company Website"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(job?.startDate)} - {formatDate(job?.endDate)}</span>
              </div>
              <div className="flex items-center mt-2 sm:mt-0 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{job?.location?.join(', ') || 'Not Specified'}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none" onClick={handleApply}>
                Register Now
              </button>
              <button
                onClick={() => handleSave(job?._id, job?.jobType)}
                className={`inline-flex items-center justify-center px-4 py-2 border ${isSaved ? 'border-gray-300 bg-gray-50' : 'border-gray-300 bg-white'} text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${isSaved ? 'text-blue-600 fill-current' : 'text-gray-400'}`} viewBox="0 0 20 20" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {job?.companyPosted?.companyDetails?.companyName || 'the Company'}</h2>
            <p className="text-gray-700 mb-6">{job?.companyPosted?.companyDetails?.description || 'No description provided.'}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{job?.companyPosted?.companyDetails?.numberOfEmployees || 'N/A'}</div>
                <div className="text-sm text-gray-600">Employees</div>
              </div>
              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">Not Specified</div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div> */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{job?.companyPosted?.companyDetails?.industryType || 'N/A'}</div>
                <div className="text-sm text-gray-600">Industries</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{job?.country || job?.companyPosted?.companyDetails?.country || 'N/A'}</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </div>
          </div>

          {/* Description */} 
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{job.lookingFor} Description</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">{job?.description || 'No job description provided.'}</p>
            </div>
          </div>
          
          {/* Job Details */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <div className="text-sm font-medium text-gray-500">Looking For</div>
                <div className="mt-1 text-base text-gray-900">{job?.lookingFor || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Employment Type</div>
                <div className="mt-1 text-base text-gray-900">{job?.employmentType || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Job Roles</div>
                <div className="mt-1 text-base text-gray-900">{job?.jobRoles?.join(', ') || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Work Mode</div>
                <div className="mt-1 text-base text-gray-900">{job?.workMode || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Amenities Required</div>
                <div className="mt-1 text-base text-gray-900">{job?.amenitiesRequired?.join(', ') || 'None'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Job Location</div>
                <div className="mt-1 text-base text-gray-900">{job?.location?.join(', ') || 'Not Specified'}</div>
              </div>
            </div>
          </div>

          {/* Require skill  */}
           <div className="px-6 py-6 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
      <div className="flex flex-wrap gap-2">
        {job?.skills.length > 0 ? (
          job?.skills.map((skill, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-gray-500">No specific skills mentioned.</p>
        )}
      </div>
    </div>

          {/* Eligibility Criteria */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Eligible Degrees</div>
                <div className="mt-1 text-base text-gray-900">{job?.degree?.join(' / ') || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Eligible Streams</div>
                <div className="mt-1 text-base text-gray-900">{job?.studentStreams?.join(', ') || 'Not Specified'}</div>
              </div>
           
              <div>
                <div className="text-sm font-medium text-gray-500">Minimum Students Required</div>
                <div className="mt-1 text-base text-gray-900">{job?.minimumStudents || 'Not Specified'}</div>
              </div>
            </div>
            {job?.eligibilityCriteria && (
                <div>
                    <div className="text-sm font-medium text-gray-500">Additional Criteria</div>
                    <p className="mt-1 text-base text-gray-700">{job.eligibilityCriteria}</p>
                </div>
            )}
          </div>
          
          {/* Compensation and Benefits */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Compensation & Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Total CTC</div>
                <div className="text-xl font-bold text-gray-900">{job?.minPackage?.amount ? `${job.minPackage.currency} ${job.minPackage.amount}` : 'Not Specified'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Fixed Pay</div>
                <div className="text-xl font-bold text-gray-900">Not Specified</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Joining Bonus</div>
                <div className="text-xl font-bold text-gray-900">Not Specified</div>
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mt-6 mb-2">Benefits Offered</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {job?.benefits?.length > 0 ? job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              )) : <li>No benefits specified.</li>}
            </ul>
          </div>
          
        {/* Selection Process */}
<div className="px-6 py-6 border-t border-gray-200">
  <h2 className="text-xl font-bold text-gray-900 mb-6">Selection Process</h2>
  
  {job?.selectionProcess?.length > 0 ? (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-200"></div>
      
      <div className="space-y-6 pl-10">
        {job.selectionProcess.map((step, index) => (
          <div key={index} className="relative flex items-start">
            {/* Step number */}
            <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
              {index + 1}
            </div>
            
            {/* Step content */}
            <div className="min-w-0 flex-1 rounded-lg bg-gray-50 p-4 border border-gray-200">
              <p className="font-medium text-gray-900">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <p className="text-gray-500 text-center">Selection process details not provided.</p>
    </div>
  )}
</div>

          {/* Important Dates */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Important Dates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-gray-300 rounded p-4 text-center">
                <div className="text-sm font-medium text-gray-500">Registration Deadline</div>
                <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(job?.endDate)}</div>
              </div>
              <div className="border border-gray-300 rounded p-4 text-center">
                <div className="text-sm font-medium text-gray-500">Online Test Date</div>
                <div className="mt-1 text-lg font-medium text-gray-900">Not Specified</div>
              </div>
              <div className="border border-gray-300 rounded p-4 text-center">
                <div className="text-sm font-medium text-gray-500">Interview Window</div>
                <div className="mt-1 text-lg font-medium text-gray-900">Not Specified</div>
              </div>
              <div className="border border-gray-300 rounded p-4 text-center">
                <div className="text-sm font-medium text-gray-500">Offer Rollout</div>
                <div className="mt-1 text-lg font-medium text-gray-900">Not Specified</div>
              </div>
            </div>
          </div>
          
          {/* How to Apply */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to Apply</h2>
            <p className="text-gray-700 mb-4">
              Students can apply through the <span className="text-blue-600">TalentConnect Portal</span>. Make sure to complete your profile and upload all necessary documents before the deadline.
            </p>
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">Contact Person:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-base font-medium text-gray-900">{job?.contactPerson?.name || 'Not Specified'} <span className='text-sm text-gray-500 '>({job?.contactPerson?.designation || 'N/A'})</span></div>
                    {job?.contactPerson?.email && (
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${job.contactPerson.email}`} className="text-blue-600 hover:text-blue-800 text-sm">{job.contactPerson.email}</a>
                      </div>
                    )}
                    {job?.contactPerson?.mobile && (
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${job.contactPerson.mobile}`} className="text-blue-600 hover:text-blue-800 text-sm">{job.contactPerson.mobile}</a>
                      </div>
                    )}
                    {job?.contactPerson?.linkedin && (
                      <a href={job.contactPerson.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.783-1.75-1.75s.784-1.75 1.75-1.75 1.75.783 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-1.339-.025-3.059-1.868-3.059-1.87 0-2.158 1.46-2.158 2.965v5.698h-3v-11h2.889v1.336h.04c.401-.762 1.383-1.563 2.83-1.563 3.029 0 3.588 1.993 3.588 4.582v6.645z" />
                        </svg>
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

                    {/* Additional Resources */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h2>
            <div className="space-y-3">
              <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Download Job Brochure (PDF)
              </a>
              <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Watch Day in the Life at {job.company}
              </a>
              <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Glassdoor Reviews
              </a>
            </div>
          </div>
          
          {/* Note to Students */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Note to Students</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Please keep your TalentConnect profile updated and check your registered email for test links and interview schedules. No communication will be sent via SMS or WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailPage;