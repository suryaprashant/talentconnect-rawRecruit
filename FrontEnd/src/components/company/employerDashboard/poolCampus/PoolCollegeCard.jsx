// import { Link } from 'react-router-dom';

// const PoolCollegeCard = ({ college }) => {

//   if (!college) return null;

//   const collegeDetails = college.collegePosted;

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//       <div className="h-48 bg-gray-100 flex items-center justify-center">
       
//         {collegeDetails?.profileImage ? (
//           <img 
//             src={collegeDetails.profileImage} 
//             alt={`${collegeDetails?.collegeUniversityDetails?.collegeName || 'College'} logo`} 
//             className="h-full w-full object-contain"
//           />
//         ) : (
//           <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//             <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//           </svg>
//         )}
//       </div>
//       <div className="p-4">
 
//         <div className="font-medium mb-1 text-center">
//           {college?.degree?.map((d, i) => (
//             <span key={i} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-1 mb-1">
//               {d}
//             </span>
//           ))}
//         </div>
      
//         <h3 className="font-medium text-lg mb-1 text-center truncate">
//           {college?.collegePosted?.collegeUniversityDetails?.collegeName || 'N/A'}
//         </h3>

//         <Link
//           to={`/company-dashboard/Pool-campus/${college._id}`}
//           className="block w-full text-center border border-gray-300 rounded py-2 text-sm hover:bg-blue-600 transition"
//         >
//           Contact
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default PoolCollegeCard;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Banknote } from 'lucide-react';

const PoolCollegeCard = ({ college }) => {
    if (!college) return null;

    const collegeDetails = college.collegePosted;
    const collegeName =
        collegeDetails?.collegeUniversityDetails?.collegeName || 'College';
    const logo = collegeDetails?.profileImage || '';

    const [imageError, setImageError] = useState(false);

    /* ---------------- HELPERS ---------------- */

    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length === 1) return words[0][0].toUpperCase();
        return (
            words[0][0] + words[words.length - 1][0]
        ).toUpperCase();
    };

    const formatVenue = () => {
        if (college.venue) return college.venue;
        if (college.location?.length) return college.location.join(', ');
        return 'Venue not specified';
    };

    const formatDegreeTypes = () =>
        college.degree?.length ? college.degree.slice(0, 2) : [];

    const formatWorkModes = () =>
        college.workMode?.length ? college.workMode.slice(0, 2) : [];

    const formatEmploymentTypes = () =>
        college.employmentType?.length
            ? college.employmentType.join(', ')
            : 'Employment type not specified';

    const formatPackage = () => {
        if (college.packageDetails?.totalCTC) {
            const currency = college.packageDetails.currency || 'INR';
            const amount = college.packageDetails.totalCTC.toLocaleString();
            return `${currency === 'INR' ? '₹' : currency} ${amount}`;
        }
        return 'Package not specified';
    };

    const formatAmenities = () =>
        college.amenitiesRequired?.length
            ? college.amenitiesRequired.slice(0, 3)
            : [];

    const formatCompanyTypes = () =>
        college.companyType?.length ? college.companyType.slice(0, 2) : [];

    const formatCollegeTypes = () =>
        college.collegeTypes?.length ? college.collegeTypes.slice(0, 2) : [];

    const formatDescription = () => {
        if (!college.description) return 'No description provided.';
        const words = college.description.split(' ');
        return words.length <= 15
            ? college.description
            : words.slice(0, 15).join(' ') + '...';
    };

    const getCollegeStatus = () => {
        const now = new Date();
        const startDate = college.startDate && new Date(college.startDate);
        const endDate = college.endDate && new Date(college.endDate);

        if (!startDate || !endDate)
            return { status: 'Not Scheduled', color: 'bg-gray-400' };

        if (now < startDate)
            return { status: 'Upcoming', color: 'bg-blue-500' };

        if (now <= endDate)
            return { status: 'Active', color: 'bg-green-500' };

        return { status: 'Completed', color: 'bg-gray-500' };
    };

    const collegeStatus = getCollegeStatus();
    const degreeTypes = formatDegreeTypes();
    const collegeTypes = formatCollegeTypes();
    const companyTypes = formatCompanyTypes();
    const workModes = formatWorkModes();
    const amenities = formatAmenities();

    /* ---------------- RENDER ---------------- */

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col h-full">
            <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center min-w-0">
                        {/* Logo / Initials */}
                        <div className="w-12 h-12 rounded-md flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg flex-shrink-0">
                            {logo && !imageError ? (
                                <img
                                    src={logo}
                                    alt={collegeName}
                                    className="w-full h-full object-contain bg-white rounded-md"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <span>{getInitials(collegeName)}</span>
                            )}
                        </div>

                        <div className="ml-3 min-w-0">
                            <h3
                                className="font-semibold text-gray-900 truncate"
                                title={collegeName}
                            >
                                {collegeName}
                            </h3>
                        </div>
                    </div>

                    <span
                        className={`px-2 py-1 rounded-full text-xs text-white font-medium ${collegeStatus.color}`}
                    >
                        {collegeStatus.status}
                    </span>
                </div>

                {/* Tags */}
                {degreeTypes.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {degreeTypes.map((d, i) => (
                            <span
                                key={i}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex-1 text-center truncate"
                            >
                                {d}
                            </span>
                        ))}
                    </div>
                )}

                {collegeTypes.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {collegeTypes.map((c, i) => (
                            <span
                                key={i}
                                className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded flex-1 text-center truncate"
                            >
                                {c}
                            </span>
                        ))}
                    </div>
                )}

                {companyTypes.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {companyTypes.map((c, i) => (
                            <span
                                key={i}
                                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded flex-1 text-center truncate"
                            >
                                {c}
                            </span>
                        ))}
                    </div>
                )}

                {/* Info */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-sm truncate">{formatVenue()}</p>
                    </div>

                    {workModes.length > 0 && (
                        <div className="flex gap-2">
                            {workModes.map((w, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-50 border rounded px-2 py-1 flex-1 text-xs text-center truncate"
                                >
                                    {w}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-sm font-medium truncate">
                            {formatEmploymentTypes()}
                        </p>
                    </div>

                    <div className="flex items-center">
                        <Banknote className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-sm truncate">
                            Min Package: {formatPackage()}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {formatDescription()}
                </p>

                {/* Amenities */}
                {amenities.length > 0 && (
                    <div className="flex gap-2 mb-4">
                        {amenities.map((a, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 border rounded px-2 py-1 flex-1 text-xs text-center truncate"
                            >
                                {a}
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-auto pt-4">
                    <Link
                        to={`/company-dashboard/Pool-campus/${college._id || college.id}`}
                    >
                        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
                            Contact College
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PoolCollegeCard;
