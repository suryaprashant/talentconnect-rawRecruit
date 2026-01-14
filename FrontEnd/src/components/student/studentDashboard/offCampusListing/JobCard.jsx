import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, HeartIcon } from "@heroicons/react/24/outline";

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
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  const companyName =
    job.companyPosted?.companyName ||
    job.companyPosted?.companyDetails?.companyName ||
    "Company";

  const logo =
    job.companyPosted?.profileImageUrl ||
    "https://cdn-icons-png.flaticon.com/512/25/25231.png";

  const stableColor = getStableColor(job._id || companyName);

  return (
    <div className="
      w-full max-w-[350px] min-h-[430px] mx-auto rounded-2xl 
      border shadow-sm hover:shadow-lg transition overflow-hidden
      flex flex-col
    ">

      {/* TOP SECTION */}
      <div className={`${stableColor} p-4 pb-6 rounded-b-2xl flex-grow`}>

        {/* Date + Save */}
        <div className="flex justify-between items-start">
          <span className="text-xs bg-white px-3 py-1 rounded-full font-medium">
            {new Date(job?.createdAt).toLocaleDateString()}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="bg-white p-2 rounded-full shadow"
          >
            <HeartIcon
              className={`h-5 w-5 ${isSaved ? "text-red-500" : "text-gray-600"}`}
            />
          </button>
        </div>

        {/* Company + Job Roles (Updated) */}
        <div className="mt-3 flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-black font-semibold text-lg">
              {companyName}
            </h3>

            {/* Display ALL Job Roles in small font */}
            <div className="flex flex-wrap gap-1 mt-1">
              {job.jobRoles && job.jobRoles.length > 0 ? (
                job.jobRoles.map((role, index) => (
                  <span 
                    key={index} 
                    className="text-sm font-bold text-gray-900 bg-white/40 px-2 py-0.5 rounded border border-black/5"
                  >
                    {role}
                  </span>
                ))
              ) : (
                <span className="text-sm font-bold text-gray-900">
                   {job.jobTitle || "Job Role"}
                </span>
              )}
            </div>
          </div>

          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border shrink-0">
            <img src={logo} alt="logo" className="w-12 h-12 object-cover" />
          </div>
        </div>

        {/* Urgent Hiring */}
        {job.urgent && (
          <div className="mt-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-full text-xs font-semibold">
              Urgent Hiring
            </span>
          </div>
        )}

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
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

      </div>

      {/* BOTTOM SECTION */}
      <div className="p-4 bg-white flex justify-between items-center border-t">

        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {job.packageDetails?.totalCTC ? `₹${job.packageDetails.totalCTC}` : "Not Disclosed"}
          </p>

          <div className="flex items-center gap-1 text-gray-700 text-xs mt-1">
            <MapPinIcon className="h-4 w-4 text-gray-500" />
            <span className="line-clamp-1 max-w-[120px]">
              {Array.isArray(job.location)
                ? job.location.join(", ")
                : job.location || "Remote"}
            </span>
          </div>
        </div>

        <Link
          to={`/${localStorage.getItem("selectedRole")}-dashboard/Off-campus/${job._id}`}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          Details 
        </Link>

      </div>

    </div>
  );
};

export default JobCard;