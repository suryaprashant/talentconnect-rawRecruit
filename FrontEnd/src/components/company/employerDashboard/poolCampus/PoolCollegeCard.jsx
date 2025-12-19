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

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Banknote } from 'lucide-react';

const PoolCollegeCard = ({ college }) => {
    if (!college) return null;

    const collegeDetails = college.collegePosted;
    const collegeName = collegeDetails?.collegeUniversityDetails?.collegeName || 'College';
    const logo = collegeDetails?.profileImage || 'https://via.placeholder.com/48';

    // Format venue/location
    const formatVenue = () => {
        if (college.venue) {
            return college.venue;
        }
        if (college.location && college.location.length > 0) {
            return college.location.join(', ');
        }
        return 'Venue not specified';
    };

    // Format degree types - only show if present
    const formatDegreeTypes = () => {
        if (college.degree && college.degree.length > 0) {
            return college.degree.slice(0, 2); // Show max 2 items
        }
        return [];
    };

    // Format work modes - only show if present
    const formatWorkModes = () => {
        if (college.workMode && college.workMode.length > 0) {
            return college.workMode.slice(0, 2); // Show max 2 items
        }
        return [];
    };

    // Format employment types
    const formatEmploymentTypes = () => {
        if (college.employmentType && college.employmentType.length > 0) {
            return college.employmentType.join(', ');
        }
        return 'Employment type not specified';
    };

    // Format package details
    const formatPackage = () => {
        if (college.packageDetails?.totalCTC) {
            const currency = college.packageDetails.currency || 'INR';
            const amount = college.packageDetails.totalCTC.toLocaleString();
            return `${currency === 'INR' ? '₹' : currency} ${amount}`;
        }
        return 'Package not specified';
    };

    // Format amenities - only show if present
    const formatAmenities = () => {
        if (college.amenitiesRequired && college.amenitiesRequired.length > 0) {
            return college.amenitiesRequired.slice(0, 3); // Show max 3 items
        }
        return [];
    };

    // Format company types - only show if present
    const formatCompanyTypes = () => {
        if (college.companyType && college.companyType.length > 0) {
            return college.companyType.slice(0, 2); // Show max 2 items
        }
        return [];
    };

    // Format college types - only show if present
    const formatCollegeTypes = () => {
        if (college.collegeTypes && college.collegeTypes.length > 0) {
            return college.collegeTypes.slice(0, 2); // Show max 2 items
        }
        return [];
    };

    // Format description to fixed height with consistent word count
    const formatDescription = () => {
        if (!college.description) {
            return 'No description provided.';
        }
        
        const words = college.description.split(' ');
        if (words.length <= 15) {
            return college.description;
        }
        
        // Always take exactly 15 words
        const truncatedWords = words.slice(0, 15);
        return truncatedWords.join(' ') + '...';
    };

    // Get status based on dates
    const getCollegeStatus = () => {
        const now = new Date();
        const startDate = college.startDate ? new Date(college.startDate) : null;
        const endDate = college.endDate ? new Date(college.endDate) : null;

        if (!startDate || !endDate) {
            return { status: 'Not Scheduled', color: 'bg-gray-400' };
        }

        if (now < startDate) {
            return { status: 'Upcoming', color: 'bg-blue-500' };
        } else if (now >= startDate && now <= endDate) {
            return { status: 'Active', color: 'bg-green-500' };
        } else {
            return { status: 'Completed', color: 'bg-gray-500' };
        }
    };

    const collegeStatus = getCollegeStatus();

    const degreeTypes = formatDegreeTypes();
    const collegeTypes = formatCollegeTypes();
    const companyTypes = formatCompanyTypes();
    const workModes = formatWorkModes();
    const amenities = formatAmenities();

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200 flex flex-col h-full">
            <div className="p-6 flex-1 flex flex-col">
                {/* College Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                                src={logo}
                                alt={`${collegeName} logo`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/48";
                                }}
                            />
                        </div>
                        <div className="ml-3 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate" title={collegeName}>
                                {collegeName}
                            </h3>
                        </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${collegeStatus.color} flex-shrink-0 ml-2`}>
                        {collegeStatus.status}
                    </div>
                </div>

                {/* Degree Types - Only show if present */}
                {degreeTypes.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {degreeTypes.map((degree, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex-1 text-center truncate" title={degree}>
                                {degree}
                            </span>
                        ))}
                    </div>
                )}

                {/* College Types - Only show if present */}
                {collegeTypes.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {collegeTypes.map((collegeType, index) => (
                            <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded flex-1 text-center truncate" title={collegeType}>
                                {collegeType}
                            </span>
                        ))}
                    </div>
                )}

                {/* Company Types - Only show if present */}
                {companyTypes.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {companyTypes.map((companyType, index) => (
                            <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded flex-1 text-center truncate" title={companyType}>
                                {companyType}
                            </span>
                        ))}
                    </div>
                )}

                {/* Info Sections with consistent height */}
                <div className="space-y-3 mb-4">
                    {/* Venue/Location */}
                    <div className="flex items-center min-h-[24px]">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate" title={formatVenue()}>
                            {formatVenue()}
                        </p>
                    </div>

                    {/* Work Modes - Only show if present */}
                    {workModes.length > 0 && (
                        <div className="flex gap-2">
                            {workModes.map((workMode, index) => (
                                <div key={index} className="bg-gray-50 border border-gray-100 rounded-md px-2 py-1 flex-1">
                                    <p className="text-xs text-gray-700 truncate text-center" title={workMode}>
                                        {workMode}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Employment Type */}
                    <div className="flex items-center min-h-[24px]">
                        <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-800 truncate" title={formatEmploymentTypes()}>
                            {formatEmploymentTypes()}
                        </p>
                    </div>

                    {/* Package */}
                    <div className="flex items-center min-h-[24px]">
                        <Banknote className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate" title={formatPackage()}>
                            Min Package: {formatPackage()}
                        </p>
                    </div>
                </div>

                {/* Description - Fixed height */}
                <div className="mb-4 flex-1">
                    <p className="text-sm text-gray-600 line-clamp-3 h-[60px] overflow-hidden">
                        {formatDescription()}
                    </p>
                </div>

                {/* Amenities - Only show if present */}
                {amenities.length > 0 && (
                    <div className="mb-4">
                        <div className="flex gap-2 mb-2">
                            {amenities.map((amenity, index) => (
                                <div key={index} className="bg-gray-50 border border-gray-100 rounded-md px-2 py-1 flex-1">
                                    <p className="text-xs text-gray-700 truncate text-center" title={amenity}>
                                        {amenity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Button - Always at bottom */}
                <div className="mt-auto pt-4">
                    <Link 
                        to={`/company-dashboard/Pool-campus/${college._id || college.id}`} 
                        className="block w-full"
                    >
                        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200 font-medium">
                            Contact College
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PoolCollegeCard;
