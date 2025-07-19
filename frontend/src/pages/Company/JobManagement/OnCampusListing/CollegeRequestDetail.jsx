// import { useState } from 'react';
// import { Calendar, MapPin, FileText, Users, CheckCircle, ArrowUpRight } from 'lucide-react';

// const CollegeRequestDetail = ({ college, onClose, onAccept, onShortlist, onReject }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleAction = (actionType) => {
//     setIsSubmitting(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       setIsSubmitting(false);
      
//       if (actionType === 'accept') {
//         onAccept && onAccept(college.id);
//       } else if (actionType === 'shortlist') {
//         onShortlist && onShortlist(college.id);
//       } else if (actionType === 'reject') {
//         onReject && onReject(college.id);
//       }
//     }, 500);
//   };

//   // If college data is not provided, show a loading state
//   if (!college) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header with College Info */}
//         <div className="bg-white p-6 rounded-md shadow-sm mb-4">
//           <div className="flex items-center">
//             <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
//             <div className="ml-4 flex-grow">
//               <h1 className="text-xl font-bold">{college.name}</h1>
//               <div className="flex items-center text-gray-600 text-sm mt-1">
//                 <div className="flex items-center mr-4">
//                   Rank #{college.rank} NIRF
//                 </div>
//                 <div className="flex items-center">
//                   <MapPin size={14} className="mr-1" />
//                   {college.location}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4 mt-4">
//             <div className="text-center">
//               <div className="font-bold text-lg">{college.placementRate}%</div>
//               <div className="text-sm text-gray-600">Placement Rate</div>
//             </div>
//             <div className="text-center">
//               <div className="font-bold text-lg">{college.highestPackage} LPA</div>
//               <div className="text-sm text-gray-600">Highest Package</div>
//             </div>
//             <div className="text-center">
//               <div className="font-bold text-lg">{college.averagePackage} LPA</div>
//               <div className="text-sm text-gray-600">Average Package</div>
//             </div>
//           </div>
//         </div>

//         {/* Drive Details */}
//         <div className="bg-white p-6 rounded-md shadow-sm mb-4">
//           <h2 className="text-lg font-bold mb-4">Drive Proposal Details</h2>
          
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <h3 className="font-medium text-gray-700 mb-2">Eligible Branches</h3>
//               <ul className="space-y-2">
//                 {college.eligibleBranches.map((branch, index) => (
//                   <li key={index} className="flex items-center">
//                     <CheckCircle size={16} className="mr-2 text-gray-600" />
//                     {branch}
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="font-medium text-gray-700 mb-2">Student Count</h3>
//               <div className="flex items-center">
//                 <Users size={16} className="mr-2 text-gray-600" />
//                 <span>{college.studentCount} Eligible Students</span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="font-medium text-gray-700 mb-2">Proposed Dates</h3>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center">
//                 <Calendar size={16} className="mr-2 text-gray-600" />
//                 <span>{college.proposedStartDate}</span>
//               </div>
//               <span>to</span>
//               <div className="flex items-center">
//                 <Calendar size={16} className="mr-2 text-gray-600" />
//                 <span>{college.proposedEndDate}</span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="font-medium text-gray-700 mb-2">Uploaded Documents</h3>
//             <ul className="space-y-3">
//               {college.documents.map((doc, index) => (
//                 <li key={index} className="flex items-center justify-between border-b pb-2">
//                   <div className="flex items-center">
//                     <FileText size={16} className="mr-2 text-gray-600" />
//                     <span>{doc.name}</span>
//                   </div>
//                   <button className="text-gray-600">
//                     <ArrowUpRight size={16} />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="mt-6">
//             <h3 className="font-medium text-gray-700 mb-2">Facilities Required</h3>
//             <ul className="space-y-2">
//               {college.facilities.map((facility, index) => (
//                 <li key={index} className="flex items-center">
//                   <CheckCircle size={16} className="mr-2 text-gray-600" />
//                   {facility}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-4">
//           <button 
//             onClick={() => handleAction('accept')}
//             disabled={isSubmitting}
//             className="flex-1 bg-black text-white py-2 font-medium rounded-md hover:bg-gray-800 disabled:opacity-50"
//           >
//             Accept Drive
//           </button>
//           <button 
//             onClick={() => handleAction('shortlist')}
//             disabled={isSubmitting}
//             className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             Shortlist Drive
//           </button>
//           <button 
//             onClick={() => handleAction('reject')}
//             disabled={isSubmitting}
//             className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             Reject Drive
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CollegeRequestDetail;


