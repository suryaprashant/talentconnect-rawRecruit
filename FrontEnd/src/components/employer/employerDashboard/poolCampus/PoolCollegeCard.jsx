import React, { useState } from 'react';
import { MapPin, Heart } from 'lucide-react';
import { SaveOppurtunity } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';

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

function getStableColor(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * 31) % pastelColors.length;
  }
  return pastelColors[hash];
}

const PoolCollegeCard = ({ college, onClick }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!college) return null;

  // Get college name with multiple fallbacks (from EmployerPoolDetailsModal structure)
  const getCollegeName = () => {
    // Primary: From EmployerPoolDetailsModal structure
    if (college.collegePosted?.collegeUniversityDetails?.collegeName) {
      return college.collegePosted.collegeUniversityDetails.collegeName;
    }
    // Secondary: Root level name
    if (college.name) {
      return college.name;
    }
    // Tertiary: Root level collegeName
    if (college.collegeName) {
      return college.collegeName;
    }
    // Final fallback
    return 'Pool Campus';
  };

  // Get logo with multiple fallbacks
  const getLogo = () => {
    if (college.collegePosted?.profileImageUrl) {
      return college.collegePosted.profileImageUrl;
    }
    if (college.collegePosted?.profileImage) {
      return college.collegePosted.profileImage;
    }
    if (college.logo) {
      return college.logo;
    }
    if (college.profileImage) {
      return college.profileImage;
    }
    return '';
  };

  // Get status based on dates (same as before)
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
    if (e.target.closest('button')) {
      return;
    }
    
    if (onClick && typeof onClick === 'function') {
      onClick(college);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    
    if (onClick && typeof onClick === 'function') {
      onClick(college);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await SaveOppurtunity(
        college._id,
        college.jobType || "Pool-campus"
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

  const formatLocation = () => {
  // Log for debugging
  console.log('PoolCollegeCard college data:', college);
  
  // Exact same logic as EmployerPoolDetailsModal
  const collegeDetails = college.collegePosted;
  const collegeUniDetails = collegeDetails?.collegeUniversityDetails || {};
  const city = collegeUniDetails.city || '';
  
  console.log('College details:', collegeDetails);
  console.log('College Uni details:', collegeUniDetails);
  console.log('City found:', city);
  
  // Return city if found
  if (city) {
    return city;
  }
  
  // If no city, check other possible locations
  if (college.location) {
    if (Array.isArray(college.location)) {
      return college.location[0];
    }
    return college.location;
  }
  
  if (college.companyDetails?.city) {
    return college.companyDetails.city;
  }
  
  if (college.hiringLocations && Array.isArray(college.hiringLocations)) {
    if (college.hiringLocations.length > 0) {
      return college.hiringLocations[0];
    }
  }
  
  return 'Location not specified';
};

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Format package details
  const formatPackage = () => {
    if (college.packageDetails?.totalCTC) {
      return `₹${college.packageDetails.totalCTC.toLocaleString()}`;
    }
    if (college.minPackage?.amount) {
      return `₹${college.minPackage.amount.toLocaleString()}`;
    }
    return 'Not Disclosed';
  };

  // Get description text
  const getDescription = () => {
    return college.description || 'Pool campus connecting multiple colleges with shared placement drives.';
  };

  const collegeName = getCollegeName();
  const logo = getLogo();
  const collegeStatus = getCollegeStatus();
  const stableColor = getStableColor(college._id || collegeName);
  const description = getDescription();

  // Get degree badges (from EmployerPoolDetailsModal structure)
  const getDegreeBadges = () => {
    // Check multiple possible fields
    const degrees = college.degree || college.studentStreams || college.jobRoles || [];
    
    if (degrees.length === 0) return null;
    
    const roleColors = [
      "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
      "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200",
      "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 border-pink-200",
      "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200",
      "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-200",
    ];
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {degrees.slice(0, 3).map((degree, index) => (
          <span 
            key={index} 
            className={`text-sm font-medium px-2 py-0.5 rounded-full border ${roleColors[index % roleColors.length]}`}
          >
            {degree}
          </span>
        ))}
        {degrees.length > 3 && (
          <span className="text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
            +{degrees.length - 3}
          </span>
        )}
      </div>
    );
  };

  // Get employment type badge
  const getEmploymentType = () => {
    if (!college.employmentType?.length) return null;
    
    return (
      <div className="mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold">
          {Array.isArray(college.employmentType) ? college.employmentType.join(', ') : college.employmentType}
        </span>
      </div>
    );
  };

  // Get college types
  const getCollegeTypes = () => {
    if (!college.collegeTypes?.length) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {college.collegeTypes.slice(0, 3).map((type, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-full text-xs"
          >
            {type}
          </span>
        ))}
        {college.collegeTypes.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-600">+{college.collegeTypes.length - 3}</span>
        )}
      </div>
    );
  };

  // Get work modes
  const getWorkModes = () => {
    if (!college.workMode?.length) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {college.workMode.slice(0, 3).map((mode, index) => (
          <span
            key={index}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/60 backdrop-blur-sm"
          >
            {mode}
          </span>
        ))}
        {college.workMode.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-600">+{college.workMode.length - 3}</span>
        )}
      </div>
    );
  };

  // Get company types
  const getCompanyTypes = () => {
    if (!college.companyType?.length) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {college.companyType.slice(0, 3).map((type, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full text-xs"
          >
            {type}
          </span>
        ))}
        {college.companyType.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-600">+{college.companyType.length - 3}</span>
        )}
      </div>
    );
  };

  // Get amenities/skills
  const getAmenitiesSkills = () => {
    const items = college.amenitiesRequired || college.skills || [];
    
    if (items.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {items.slice(0, 3).map((item, index) => (
          <span
            key={index}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/60 backdrop-blur-sm"
          >
            {item}
          </span>
        ))}
        {items.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-600">+{items.length - 3}</span>
        )}
      </div>
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className="
        w-full max-w-[350px] mx-auto rounded-2xl 
        border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden
        flex flex-col cursor-pointer h-full hover:scale-[1.02] bg-white
      "
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
            
            {/* Degree Types as colored badges */}
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
        {getEmploymentType()}

        {/* College Types */}
        {getCollegeTypes()}

        {/* Work Modes */}
        {getWorkModes()}

        {/* Company Types */}
        {getCompanyTypes()}

        {/* Amenities/Skills */}
        {getAmenitiesSkills()}

        {/* Description */}
        <div className="flex-1">
          <p className="text-sm text-gray-700 line-clamp-2">
            {description}
          </p>
        </div>
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