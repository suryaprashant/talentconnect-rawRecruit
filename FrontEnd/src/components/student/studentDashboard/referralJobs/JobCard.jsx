import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  // Pastel colors
  const pastelColors = [
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-yellow-100 text-yellow-700",
    "bg-red-100 text-red-700",
  ];

  const getColor = (i) => pastelColors[i % pastelColors.length];

  const companyName =
    job.companyPosted?.companyDetails?.companyName || "Company";

  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition flex flex-col relative">

      {/* TITLE + COMPANY */}
      <Link
        to={`/${localStorage.getItem("selectedRole")}-dashboard/Referral/${job._id}`}
        className="block"
      >
        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
          {job.jobTitle}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{companyName}</p>
      </Link>

      {/* SKILLS / STREAMS */}
      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills.map((skill, i) => (
            <span
              key={i}
              className={`px-2 py-1 text-xs rounded-full ${getColor(i)}`}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* LOCATION + MODE ROW */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-700">

        {/* Location */}
        <div className="flex items-center">
          <MapPinIcon className="w-4 h-4 mr-1" />
          {Array.isArray(job.location) ? job.location.join(", ") : job.location}
        </div>

        {/* Work Mode */}
        <div className="flex items-center">
          <BriefcaseIcon className="w-4 h-4 mr-1" />
          {job.workMode}
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-4 text-sm text-gray-700 line-clamp-3">
        {job.description?.slice(0, 150)}
        {job.description && job.description.length > 150 ? "..." : ""}
      </p>

      {/* APPLY BUTTON (BLACK) */}
      <Link
        to={`/${localStorage.getItem("selectedRole")}-dashboard/Referral/${job._id}`}
        className="block w-full mt-5 py-2 text-center text-white bg-black rounded-xl hover:bg-gray-800 transition"
      >
        Apply now
      </Link>
    </div>
  );
};

export default JobCard;