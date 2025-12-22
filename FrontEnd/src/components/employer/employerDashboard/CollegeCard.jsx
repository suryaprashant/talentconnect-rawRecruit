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

const CollegeCard = ({ college }) => {
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

  return (
    <div className={`
      w-full max-w-[350px] min-h-[430px] mx-auto rounded-2xl 
      shadow-sm hover:shadow-lg transition overflow-hidden
      flex flex-col ${stableColor}
    `}>
      {/* FULL PASTEL CARD */}
      <div className="p-5 flex-grow flex flex-col h-full">

        {/* College Type + Save */}
        <div className="flex justify-between items-start">
          <span className="text-xs bg-white/90 text-gray-700 px-3 py-1 rounded-full font-medium">
            {degreeType}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="bg-white p-2 rounded-full shadow hover:shadow-md transition"
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? "text-red-500 fill-red-500" : "text-gray-600"}`}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* College Name + Logo */}
        <div className="mt-10 flex flex-col items-center gap-3">
          {/* Logo/Icon */}
          <div className="w-20 h-20 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* College Name */}
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-white font-semibold text-xl text-center">
              {collegeName}
            </h3>

            {/* College Type Badge */}
            <span className="text-sm font-medium text-white/90 bg-white/20 px-3 py-1 rounded-full border border-white/30">
              College
            </span>
          </div>
        </div>

        {/* Stats/Info Section */}
        <div className="mt-8 flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">50+</div>
            <div className="text-xs text-white/90 mt-1">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">1000+</div>
            <div className="text-xs text-white/90 mt-1">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">₹10L+</div>
            <div className="text-xs text-white/90 mt-1">Avg Package</div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 flex-grow">
          <p className="text-sm text-white/90 text-center line-clamp-3">
            {college.description 
              ? college.description.split(' ').slice(0, 20).join(' ') + (college.description.split(' ').length > 20 ? '...' : '')
              : 'Leading educational institution with excellent placement records and industry partnerships.'}
          </p>
        </div>

        {/* Location Info */}
        <div className="mt-6">
          <div className="flex items-center justify-center gap-2 text-white/90">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-sm">
              {college.location || 'Multiple Campuses'}
            </span>
          </div>
        </div>

        {/* Contact Button */}
        <div className="mt-8 pt-4 border-t border-white/30">
          <Link
            to={`/employer-dashboard/On-campus/${college.id}`}
            className="block w-full px-4 py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-100 transition shadow hover:shadow-md text-center"
          >
            Contact College
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CollegeCard;