// import { useState } from 'react';
// import { Calendar, MapPin, FileText, Users, CheckCircle, ArrowUpRight, X, User, Mail, Phone, Link } from 'lucide-react';

// const CollegeApplicationDetailView = ({ collegeApplication, onAccept, onShortlist, onReject }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Helper to format dates, returns 'Not Specified' if date is invalid
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not Specified';
//     try {
//       return new Date(dateString).toLocaleDateString('en-GB'); // e.g., 17/07/2025
//     } catch (e) {
//       return 'Invalid Date';
//     }
//   };

//   const handleAction = (actionType) => {
//     setIsSubmitting(true);
//     setTimeout(() => {
//       setIsSubmitting(false);
//       const appId = collegeApplication.applicationId;

//       if (actionType === 'accept') onAccept && onAccept(appId);
//       else if (actionType === 'shortlist') onShortlist && onShortlist(appId);
//       else if (actionType === 'reject') onReject && onReject(appId);
//     }, 500);
//   };

//   // Data extraction with fallbacks for robustness
//   const {
//     collegeName = 'Not Specified',
//     city = 'Not Specified',
//     state = 'Not Specified',
//     profileImage,
//     coordinator,
//     applicationId,
//   } = collegeApplication;

//   const collegeLocation = (city !== 'Not Specified' || state !== 'Not Specified') ? `${city}, ${state}` : 'Not Specified';
//   const coordinatorName = coordinator?.coordinatorName || 'Not Specified';
//   const coordinatorEmail = coordinator?.officialEmail || 'Not Specified';
//   const coordinatorMobile = coordinator?.officialMobile || 'Not Specified';
//   const coordinatorLinkedin = coordinator?.linkedinUrl;

//   // IMPORTANT: The following fields are placeholders.
//   // To populate these, your API endpoint for fetching colleges
//   // (`/api/.../{jobId}/colleges`) must include this data for each college.
//   const collegeRank = 'Not Specified';
//   const placementRate = 'Not Specified';
//   const highestPackage = 'Not Specified';
//   const averagePackage = 'Not Specified';
//   const studentCount = 'Not Specified';
//   const documents = [];
//   const facilities = [];
//   // END IMPORTANT

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       {/* Header with College Info */}
//       <div className="pb-4 border-b border-gray-200 mb-4">
//         <div className="flex items-start">
//           <img
//             src={profileImage || 'https://via.placeholder.com/64'} // Placeholder image
//             alt={collegeName}
//             className="w-16 h-16 rounded-md object-cover flex-shrink-0"
//           />
//           <div className="ml-4 flex-grow">
//             <h1 className="text-xl font-bold text-gray-900">{collegeName}</h1>
//             <div className="flex flex-wrap items-center text-gray-600 text-sm mt-1 gap-x-4">
//               {collegeRank !== 'Not Specified' && <div className="flex items-center">Rank #{collegeRank} NIRF</div>}
//               <div className="flex items-center">
//                 <MapPin size={14} className="mr-1" />
//                 <span>{collegeLocation}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
//           <div>
//             <div className="font-bold text-lg">{placementRate}{placementRate !== 'Not Specified' && '%'}</div>
//             <div className="text-sm text-gray-600">Placement Rate</div>
//           </div>
//           <div>
//             <div className="font-bold text-lg">{highestPackage}{highestPackage !== 'Not Specified' && ' LPA'}</div>
//             <div className="text-sm text-gray-600">Highest Package</div>
//           </div>
//           <div>
//             <div className="font-bold text-lg">{averagePackage}{averagePackage !== 'Not Specified' && ' LPA'}</div>
//             <div className="text-sm text-gray-600">Average Package</div>
//           </div>
//         </div>
//       </div>

