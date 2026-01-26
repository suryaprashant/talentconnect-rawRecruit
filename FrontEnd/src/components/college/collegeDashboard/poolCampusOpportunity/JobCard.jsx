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

const JobCard = ({ job, onClick }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!job) return null;

  // Extract data from the job object with proper fallbacks
  const companyDetails = job.companyPosted?.companyDetails || {};
  const companyName = companyDetails.companyName || 
                     job.companyName || 
                     'Company';
  
  const logo = job.companyPosted?.profileImageUrl || 
             companyDetails.logo || 
             job.logo || 
             null;

  // Get status based on dates
  const getJobStatus = () => {
    const now = new Date();
    const startDate = job.startDate ? new Date(job.startDate) : null;
    const endDate = job.endDate ? new Date(job.endDate) : null;

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
      onClick(job);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    
    // Use onClick prop if provided
    if (onClick && typeof onClick === 'function') {
      onClick(job);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await SaveOppurtunity(
        job._id,        
        job.jobType || "Pool-campus"
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

  // Format location - combine venue and workLocation
  const formatLocation = () => {
    const locationParts = [];
    
    // Add venue if available
    if (job.venue && job.venue !== 'Not specified') {
      locationParts.push(job.venue);
    }
    
    // Add work location if available
    if (Array.isArray(job.workLocation) && job.workLocation.length > 0) {
      const workLoc = job.workLocation.slice(0, 2).join(', ');
      if (!locationParts.includes(workLoc)) {
        locationParts.push(workLoc);
      }
    }
    
    // Add location string if available
    if (typeof job.location === 'string' && job.location !== 'Not specified') {
      if (!locationParts.includes(job.location)) {
        locationParts.push(job.location);
      }
    }
    
    // Return combined location or default
    return locationParts.length > 0 
      ? locationParts.slice(0, 2).join(' • ') 
      : 'Location not specified';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Format package details
  const formatPackage = () => {
    if (job.packageDetails?.totalCTC) {
      const currency = job.packageDetails.currency || '₹';
      return `${currency}${job.packageDetails.totalCTC.toLocaleString()}`;
    }
    if (job.package && typeof job.package === 'string' && job.package.includes('₹')) {
      return job.package;
    }
    return 'Not Disclosed';
  };

  // Get description text
  const getDescription = () => {
    return job.description || 
           job.jobDescription || 
           companyDetails.description ||
           `${companyName} is hiring for various positions.`;
  };

  const jobStatus = getJobStatus();
  const stableColor = getStableColor(job._id || companyName);
  const description = getDescription();

  // Get colored badges for job roles
  const getJobRoleBadges = () => {
    if (!job.jobRoles?.length) {
      // Try to get position or jobTitle as fallback
      const position = job.position || job.jobTitle || "Job Role";
      return (
        <div className="flex flex-wrap gap-1 mt-2">
          <span className="text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
            {position}
          </span>
        </div>
      );
    }
    
    const roleColors = [
      "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
      "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200",
      "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 border-pink-200",
      "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200",
      "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-200",
    ];
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {job.jobRoles.slice(0, 3).map((role, index) => (
          <span 
            key={index} 
            className={`text-sm font-medium px-2 py-0.5 rounded-full border ${roleColors[index % roleColors.length]}`}
          >
            {role}
          </span>
        ))}
        {job.jobRoles.length > 3 && (
          <span className="text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
            +{job.jobRoles.length - 3}
          </span>
        )}
      </div>
    );
  };

  // Get student streams badges
  const getStreamBadges = () => {
    if (!job.studentStreams?.length && !job.streams?.length) return null;
    
    const streams = job.studentStreams || job.streams || [];
    const streamColors = [
      "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
      "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200",
      "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 border-pink-200",
    ];
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {streams.slice(0, 2).map((stream, index) => (
          <span 
            key={index} 
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${streamColors[index % streamColors.length]}`}
          >
            {stream}
          </span>
        ))}
        {streams.length > 2 && (
          <span className="text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
            +{streams.length - 2}
          </span>
        )}
      </div>
    );
  };

  // Get work mode badge
  const getWorkModeBadge = () => {
    if (!job.workMode) return null;
    
    return (
      <div className="mt-1">
        <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
          {Array.isArray(job.workMode) ? job.workMode.join(', ') : job.workMode}
        </span>
      </div>
    );
  };

  // Get skills badges
  const getSkillsBadges = () => {
    if (!job.skills?.length) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {job.skills.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/50"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-600">+{job.skills.length - 3}</span>
        )}
      </div>
    );
  };

  // Get selection process badges
  const getSelectionProcessBadges = () => {
    if (!job.selectionProcess?.length && !job.hiringProcess?.length) return null;
    
    const process = job.selectionProcess || job.hiringProcess || [];
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {process.slice(0, 2).map((step, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-300 rounded-full text-xs"
          >
            {step}
          </span>
        ))}
        {process.length > 2 && (
          <span className="px-2 py-1 text-xs text-gray-600">+{process.length - 2}</span>
        )}
      </div>
    );
  };

  // Get employment type badge
  const getEmploymentTypeBadge = () => {
    if (!job.employmentType?.length) return null;
    
    return (
      <div className="mb-3">
        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold">
          {Array.isArray(job.employmentType) ? job.employmentType.join(', ') : job.employmentType}
        </span>
      </div>
    );
  };

  // Get company type badges (similar to amenities in CollegeCard)
  // Get company type badges (similar to amenities in CollegeCard)
const getCompanyTypeBadges = () => {
  // Safely get types, handling strings, arrays, or undefined
  let types = [];
  
  if (companyDetails.companyType) {
    if (Array.isArray(companyDetails.companyType)) {
      types = companyDetails.companyType;
    } else if (typeof companyDetails.companyType === 'string') {
      types = [companyDetails.companyType];
    }
  } else if (companyDetails.industryType) {
    if (Array.isArray(companyDetails.industryType)) {
      types = companyDetails.industryType;
    } else if (typeof companyDetails.industryType === 'string') {
      types = [companyDetails.industryType];
    }
  }
  
  if (types.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {types.slice(0, 2).map((type, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-300 rounded-full text-xs"
        >
          {type}
        </span>
      ))}
      {types.length > 2 && (
        <span className="px-2 py-1 text-xs text-gray-600">+{types.length - 2}</span>
      )}
    </div>
  );
};

  return (
    <div 
      onClick={handleCardClick}
      className="
        w-full max-w-[350px] mx-auto rounded-2xl 
        border shadow-sm hover:shadow-lg transition overflow-hidden
        flex flex-col cursor-pointer h-full min-h-[360px]
      "
    >
      {/* TOP SECTION - Pastel background */}
      <div className={`${stableColor} p-4 flex-1 flex flex-col min-h-[240px]`}>
        {/* Status + Save */}
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs ${jobStatus.color} px-3 py-1 rounded-full font-medium`}>
            {jobStatus.status}
          </span>

          <button
            onClick={handleSave}
            className="bg-white p-2 rounded-full shadow hover:shadow-md transition z-10"
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? "text-red-500 fill-red-500" : "text-gray-600"}`}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Company Name + Job Roles */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1 pr-2">
            <h3 className="text-black font-semibold text-lg truncate">
              {companyName}
            </h3>
            
            {/* Job Roles as colored badges */}
            {getJobRoleBadges()}
            
            {/* Stream badges */}
            {getStreamBadges()}
            
            {/* Work mode badge */}
            {getWorkModeBadge()}
          </div>

          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border shrink-0">
  {/* Only show image if logo exists and is a valid URL */}
  {logo && logo.startsWith('http') && !imageError ? (
    <img 
      src={logo} 
      alt={`${companyName} logo`}
      className="w-12 h-12 object-cover"
      onError={() => setImageError(true)}
    />
  ) : (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
      <span className="text-lg font-bold text-blue-700">
        {getInitials(companyName)}
      </span>
    </div>
  )}
</div>
        </div>

        {/* Employment Type Badge */}
        {getEmploymentTypeBadge()}

        {/* Company Type Badges */}
        {getCompanyTypeBadges()}

        {/* Skills */}
        {getSkillsBadges()}

        {/* Selection Process */}
        {getSelectionProcessBadges()}

        {/* Urgent Hiring Badge */}
        {job.urgent && (
          <div className="mb-3">
            <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-300 rounded-full text-xs font-semibold">
              Urgent Hiring
            </span>
          </div>
        )}

        {/* Description */}
        <div className="flex-1 mt-2">
          <p className="text-sm text-gray-700 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION - White background */}
      <div className="p-4 bg-white border-t">
        <div className="flex justify-between items-center">
          <div>
            {/* Package */}
            <p className="font-semibold text-gray-900 text-sm">
              {formatPackage()}
            </p>

            {/* Location with venue included */}
            <div className="flex items-center gap-1 text-gray-700 text-xs mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="line-clamp-1 max-w-[120px]">
                {formatLocation()}
              </span>
            </div>
          </div>

          <button
            onClick={handleDetailsClick}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;