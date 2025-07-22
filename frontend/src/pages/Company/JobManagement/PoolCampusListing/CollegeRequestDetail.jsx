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



// // import { useState } from 'react';
// // import { Calendar, MapPin, FileText, Users, CheckCircle, ArrowUpRight ,X} from 'lucide-react';

// // const CollegeRequestDetail = ({ drive, onClose, onAccept, onShortlist, onReject }) => {
// //   const [isSubmitting, setIsSubmitting] = useState(false);

 
// //   const collegeDetails = drive?.appliedCollegesDetails?.[0];

// //   // Helper function to format dates
// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     return new Date(dateString).toLocaleDateString();
// //   };

// //   const handleAction = (actionType) => {
// //     setIsSubmitting(true);

// //     // In a real application, you would make an API call here
// //     // to update the status of the drive or the specific college application.
// //     // For now, we'll pass the drive's ID.
// //     setTimeout(() => {
// //       setIsSubmitting(false);

// //       if (actionType === 'accept') {
// //         onAccept && onAccept(drive._id); // Pass the drive ID
// //       } else if (actionType === 'shortlist') {
// //         onShortlist && onShortlist(drive._id); // Pass the drive ID
// //       } else if (actionType === 'reject') {
// //         onReject && onReject(drive._id); // Pass the drive ID
// //       }
// //       onClose(); // Close the detail view after action
// //     }, 500);
// //   };

// //   // If drive data is not provided, show a loading state
// //   if (!drive) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
// //       </div>
// //     );
// //   }

// //   // Map backend data to frontend display
// //   const collegeName = collegeDetails?.collegeUniversityDetails?.collegeName || 'N/A College';
// //   const collegeLocation = collegeDetails?.collegeUniversityDetails?.collegeLocation || 'N/A Location';
// //   // Rank, Placement Rate, Highest/Average Package are not available in the provided backend models.
// //   // Using placeholders for now.
// //   const collegeRank = 'N/A';
// //   const placementRate = 'N/A';
// //   const highestPackage = 'N/A';
// //   const averagePackage = 'N/A';

// //   const eligibleBranches = collegeDetails?.placementRecruitmentDetails?.programsOffered || [];
// //   const studentCount = drive.minStudents || 'N/A'; // This comes from the drive, not college onboarding
// //   const proposedStartDate = formatDate(drive.placementStartDate);
// //   const proposedEndDate = formatDate(drive.placementEndDate);

// //   const documents = collegeDetails?.placementRecruitmentDetails?.collegeBrochureUrl
// //     ? [{ name: "College Brochure", url: collegeDetails.placementRecruitmentDetails.collegeBrochureUrl }]
// //     : [];

// //   const facilities = collegeDetails?.placementRecruitmentDetails?.recruitmentServicesRequired || [];


// //   return (
// //     <div className="bg-gray-50 min-h-screen py-8">
// //       <div className="max-w-3xl mx-auto px-4"> {/* Added px-4 for mobile padding */}
// //         {/* Close Button */}
// //         <div className="flex justify-end mb-4">
// //           <button
// //             onClick={onClose}
// //             className="text-gray-600 hover:text-gray-900 focus:outline-none"
// //           >
// //             <X size={24} />
// //           </button>
// //         </div>