//       {/* Coordinator Details */}
//       <div className="py-4">
//         <h3 className="text-lg font-bold mb-2 text-gray-800">Placement Coordinator</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
//           <div className="flex items-center"><User size={16} className="mr-2 text-gray-500" /><span>{coordinatorName}</span></div>
//           <div className="flex items-center"><Mail size={16} className="mr-2 text-gray-500" /><span>{coordinatorEmail}</span></div>
//           <div className="flex items-center"><Phone size={16} className="mr-2 text-gray-500" /><span>{coordinatorMobile}</span></div>
//           {coordinatorLinkedin && (
//             <a href={coordinatorLinkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
//               <Link size={16} className="mr-2" /><span>LinkedIn Profile</span>
//             </a>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 pt-4 border-t border-gray-200">
//         <button onClick={() => handleAction('accept')} disabled={isSubmitting} className="flex-1 bg-black text-white py-2 font-medium rounded-md hover:bg-gray-800 disabled:opacity-50">
//           Accept Drive
//         </button>
//         <button onClick={() => handleAction('shortlist')} disabled={isSubmitting} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50">
//           Shortlist
//         </button>
//         <button onClick={() => handleAction('reject')} disabled={isSubmitting} className="flex-1 bg-white border border-gray-300 text-red-600 py-2 font-medium rounded-md hover:bg-red-50 disabled:opacity-50">
//           Reject
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CollegeApplicationDetailView;



// import { useState } from 'react';
// import { Calendar, MapPin, FileText, Users, CheckCircle, X, User, Mail, Phone, Link } from 'lucide-react';
// import { format } from 'date-fns';

// const CollegeApplicationDetailView = ({ collegeApplication, onAccept, onShortlist, onReject }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Extract data from collegeApplication which matches backend model
//   const collegeName = collegeApplication.collegeName || 'Not Specified';
//   const city = collegeApplication.city || 'Not Specified';
//   const state = collegeApplication.state || 'Not Specified';
//   const pincode = collegeApplication.pincode || 'Not Specified';
//   const country = collegeApplication.country || 'Not Specified';
//   const coordinatorName = collegeApplication.coordinator?.coordinatorName || 'Not Specified';
//   const coordinatorEmail = collegeApplication.coordinator?.officialEmail || 'Not Specified';
//   const coordinatorMobile = collegeApplication.coordinator?.officialMobile || 'Not Specified';
//   const coordinatorLinkedin = collegeApplication.coordinator?.linkedinUrl || 'Not Specified';
//   const profileImage = collegeApplication.profileImage;
//   const appliedAt = collegeApplication.appliedAt ? format(new Date(collegeApplication.appliedAt), 'MMM d, yyyy') : 'Not Specified';

