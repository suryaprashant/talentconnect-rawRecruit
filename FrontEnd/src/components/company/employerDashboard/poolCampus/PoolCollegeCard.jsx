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
import { MapPin, User, Banknote, Calendar, GraduationCap, Users, Building } from 'lucide-react';

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

    // Format degree types
    const formatDegreeTypes = () => {
        if (college.degree && college.degree.length > 0) {
            return college.degree;
        }
        return ['Degree not specified'];
    };

    // Format work modes
    const formatWorkModes = () => {
        if (college.workMode && college.workMode.length > 0) {
            return college.workMode.join(', ');
        }
        return 'Work mode not specified';
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

    // Format dates
    const formatDateRange = () => {
        if (college.startDate && college.endDate) {
            const start = new Date(college.startDate).toLocaleDateString();
            const end = new Date(college.endDate).toLocaleDateString();
            return `${start} - ${end}`;
        }
        return 'Dates not specified';
    };

    // Format student count
    const formatStudentCount = () => {
        if (college.numberOfStudent && college.numberOfStudent.length > 0) {
            const total = college.numberOfStudent.reduce((sum, count) => sum + (parseInt(count) || 0), 0);
            return `${total}+ Students`;
        }
        return 'Student count not specified';
    };

    // Format amenities
    const formatAmenities = () => {
        if (college.amenitiesRequired && college.amenitiesRequired.length > 0) {
            return college.amenitiesRequired.slice(0, 3); // Show only first 3 amenities
        }
        return ['Facilities not specified'];
    };

    // Format company types
    const formatCompanyTypes = () => {
        if (college.companyType && college.companyType.length > 0) {
            return college.companyType;
        }
        return ['Company type not specified'];
    };

    // Format college types
    const formatCollegeTypes = () => {
        if (college.collegeTypes && college.collegeTypes.length > 0) {
            return college.collegeTypes;
        }
        return ['College type not specified'];
    };

    // Format description to show only 15-20 words
    const formatDescription = () => {
        if (!college.description) {
            return 'No description provided.';
        }
        
        const words = college.description.split(' ');
        if (words.length <= 20) {
            return college.description;
        }
        
        // Take first 15-20 words and add ellipsis
        const truncatedWords = words.slice(0, 20);
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

    // Format selection process rounds
    const formatRounds = () => {
        if (college.rounds && college.rounds.length > 0) {
            return college.rounds.slice(0, 4); // Show only first 4 rounds
        }
        return ['Selection process not specified'];
    };

    // Format skills
    const formatSkills = () => {
        if (college.skills && college.skills.length > 0) {
            return college.skills.slice(0, 5); // Show only first 5 skills
        }
        return [];
    };

    const collegeStatus = getCollegeStatus();

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
            <div className="p-6">
                {/* College Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
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
                        <div className="ml-3">
                            <h3 className="font-semibold text-gray-900">{collegeName}</h3>
                            {/* Pool Campus Badge */}
                           
                        </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${collegeStatus.color}`}>
                        {collegeStatus.status}
                    </div>
                </div>

                {/* Degree Types */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {formatDegreeTypes().map((degree, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {degree}
                        </span>
                    ))}
                </div>

                {/* College Types */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {formatCollegeTypes().map((collegeType, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                            {collegeType}
                        </span>
                    ))}
                </div>

                {/* Company Types */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {formatCompanyTypes().map((companyType, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {companyType}
                        </span>
                    ))}
                </div>

                {/* Venue */}
                <div className="mb-3">
                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                            {formatVenue()}
                        </p>
                    </div>
                </div>

              

                {/* Employment Type */}
                <div className="mb-3">
                    <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-800">
                            {formatEmploymentTypes()}
                        </p>
                    </div>
                </div>

                {/* Package */}
                <div className="mb-3">
                    <div className="flex items-center">
                        <Banknote className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          Min Package to offer:  {formatPackage()}
                        </p>
                    </div>
                </div>


               
                {/* Description - Limited to 15-20 words */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {formatDescription()}
                </p>

              

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="bg-green-50 border border-green-100 rounded-md px-3 py-1">
                        <p className="text-xs font-medium text-green-800">Campus Facilities</p>
                    </div>
                    {formatAmenities().map((amenity, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-100 rounded-md px-3 py-1">
                            <p className="text-xs text-gray-700">{amenity}</p>
                        </div>
                    ))}
                </div>

                {/* Contact Button */}
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
    );
};

export default PoolCollegeCard;
