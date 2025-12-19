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
import {
    MapPin, User, Banknote, Building, Home, Monitor,
    Building2, Calendar, Briefcase, Tag
} from 'lucide-react';
import PropTypes from 'prop-types';

const JobCard = ({ job }) => {
    if (!job) return null;

    const companyName =
        job.companyPosted?.companyDetails?.companyName || 'Company';

    const logo = job.companyPosted?.profileImageUrl || '';

    // 🔹 Initials helper (NEW)
    const getInitials = (name = '') => {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length === 1) return words[0][0].toUpperCase();
        return (words[0][0] + words[1][0]).toUpperCase();
    };

    // Get job status
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

    const formatPackage = () => {
        if (job.packageDetails?.totalCTC) {
            const currency = job.packageDetails.currency || 'INR';
            const amount = job.packageDetails.totalCTC.toLocaleString();
            return `${currency === 'INR' ? '₹' : currency} ${amount}`;
        }
        return 'Package not specified';
    };

    const formatLocation = () =>
        job.workLocation?.slice(0, 2).join(', ') || 'Location not specified';

    const formatJobRoles = () =>
        job.jobRoles?.[0] || 'Role not specified';

    const formatStreams = () =>
        job.studentStreams?.slice(0, 2) || [];

    const formatHiringProcess = () => {
        if (!job.selectionProcess) return [];
        if (typeof job.selectionProcess === 'string') {
            return job.selectionProcess.split(' + ').slice(0, 3);
        }
        return job.selectionProcess.slice(0, 3);
    };

    const formatEmploymentType = () => {
        if (!job.employmentType) return 'Employment type not specified';
        if (Array.isArray(job.employmentType)) {
            return job.employmentType.join(', ');
        }
        return job.employmentType;
    };

    const formatTags = () => job.tags?.slice(0, 3) || [];

    const formatDateRange = () => {
        const s = new Date(job.startDate);
        const e = new Date(job.endDate);
        return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    const formatDescription = () => {
        if (!job.description) return 'No description provided.';
        const words = job.description.split(' ');
        return words.length <= 15
            ? job.description
            : words.slice(0, 15).join(' ') + '...';
    };

    const streams = formatStreams();
    const hiringProcess = formatHiringProcess();
    const tags = formatTags();

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition duration-200 flex flex-col h-full">
            <div className="p-6 flex-1 flex flex-col">

                {/* Company Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center flex-1 min-w-0">
                        
                        {/* 🔹 LOGO / INITIALS BLOCK (UPDATED) */}
                        <div className="w-12 h-12 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-200">
                            {logo ? (
                                <img
                                    src={logo}
                                    alt={`${companyName} logo`}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <span className="text-sm font-semibold text-gray-700">
                                    {getInitials(companyName)}
                                </span>
                            )}
                        </div>

                        <div className="ml-3 min-w-0">
                            <h3
                                className="font-semibold text-gray-900 truncate"
                                title={companyName}
                            >
                                {companyName}
                            </h3>
                        </div>
                    </div>

                    <div className={`px-2 py-1 rounded-full text-xs text-white ${jobStatus.color}`}>
                        {jobStatus.status}
                    </div>
                </div>

                {/* Streams */}
                {streams.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {streams.map((s, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded truncate">
                                {s}
                            </span>
                        ))}
                    </div>
                )}

                {/* Info */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                        <p className="text-sm truncate">{formatJobRoles()}</p>
                    </div>

                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <p className="text-sm truncate">{formatLocation()}</p>
                    </div>

                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <p className="text-sm truncate">{formatEmploymentType()}</p>
                    </div>

                    <div className="flex items-center">
                        <Banknote className="w-4 h-4 mr-2 text-gray-500" />
                        <p className="text-sm truncate">{formatPackage()}</p>
                    </div>

                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <p className="text-sm truncate">{formatDateRange()}</p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 h-[60px]">
                    {formatDescription()}
                </p>

                {/* Hiring Process */}
                {hiringProcess.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium mb-1">Hiring Process</p>
                        <div className="flex gap-2">
                            {hiringProcess.map((step, i) => (
                                <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded truncate">
                                    {step}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="mb-4 flex gap-2">
                        {tags.map((tag, i) => (
                            <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded-full truncate">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-auto">
                    <Link to={`/college-dashboard/On-campus/${job._id || job.id}`}>
                        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
