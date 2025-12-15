import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, HeartIcon } from "@heroicons/react/24/outline";

const pastelColors = [
  "bg-pink-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-indigo-100",
  "bg-teal-100",
  "bg-rose-100",
  "bg-cyan-100",
  "bg-lime-100",
];

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
          to={`/${localStorage.getItem("selectedRole")}-dashboard/job-listing/${job._id}`}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          Details
        </Link>

      </div>

    </div>
  );
};

export default JobCard;