//   const handleAction = async (actionCallback) => {
//     setIsSubmitting(true);
//     try {
//       await actionCallback();
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
//       {/* College Header */}
//       <div className="pb-4 border-b border-gray-200 mb-4">
//         <div className="flex items-center">
//           {profileImage ? (
//             <img
//               src={profileImage}
//               alt={collegeName}
//               className="w-16 h-16 rounded-md object-cover flex-shrink-0"
//             />
//           ) : (
//             <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
//               No Image
//             </div>
//           )}
//           <div className="ml-4 flex-grow">
//             <h1 className="text-xl font-bold text-gray-900">{collegeName}</h1>
//             <div className="flex items-center text-gray-600 text-sm mt-1">
//               <MapPin size={14} className="mr-1" />
//               <span>{[city, state, country].filter(Boolean).join(', ')}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Coordinator Details */}
//       <div className="pb-4 mb-4">
//         <h3 className="text-lg font-bold mb-2 text-gray-800">Placement Coordinator</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
//           <div className="flex items-center">
//             <User size={16} className="mr-2 text-gray-500 flex-shrink-0" />
//             <span>{coordinatorName}</span>
//           </div>
//           <div className="flex items-center">
//             <Mail size={16} className="mr-2 text-gray-500 flex-shrink-0" />
//             <span>{coordinatorEmail}</span>
//           </div>
//           <div className="flex items-center">
//             <Phone size={16} className="mr-2 text-gray-500 flex-shrink-0" />
//             <span>{coordinatorMobile}</span>
//           </div>
//           {coordinatorLinkedin !== 'Not Specified' && (
//             <a
//               href={coordinatorLinkedin.startsWith('http') ? coordinatorLinkedin : `https://${coordinatorLinkedin}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center text-blue-600 hover:underline"
//             >
//               <Link size={16} className="mr-2 flex-shrink-0" />
//               <span>LinkedIn Profile</span>
//             </a>
//           )}
//         </div>
//       </div>

//       {/* Application Details */}
//       <div className="mb-6">
//         <h3 className="text-lg font-bold mb-2 text-gray-800">Application Details</h3>
//         <div className="flex items-center text-gray-700 text-sm">
//           <Calendar size={16} className="mr-2 text-gray-500 flex-shrink-0" />
//           <span>Applied on: {appliedAt}</span>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
//         <button
//           onClick={() => handleAction(onAccept)}
//           disabled={isSubmitting}
//           className="flex-1 bg-black text-white py-2 font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isSubmitting ? 'Processing...' : 'Accept Application'}
//         </button>
//         <button
//           onClick={() => handleAction(onShortlist)}
//           disabled={isSubmitting}
//           className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isSubmitting ? 'Processing...' : 'Shortlist Application'}
//         </button>
//         <button
//           onClick={() => handleAction(onReject)}
//           disabled={isSubmitting}
//           className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isSubmitting ? 'Processing...' : 'Reject Application'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CollegeApplicationDetailView;




// import { useState } from 'react';
// import { Calendar, MapPin, FileText, Users, CheckCircle, ArrowUpRight, X, User, Mail, Phone, Link } from 'lucide-react';
// import { format } from 'date-fns';

// const CollegeRequestDetail = ({ collegeApplication, onAccept, onShortlist, onReject }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Helper function to format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not Specified';
//     try {
//       return format(new Date(dateString), 'MMM d, yyyy');
//     } catch (e) {
//       return 'Invalid Date';
//     }
//   };

//   const handleAction = async (actionCallback) => {
//     setIsSubmitting(true);
//     try {
//       await actionCallback();
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Destructure with fallbacks from the consolidated collegeApplication object
//   const {
//     collegeName = 'Not Specified',
//     city = 'Not Specified',
//     state = 'Not Specified',
//     country = 'Not Specified',
//     pincode = 'Not Specified',
//     profileImage = null,
//     collegeProfilePdf = null,
//     collegeDescriptionPdf = null,
//     collegeWebsite = null,
//     linkedinProfile = null,
//     placementRate = 'Not Specified',
//     highestPackage = 'Not Specified',
//     averagePackage = 'Not Specified',
//     eligibleBranches = [],
//     studentCount = 'Not Specified',
//     proposedStartDate = null,
//     proposedEndDate = null,
//     coordinator = {}, // Ensure coordinator is an object
//     applicationId,
//     appliedAt,
//     currentStatus = 'Unknown',
//   } = collegeApplication;

//   const collegeLocation = (city !== 'Not Specified' || state !== 'Not Specified') ? `${city}, ${state}` : 'Not Specified';

