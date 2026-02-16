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
import { MapPin, Heart } from 'lucide-react';
import { SaveOppurtunity } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';

const pastelColors = [
  // Purple / Indigo
  "bg-gradient-to-r from-[#a5b4fc]/15 to-[#c4b5fd]/15 text-[#5b21b6] border border-[#a5b4fc]/25",
  "bg-gradient-to-r from-[#c4b5fd]/15 to-[#a78bfa]/15 text-[#6d28d9] border border-[#c4b5fd]/25",
  "bg-gradient-to-r from-[#818cf8]/15 to-[#a5b4fc]/15 text-[#4f46e5] border border-[#818cf8]/25",

  // Green
  "bg-gradient-to-r from-[#bbf7d0]/15 to-[#86efac]/15 text-[#047857] border border-[#bbf7d0]/25",
  "bg-gradient-to-r from-[#86efac]/15 to-[#4ade80]/15 text-[#059669] border border-[#86efac]/25",
  "bg-gradient-to-r from-[#6ee7b7]/15 to-[#34d399]/15 text-[#059669] border border-[#6ee7b7]/25",

  // Pink
  "bg-gradient-to-r from-[#fbcfe8]/15 to-[#f9a8d4]/15 text-[#9d174d] border border-[#fbcfe8]/25",
  "bg-gradient-to-r from-[#f9a8d4]/15 to-[#f472b6]/15 text-[#be185d] border border-[#f9a8d4]/25",
  "bg-gradient-to-r from-[#fda4af]/15 to-[#fb7185]/15 text-[#be123c] border border-[#fda4af]/25",

  // Yellow / Orange
  "bg-gradient-to-r from-[#fde68a]/15 to-[#fcd34d]/15 text-[#92400e] border border-[#fde68a]/25",
  "bg-gradient-to-r from-[#fed7aa]/15 to-[#fdba74]/15 text-[#9a3412] border border-[#fed7aa]/25",
  "bg-gradient-to-r from-[#fdba74]/15 to-[#fb923c]/15 text-[#c2410c] border border-[#fdba74]/25",

  // Blue / Cyan
  "bg-gradient-to-r from-[#bae6fd]/15 to-[#7dd3fc]/15 text-[#0369a1] border border-[#bae6fd]/25",
  "bg-gradient-to-r from-[#7dd3fc]/15 to-[#38bdf8]/15 text-[#0284c7] border border-[#7dd3fc]/25",
  "bg-gradient-to-r from-[#67e8f9]/15 to-[#22d3ee]/15 text-[#0e7490] border border-[#67e8f9]/25",

  // Teal / Emerald
  "bg-gradient-to-r from-[#99f6e4]/15 to-[#5eead4]/15 text-[#0f766e] border border-[#99f6e4]/25",
  "bg-gradient-to-r from-[#5eead4]/15 to-[#2dd4bf]/15 text-[#115e59] border border-[#5eead4]/25",
  "bg-gradient-to-r from-[#2dd4bf]/15 to-[#14b8a6]/15 text-[#134e4a] border border-[#2dd4bf]/25",

  // Rose / Fuchsia
  "bg-gradient-to-r from-[#fecdd3]/15 to-[#fda4af]/15 text-[#9f1239] border border-[#fecdd3]/25",
  "bg-gradient-to-r from-[#fda4af]/15 to-[#fb7185]/15 text-[#be123c] border border-[#fda4af]/25",
  "bg-gradient-to-r from-[#fb7185]/15 to-[#f43f5e]/15 text-[#be123c] border border-[#fb7185]/25",

  // Lime
  "bg-gradient-to-r from-[#d9f99d]/15 to-[#bef264]/15 text-[#3f6212] border border-[#d9f99d]/25",
  "bg-gradient-to-r from-[#bef264]/15 to-[#a3e635]/15 text-[#4d7c0f] border border-[#bef264]/25",
  "bg-gradient-to-r from-[#a3e635]/15 to-[#84cc16]/15 text-[#3f6212] border border-[#a3e635]/25",

  // Amber
  "bg-gradient-to-r from-[#fef3c7]/15 to-[#fde68a]/15 text-[#92400e] border border-[#fef3c7]/25",
  "bg-gradient-to-r from-[#fde68a]/15 to-[#fcd34d]/15 text-[#b45309] border border-[#fde68a]/25",
  "bg-gradient-to-r from-[#fcd34d]/15 to-[#fbbf24]/15 text-[#d97706] border border-[#fcd34d]/25",
];

function getStableColor(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * 31) % pastelColors.length;
  }
  return pastelColors[hash];
}

