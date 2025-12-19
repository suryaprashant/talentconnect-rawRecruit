// import React from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

// const JobCard = ({ job }) => {
//   const companyName = job.companyPosted?.companyDetails?.companyName || 'Company';
//   const logo = job.companyPosted?.profileImageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeRfV9n69zxuV4DQX7sYF7ql8ajx47wLioPeP-m4qFbHLkD9UNwfQSneRtkQEDnx-QxFs&usqp=CAU';

//   const getJobStatus = () => {
//     const now = new Date();
//     const startDate = new Date(job.startDate);
//     const endDate = new Date(job.endDate);

//     if (now < startDate) {
//       return { status: 'Pending', color: 'bg-yellow-400' };
//     } else if (now >= startDate && now <= endDate) {
//       return { status: 'Open', color: 'bg-green-500' };
//     } else {
//       return { status: 'Closed', color: 'bg-red-500' };
//     }
//   };

//   const jobStatus = getJobStatus();

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
//       <div className="relative h-40 bg-gray-200">
//         <img
//           src={logo}
//           alt={`${companyName} logo`}
//           className="w-full h-full object-cover"
//         />
//         {/* Job Status Badge */}
//         <div className={`absolute top-2 right-2 px-3 py-1 text-xs font-bold text-white rounded-full ${jobStatus.color}`}>
//           {jobStatus.status}
//         </div>
//       </div>
//       <div className="p-4">
//         <div className="text-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">{companyName}</h3>
//           <p className="text-sm text-gray-600">
//             {job?.degree?.map((degree, index) => (
//               <span key={index}>
//                 {degree}
//                 {index < job.degree.length - 1 ? ', ' : ''}
//               </span>
//             ))}
//           </p>
//         </div>
//         <div className='flex m-2 gap-2 flex-wrap text-center mb-4 text-sm'>
//           {job?.tags?.map((tag, i) => (
//             <span className='bg-gray-300 p-1 rounded' key={i}>{tag}</span>
//           ))}
//         </div>
//         <Link
//           to={`/college-dashboard/On-campus/${job._id}`}
//           className="block w-full py-2 px-4 text-center text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//         >
//           View Details
//         </Link>
//       </div>
//     </div>
//   );
// };

// JobCard.propTypes = {
//   job: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     companyPosted: PropTypes.shape({
//       companyDetails: PropTypes.shape({
//         companyName: PropTypes.string
//       }),
//       profileImageUrl: PropTypes.string
//     }),
//     degree: PropTypes.arrayOf(PropTypes.string).isRequired,
//     startDate: PropTypes.string.isRequired,
//     endDate: PropTypes.string.isRequired
//   }).isRequired
// };

// export default JobCard;



import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Banknote, Building, Home, Monitor, Building2, Calendar, Briefcase, Tag } from 'lucide-react';
import PropTypes from 'prop-types';

