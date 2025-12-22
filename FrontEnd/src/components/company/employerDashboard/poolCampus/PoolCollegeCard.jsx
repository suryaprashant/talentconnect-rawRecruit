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
import { MapPin, User, Banknote, Heart } from 'lucide-react';

const pastelColors = [
  // Purple/Indigo gradient variants (primary theme colors)
  "bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30",
  "bg-gradient-to-r from-[#c4b5fd]/20 to-[#a78bfa]/20 text-[#6d28d9] border border-[#c4b5fd]/30",
  "bg-gradient-to-r from-[#818cf8]/20 to-[#a5b4fc]/20 text-[#4f46e5] border border-[#818cf8]/30",
  
  // Green gradient variants
  "bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30",
  "bg-gradient-to-r from-[#86efac]/20 to-[#4ade80]/20 text-[#047857] border border-[#86efac]/30",
  "bg-gradient-to-r from-[#6ee7b7]/20 to-[#34d399]/20 text-[#059669] border border-[#6ee7b7]/30",
  
  // Pink gradient variants
  "bg-gradient-to-r from-[#fbcfe8]/20 to-[#f9a8d4]/20 text-[#9d174d] border border-[#fbcfe8]/30",
  "bg-gradient-to-r from-[#f9a8d4]/20 to-[#f472b6]/20 text-[#be185d] border border-[#f9a8d4]/30",
  "bg-gradient-to-r from-[#fda4af]/20 to-[#fb7185]/20 text-[#be123c] border border-[#fda4af]/30",
  
  // Yellow/Orange gradient variants
  "bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30",
  "bg-gradient-to-r from-[#fed7aa]/20 to-[#fdba74]/20 text-[#9a3412] border border-[#fed7aa]/30",
  "bg-gradient-to-r from-[#fdba74]/20 to-[#fb923c]/20 text-[#c2410c] border border-[#fdba74]/30",
  
  // Blue/Cyan gradient variants
  "bg-gradient-to-r from-[#bae6fd]/20 to-[#7dd3fc]/20 text-[#0369a1] border border-[#bae6fd]/30",
  "bg-gradient-to-r from-[#7dd3fc]/20 to-[#38bdf8]/20 text-[#0284c7] border border-[#7dd3fc]/30",
  "bg-gradient-to-r from-[#67e8f9]/20 to-[#22d3ee]/20 text-[#0e7490] border border-[#67e8f9]/30",
  
  // Teal/Emerald gradient variants
  "bg-gradient-to-r from-[#99f6e4]/20 to-[#5eead4]/20 text-[#0f766e] border border-[#99f6e4]/30",
  "bg-gradient-to-r from-[#5eead4]/20 to-[#2dd4bf]/20 text-[#115e59] border border-[#5eead4]/30",
  "bg-gradient-to-r from-[#2dd4bf]/20 to-[#14b8a6]/20 text-[#134e4a] border border-[#2dd4bf]/30",
  
  // Rose/Fuchsia gradient variants
  "bg-gradient-to-r from-[#fecdd3]/20 to-[#fda4af]/20 text-[#9f1239] border border-[#fecdd3]/30",
  "bg-gradient-to-r from-[#fda4af]/20 to-[#fb7185]/20 text-[#be123c] border border-[#fda4af]/30",
  "bg-gradient-to-r from-[#fb7185]/20 to-[#f43f5e]/20 text-[#be123c] border border-[#fb7185]/30",
  
  // Lime/Emerald gradient variants
  "bg-gradient-to-r from-[#d9f99d]/20 to-[#bef264]/20 text-[#3f6212] border border-[#d9f99d]/30",
  "bg-gradient-to-r from-[#bef264]/20 to-[#a3e635]/20 text-[#4d7c0f] border border-[#bef264]/30",
  "bg-gradient-to-r from-[#a3e635]/20 to-[#84cc16]/20 text-[#3f6212] border border-[#a3e635]/30",
  
  // Amber/Warm gradient variants
  "bg-gradient-to-r from-[#fef3c7]/20 to-[#fde68a]/20 text-[#92400e] border border-[#fef3c7]/30",
  "bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#b45309] border border-[#fde68a]/30",
  "bg-gradient-to-r from-[#fcd34d]/20 to-[#fbbf24]/20 text-[#d97706] border border-[#fcd34d]/30",
];

// Helper function to get a random theme color
const getRandomThemeColor = () => {
  const themeColors = [
    "bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30", // Purple
    "bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30", // Green
    "bg-gradient-to-r from-[#fbcfe8]/20 to-[#f9a8d4]/20 text-[#9d174d] border border-[#fbcfe8]/30", // Pink
    "bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30", // Yellow
    "bg-gradient-to-r from-[#bae6fd]/20 to-[#7dd3fc]/20 text-[#0369a1] border border-[#bae6fd]/30", // Blue
  ];
  return themeColors[Math.floor(Math.random() * themeColors.length)];
};

