import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

const JobCard = ({ job, onClick }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

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
    <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition flex flex-col" onClick={() => onClick(job._id)}>

      {/* TOP SECTION */}
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 bg-white rounded-xl shadow flex items-center justify-center overflow-hidden border">
          <img src={logo} alt="logo" className="w-14 h-14 object-cover" />
        </div>

        <div className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
          {job.jobStatus}
        </div>
      </div>

      {/* Company Name */}
      <h3 className="mt-4 text-lg font-semibold">{companyName}</h3>

      {/* Streams (PASTEL) */}
      {job.studentStreams?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.studentStreams.map((s, i) => (
            <span key={i} className={`px-2 py-1 text-xs rounded-full ${getColor(i)}`}>
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Skills (PASTEL) */}
      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills.map((skill, i) => (
            <span key={i} className={`px-2 py-1 text-xs rounded-full ${getColor(i + 2)}`}>
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* ---------- NEW POSITION OF JOB MODE ---------- */}
      {job.workMode && (
        <div className="mt-3 flex items-center text-sm text-gray-700">
          <BriefcaseIcon className="w-4 h-4 mr-2" />
          {job.workMode}
        </div>
      )}

      {/* LOCATION (ICON STYLE) */}
      <div className="mt-2 flex items-center text-sm text-gray-700">
        <MapPinIcon className="w-4 h-4 mr-2" />
        {Array.isArray(job.location) ? job.location.join(", ") : job.location}
      </div>

      {/* Salary */}
      <div className="mt-4 flex items-center text-sm">
        <span className="font-semibold mr-1">{job.packageDetails?.currency}</span>
        {job.packageDetails?.totalCTC || "Not mentioned"}
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-600">
        {job.description
          ? job.description.split(" ").slice(0, 25).join(" ") +
          (job.description.split(" ").length > 25 ? "..." : "")
          : "No description available."}
      </p>

      {/* Hiring Process */}
      <div className="mt-4 text-xs text-gray-500">
        Hiring Process:{" "}
        <span className="ml-1 text-gray-700">
          {job.selectionProcess?.length > 0
            ? job.selectionProcess.join(" - ")
            : "Not specified"}
        </span>
      </div>

      {/* Button */}
      <button className="w-full mt-5 bg-black text-white py-2 rounded-xl hover:bg-gray-800">
        Register Now
      </button>
    </div>
  );
};

export default JobCard;
