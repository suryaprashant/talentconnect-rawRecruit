import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const JobCard = ({ job, userType }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  // Pastel Colors
  const pastelColors = [
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-yellow-100 text-yellow-700",
    "bg-red-100 text-red-700",
  ];
  const getColor = (i) => pastelColors[i % pastelColors.length];

  // Job Status Styling
  const statusMap = {
    Open: "bg-green-100 text-green-800",
    Closed: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };
  const statusClasses = statusMap[job.jobStatus] || "bg-gray-100 text-gray-800";

  const companyName =
    job.companyPosted?.companyDetails?.companyName || "Company";

  return (
    <div className="bg-white rounded-xl shadow p-5 border flex flex-col relative">

      {/* STATUS BADGE */}
      <div className="absolute top-4 right-4">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
          {job.jobStatus}
        </div>
      </div>

      {/* TITLE + COMPANY */}
      <Link
        to={`/${localStorage.getItem("selectedRole")}-dashboard/Internship/${job._id}`}
      >
        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
          {job.jobTitle}
        </h3>
        <p className="text-sm text-gray-600">{companyName}</p>
      </Link>

      {/* COLORED TAGS for Streams / Skills */}
      {/* STREAMS */}
      {job.studentStreams?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.studentStreams.map((stream, i) => (
            <span
              key={i}
              className={`px-2 py-1 text-xs rounded-full ${getColor(i)}`}
            >
              {stream}
            </span>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills.map((skill, i) => (
            <span
              key={i}
              className={`px-2 py-1 text-xs rounded-full ${getColor(i + 2)}`}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* LOCATION + MODE (NO COLOR BG — ICON BASED) */}
      <div className="mt-4 space-y-1 text-sm text-gray-700">

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-gray-500" />
          <span>
            {Array.isArray(job.location)
              ? job.location.join(", ")
              : job.location}
          </span>
        </div>

        {/* Mode */}
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="w-4 h-4 text-gray-500" />
          <span className="capitalize">{job.workMode}</span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-3 text-gray-700 text-sm line-clamp-3">
        {job.description
          ? job.description.slice(0, 150) +
          (job.description.length > 150 ? "..." : "")
          : "No description available."}
      </p>

      {/* APPLY BUTTON */}
      <Link
        to={`/${localStorage.getItem("selectedRole")}-dashboard/Internship/${job._id}`}
        className="block w-full mt-5 py-2 text-center text-white bg-black rounded-md hover:bg-gray-800"
      >
        Apply now
      </Link>
    </div>
  );
};

export default JobCard;