//   // Coordinator details from the 'coordinator' object
//   const coordinatorName = coordinator.coordinatorName || 'Not Specified';
//   const coordinatorEmail = coordinator.officialEmail || 'Not Specified';
//   const coordinatorMobile = coordinator.officialMobile || 'Not Specified';
//   const coordinatorLinkedin = coordinator.linkedinUrl || ''; // Empty string for href to prevent invalid link

//   // Dummy/Placeholder for fields not explicitly requested in this refined data structure
//   const collegeRank = 'Not Specified'; // Still a placeholder
//   const facilities = []; // Placeholder, adjust if you get this data elsewhere

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
//       {/* College Header */}
//       <div className="pb-4 border-b border-gray-200 mb-4">
//         <div className="flex items-center">
//           {profileImage ? (
//             <img
//               src={profileImage}
//               alt={collegeName}
//               className="w-16 h-16 rounded-md object-cover flex-shrink-0"
//             />
//           ) : (
//             <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
//               No Image
//             </div>
//           )}
//           <div className="ml-4 flex-grow">
//             <h1 className="text-xl font-bold text-gray-900">{collegeName}</h1>
//             <div className="flex flex-wrap items-center text-gray-600 text-sm mt-1 gap-x-4">
//               {collegeRank !== 'Not Specified' && (
//                 <div className="flex items-center">
//                   Rank #{collegeRank} NIRF
//                 </div>
//               )}
//               <div className="flex items-center">
//                 <MapPin size={14} className="mr-1" />
//                 <span>{[city, state, country].filter(Boolean).join(', ')}</span>
//                 {pincode !== 'Not Specified' && pincode && <span className="ml-1">({pincode})</span>}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//           <div className="text-center">
//             <div className="font-bold text-lg">{placementRate}{placementRate !== 'Not Specified' && '%'}</div>
//             <div className="text-sm text-gray-600">Placement Rate</div>
//           </div>
//           <div className="text-center">
//             <div className="font-bold text-lg">{highestPackage}{highestPackage !== 'Not Specified' && ' LPA'}</div>
//             <div className="text-sm text-gray-600">Highest Package</div>
//           </div>
//           <div className="text-center">
//             <div className="font-bold text-lg">{averagePackage}{averagePackage !== 'Not Specified' && ' LPA'}</div>
//             <div className="text-sm text-gray-600">Average Package</div>
//           </div>
//         </div>
//       </div>

//       {/* Coordinator Details */}
//       <div className="pb-4 mb-4">
//         <h3 className="text-lg font-bold mb-2 text-gray-800">Placement Coordinator</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
//           <div className="flex items-center">
//             <User size={16} className="mr-2 text-gray-500 flex-shrink-0" />
//             <span>{coordinatorName}</span>
//           </div>
//           <div className="flex items-center">
//             <Mail size={16} className="mr-2 text-gray-500 flex-shrink-0" />
//             <span>{coordinatorEmail}</span>
//           </div>
//           <div className="flex items-center">
//             <Phone size={16} className="mr-2 text-gray-500 flex-shrink-0" />
//             <span>{coordinatorMobile}</span>
//           </div>
//           {coordinatorLinkedin && coordinatorLinkedin !== 'Not Specified' && (
//             <a
//               href={coordinatorLinkedin.startsWith('http') ? coordinatorLinkedin : `https://${coordinatorLinkedin}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center text-blue-600 hover:underline"
//             >
//               <Link size={16} className="mr-2 flex-shrink-0" />
//               <span>LinkedIn Profile</span>
//             </a>
//           )}
//         </div>
//       </div>

//       {/* Application Details */}
//       <div className="mb-6">
//         <h3 className="text-lg font-bold mb-2 text-gray-800">Application Details</h3>
//         <div className="flex items-center text-gray-700 text-sm mb-2">
//           <Calendar size={16} className="mr-2 text-gray-500 flex-shrink-0" />
//           <span>Applied on: {formatDate(appliedAt)}</span>
//         </div>
//         <div className="flex items-center text-gray-700 text-sm">
//             <FileText size={16} className="mr-2 text-gray-500 flex-shrink-0" />
//             <span>Current Status: <span className="font-semibold">{currentStatus}</span></span>
//         </div>
//       </div>