const PoolCollegeCard = ({ college, onClick, compact = false }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!college) return null;

  // =========== SIMPLIFIED COLLEGE NAME EXTRACTION ===========
  const getCollegeName = () => {
    // Priority 1: Root level fields (these exist in your data)
    if (college.collegeName && college.collegeName !== 'College') {
      return college.collegeName;
    }
    if (college.name && college.name !== 'College') {
      return college.name;
    }
    
    // Priority 2: Check if there's real data in collegePosted
    if (college.collegePosted) {
      if (college.collegePosted.collegeUniversityDetails?.collegeName) {
        return college.collegePosted.collegeUniversityDetails.collegeName;
      }
      if (college.collegePosted.name) {
        return college.collegePosted.name;
      }
    }
    
    // Priority 3: Fallback to normalized field
    if (college.normalizedCollegeName) {
      return college.normalizedCollegeName;
    }
    
    // Last resort
    return 'College';
  };

  const collegeName = getCollegeName();
  
  // =========== SIMPLIFIED LOGO EXTRACTION ===========
  const getCollegeLogo = () => {
    // Try root level first
    if (college.logo) return college.logo;
    if (college.profileImage) return college.profileImage;
    
    // Then check collegePosted
    if (college.collegePosted?.profileImage) {
      return college.collegePosted.profileImage;
    }
    
    // Then normalized field
    if (college.normalizedLogo) {
      return college.normalizedLogo;
    }
    
    return '';
  };

  const logo = getCollegeLogo();

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

  const handleCardClick = (e) => {
    // Don't trigger if clicking on save button or details button
    if (e.target.closest('button')) {
      return;
    }
    
    // Use onClick prop if provided
    if (onClick && typeof onClick === 'function') {
      onClick(college);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    
    // Use onClick prop if provided
    if (onClick && typeof onClick === 'function') {
      onClick(college);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await SaveOppurtunity(
        college._id,        // ✅ jobId
        college.jobType || "Pool-campus"     // ✅ jobType = "Pool-campus"
      );

      if (response?.data?.success === true) {
        setIsSaved(true);
        toast.success("Saved");
      } else {
        toast.error(response?.response?.data?.msg || "Unable to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Something went wrong!");
    }
  };

  // Format location
  const formatLocation = () => {
    if (college.location && college.location.length > 0) {
      return college.location.slice(0, 2).join(', ');
    }
    if (college.venue) return college.venue;
    
    // Try to get location from college details
    if (college.collegePosted?.collegeUniversityDetails?.city) {
      const city = college.collegePosted.collegeUniversityDetails.city;
      const state = college.collegePosted.collegeUniversityDetails.state;
      return `${city}${state ? `, ${state}` : ''}`;
    }
    
    return 'Location not specified';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  // Format package details
  const formatPackage = () => {
    if (college.packageDetails?.totalCTC) {
      return `₹${college.packageDetails.totalCTC.toLocaleString()}`;
    }
    return 'Not Disclosed';
  };

  // Get description text
  const getDescription = () => {
    return college.description || 'No description provided.';
  };

  const collegeStatus = getCollegeStatus();
  const stableColor = getStableColor(college._id || collegeName);
  const description = getDescription();

  // Get colored badges for degree types - with +X more format
  const getDegreeBadges = () => {
    if (!college.degree?.length) return null;
    
    const roleColors = [
      "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
      "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200",
      "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 border-pink-200",
      "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200",
      "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-200",
    ];
    
    const visibleDegrees = college.degree.slice(0, 4);
    const remainingCount = college.degree.length > 4 ? college.degree.length - 4 : 0;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {visibleDegrees.map((degree, index) => (
          <span 
            key={index} 
            className={`text-sm font-medium px-2 py-0.5 rounded-full border ${roleColors[index % roleColors.length]}`}
          >
            {degree}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };

  // Get student streams badges (branch) - with +X more format
  const getStreamBadges = () => {
    if (!college.studentStreams?.length) return null;
    
    const streamColors = [
      "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
      "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200",
      "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 border-pink-200",
      "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200",
      "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-200",
    ];
    
    const visibleStreams = college.studentStreams.slice(0, 4);
    const remainingCount = college.studentStreams.length > 4 ? college.studentStreams.length - 4 : 0;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {/* <span className="text-xs font-semibold text-gray-600 mr-1">Branches:</span> */}
        {visibleStreams.map((stream, index) => (
          <span 
            key={index} 
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${streamColors[index % streamColors.length]}`}
          >
            {stream}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };

  // Get skills badges - with 2 rows and +X more format
  const getSkillsBadges = () => {
    if (!college.skills?.length) return null;
    
    const skillColors = [
      "px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full text-xs",
      "px-3 py-1 bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-full text-xs",
      "px-3 py-1 bg-pink-100 text-pink-800 border border-pink-300 rounded-full text-xs",
      "px-3 py-1 bg-teal-100 text-teal-800 border border-teal-300 rounded-full text-xs",
      "px-3 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-full text-xs",
      "px-3 py-1 bg-cyan-100 text-cyan-800 border border-cyan-300 rounded-full text-xs",
    ];
    
    // Show up to 5 skills (which typically fits in 2 rows)
    const visibleSkills = college.skills.slice(0, 5);
    const remainingCount = college.skills.length > 5 ? college.skills.length - 5 : 0;
    
    return (
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-600 mb-1"></div>
        <div className="flex flex-wrap gap-1">
          {visibleSkills.map((skill, index) => (
            <span
              key={index}
              className={skillColors[index % skillColors.length]}
            >
              {skill}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-1 rounded-full border">
              +{remainingCount} more
            </span>
          )}
        </div>
      </div>
    );
  };

  // Get round details (branch + skills) from roundDetails array
  const getRoundDetailsBadges = () => {
    if (!college.roundDetails?.length) return null;
    
    // Create a combined representation for first few rounds
    const visibleRounds = college.roundDetails.slice(0, 2);
    const remainingCount = college.roundDetails.length > 2 ? college.roundDetails.length - 2 : 0;
    
    return (
      <div className="mb-3">
        {/* <div className="text-xs font-semibold text-gray-600 mb-1">Branches & Skills:</div> */}
        <div className="space-y-1">
          {visibleRounds.map((round, index) => (
            <div key={index} className="flex flex-wrap items-center gap-1">
              <span className="text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                {round.branch || 'Branch'}
              </span>
              <span className="text-xs text-gray-400">→</span>
              {round.skills ? (
                <span className="text-xs bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                  {round.skills}
                </span>
              ) : (
                <span className="text-xs text-gray-500">No skills specified</span>
              )}
            </div>
          ))}
          {remainingCount > 0 && (
            <span className="text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-0.5 rounded-full border">
              +{remainingCount} more rounds
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`
        ${compact ? "w-full" : "w-full max-w-[350px]"} 
        mx-auto rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden
        flex flex-col cursor-pointer h-full hover:scale-[1.02] bg-white
      `}
    >
      {/* TOP SECTION - Pastel background */}
      <div className={`${stableColor} p-4 flex-1 flex flex-col`}>
        {/* Status + Save */}
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs ${collegeStatus.color} px-3 py-1 rounded-full font-medium`}>
            {collegeStatus.status}
          </span>

          <button
            onClick={handleSave}
            className="bg-white p-2 rounded-full shadow hover:shadow-md transition z-10 hover:bg-gray-50"
            aria-label={isSaved ? "Remove from saved" : "Save college"}
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? "text-red-500 fill-red-500" : "text-gray-600"}`}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* College Name + Degree Types */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1 pr-2">
            <h3 className="text-black font-semibold text-lg truncate">
              {collegeName}
            </h3>
            
            {/* Degree Types as colored badges with +X more */}
            {getDegreeBadges()}
          </div>

          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border border-gray-300 shrink-0">
            {logo && !imageError ? (
              <img 
                src={logo} 
                alt={`${collegeName} logo`}
                className="w-12 h-12 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700">
                  {getInitials(collegeName)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Employment Type Badge */}
        {college.employmentType?.length > 0 && (
          <div className="mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold">
              {college.employmentType.join(', ')}
            </span>
          </div>
        )}

        {/* Student Streams (Branches) with +X more */}
        {getStreamBadges()}

        {/* Skills with 2 rows and +X more */}
        {getSkillsBadges()}

        {/* Round Details (Branch + Skills) */}
        {/* {getRoundDetailsBadges()} */}

        {/* College Types with +X more */}
        {/* {college.collegeTypes?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-600 mr-1">College Types:</span>
            {college.collegeTypes.slice(0, 3).map((type, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-full text-xs"
              >
                {type}
              </span>
            ))}
            {college.collegeTypes.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200 rounded-full">
                +{college.collegeTypes.length - 3} more
              </span>
            )}
          </div>
        )} */}

        {/* Work Modes with +X more */}
        {/* {college.workMode?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-600 mr-1">Work Modes:</span>
            {college.workMode.slice(0, 3).map((mode, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/60 backdrop-blur-sm"
              >
                {mode}
              </span>
            ))}
            {college.workMode.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200 rounded-full">
                +{college.workMode.length - 3} more
              </span>
            )}
          </div>
        )} */}

        {/* Company Types with +X more */}
        {/* {college.companyType?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-600 mr-1">Preferred:</span>
            {college.companyType.slice(0, 3).map((type, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full text-xs"
              >
                {type}
              </span>
            ))}
            {college.companyType.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200 rounded-full">
                +{college.companyType.length - 3} more
              </span>
            )}
          </div>
        )} */}

        {/* Amenities as Skills with +X more */}
        {/* {college.amenitiesRequired?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-600 mr-1">Amenities:</span>
            {college.amenitiesRequired.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/60 backdrop-blur-sm"
              >
                {amenity}
              </span>
            ))}
            {college.amenitiesRequired.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200 rounded-full">
                +{college.amenitiesRequired.length - 3} more
              </span>
            )}
          </div>
        )} */}

        {/* Description */}
        {/* <div className="flex-1 mt-2">
          <p className="text-sm text-gray-700 line-clamp-2">
            {description}
          </p>
        </div> */}
      </div>

      {/* BOTTOM SECTION - White background */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="min-w-0">
            {/* Package */}
            <p className="font-semibold text-gray-900 text-sm truncate">
              {formatPackage()}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-700 text-xs mt-1">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="line-clamp-1 truncate">
                {formatLocation()}
              </span>
            </div>
          </div>

          <button
            onClick={handleDetailsClick}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap flex-shrink-0 ml-2"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolCollegeCard;