import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Banknote, Calendar, Heart, Home, Monitor, Building2, Building, User } from 'lucide-react';

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

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!job) return null;

  // Get work mode details with updated colors
  const getWorkModeDetails = () => {
    const workMode = job.workMode && typeof job.workMode === 'string' 
      ? job.workMode.toLowerCase() 
      : 'not specified';
    
    switch (workMode) {
      case 'remote':
        return {
          label: 'Remote',
          icon: Home,
          color: 'bg-blue-100 text-blue-700',
        };
      case 'hybrid':
        return {
          label: 'Hybrid',
          icon: Monitor,
          color: 'bg-purple-100 text-purple-700',
        };
      case 'onsite':
      case 'on-site':
        return {
          label: 'On-Site',
          icon: Building2,
          color: 'bg-green-100 text-green-700',
        };
      case 'office':
        return {
          label: 'Office',
          icon: Building,
          color: 'bg-orange-100 text-orange-700',
        };
      default:
        return {
          label: workMode === 'not specified' ? 'Not specified' : 
                 workMode.charAt(0).toUpperCase() + workMode.slice(1),
          icon: Building,
          color: 'bg-gray-100 text-gray-700',
        };
    }
  };

  // Format package details
  const formatPackage = () => {
    if (job.package && job.package !== 'Not specified') {
      return job.package;
    }
    return 'Package not specified';
  };

  // Format location
  const formatLocation = () => {
    if (job.location && job.location !== 'Not specified') {
      return job.location;
    }
    return 'Location not specified';
  };

  // Format streams
  const formatStreams = () => {
    if (job.streams && job.streams.length > 0 && job.streams[0] !== 'Not specified') {
      return job.streams.slice(0, 2);
    }
    return [];
  };

  // Format hiring process steps
  const formatHiringProcess = () => {
    if (job.hiringProcess && job.hiringProcess.length > 0 && job.hiringProcess[0] !== 'Not specified') {
      if (typeof job.hiringProcess === 'string') {
        const steps = job.hiringProcess.split(' + ');
        return steps.slice(0, 3);
      }
      return job.hiringProcess.slice(0, 3);
    }
    return [];
  };

  const workModeDetails = getWorkModeDetails();
  const WorkModeIcon = workModeDetails.icon;
  const shouldDisplayWorkMode = job.workMode && 
                               job.workMode !== 'Not specified' && 
                               job.workMode !== 'not specified' &&
                               workModeDetails.label !== 'Not specified';

  const streams = formatStreams();
  const hiringProcess = formatHiringProcess();
  const stableColor = getStableColor(job.id || job.companyName);

  // Get initials for logo fallback
  const getInitials = (name = '') => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div className={`
      w-full max-w-[350px] min-h-[430px] mx-auto rounded-2xl 
      border shadow-sm hover:shadow-lg transition overflow-hidden
      flex flex-col ${stableColor}
    `}>
      {/* FULL PASTEL CARD */}
      <div className="p-5 flex-grow flex flex-col">

        {/* Work Mode + Save */}
        <div className="flex justify-between items-start">
          {shouldDisplayWorkMode && (
            <span className={`text-xs ${workModeDetails.color} px-3 py-1 rounded-full font-medium`}>
              {workModeDetails.label}
            </span>
          )}
          
          {!shouldDisplayWorkMode && <div className="h-6"></div>}

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

        {/* Company Name + Position */}
        <div className="mt-4 flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-black font-semibold text-lg truncate max-w-[200px]">
              {job.companyName}
            </h3>

            {/* Position */}
            <div className="flex flex-wrap gap-1 mt-1">
              <span 
                className="text-sm font-bold text-gray-900 bg-white/50 px-2 py-0.5 rounded border border-white/50"
              >
                {job.position || 'Position not specified'}
              </span>
            </div>
          </div>

          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border shrink-0">
            <img 
              src={job.logo || "https://via.placeholder.com/48"}
              alt={`${job.companyName} logo`}
              className="w-12 h-12 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/48";
                setImageError(true);
              }}
            />
          </div>
        </div>

        {/* Streams */}
        {streams.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {streams.map((stream, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/70 text-blue-800 border border-white/80 rounded-full text-xs"
                >
                  {stream}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Date Range */}
        {job.startDate && job.endDate && (
          <div className="mt-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-600" />
              <span className="text-xs text-gray-800">
                {new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        )}

        {/* Hiring Process */}
        {hiringProcess.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {hiringProcess.map((step, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-white/80 text-gray-800 rounded-full text-xs bg-white/60"
              >
                {step}
              </span>
            ))}
          </div>
        )}

        {/* Venue */}
        {job.venue && (
          <div className="mt-4">
            <div className="flex items-center gap-1">
              <Building className="h-3 w-3 text-gray-600" />
              <span className="text-xs text-gray-800 truncate">
                {job.venue}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        {job.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {job.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/70 text-gray-800 border border-white/80 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-700">+{job.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Description - Fixed height */}
        <div className="mt-4 flex-grow">
          <p className="text-sm text-gray-800 line-clamp-3">
            {job.description 
              ? job.description.split(' ').slice(0, 20).join(' ') + (job.description.split(' ').length > 20 ? '...' : '')
              : 'No description provided.'}
          </p>
        </div>

        {/* BOTTOM SECTION WITH PACKAGE AND BUTTON */}
        <div className="mt-6 pt-4 border-t border-white/50 flex justify-between items-center">
          <div>
            {/* Package */}
            <p className="font-semibold text-gray-900 text-sm">
              {job.package && job.package !== 'Not specified' 
                ? job.package
                : "Not Disclosed"}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-800 text-xs mt-1">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="line-clamp-1 max-w-[120px]">
                {formatLocation()}
              </span>
            </div>
          </div>

          <Link
            to={`/college-dashboard/Pool-campus/${job.id}`}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
};

export default JobCard;