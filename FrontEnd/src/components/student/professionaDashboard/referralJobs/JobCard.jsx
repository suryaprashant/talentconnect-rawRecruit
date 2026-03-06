{/*import { useState } from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, userType }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
   
  };

 
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
     
      <div className="absolute top-4 right-4 flex items-center space-x-2">
       
      

        <button
          onClick={toggleSave}
          className="text-gray-400 hover:text-blue-500 focus:outline-none"
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          {isSaved ? (
            
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          ) : (
           
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-5">
        <div className="flex flex-col mb-2">
        
          <Link to={`/${localStorage.getItem('selectedRole')}-dashboard/Referral/${job._id}`} className="block ">
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-1">
              {job.jobTitle} Intern
            </h3>
          
            <p className="text-sm text-gray-600">{job.companyPosted?.companyDetails?.companyName}</p>
          </Link>
        </div>

       
        <div className="flex flex-wrap text-sm text-gray-600 mb-2">
       
          <span className="mr-3 capitalize">{Array.isArray(job.location) ? job.location.join(', ') : job.location}</span>
          <span className="mr-3">•</span>
          <span className="mr-3 capitalize">{job.employmentType}</span>
          <span className="mr-3">•</span>
          <span className='capitalize'>{job.workMode}</span>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          
          {job.description?.slice(0, 150)}{job.description && job.description.length > 150 ? '...' : ''}
        </p>

      
        <Link
          to={`/${localStorage.getItem('selectedRole')}-dashboard/Referral/${job._id}`}
          className="block w-full py-2 text-center text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Apply now
        </Link>
      </div>
    </div>
  );
};

export default JobCard;*/}
import { useState } from "react";
//import { Link } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Heart } from 'lucide-react';
import { SaveOppurtunity } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";

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

const JobCard = ({ job, onClick }) => {
  const { user, loading } = useAuth();
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [imageError, setImageError] = useState(false);

   const role = user?.userType;
const navigate = useNavigate();
  // Remove the undefined loading and user variables
  const companyName =
  job?.jobType === "Referral"
    ? job?.candidatePosted?.currentCompany || "Referral"
    : job?.companyName ||
      job?.collegeName ||
      job?.companyPosted?.companyDetails?.companyName ||
      "Company";

  const logo = job?.jobType === "Referral"
    ? job?.candidatePosted?.profileImage 
              : job?.collegePosted?.profileImage ||
               job?.collegePosted?.profileImageUrl ||
               "https://cdn-icons-png.flaticon.com/512/25/25231.png";

  const stableColor = getStableColor(job._id || companyName);

  const handleCardClick = (e) => {
    // Don't trigger if clicking on save button or details button
    console.log('🟡 JobCard clicked:', job._id);
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
      // Check if job has jobType, otherwise default to "Off-campus"
      const jobType = job?.jobType || "Off-campus";
      const response = await SaveOppurtunity(job._id, jobType);
  
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

  const getInitials = (name = '') => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Format location
  const formatLocation = () => {
    if (Array.isArray(job.location)) {
      return job.location.slice(0, 2).join(', ');
    }
    if (job.venue) {
      return job.venue;
    }
    if (job.workLocation && Array.isArray(job.workLocation)) {
      return job.workLocation.slice(0, 2).join(', ');
    }
    return job.location || "Remote";
  };

  // Format package details
  const formatPackage = () => {
    if (job.packageDetails?.totalCTC) {
      const currency = job.packageDetails.currency || '₹';
      return `${currency} ${job.packageDetails.totalCTC.toLocaleString()}`;
    }
    return 'Not Disclosed';
  };

  // Get job status (Upcoming/Active/Completed)
  const getJobStatus = () => {
    if (!job?.startDate || !job?.endDate) {
      return { status: 'Not Scheduled', color: 'bg-gray-100 text-gray-700' };
    }
    
    const now = new Date();
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);

    if (now < startDate) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Active', color: 'bg-green-100 text-green-700' };
    } else {
      return { status: 'Completed', color: 'bg-gray-100 text-gray-700' };
    }
  };

  // Get colored badges for job roles
  const getJobRoleBadges = () => {
    if (!job.jobRoles?.length) {
      // Try to get jobTitle or lookingFor as fallback
      const title = job.jobTitle || job.lookingFor || "Job Role";
      return (
        <span className="text-sm font-bold text-gray-900">
          {title}
        </span>
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

  // Get description text
  const getDescription = () => {
    return job.description || 
           job.jobDescription || 
           `${companyName} is hiring for various positions.`;
  };

  // Get user role for navigation
  const getUserRole = () => {
    // Try to get from localStorage
    const storedRole = localStorage.getItem("selectedRole");
    if (storedRole) return storedRole;
    
    // Default to 'college' if not found
    return 'college';
  };

  const jobStatus = getJobStatus();
  const userRole = getUserRole();
  const description = getDescription();
  
  // Determine job type for routing
  const jobType = job?.jobType || "Off-campus";
  const routePath = `/${userRole}-dashboard/${jobType}/${job._id}`;

  return (
    <div 
      onClick={handleCardClick}
      className="
        w-full max-w-[350px] mx-auto rounded-2xl 
        border shadow-sm hover:shadow-lg transition overflow-hidden
        flex flex-col cursor-pointer h-full
      "
    >
      {/* TOP SECTION - Pastel background */}
      <div className={`${stableColor} p-4 flex-1 flex flex-col`}>
        {/* Status + Save */}
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs ${jobStatus.color} px-3 py-1 rounded-full font-medium`}>
            {jobStatus.status}
          </span>

          <button
            onClick={handleSave}
            className="bg-white p-2 rounded-full shadow hover:shadow-md transition z-10"
            aria-label={isSaved ? "Remove from saved" : "Save job"}
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
          </div>

          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border shrink-0">
            {logo && !imageError ? (
              <img 
                src={logo} 
                alt={`${companyName} logo`}
                className="w-12 h-12 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700">
                  {getInitials(companyName)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Urgent Hiring Badge */}
        {job.urgent && (
          <div className="mb-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-full text-xs font-semibold">
              Urgent Hiring
            </span>
          </div>
        )}

        {/* Employment Type Badge */}
        {job.employmentType && (
          <div className="mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold">
              {Array.isArray(job.employmentType) ? job.employmentType.join(', ') : job.employmentType}
            </span>
          </div>
        )}

        {/* Skills */}
        {job.skills?.length > 0 && (
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
        )}

        {/* Company Types (if available in job object) */}
        {job.companyType?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {job.companyType.slice(0, 2).map((type, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full text-xs"
              >
                {type}
              </span>
            ))}
            {job.companyType.length > 2 && (
              <span className="px-2 py-1 text-xs text-gray-600">+{job.companyType.length - 2}</span>
            )}
          </div>
        )}

        {/* Description */}
        <div className="flex-1">
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

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-700 text-xs mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="line-clamp-1 max-w-[120px]">
                {formatLocation()}
              </span>
            </div>
          </div>

          <Link
          to={`/${role}-dashboard/job-listing/${job._id}`}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          Details
        </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard
