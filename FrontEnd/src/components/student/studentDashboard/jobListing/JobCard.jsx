import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, UserIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  const companyName =
    job.companyPosted?.companyName ||
    job.companyPosted?.companyDetails?.companyName ||
    "Company";

  const logo =
    job.companyPosted?.profileImageUrl ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeRfV9n69zxuV4DQX7sYF7ql8ajx47wLioPeP-m4qFbHLkD9UNwfQSneRtkQEDnx-QxFs&usqp=CAU";

  let statusColor = "";
  switch (job.jobStatus) {
    case "Open":
      statusColor = "bg-green-500 text-white";
      break;
    case "Closed":
      statusColor = "bg-red-500 text-white";
      break;
    case "Pending":
      statusColor = "bg-yellow-500 text-white";
      break;
    default:
      statusColor = "bg-gray-400 text-white";
  }

  return (
    <div className="bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition flex flex-col">

      <div className="flex justify-between items-start">
        {/* Logo */}
        <div className="w-16 h-16 bg-white rounded-xl shadow flex items-center justify-center overflow-hidden border">
          <img src={logo} alt="company logo" className="w-14 h-14 object-cover" />
        </div>

        {/* Status Pill */}
        <div className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
          {job.jobStatus}
        </div>
      </div>

      {/* Company Name */}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{companyName}</h3>

      <div className="mt-2 space-y-2 text-sm text-gray-700">

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-gray-500" />
          <span>{Array.isArray(job.location) ? job.location.join(", ") : job.location}</span>
        </div>

        {/* Employment Type */}
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <span className="font-medium">{job.employmentType}</span>
        </div>

        {/* Work Mode */}
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-5 w-5 text-gray-500" />
          <span>{job.workMode}</span>
        </div>

      </div>

      <p className="text-gray-700 mt-3 text-sm line-clamp-3">
        {job.description?.slice(0, 140)}
        {job.description?.length > 140 ? "..." : ""}
      </p>

      {/* TAG COLORS */}
      <div className="flex flex-wrap gap-2 mt-3">
        {(job?.tags || []).map((tag, idx) => {
          const pastelColors = [
            "bg-pink-100 text-pink-800 border-pink-200",
            "bg-blue-100 text-blue-800 border-blue-200",
            "bg-green-100 text-green-800 border-green-200",
            "bg-yellow-100 text-yellow-800 border-yellow-200",
            "bg-purple-100 text-purple-800 border-purple-200",
            "bg-indigo-100 text-indigo-800 border-indigo-200",
            "bg-teal-100 text-teal-800 border-teal-200",
            "bg-orange-100 text-orange-800 border-orange-200",
            "bg-rose-100 text-rose-800 border-rose-200",
            "bg-cyan-100 text-cyan-800 border-cyan-200",
            "bg-lime-100 text-lime-800 border-lime-200",
            "bg-amber-100 text-amber-800 border-amber-200",
          ];
          const randomColor =
            pastelColors[Math.floor(Math.random() * pastelColors.length)];

          return (
            <span
              key={idx}
              className={`px-2 py-1 text-xs rounded-md border ${randomColor}`}
            >
              {tag}
            </span>
          );
        })}
      </div>

      {/* BUTTON AT BOTTOM */}
      <Link
        to={`/${localStorage.getItem("selectedRole")}-dashboard/job-listing/${job._id}`}
        className="mt-5 block w-full text-center py-2 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
