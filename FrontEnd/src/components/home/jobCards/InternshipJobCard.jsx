import { motion } from "framer-motion";
import {
MapPin,
IndianRupee,
CalendarDays,
Clock,
} from "lucide-react";

const InternshipJobCard = ({ job, i, handleApply }) => {
// 🔹 ROLE
const title =
job.companyPosted?.hiringPreferences?.jobRoles?.[0] ||
job.jobRoles?.[0] ||
"Role not specified";

// 🔹 COMPANY
const company =
job.companyPosted?.companyDetails?.companyName || "Not Mentioned";

// 🔹 LOCATION
const location =
job.companyPosted?.hiringPreferences?.hiringLocations?.[0] ||
job.location?.[0] ||
"Location not specified";

// 🔹 STIPEND
const stipend = job.packageDetails?.totalCTC
? job.packageDetails.totalCTC < 100000
? `${job.packageDetails.totalCTC}/month`
: `${(job.packageDetails.totalCTC / 100000).toFixed(1)} LPA`
: "Not disclosed";

// 🔹 WORK MODE
const workMode = job.workMode?.[0] || "N/A";

// 🔹 DATE
const startDate = job.startDate
? new Date(job.startDate).toLocaleDateString()
: null;

// 🔹 DURATION
const duration = job.internshipDuration || null;

// 🔹 STREAMS
const streams = job.studentStreams || [];

// 🔹 SKILLS
const skills = job.skills || [];
const visibleSkills = skills.slice(0, 2);
const extraSkills = skills.length - 2;

return (
<motion.div
key={job._id || i}
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.08 }}
className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition flex flex-col h-full"
> <div className="flex-grow">

    {/* 🔹 HEADER */}
    <div className="mb-3">
      <h3 className="font-semibold text-gray-900 text-lg">
        {title}
      </h3>
      <p className="text-sm text-gray-500">{company}</p>
    </div>

    {/* 🔹 LOCATION */}
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
      <MapPin className="w-4 h-4" />
      {location}
    </div>

    {/* 🔹 DATE + DURATION (SAME ROW) */}
    {(startDate || duration) && (
      <div className={`grid ${startDate && duration ? "grid-cols-2" : "grid-cols-1"} gap-2 mb-3`}>

        {/* START DATE */}
        {startDate && (
          <div className="bg-gray-100 rounded-xl py-1 text-center">
            <p className="text-[10px] text-gray-500 leading-none">
              Start Date
            </p>
            <p className="text-sm font-semibold text-gray-900 leading-tight mt-0.5">
              {startDate}
            </p>
          </div>
        )}

        {/* DURATION */}
        {duration && (
          <div className="bg-purple-100 rounded-xl py-1 text-center">
            <p className="text-[10px] text-gray-500 leading-none">
              Duration
            </p>
            <p className="text-sm font-semibold text-gray-900 leading-tight mt-0.5">
              {duration}
            </p>
          </div>
        )}

      </div>
    )}

    {/* 🔹 PACKAGE */}
    <div className="flex justify-between text-sm text-gray-700 mb-3">
      <span>Stipend</span>
      <span className="font-medium flex items-center gap-1">
        <IndianRupee className="w-4 h-4" />
        {stipend}
      </span>
    </div>

    {/* 🔹 WORK MODE */}
    <div className="text-xs text-gray-500 mb-3">
      <span>Work Mode </span>
      {workMode}
    </div>

    {/* 🔹 STREAMS */}
    {streams.length > 0 && (
      <div className="mb-3">
        <div className="text-sm font-medium mb-2">
          Eligible Streams
        </div>

        <div className="flex flex-wrap gap-2">
          {streams.slice(0, 3).map((s, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-100 px-2 py-1 rounded-md"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* 🔹 SKILLS */}
    {skills.length > 0 && (
      <div>
        <div className="text-sm font-medium mb-2">
          Skills Required
        </div>

        <div className="flex flex-wrap gap-2">
          {visibleSkills.map((skill, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-100 px-2 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}

          {extraSkills > 0 && (
            <span className="text-xs bg-gray-200 px-2 py-1 rounded-md">
              +{extraSkills} more
            </span>
          )}
        </div>
      </div>
    )}

  </div>

  {/* 🔹 BUTTON */}
  <button
    onClick={handleApply}
    className="mt-4 w-full bg-primaryBrand text-white py-3 rounded-xl font-medium"
  >
    Apply Now
  </button>
</motion.div>

);
};

export default InternshipJobCard;