//       {/* Drive Proposal Details Section - Now from the driveDetails */}
//       <div className="bg-white p-6 rounded-md shadow-sm mb-4">
//         <h2 className="text-lg font-bold mb-4">Drive Proposal Details</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <div>
//             <h3 className="font-medium text-gray-700 mb-2">Eligible Branches</h3>
//             {eligibleBranches.length > 0 ? (
//               <ul className="space-y-2">
//                 {eligibleBranches.map((branch, index) => (
//                   <li key={index} className="flex items-center">
//                     <CheckCircle size={16} className="mr-2 text-gray-600" />
//                     {branch}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">Not Specified</p>
//             )}
//           </div>

//           <div>
//             <h3 className="font-medium text-gray-700 mb-2">Student Count</h3>
//             <div className="flex items-center">
//               <Users size={16} className="mr-2 text-gray-600" />
//               <span>{studentCount} Eligible Students</span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h3 className="font-medium text-gray-700 mb-2">Proposed Dates</h3>
//           <div className="flex flex-wrap items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
//             <div className="flex items-center">
//               <Calendar size={16} className="mr-2 text-gray-600" />
//               <span>{formatDate(proposedStartDate)}</span>
//             </div>
//             {proposedStartDate && proposedEndDate && <span className="hidden sm:inline">to</span>}
//             <div className="flex items-center">
//               <Calendar size={16} className="mr-2 text-gray-600" />
//               <span>{formatDate(proposedEndDate)}</span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h3 className="font-medium text-gray-700 mb-2">Uploaded Documents</h3>
//           {(collegeProfilePdf || collegeDescriptionPdf) ? (
//             <ul className="space-y-3">
//               {collegeProfilePdf && (
//                 <li className="flex items-center justify-between border-b pb-2">
//                   <div className="flex items-center">
//                     <FileText size={16} className="mr-2 text-gray-600" />
//                     <span>College Profile PDF</span>
//                   </div>
//                   <a href={collegeProfilePdf} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
//                     <ArrowUpRight size={16} />
//                   </a>
//                 </li>
//               )}
//               {collegeDescriptionPdf && (
//                 <li className="flex items-center justify-between border-b pb-2">
//                   <div className="flex items-center">
//                     <FileText size={16} className="mr-2 text-gray-600" />
//                     <span>College Description PDF</span>
//                   </div>
//                   <a href={collegeDescriptionPdf} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
//                     <ArrowUpRight size={16} />
//                   </a>
//                 </li>
//               )}
//             </ul>
//           ) : (
//             <p className="text-gray-500">No documents uploaded.</p>
//           )}
//         </div>

//         <div className="mt-6">
//           <h3 className="font-medium text-gray-700 mb-2">Facilities Required</h3>
//           {facilities.length > 0 ? ( // Still using a placeholder for facilities
//             <ul className="space-y-2">
//               {facilities.map((facility, index) => (
//                 <li key={index} className="flex items-center">
//                   <CheckCircle size={16} className="mr-2 text-gray-600" />
//                   {facility}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500">Not Specified</p>
//           )}
//         </div>

//         {/* College Website & LinkedIn */}
//         <div className="mt-6">
//           <h3 className="font-medium text-gray-700 mb-2">College Online Presence</h3>
//           {(collegeWebsite || linkedinProfile) ? (
//             <div className="flex flex-wrap gap-4">
//               {collegeWebsite && (
//                 <a href={collegeWebsite.startsWith('http') ? collegeWebsite : `https://${collegeWebsite}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
//                   <Link size={16} className="mr-2" />
//                   College Website
//                   <ArrowUpRight size={16} className="ml-1" />
//                 </a>
//               )}
//               {linkedinProfile && (
//                 <a href={linkedinProfile.startsWith('http') ? linkedinProfile : `https://${linkedinProfile}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
//                   <Link size={16} className="mr-2" />
//                   College LinkedIn
//                   <ArrowUpRight size={16} className="ml-1" />
//                 </a>
//               )}
//             </div>
//           ) : (
//             <p className="text-gray-500">Not Specified</p>
//           )}
//         </div>

