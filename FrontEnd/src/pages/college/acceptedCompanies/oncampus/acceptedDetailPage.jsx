// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getAcceptedCompaniesForCollege } from '@/lib/College_AxiosIntance';
// import { ArrowLeft, Building2, MapPin, Mail, Phone, CheckCircle } from 'lucide-react';

// const AcceptedCompaniesPage = () => {
//   const { jobId } = useParams();
//   const navigate = useNavigate();
//   const [acceptedCompanies, setAcceptedCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAcceptedCompanies = async () => {
//       try {
//         setLoading(true);
//         const response = await getAcceptedCompaniesForCollege('company', 'On-campus');
        
//         if (response.data && Array.isArray(response.data)) {
//           // Filter companies for this specific job
//           const companiesForThisJob = response.data.filter(
//             company => company.job && company.job._id === jobId
//           );
//           setAcceptedCompanies(companiesForThisJob);
//         } else {
//           setAcceptedCompanies([]);
//         }
//       } catch (err) {
//         setError('Failed to fetch accepted companies');
//         console.error('Error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAcceptedCompanies();
//   }, [jobId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={() => navigate(-1)}
//               className="flex items-center text-gray-600 hover:text-black"
//             >
//               <ArrowLeft size={20} className="mr-2" />
//               Back
//             </button>
//             <h1 className="text-2xl font-bold">Accepted Companies</h1>
//           </div>
//           <div className="text-sm text-gray-500">
//             {acceptedCompanies.length} companies accepted
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         <div className="grid gap-4">
//           {acceptedCompanies.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-lg border">
//               <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
//               <p className="text-gray-500">No accepted companies for this job yet.</p>
//             </div>
//           ) : (
//             acceptedCompanies.map((company, index) => (
//               <div key={company._id || index} className="bg-white p-6 rounded-lg border shadow-sm">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start space-x-4">
//                     <img
//                       src={company.applicant?.profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
//                       alt={company.applicant?.companyDetails?.companyName}
//                       className="w-16 h-16 rounded-lg object-cover border"
//                     />
//                     <div>
//                       <h3 className="text-xl font-semibold text-gray-800">
//                         {company.applicant?.companyDetails?.companyName}
//                       </h3>
//                       <div className="mt-2 space-y-2">
//                         <div className="flex items-center text-sm text-gray-600">
//                           <Building2 size={16} className="mr-2" />
//                           {company.applicant?.companyDetails?.industryType || 'N/A'}
//                         </div>
//                         <div className="flex items-center text-sm text-gray-600">
//                           <MapPin size={16} className="mr-2" />
//                           {company.applicant?.companyDetails?.city}, {company.applicant?.companyDetails?.state}
//                         </div>
//                         <div className="flex items-center text-sm text-gray-600">
//                           <Mail size={16} className="mr-2" />
//                           {company.applicant?.employerDetails?.workEmail || 'N/A'}
//                         </div>
//                         <div className="flex items-center text-sm text-gray-600">
//                           <Phone size={16} className="mr-2" />
//                           {company.applicant?.companyDetails?.phoneNumber || 'N/A'}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
//                     <CheckCircle size={16} />
//                     <span className="text-sm font-medium">Accepted</span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AcceptedCompaniesPage;


import { useState } from 'react';
import { Calendar, MapPin, FileText, Users, ArrowUpRight, User, Mail, Phone, Link, Briefcase, DollarSign, Target, ClipboardList, Send } from 'lucide-react';
import { format, isValid } from 'date-fns';

const DetailRow = ({ icon: Icon, label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    let displayValue = value;
    if (Array.isArray(value)) {
        displayValue = value.join(', ');
    } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value);
    }
    
    return (
        <div className="flex items-start">
            <Icon className="w-5 h-5 mr-3 mt-1 text-gray-500 flex-shrink-0" />
            <div>
                <p className="font-semibold text-gray-800">{label}</p>
                <p className="text-gray-600">{displayValue}</p>
            </div>
        </div>
    );
};

