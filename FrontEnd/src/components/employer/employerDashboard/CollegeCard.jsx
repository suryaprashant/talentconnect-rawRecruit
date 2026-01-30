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

const CollegeCard = ({ college, onClick }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!college) return null;

  // Extract data with multiple fallbacks - from first component
  const getCollegeName = () => {
    if (college.collegePosted?.collegeUniversityDetails?.collegeName) {
      return college.collegePosted.collegeUniversityDetails.collegeName;
    }
    if (college.collegeUniversityDetails?.collegeName) {
      return college.collegeUniversityDetails.collegeName;
    }
    if (college.name) {
      return college.name;
    }
    if (college.collegeName) {
      return college.collegeName;
    }
    return 'College';
  };

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

  // Get degree type (from second component)
  const getDegreeTypes = () => {
    if (college.degreeType && Array.isArray(college.degreeType)) {
      return college.degreeType;
    }
    if (college.collegeType) {
      return Array.isArray(college.collegeType) ? college.collegeType : [college.collegeType];
    }
    if (college.collegePosted?.collegeUniversityDetails?.collegeType) {
      const type = college.collegePosted.collegeUniversityDetails.collegeType;
      return Array.isArray(type) ? type : [type];
    }
    if (college.degree) {
      return Array.isArray(college.degree) ? college.degree : [college.degree];
    }
    return [];
  };

  const getLocation = () => {
    // First: Check root level location
    if (college.location) {
      if (Array.isArray(college.location)) {
        return college.location.slice(0, 2).join(', ');
      }
      return college.location;
    }
    
    // Second: Check college details
    const collegeDetails = college.collegePosted?.collegeUniversityDetails || college.collegeUniversityDetails || {};
    const locationParts = [
      collegeDetails.city,
      collegeDetails.state,
      collegeDetails.country
    ].filter(Boolean);
    
    if (locationParts.length > 0) {
      return locationParts.join(', ');
    }
    
    return 'Location not specified';
  };

  const getPackage = () => {
    if (college.avgPackage) {
      return college.avgPackage;
    }
    if (college.packageDetails?.totalCTC) {
      return college.packageDetails.totalCTC;
    }
    if (college.minPackage?.amount) {
      return college.minPackage.amount;
    }
    return null;
  };

  const getDescription = () => {
    if (college.description) {
      return college.description;
    }
    if (college.collegePosted?.collegeUniversityDetails?.description) {
      return college.collegePosted.collegeUniversityDetails.description;
    }
    return 'Leading educational institution with excellent placement records and industry partnerships.';
  };

  const getSpecializations = () => {
    if (college.specializations && Array.isArray(college.specializations)) {
      return college.specializations;
    }
    if (college.studentStreams && Array.isArray(college.studentStreams)) {
      return college.studentStreams;
    }
    if (college.degree && Array.isArray(college.degree)) {
      return college.degree;
    }
    return [];
  };

  // Get company type (from second component)
  const getCompanyTypes = () => {
    if (college.companyType && Array.isArray(college.companyType)) {
      return college.companyType;
    }
    if (college.companyTypes && Array.isArray(college.companyTypes)) {
      return college.companyTypes;
    }
    if (college.industryType) {
      return Array.isArray(college.industryType) ? college.industryType : [college.industryType];
    }
    return [];
  };

  // Get amenities (from second component)
  const getAmenities = () => {
    if (college.amenitiesRequired && Array.isArray(college.amenitiesRequired)) {
      return college.amenitiesRequired;
    }
    if (college.amenities && Array.isArray(college.amenities)) {
      return college.amenities;
    }
    if (college.facilities && Array.isArray(college.facilities)) {
      return college.facilities;
    }
    return [];
  };

  // Get employment type (from second component)
  const getEmploymentTypes = () => {
    if (college.employmentType && Array.isArray(college.employmentType)) {
      return college.employmentType;
    }
    if (college.employmentTypes && Array.isArray(college.employmentTypes)) {
      return college.employmentTypes;
    }
    if (college.jobType) {
      return Array.isArray(college.jobType) ? college.jobType : [college.jobType];
    }
    return [];
  };

  const getStats = () => {
    const stats = {};
    
    // Check multiple possible fields for stats
    if (college.numberOfStudent) {
      stats['Students'] = college.numberOfStudent;
    }
    if (college.studentsCount) {
      stats['Students'] = college.studentsCount;
    }
    if (college.establishedYear) {
      stats['Established'] = college.establishedYear;
    }
    if (college.facultyCount) {
      stats['Faculty'] = college.facultyCount;
    }
    if (college.noOfplacedStudents) {
      stats['Placements'] = college.noOfplacedStudents;
    }
    
    return Object.keys(stats).length > 0 ? stats : null;
  };

  const getTags = () => {
    if (college.tags && Array.isArray(college.tags)) {
      return college.tags;
    }
    if (college.badges && Array.isArray(college.badges)) {
      return college.badges;
    }
    return ['Top Rated', 'Placement Cell', 'Industry Connect'];
  };

  // Get college status based on dates (from second component)
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

  const handleContactClick = (e) => {
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
        "college" // You might need to adjust this based on your API
      );

      if (response?.data?.success === true) {
        setIsSaved(!isSaved);
        toast.success(isSaved ? "Removed from saved" : "Saved");
      } else {
        toast.error(response?.response?.data?.msg || "Unable to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Something went wrong!");
    }
  };

  const getInitials = (name = '') => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Now extract all data
  const collegeName = getCollegeName();
  const logo = getLogo();
  const degreeTypes = getDegreeTypes();
  const companyTypes = getCompanyTypes();
  const amenities = getAmenities();
  const employmentTypes = getEmploymentTypes();
  const location = getLocation();
  const avgPackage = getPackage();
  const description = getDescription();
  const specializations = getSpecializations();
  const stats = getStats();
  const tags = getTags();

  const stableColor = getStableColor(college._id || collegeName);
  const collegeStatus = getCollegeStatus();

  // Format package
  const formatPackage = () => {
    if (avgPackage) {
      return `₹${avgPackage.toLocaleString()}`;
    }
    return 'Not Disclosed';
  };

  // Get degree/specialization badges (combined from degreeTypes and specializations)
  const getDegreeBadges = () => {
    const allDegrees = [...new Set([...degreeTypes, ...specializations])];
    if (allDegrees.length === 0) return null;
    
    const roleColors = [
      "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
      "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200",
      "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 border-pink-200",
      "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200",
      "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-200",
    ];
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {allDegrees.slice(0, 3).map((item, index) => (
          <span 
            key={index} 
            className={`text-sm font-medium px-2 py-0.5 rounded-full border ${roleColors[index % roleColors.length]}`}
          >
            {item}
          </span>
        ))}
        {allDegrees.length > 3 && (
          <span className="text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
            +{allDegrees.length - 3}
          </span>
        )}
      </div>
    );
  };

  // Get employment type badge (from second component)
  const getEmploymentTypeBadge = () => {
    if (employmentTypes.length === 0) return null;
    
    return (
      <div className="mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold">
          {employmentTypes.join(', ')}
        </span>
      </div>
    );
  };

  // Get amenities as skills (from second component)
  const getAmenitiesBadges = () => {
    if (amenities.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {amenities.slice(0, 3).map((amenity, index) => (
          <span
            key={index}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/50"
          >
            {amenity}
          </span>
        ))}
        {amenities.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-600">+{amenities.length - 3}</span>
        )}
      </div>
    );
  };

  // Get company types (from second component)
  const getCompanyTypesBadges = () => {
    if (companyTypes.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {companyTypes.slice(0, 2).map((type, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full text-xs"
          >
            {type}
          </span>
        ))}
        {companyTypes.length > 2 && (
          <span className="px-2 py-1 text-xs text-gray-600">+{companyTypes.length - 2}</span>
        )}
      </div>
    );
  };

  // Get stats badges
  const getStatsBadges = () => {
    if (!stats) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {Object.entries(stats).slice(0, 3).map(([key, value], index) => (
          <span
            key={index}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/50"
          >
            {value} {key}
          </span>
        ))}
      </div>
    );
  };

  // Get tags badges
  const getTagsBadges = () => {
    if (tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/50"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-600">+{tags.length - 3}</span>
        )}
      </div>
    );
  };

  // Check if we should show college initials
  const shouldShowInitials = !logo || imageError;

  return (
    <div 
      onClick={handleCardClick}
      className="
        w-full max-w-[350px] mx-auto rounded-2xl 
        border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden
        flex flex-col cursor-pointer h-full hover:scale-[1.02] bg-white
        flex-grow
      "
    >
      {/* TOP SECTION - Pastel background */}
      <div className={`${stableColor} p-4 flex-grow flex flex-col min-h-[280px]`}>
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

        {/* College Name + Degree Badges */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1 pr-2 min-w-0">
            <h3 className="text-black font-semibold text-lg truncate">
              {collegeName}
            </h3>
            
            {/* Degree/Specialization Badges */}
            {getDegreeBadges()}
          </div>

          {/* Logo/Initials Container */}
          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border border-gray-300 shrink-0">
            {logo && !imageError ? (
              <img 
                src={logo} 
                alt={`${collegeName} logo`}
                className="w-12 h-12 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-700">
                  {getInitials(collegeName)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Employment Type Badge (from second component) */}
        {getEmploymentTypeBadge()}

        {/* Amenities Badges (from second component) */}
        {getAmenitiesBadges()}

        {/* Company Types Badges (from second component) */}
        {getCompanyTypesBadges()}

        {/* Stats Badges */}
        {/* {getStatsBadges()} */}

        {/* Tags Badges */}
        {getTagsBadges()}

        {/* Description */}
        <div className="flex-grow mt-3">
          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION - White background */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="min-w-0 flex-1">
            {/* Average Package */}
            <p className="font-semibold text-gray-900 text-sm truncate mb-2">
              {formatPackage()} avg
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-700 text-xs">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="line-clamp-1 truncate">
                {location}
              </span>
            </div>
          </div>

          <button
            onClick={handleContactClick}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap flex-shrink-0 ml-2 h-fit"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;