//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
//         <button
//           onClick={() => handleAction(onAccept)}
//           disabled={isSubmitting}
//           className="flex-1 bg-black text-white py-2 font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isSubmitting ? 'Processing...' : 'Accept Application'}
//         </button>
//         <button
//           onClick={() => handleAction(onShortlist)}
//           disabled={isSubmitting}
//           className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isSubmitting ? 'Processing...' : 'Shortlist Application'}
//         </button>
//         <button
//           onClick={() => handleAction(onReject)}
//           disabled={isSubmitting}
//           className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isSubmitting ? 'Processing...' : 'Reject Application'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CollegeRequestDetail;

import { useState } from 'react';
import { Calendar, MapPin, FileText, Users, CheckCircle, ArrowUpRight, User, Mail, Phone, Link, Briefcase, DollarSign, Target, ClipboardList } from 'lucide-react';
import { format, isValid } from 'date-fns';

const DetailRow = ({ icon: Icon, label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
        <div className="flex items-start">
            <Icon className="w-5 h-5 mr-3 mt-1 text-gray-500 flex-shrink-0" />
            <div>
                <p className="font-semibold text-gray-800">{label}</p>
                <p className="text-gray-600">{Array.isArray(value) ? value.join(', ') : value}</p>
            </div>
        </div>
    );
};

