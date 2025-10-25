
// import { useState } from 'react';
// import { Calendar, MapPin, FileText, Users, CheckCircle, ArrowUpRight, X, User, Mail, Phone, Link } from 'lucide-react';

// const CollegeApplicationDetailView = ({ collegeApplication, onClose, onAccept, onShortlist, onReject }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Helper function to format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not Specified';
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch (e) {
//       return 'Invalid Date';
//     }
//   };

//   const handleAction = (actionType) => {
//     setIsSubmitting(true);

//     // In a real application, you would make an API call here
//     // to update the status of the specific college application (collegeApplication.applicationId).
//     setTimeout(() => {
//       setIsSubmitting(false);

//       // Call parent callbacks with the application ID
//       if (actionType === 'accept') {
//         onAccept && onAccept(collegeApplication.applicationId);
//       } else if (actionType === 'shortlist') {
//         onShortlist && onShortlist(collegeApplication.applicationId);
//       } else if (actionType === 'reject') {
//         onReject && onReject(collegeApplication.applicationId);
//       }
//       // onClose(); // Optionally close the detail view after action if this was a modal
//     }, 500);
//   };

//   // Extracting data from collegeApplication (which comes from fetchCollegesForJob)
//   const collegeName = collegeApplication.collegeName || 'Not Specified';
//   const city = collegeApplication.city || 'Not Specified';
//   const state = collegeApplication.state || 'Not Specified';
//   const country = collegeApplication.country || 'Not Specified';
//   const collegeLocation = (city !== 'Not Specified' || state !== 'Not Specified') ? `${city}, ${state}` : 'Not Specified';
//   const coordinatorName = collegeApplication.coordinator?.coordinatorName || 'Not Specified';
//   const coordinatorEmail = collegeApplication.coordinator?.officialEmail || 'Not Specified';
//   const coordinatorMobile = collegeApplication.coordinator?.officialMobile || 'Not Specified';
//   const coordinatorLinkedin = collegeApplication.coordinator?.linkedinUrl || 'Not Specified';
//   const profileImage = collegeApplication.profileImage;
//   const appliedAt = formatDate(collegeApplication.appliedAt);

//   // **** IMPORTANT: The following fields are NOT available in the current `fetchCollegesForJob` response.
//   // They will always show 'Not Specified' or empty lists based on your current backend structure.
//   // To populate these, your `/api/company/jobmanagement/pool-campus-drives/{jobId}/colleges` API
//   // would need to return this information for each applied college.
//   const collegeRank = 'Not Specified'; // Placeholder as per backend data structure
//   const placementRate = 'Not Specified'; // Placeholder as per backend data structure
//   const highestPackage = 'Not Specified'; // Placeholder as per backend data structure
//   const averagePackage = 'Not Specified'; // Placeholder as per backend data structure
//   const eligibleBranches = []; // Placeholder, assuming it's not in the 'colleges' array
//   const studentCount = 'Not Specified'; // Placeholder, assuming it's not in the 'colleges' array
//   const proposedStartDate = 'Not Specified'; // Placeholder, assuming it's not in the 'colleges' array
//   const proposedEndDate = 'Not Specified'; // Placeholder, assuming it's not in the 'colleges' array
//   const documents = []; // Placeholder, assuming no direct documents other than profileImage
//   const facilities = []; // Placeholder, assuming it's not in the 'colleges' array
//   // **** END IMPORTANT

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
//       {/* Optional Close Button (if this component is used in a modal/slide-over) */}
//       {onClose && (
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={onClose}
//             className="text-gray-600 hover:text-gray-900 focus:outline-none"
//             aria-label="Close"
//           >
//             <X size={24} />
//           </button>
//         </div>
//       )}

//       {/* Header with College Info */}
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
//                 <span>{collegeLocation}</span>
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

//       {/* Drive Proposal Details */}
//       <div className="bg-white p-6 rounded-md shadow-sm mb-4"> {/* Removed redundant border/shadow if parent already has it */}
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
//               <span>{proposedStartDate}</span>
//             </div>
//             {proposedStartDate !== 'Not Specified' && proposedEndDate !== 'Not Specified' && <span className="hidden sm:inline">to</span>}
//             <div className="flex items-center">
//               <Calendar size={16} className="mr-2 text-gray-600" />
//               <span>{proposedEndDate}</span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h3 className="font-medium text-gray-700 mb-2">Uploaded Documents</h3>
//           {documents.length > 0 ? (
//             <ul className="space-y-3">
//               {documents.map((doc, index) => (
//                 <li key={index} className="flex items-center justify-between border-b pb-2">
//                   <div className="flex items-center">
//                     <FileText size={16} className="mr-2 text-gray-600" />
//                     <span>{doc.name}</span>
//                   </div>
//                   {doc.url !== 'Not Specified' && (
//                     <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
//                       <ArrowUpRight size={16} />
//                     </a>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500">Not Specified</p>
//           )}
//         </div>

//         <div className="mt-6">
//           <h3 className="font-medium text-gray-700 mb-2">Facilities Required</h3>
//           {facilities.length > 0 ? (
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
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
//         <button
//           onClick={() => handleAction('accept')}
//           disabled={isSubmitting}
//           className="flex-1 bg-black text-white py-2 font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isSubmitting ? 'Processing...' : 'Accept Drive'}
//         </button>
//         <button
//           onClick={() => handleAction('shortlist')}
//           disabled={isSubmitting}
//           className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isSubmitting ? 'Processing...' : 'Shortlist Drive'}
//         </button>
//         <button
//           onClick={() => handleAction('reject')}
//           disabled={isSubmitting}
//           className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isSubmitting ? 'Processing...' : 'Reject Drive'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CollegeApplicationDetailView;


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

const CollegeApplicationDetailView = ({ collegeApplication, onAccept, onShortlist, onReject }) => {
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
    } catch (error) {
      console.log("error: ", error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const {
    // College Application Data
    applicationId,
    appliedAt = collegeApplication.createdAt,
    currentStatus = collegeApplication.currentStatus,

    collegeName = collegeApplication?.applicant.collegeUniversityDetails.collegeName,
    city = collegeApplication?.applicant.collegeUniversityDetails.city,
    state = collegeApplication?.applicant.collegeUniversityDetails.state,
    country = collegeApplication?.applicant.collegeUniversityDetails.country,
    pincode = collegeApplication?.applicant.collegeUniversityDetails.pincode,
    profileImage = collegeApplication.applicant?.profileImage,
    collegeProfilePdf = null,
    collegeDescriptionPdf = null,
    collegeWebsite = collegeApplication?.applicant?.profileAchievements.collegeWebsite,
    linkedinProfile = collegeApplication?.applicant?.profileAchievements.linkedInProfile,
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
    contactPerson = collegeApplication?.applicant?.placementCoordinatorDetails.coordinatorName,
    contactDesignation = collegeApplication?.applicant?.placementCoordinatorDetails.designation,
    email = collegeApplication?.applicant?.placementCoordinatorDetails.officialEmail,
    mobile = collegeApplication?.applicant?.placementCoordinatorDetails.officialMobile,
    linkedin = collegeApplication?.applicant?.placementCoordinatorDetails.linkedInUrl,
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
        <button onClick={() => handleAction(() => onAccept(applicationId))} disabled={isSubmitting} className="flex-1 justify-center bg-white text-green-500 py-2 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200">
          {isSubmitting ? 'Processing...' : 'Accept Application'}
        </button>
        <button onClick={() => handleAction(() => onShortlist(applicationId))} disabled={isSubmitting} className="flex-1 justify-center bg-white border border-gray-300 text-yellow-500 py-2 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200">
          {isSubmitting ? 'Processing...' : 'Shortlist Application'}
        </button>
        <button onClick={() => handleAction(() => onReject(applicationId))} disabled={isSubmitting} className="flex-1 justify-center bg-white border border-gray-300 text-red-500 py-2 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200">
          {isSubmitting ? 'Processing...' : 'Reject Application'}
        </button>
      </div>
    </div>
  );
};

export default CollegeApplicationDetailView;