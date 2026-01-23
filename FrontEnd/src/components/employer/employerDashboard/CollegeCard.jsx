import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';

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

const CollegeCard = ({ college, onClick, compact = false }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!college) return null;

  const collegeName = college.name || 'College';
  const degreeType = college.degreeType || 'Degree';
  const stableColor = getStableColor(college.id || collegeName);

  // Get initials for fallback
  const getInitials = (name = '') => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const handleCardClick = (e) => {
    // Don't trigger if clicking on save button
    if (e.target.closest('button')) {
      return;
    }
    
    // Use onClick prop if provided
    if (onClick && typeof onClick === 'function') {
      onClick(college);
    }
  };

  const handleContactClick = (e) => {
    e.stopPropagation();
    
    // Use onClick prop if provided
    if (onClick && typeof onClick === 'function') {
      onClick(college);
    }
  };

  // Format location
  const formatLocation = () => 
    college.location || 'Location not specified';

  // Format package details
  const formatPackage = () => {
    if (college.avgPackage) {
      return `₹${college.avgPackage.toLocaleString()}`;
    }
    return 'Not Disclosed';
  };

  // Get description text
  const getDescription = () => {
    return college.description || 
           'Leading educational institution with excellent placement records and industry partnerships.';
  };

  // College badges - similar to job roles
  const collegeBadges = college.badges || [];
  const defaultBadges = ['Top Rated', 'Placement Cell', 'Industry Connect'];
  const displayBadges = collegeBadges.length > 0 ? collegeBadges : defaultBadges;

  const description = getDescription();

  return (
    <div 
      onClick={handleCardClick}
      className="
        w-full max-w-[350px] mx-auto rounded-2xl 
        border shadow-sm hover:shadow-lg transition overflow-hidden
        flex flex-col cursor-pointer h-full min-h-[400px]
      "
    >
      {/* TOP SECTION - Pastel background */}
      <div className={`${stableColor} p-4 flex-1 flex flex-col min-h-[280px]`}>
        {/* Degree Type + Save */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs bg-white/90 text-gray-700 px-3 py-1 rounded-full font-medium">
            {degreeType}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className="bg-white p-2 rounded-full shadow hover:shadow-md transition z-10"
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? "text-red-500 fill-red-500" : "text-gray-600"}`}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* College Name + Logo */}
        <div className="flex justify-between items-start gap-2 mb-4">
          <div className="flex-1 pr-2">
            <h3 className="text-black font-semibold text-lg truncate mb-2">
              {collegeName}
            </h3>

            {/* College Badges */}
            {displayBadges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {displayBadges.slice(0, 3).map((badge, index) => {
                  const badgeColors = [
                    "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700",
                    "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700",
                    "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700",
                    "bg-gradient-to-r from-green-100 to-green-50 text-green-700",
                    "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700",
                  ];
                  const colorClass = badgeColors[index % badgeColors.length];
                  
                  return (
                    <span 
                      key={index} 
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${colorClass}`}
                    >
                      {badge}
                    </span>
                  );
                })}
                {displayBadges.length > 3 && (
                  <span className="text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-1 rounded-full border">
                    +{displayBadges.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* College Logo */}
          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border shrink-0">
            {college.logo && !imageError ? (
              <img 
                src={college.logo} 
                alt={`${collegeName} logo`}
                className="w-12 h-12 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* College Type Badge */}
        {college.type && (
          <div className="mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold">
              {Array.isArray(college.type) ? college.type.join(', ') : college.type}
            </span>
          </div>
        )}

        {/* Streams/Specializations */}
        {college.specializations?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {college.specializations.slice(0, 3).map((specialization, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-xs"
              >
                {specialization}
              </span>
            ))}
            {college.specializations.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-600">+{college.specializations.length - 3}</span>
            )}
          </div>
        )}

        {/* Stats */}
        {college.stats && (
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(college.stats).slice(0, 3).map(([key, value], index) => (
              <span
                key={index}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/50"
              >
                {value} {key}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {college.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {college.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {college.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-600">+{college.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Description - Made this section more prominent */}
        <div className="flex-1 mb-2">
          <p className="text-sm text-gray-700 line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION - White background */}
      <div className="p-4 bg-white border-t">
        <div className="flex justify-between items-center">
          <div>
            {/* Average Package */}
            <p className="font-semibold text-gray-900 text-sm">
              {formatPackage()} avg
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-700 text-xs mt-1">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="line-clamp-1 max-w-[120px]">
                {formatLocation()}
              </span>
            </div>
          </div>

          <button
            onClick={handleContactClick}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;