const CollegeRequestDetail = ({ collegeApplication, onAccept, onShortlist, onReject }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeFormatDate = (dateString, formatStr = 'MMM d, yyyy') => {
    if (!dateString) return 'Not Specified';
    const date = new Date(dateString);
    return isValid(date) ? format(date, formatStr) : 'Invalid Date';
  };

  const handleAction = async (actionCallback) => {
    setIsSubmitting(true);
    try {
      await actionCallback();
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DESTRUCTURE ALL FIELDS FROM THE SINGLE, MERGED PROP ---
  const {
    // College Application Data
    applicationId,
    appliedAt,
    currentStatus = 'Unknown',
    
    // College Profile Data
    collegeName = 'Not Specified',
    city = 'Not Specified',
    state = 'Not Specified',
    country = 'Not Specified',
    pincode = 'Not Specified',
    profileImage = null,
    collegeProfilePdf = null,
    collegeDescriptionPdf = null,
    collegeWebsite = null,
    linkedinProfile = null, // College's LinkedIn
    placementRate = 'Not Specified',
    highestPackage = 'Not Specified',
    averagePackage = 'Not Specified',

    // Drive (CampusRegistration) Data - now merged in!
    lookingFor = 'Not Specified',
    employmentType = 'Not Specified',
    preferredLocations = [],
    minimumSalary = 'Not Specified',
    startDate = '',
    endDate = '',
    rounds = [],
    selectionProcess = [],
    contactPerson = 'Not Specified',
    contactDesignation = 'Not Specified',
    email = 'Not Specified',
    mobile = 'Not Specified',
    linkedin = '', // Coordinator's LinkedIn
    minimumStudents = 'Not Specified',
  } = collegeApplication || {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
      {/* College Header */}
      <div className="pb-4 border-b border-gray-200 mb-4">
        <div className="flex items-center">
          {profileImage ? (
            <img src={profileImage} alt={collegeName} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">No Image</div>
          )}
          <div className="ml-4 flex-grow">
            <h1 className="text-xl font-bold text-gray-900">{collegeName}</h1>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              <span>{[city, state].filter(Boolean).join(', ')}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="text-center"><div className="font-bold text-lg">{placementRate}{placementRate !== 'Not Specified' && '%'}</div><div className="text-sm text-gray-600">Placement Rate</div></div>
          <div className="text-center"><div className="font-bold text-lg">{highestPackage}{highestPackage !== 'Not Specified' && ' LPA'}</div><div className="text-sm text-gray-600">Highest Package</div></div>
          <div className="text-center"><div className="font-bold text-lg">{averagePackage}{averagePackage !== 'Not Specified' && ' LPA'}</div><div className="text-sm text-gray-600">Average Package</div></div>
        </div>
      </div>

      {/* Main Drive Details Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Drive Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailRow icon={Target} label="Role" value={lookingFor} />
            <DetailRow icon={Briefcase} label="Employment Type" value={employmentType} />
            <DetailRow icon={MapPin} label="Locations" value={preferredLocations} />
            <DetailRow icon={DollarSign} label="Minimum Salary" value={minimumSalary} />
            <DetailRow icon={Users} label="Minimum Students" value={minimumStudents} />
            <DetailRow icon={Calendar} label="Drive Period" value={`${safeFormatDate(startDate)} to ${safeFormatDate(endDate)}`} />
            <DetailRow icon={ClipboardList} label="Rounds" value={rounds} />
            <DetailRow icon={ClipboardList} label="Selection Process" value={selectionProcess} />
        </div>
      </div>

      {/* Proposed date */}
      <div>
        
      </div>
      
      {/* Coordinator and Application Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Drive Coordinator</h3>
            <div className="space-y-3 text-sm">
                <div className="flex items-center"><User size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>{contactPerson} ({contactDesignation})</span></div>
                <div className="flex items-center"><Mail size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>{email}</span></div>
                <div className="flex items-center"><Phone size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>{mobile}</span></div>
                {linkedin && <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Link size={16} className="mr-2 flex-shrink-0" /><span>Coordinator LinkedIn</span></a>}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">College Application Status</h3>
            <div className="space-y-3 text-sm">
                <div className="flex items-center"><Calendar size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>Applied on: {safeFormatDate(appliedAt)}</span></div>
                <div className="flex items-center"><FileText size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>Current Status: <span className="font-semibold">{currentStatus}</span></span></div>
            </div>
        </div>
      </div>

      {/* College Links and Documents */}
      <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">College Resources</h3>
          <div className="flex flex-wrap gap-4 text-sm">
              {collegeWebsite && <a href={collegeWebsite.startsWith('http') ? collegeWebsite : `https://${collegeWebsite}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Link size={16} className="mr-2" />College Website <ArrowUpRight size={16} className="ml-1" /></a>}
              {linkedinProfile && <a href={linkedinProfile.startsWith('http') ? linkedinProfile : `https://${linkedinProfile}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Link size={16} className="mr-2" />College LinkedIn <ArrowUpRight size={16} className="ml-1" /></a>}
              {collegeProfilePdf && <a href={collegeProfilePdf} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><FileText size={16} className="mr-2" />Profile PDF <ArrowUpRight size={16} className="ml-1" /></a>}
              {collegeDescriptionPdf && <a href={collegeDescriptionPdf} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><FileText size={16} className="mr-2" />Description PDF <ArrowUpRight size={16} className="ml-1" /></a>}
          </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
        <button onClick={() => handleAction(() => onAccept(applicationId))} disabled={isSubmitting} className="flex-1 justify-center bg-black text-white py-2 font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200">
          {isSubmitting ? 'Processing...' : 'Accept Application'}
        </button>
        <button onClick={() => handleAction(() => onShortlist(applicationId))} disabled={isSubmitting} className="flex-1 justify-center bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200">
          {isSubmitting ? 'Processing...' : 'Shortlist Application'}
        </button>
        <button onClick={() => handleAction(() => onReject(applicationId))} disabled={isSubmitting} className="flex-1 justify-center bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200">
          {isSubmitting ? 'Processing...' : 'Reject Application'}
        </button>
      </div>
    </div>
  );
};

export default CollegeRequestDetail;