const CollegeRequestDetail = ({ collegeApplication, driveDetails, onReject }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debug logging to see what data we're receiving
    console.log("College Application:", collegeApplication);
    console.log("Drive Details:", driveDetails);

    const safeFormatDate = (dateString, formatStr = 'MMM d, yyyy') => {
        if (!dateString) return 'Not Specified';
        try {
            const date = new Date(dateString);
            return isValid(date) ? format(date, formatStr) : 'Invalid Date';
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const handleAction = async (actionCallback) => {
        setIsSubmitting(true);
        try {
            await actionCallback();
        } catch (error) {
            console.log("Action error: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Extract college data
    const applicationId = collegeApplication?._id;
    const appliedAt = collegeApplication?.createdAt || collegeApplication?.appliedAt;
    const currentStatus = collegeApplication?.currentStatus || 'Applied';

    // College Details
    const collegeDetails = collegeApplication?.applicant?.collegeUniversityDetails || {};
    const collegeName = collegeDetails.collegeName || 'Not Specified';
    const city = collegeDetails.city || 'Not Specified';
    const state = collegeDetails.state || 'Not Specified';
    const profileImage = collegeApplication?.applicant?.profileImage;

    // Placement Coordinator Details
    const coordinatorDetails = collegeApplication?.applicant?.placementCoordinatorDetails || {};
    const contactPerson = coordinatorDetails.coordinatorName || 'Not Specified';
    const contactDesignation = coordinatorDetails.designation || 'Not Specified';
    const email = coordinatorDetails.officialEmail || 'Not Specified';
    const mobile = coordinatorDetails.officialMobile || 'Not Specified';
    const linkedin = coordinatorDetails.linkedInUrl;

    // Profile Achievements
    const achievements = collegeApplication?.applicant?.profileAchievements || {};
    const collegeWebsite = achievements.collegeWebsite;
    const linkedinProfile = achievements.linkedInProfile;

    // DRIVE DETAILS - Now coming from the separate prop
    const lookingFor = Array.isArray(driveDetails?.jobRoles) 
        ? driveDetails.jobRoles.join(', ') 
        : driveDetails?.jobRoles || driveDetails?.lookingFor || 'Not Specified';
    
    const employmentType = Array.isArray(driveDetails?.employmentType) 
        ? driveDetails.employmentType.join(', ') 
        : driveDetails?.employmentType || 'Not Specified';
    
    const workLocations = driveDetails?.workLocation || driveDetails?.location || [];
    const startDate = driveDetails?.startDate;
    const endDate = driveDetails?.endDate;
    const rounds = driveDetails?.rounds || [];
    const selectionProcess = Array.isArray(driveDetails?.selectionProcess) 
        ? driveDetails.selectionProcess 
        : (driveDetails?.selectionProcess ? [driveDetails.selectionProcess] : []);
    
    const minimumStudents = driveDetails?.minimumStudents || 'Not Specified';
    const packageDetails = driveDetails?.packageDetails || {};
    const skills = driveDetails?.skills || [];
    const workMode = Array.isArray(driveDetails?.workMode) 
        ? driveDetails.workMode.join(', ') 
        : driveDetails?.workMode || 'Not Specified';
    
    const eligibilityCriteria = driveDetails?.eligibilityCriteria;
    const description = driveDetails?.description;
    const venue = driveDetails?.venue;
    const collegeCategories = driveDetails?.collegeCategories || [];
    const studentStreams = driveDetails?.studentStreams || [];

    // College statistics
    const placementRate = 'Not Specified';
    const highestPackage = 'Not Specified';
    const averagePackage = 'Not Specified';

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
                    <div className="text-center">
                        <div className="font-bold text-lg">{placementRate}{placementRate !== 'Not Specified' && '%'}</div>
                        <div className="text-sm text-gray-600">Placement Rate</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg">{highestPackage}{highestPackage !== 'Not Specified' && ' LPA'}</div>
                        <div className="text-sm text-gray-600">Highest Package</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg">{averagePackage}{averagePackage !== 'Not Specified' && ' LPA'}</div>
                        <div className="text-sm text-gray-600">Average Package</div>
                    </div>
                </div>
            </div>

            {/* Main Drive Details Section */}
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Drive Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <DetailRow icon={Target} label="Job Roles" value={lookingFor} />
                    <DetailRow icon={Briefcase} label="Employment Type" value={employmentType} />
                    <DetailRow icon={MapPin} label="Work Locations" value={workLocations} />
                    <DetailRow icon={MapPin} label="Venue" value={venue} />
                    <DetailRow icon={Users} label="Work Mode" value={workMode} />
                    <DetailRow icon={Users} label="Minimum Students" value={minimumStudents} />
                    <DetailRow icon={Calendar} label="Drive Period" value={`${safeFormatDate(startDate)} to ${safeFormatDate(endDate)}`} />
                   
                   
                    <DetailRow icon={Users} label="College Categories" value={collegeCategories} />
                    <DetailRow icon={Users} label="Student Streams" value={studentStreams} />
                </div>

                {/* Package Details */}
                {(packageDetails.totalCTC || packageDetails.fixedPay) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Package Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {packageDetails.totalCTC && (
                                <div>
                                    <span className="font-medium">Total CTC: </span>
                                    <span>{packageDetails.currency} {packageDetails.totalCTC}</span>
                                </div>
                            )}
                            {packageDetails.fixedPay && (
                                <div>
                                    <span className="font-medium">Fixed Pay: </span>
                                    <span>{packageDetails.currency} {packageDetails.fixedPay}</span>
                                </div>
                            )}
                            {packageDetails.joiningBonus && (
                                <div>
                                    <span className="font-medium">Joining Bonus: </span>
                                    <span>{packageDetails.currency} {packageDetails.joiningBonus}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

              
               
               
            </div>

            {/* Coordinator and Application Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Drive Coordinator</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                            <User size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                            <span>{contactPerson} ({contactDesignation})</span>
                        </div>
                        <div className="flex items-center">
                            <Mail size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                            <span>{email}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                            <span>{mobile}</span>
                        </div>
                        {linkedin && (
                            <a 
                                href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <Link size={16} className="mr-2 flex-shrink-0" />
                                <span>Coordinator LinkedIn</span>
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Application Status</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                            <span>Applied on: {safeFormatDate(appliedAt)}</span>
                        </div>
                        <div className="flex items-center">
                            <FileText size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                            <span>
                                Current Status: <span className={`font-semibold ${
                                    currentStatus === 'Accepted' ? 'text-green-600' : 
                                    currentStatus === 'Rejected' ? 'text-red-600' : 
                                    currentStatus === 'Shortlisted' ? 'text-yellow-600' : 
                                    'text-blue-600'
                                }`}>
                                    {currentStatus}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* College Links and Documents */}
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">College Resources</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    {collegeWebsite && (
                        <a 
                            href={collegeWebsite.startsWith('http') ? collegeWebsite : `https://${collegeWebsite}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-blue-600 hover:underline"
                        >
                            <Link size={16} className="mr-2" />
                            College Website 
                            <ArrowUpRight size={16} className="ml-1" />
                        </a>
                    )}
                    {linkedinProfile && (
                        <a 
                            href={linkedinProfile.startsWith('http') ? linkedinProfile : `https://${linkedinProfile}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-blue-600 hover:underline"
                        >
                            <Link size={16} className="mr-2" />
                            College LinkedIn 
                            <ArrowUpRight size={16} className="ml-1" />
                        </a>
                    )}
                </div>
            </div>

            {/* Action Buttons - Only Reject and Message */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                <button 
                    onClick={() => handleAction(() => onReject(applicationId))} 
                    disabled={isSubmitting || currentStatus === 'Rejected'}
                    className={`flex-1 justify-center py-2 font-medium rounded-md transition-colors duration-200 ${
                        currentStatus === 'Rejected'
                            ? 'bg-red-100 text-red-700 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-red-500 hover:bg-gray-100'
                    } disabled:opacity-50`}
                >
                    {currentStatus === 'Rejected' ? 'Already Rejected' : (isSubmitting ? 'Processing...' : 'Reject Drive')}
                </button>
                <button
                    onClick={() => {/* Add message functionality here */}}
                    disabled={isSubmitting}
                    className={`flex-1 justify-center py-2 font-medium rounded-md transition-colors duration-200 flex items-center ${
                        isSubmitting 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                >
                    <Send size={16} className="mr-2" /> 
                    {isSubmitting ? 'Processing...' : 'Message'}
                </button>
            </div>
        </div>
    );
};

export default CollegeRequestDetail;