const JobCard = ({ job }) => {
    if (!job) return null;

    const companyName = job.companyPosted?.companyDetails?.companyName || 'Company';
    const logo = job.companyPosted?.profileImageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeRfV9n69zxuV4DQX7sYF7ql8ajx47wLioPeP-m4qFbHLkD9UNwfQSneRtkQEDnx-QxFs&usqp=CAU';

    // Get job status based on dates
    const getJobStatus = () => {
        const now = new Date();
        const startDate = new Date(job.startDate);
        const endDate = new Date(job.endDate);

        if (now < startDate) {
            return { status: 'Upcoming', color: 'bg-blue-500' };
        } else if (now >= startDate && now <= endDate) {
            return { status: 'Active', color: 'bg-green-500' };
        } else {
            return { status: 'Completed', color: 'bg-gray-500' };
        }
    };

    const jobStatus = getJobStatus();

    // Format package details
    const formatPackage = () => {
        if (job.packageDetails?.totalCTC) {
            const currency = job.packageDetails.currency || 'INR';
            const amount = job.packageDetails.totalCTC.toLocaleString();
            return `${currency === 'INR' ? '₹' : currency} ${amount}`;
        }
        return 'Package not specified';
    };

    // Format location - max 2 locations
    const formatLocation = () => {
        if (job.workLocation && job.workLocation.length > 0) {
            return job.workLocation.slice(0, 2).join(', ');
        }
        return 'Location not specified';
    };

    // Format job roles - max 1 role for consistent display
    const formatJobRoles = () => {
        if (job.jobRoles && job.jobRoles.length > 0) {
            return job.jobRoles[0]; // Only show first role
        }
        return 'Role not specified';
    };

    // Format streams - only show if present, max 2 items
    const formatStreams = () => {
        if (job.studentStreams && job.studentStreams.length > 0) {
            return job.studentStreams.slice(0, 2);
        }
        return [];
    };

    // Format hiring process steps - max 3 steps
    const formatHiringProcess = () => {
        if (job.selectionProcess && job.selectionProcess.length > 0) {
            if (typeof job.selectionProcess === 'string') {
                const steps = job.selectionProcess.split(' + ');
                return steps.slice(0, 3);
            }
            return job.selectionProcess.slice(0, 3);
        }
        return [];
    };

    // Get work mode details with safe type checking
    const getWorkModeDetails = () => {
        // Safely handle workMode - check if it exists and is a string
        const workMode = job.workMode && typeof job.workMode === 'string' 
            ? job.workMode.toLowerCase() 
            : 'not specified';
        
        switch (workMode) {
            case 'remote':
                return {
                    label: 'Remote',
                    icon: Home,
                    color: 'bg-blue-100',
                    textColor: 'text-blue-800'
                };
            case 'hybrid':
                return {
                    label: 'Hybrid',
                    icon: Monitor,
                    color: 'bg-purple-100',
                    textColor: 'text-purple-800'
                };
            case 'onsite':
            case 'on-site':
                return {
                    label: 'On-Site',
                    icon: Building2,
                    color: 'bg-green-100',
                    textColor: 'text-green-800'
                };
            case 'office':
                return {
                    label: 'Office',
                    icon: Building,
                    color: 'bg-orange-100',
                    textColor: 'text-orange-800'
                };
            default:
                return {
                    label: workMode === 'not specified' ? 'Not specified' : 
                           workMode.charAt(0).toUpperCase() + workMode.slice(1),
                    icon: Building,
                    color: 'bg-gray-100',
                    textColor: 'text-gray-800'
                };
        }
    };

    const workModeDetails = getWorkModeDetails();
    const WorkModeIcon = workModeDetails.icon;

    // Check if work mode should be displayed
    const shouldDisplayWorkMode = job.workMode && 
                                 job.workMode !== 'Not specified' && 
                                 job.workMode !== 'not specified' &&
                                 workModeDetails.label !== 'Not specified';

    // Format employment type
    const formatEmploymentType = () => {
        if (job.employmentType) {
            if (typeof job.employmentType === 'string') {
                return job.employmentType;
            } else if (Array.isArray(job.employmentType) && job.employmentType.length > 0) {
                return job.employmentType.join(', ');
            }
        }
        return 'Employment type not specified';
    };

    // Format tags - only show if present, max 3 items
    const formatTags = () => {
        if (job?.tags && job.tags.length > 0) {
            return job.tags.slice(0, 3);
        }
        return [];
    };

    // Format dates
    const formatDateRange = () => {
        const startDate = new Date(job.startDate);
        const endDate = new Date(job.endDate);
        
        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        };
        
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    // Format description to fixed height with consistent word count
    const formatDescription = () => {
        if (!job.description) {
            return 'No description provided.';
        }
        
        const words = job.description.split(' ');
        if (words.length <= 15) {
            return job.description;
        }
        
        // Always take exactly 15 words
        const truncatedWords = words.slice(0, 15);
        return truncatedWords.join(' ') + '...';
    };

    const streams = formatStreams();
    const hiringProcess = formatHiringProcess();
    const tags = formatTags();

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200 flex flex-col h-full">
            <div className="p-6 flex-1 flex flex-col">
                {/* Company Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                                src={logo}
                                alt={`${companyName} logo`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/48";
                                }}
                            />
                        </div>
                        <div className="ml-3 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate" title={companyName}>
                                {companyName}
                            </h3>
                        </div>
                    </div>
                    
                    {/* Status Badge moved to the top right corner */}
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${jobStatus.color} flex-shrink-0 ml-2`}>
                        {jobStatus.status}
                    </div>
                </div>

                {/* Streams - Only show if present */}
                {streams.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {streams.map((stream, index) => (
                            <span 
                                key={index} 
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex-1 text-center truncate" 
                                title={stream}
                            >
                                {stream}
                            </span>
                        ))}
                    </div>
                )}

                {/* Info Sections with consistent height */}
                <div className="space-y-3 mb-4">
                    {/* Position/Role */}
                    <div className="flex items-center min-h-[24px]">
                        <Briefcase className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-800 truncate" title={formatJobRoles()}>
                            {formatJobRoles()}
                        </p>
                    </div>

                    {/* Location */}
                    <div className="flex items-center min-h-[24px]">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate" title={formatLocation()}>
                            {formatLocation()}
                        </p>
                    </div>

                    {/* Employment Type & Work Mode Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center min-h-[24px]">
                            <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                            <p className="text-sm text-gray-700 truncate max-w-[120px]" title={formatEmploymentType()}>
                                {formatEmploymentType()}
                            </p>
                        </div>
                        
                        {/* Work Mode Badge */}
                        {shouldDisplayWorkMode && (
                            <div className={`inline-flex items-center px-2 py-1 rounded-full ${workModeDetails.color}`}>
                                <WorkModeIcon className={`h-3 w-3 mr-1 ${workModeDetails.textColor}`} />
                                <span className={`text-xs font-medium ${workModeDetails.textColor}`}>
                                    {workModeDetails.label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Package */}
                    <div className="flex items-center min-h-[24px]">
                        <Banknote className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate" title={formatPackage()}>
                            {formatPackage()}
                        </p>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center min-h-[24px]">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate">
                            {formatDateRange()}
                        </p>
                    </div>
                </div>

                {/* Description - Fixed height */}
                <div className="mb-4 flex-1">
                    <p className="text-sm text-gray-600 line-clamp-3 h-[60px] overflow-hidden">
                        {formatDescription()}
                    </p>
                </div>

                {/* Hiring Process - Only show if present */}
                {hiringProcess.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <div className="bg-yellow-100 border border-yellow-200 rounded-md px-3 py-1">
                                <p className="text-xs font-medium text-yellow-800">Hiring Process</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mb-2">
                            {hiringProcess.map((step, index) => (
                                <div key={index} className="bg-gray-50 border border-gray-100 rounded-md px-2 py-1 flex-1">
                                    <p className="text-xs text-gray-700 truncate text-center" title={step}>
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags - Only show if present */}
                {tags.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <Tag className="h-3 w-3 text-gray-500 mr-1" />
                            <span className="text-xs font-medium text-gray-700">Tags</span>
                        </div>
                        <div className="flex gap-2">
                            {tags.map((tag, index) => (
                                <span 
                                    key={index} 
                                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full truncate max-w-[100px]" 
                                    title={tag}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* View Details Button - Always at bottom */}
                <div className="mt-auto pt-4">
                    <Link 
                        to={`/college-dashboard/On-campus/${job._id || job.id}`} 
                        className="block w-full"
                    >
                        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200 font-medium">
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

JobCard.propTypes = {
    job: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        id: PropTypes.string,
        companyPosted: PropTypes.shape({
            companyDetails: PropTypes.shape({
                companyName: PropTypes.string
            }),
            profileImageUrl: PropTypes.string
        }),
        studentStreams: PropTypes.arrayOf(PropTypes.string),
        jobRoles: PropTypes.arrayOf(PropTypes.string),
        workLocation: PropTypes.arrayOf(PropTypes.string),
        packageDetails: PropTypes.shape({
            totalCTC: PropTypes.number,
            currency: PropTypes.string
        }),
        workMode: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool
        ]),
        employmentType: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),
        description: PropTypes.string,
        selectionProcess: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),
        tags: PropTypes.arrayOf(PropTypes.string),
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired
    }).isRequired
};

export default JobCard;