// //         {/* Header with College Info */}
// //         <div className="bg-white p-6 rounded-md shadow-sm mb-4">
// //           <div className="flex items-center">
// //             {/* Placeholder for college image/logo */}
// //             <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
// //               {collegeDetails?.profileImage ? (
// //                 <img src={collegeDetails.profileImage} alt="College Profile" className="w-full h-full object-cover rounded-md" />
// //               ) : (
// //                 'Logo'
// //               )}
// //             </div>
// //             <div className="ml-4 flex-grow">
// //               <h1 className="text-xl font-bold">{collegeName}</h1>
// //               <div className="flex flex-wrap items-center text-gray-600 text-sm mt-1">
// //                 {collegeRank !== 'N/A' && (
// //                   <div className="flex items-center mr-4">
// //                     Rank #{collegeRank} NIRF
// //                   </div>
// //                 )}
// //                 <div className="flex items-center">
// //                   <MapPin size={14} className="mr-1" />
// //                   {collegeLocation}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"> {/* Responsive grid */}
// //             <div className="text-center">
// //               <div className="font-bold text-lg">{placementRate}</div>
// //               <div className="text-sm text-gray-600">Placement Rate</div>
// //             </div>
// //             <div className="text-center">
// //               <div className="font-bold text-lg">{highestPackage}</div>
// //               <div className="text-sm text-gray-600">Highest Package</div>
// //             </div>
// //             <div className="text-center">
// //               <div className="font-bold text-lg">{averagePackage}</div>
// //               <div className="text-sm text-gray-600">Average Package</div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Drive Details */}
// //         <div className="bg-white p-6 rounded-md shadow-sm mb-4">
// //           <h2 className="text-lg font-bold mb-4">Drive Proposal Details</h2>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> {/* Responsive grid */}
// //             <div>
// //               <h3 className="font-medium text-gray-700 mb-2">Eligible Branches</h3>
// //               {eligibleBranches.length > 0 ? (
// //                 <ul className="space-y-2">
// //                   {eligibleBranches.map((branch, index) => (
// //                     <li key={index} className="flex items-center">
// //                       <CheckCircle size={16} className="mr-2 text-gray-600" />
// //                       {branch}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               ) : (
// //                 <p className="text-gray-500">No eligible branches specified.</p>
// //               )}
// //             </div>

// //             <div>
// //               <h3 className="font-medium text-gray-700 mb-2">Student Count</h3>
// //               <div className="flex items-center">
// //                 <Users size={16} className="mr-2 text-gray-600" />
// //                 <span>{studentCount} Eligible Students</span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mt-6">
// //             <h3 className="font-medium text-gray-700 mb-2">Proposed Dates</h3>
// //             <div className="flex flex-wrap items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0"> {/* Responsive spacing */}
// //               <div className="flex items-center">
// //                 <Calendar size={16} className="mr-2 text-gray-600" />
// //                 <span>{proposedStartDate}</span>
// //               </div>
// //               <span className="hidden sm:inline">to</span> {/* Hide 'to' on small screens */}
// //               <div className="flex items-center">
// //                 <Calendar size={16} className="mr-2 text-gray-600" />
// //                 <span>{proposedEndDate}</span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mt-6">
// //             <h3 className="font-medium text-gray-700 mb-2">Uploaded Documents</h3>
// //             {documents.length > 0 ? (
// //               <ul className="space-y-3">
// //                 {documents.map((doc, index) => (
// //                   <li key={index} className="flex items-center justify-between border-b pb-2">
// //                     <div className="flex items-center">
// //                       <FileText size={16} className="mr-2 text-gray-600" />
// //                       <span>{doc.name}</span>
// //                     </div>
// //                     <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
// //                       <ArrowUpRight size={16} />
// //                     </a>
// //                   </li>
// //                 ))}
// //               </ul>
// //             ) : (
// //               <p className="text-gray-500">No documents uploaded.</p>
// //             )}
// //           </div>

// //           <div className="mt-6">
// //             <h3 className="font-medium text-gray-700 mb-2">Facilities Required</h3>
// //             {facilities.length > 0 ? (
// //               <ul className="space-y-2">
// //                 {facilities.map((facility, index) => (
// //                   <li key={index} className="flex items-center">
// //                     <CheckCircle size={16} className="mr-2 text-gray-600" />
// //                     {facility}
// //                   </li>
// //                 ))}
// //               </ul>
// //             ) : (
// //               <p className="text-gray-500">No facilities specified.</p>
// //             )}
// //           </div>
// //         </div>

// //         {/* Action Buttons */}
// //         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"> {/* Responsive layout */}
// //           <button
// //             onClick={() => handleAction('accept')}
// //             disabled={isSubmitting}
// //             className="flex-1 bg-black text-white py-2 font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200"
// //           >
// //             {isSubmitting ? 'Processing...' : 'Accept Drive'}
// //           </button>
// //           <button
// //             onClick={() => handleAction('shortlist')}
// //             disabled={isSubmitting}
// //             className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
// //           >
// //             {isSubmitting ? 'Processing...' : 'Shortlist Drive'}
// //           </button>
// //           <button
// //             onClick={() => handleAction('reject')}
// //             disabled={isSubmitting}
// //             className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
// //           >
// //             {isSubmitting ? 'Processing...' : 'Reject Drive'}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CollegeRequestDetail;