function getStableColor(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * 31) % pastelColors.length;
  }
  return pastelColors[hash];
}

const PoolCollegeCard = ({ college }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!college) return null;

  const collegeDetails = college.collegePosted;
  const collegeName = collegeDetails?.collegeUniversityDetails?.collegeName || 'College';
  const logo = collegeDetails?.profileImage || '';

  // Get status based on dates
  const getCollegeStatus = () => {
    const now = new Date();
    const startDate = college.startDate ? new Date(college.startDate) : null;
    const endDate = college.endDate ? new Date(college.endDate) : null;

    if (!startDate || !endDate) {
      return { status: 'Not Scheduled', color: 'bg-gray-100 text-gray-700' };
    }

    if (now < startDate) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Active', color: 'bg-green-100 text-green-700' };
    } else {
      return { status: 'Completed', color: 'bg-gray-100 text-gray-700' };
    }
  };

  // Format venue/location
  const formatVenue = () => {
    if (college.venue) return college.venue;
    if (college.location?.length) return college.location.join(', ');
    return 'Venue not specified';
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

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  const collegeStatus = getCollegeStatus();
  const stableColor = getStableColor(college._id || collegeName);

  return (
    <div className="
      w-full max-w-[350px] min-h-[430px] mx-auto rounded-2xl 
      border shadow-sm hover:shadow-lg transition overflow-hidden
      flex flex-col
    ">
      {/* TOP SECTION */}
      <div className={`${stableColor} p-4 pb-6 rounded-b-2xl flex-grow`}>

        {/* Status + Save */}
        <div className="flex justify-between items-start">
          <span className={`text-xs ${collegeStatus.color} px-3 py-1 rounded-full font-medium`}>
            {collegeStatus.status}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="bg-white p-2 rounded-full shadow"
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? "text-red-500 fill-red-500" : "text-gray-600"}`}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* College Name + Degree Types */}
        <div className="mt-3 flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-black font-semibold text-lg truncate max-w-[200px]">
              {collegeName}
            </h3>

            {/* Display Degree Types */}
            {college.degree?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {college.degree.slice(0, 3).map((degree, index) => (
                  <span 
                    key={index} 
                    className="text-sm font-bold text-gray-900 bg-white/40 px-2 py-0.5 rounded border border-black/5"
                  >
                    {degree}
                  </span>
                ))}
                {college.degree.length > 3 && (
                  <span className="text-sm font-bold text-gray-900 bg-white/40 px-2 py-0.5 rounded border border-black/5">
                    +{college.degree.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border shrink-0">
            {logo && !imageError ? (
              <img 
                src={logo} 
                alt={`${collegeName} logo`}
                className="w-12 h-12 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {getInitials(collegeName)}
              </div>
            )}
          </div>
        </div>

        {/* Employment Type */}
        <div className="mt-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold">
            {college.employmentType?.length > 0 
              ? college.employmentType.join(', ')
              : 'Employment type not specified'}
          </span>
        </div>

        {/* College Types */}
        {college.collegeTypes?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {college.collegeTypes.slice(0, 2).map((type, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-full text-xs"
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {/* Work Modes */}
        {college.workMode?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {college.workMode.slice(0, 3).map((mode, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/50"
              >
                {mode}
              </span>
            ))}
            {college.workMode.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-600">+{college.workMode.length - 3}</span>
            )}
          </div>
        )}

        {/* Company Types */}
        {college.companyType?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {college.companyType.slice(0, 2).map((type, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full text-xs"
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {/* Amenities as Skills */}
        {college.amenitiesRequired?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {college.amenitiesRequired.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/50"
              >
                {amenity}
              </span>
            ))}
            {college.amenitiesRequired.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-600">+{college.amenitiesRequired.length - 3}</span>
            )}
          </div>
        )}

        {/* Description - Fixed height */}
        <div className="mt-3">
          <p className="text-sm text-gray-700 line-clamp-3">
            {college.description 
              ? college.description.split(' ').slice(0, 20).join(' ') + (college.description.split(' ').length > 20 ? '...' : '')
              : 'No description provided.'}
          </p>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="p-4 bg-white flex justify-between items-center border-t">

        <div>
          {/* Package */}
          <p className="font-semibold text-gray-900 text-sm">
            {college.packageDetails?.totalCTC 
              ? `₹${college.packageDetails.totalCTC.toLocaleString()}`
              : "Not Disclosed"}
          </p>

          {/* Location/Venue */}
          <div className="flex items-center gap-1 text-gray-700 text-xs mt-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="line-clamp-1 max-w-[120px]">
              {formatVenue()}
            </span>
          </div>
        </div>

        <Link
          to={`/company-dashboard/Pool-campus/${college._id || college.id}`}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          Contact
        </Link>

      </div>

    </div>
  );
};

export default PoolCollegeCard;
