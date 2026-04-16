import { motion } from "framer-motion";
import { MapPin, IndianRupee, CalendarDays, Clock } from "lucide-react";

const InternshipJobCard = ({ job, i, handleApply }) => {
  // ✅ TITLE
  const title =
    job.companyPosted?.hiringPreferences?.jobRoles?.[0] ||
    job.jobRoles?.[0] ||
    "Role not specified";

  // ✅ COMPANY
  const company =
    job.companyPosted?.companyDetails?.companyName || "Not Mentioned";

  // ✅ LOCATION
  const location =
    job.companyPosted?.hiringPreferences?.hiringLocations?.[0] ||
    job.location?.[0] ||
    "Location not specified";

  // ✅ STIPEND (internship → don’t show LPA always)
  const stipend = job.packageDetails?.totalCTC
    ? job.packageDetails.totalCTC < 100000
      ? `₹${job.packageDetails.totalCTC}/month`
      : `${(job.packageDetails.totalCTC / 100000).toFixed(1)} LPA`
    : "Not disclosed";

  // ✅ EMPLOYMENT + MODE
  const employmentType =
    job.companyPosted?.hiringPreferences?.lookingFor?.[0] ||
    "Internship";

  const workMode = job.workMode?.[0] || "N/A";

  // ✅ START DATE
  const startDate = job.startDate
    ? new Date(job.startDate).toLocaleDateString()
    : null;

  // ✅ DURATION
  const duration = job.internshipDuration || null;

  // ✅ SKILLS
  const skills = job.skills || [];
  const visibleSkills = skills.slice(0, 2);
  const extraSkills = skills.length - 2;

  return (
    <motion.div
      key={job._id || i}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08 }}
      className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col h-full"
    >
      {/* 🔵 TOP RIGHT BADGES */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">

        {/* Start Date */}
        {startDate && (
          <div className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
            <CalendarDays className="w-3 h-3" />
            Starts {startDate}
          </div>
        )}

        {/* Duration */}
        {duration && (
          <div className="flex items-center gap-1 text-[10px] bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
            <Clock className="w-3 h-3" />
            {duration}
          </div>
        )}

      </div>

      {/* CONTENT */}
      <div className="flex-grow">

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{company}</p>
        </div>

        {/* META */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="w-3.5 h-3.5" />
            {stipend}
          </div>

          <div className="flex gap-3 text-xs text-gray-500">
            <span className="capitalize">{employmentType}</span>
            <span>•</span>
            <span>{workMode}</span>
          </div>

        </div>

        {/* SKILLS */}
        <div className="flex flex-wrap gap-2 mb-3">
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

      {/* BUTTON */}
      <button
        onClick={handleApply}
        className="mt-auto w-full bg-primaryBrand text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition"
      >
        Apply Now
      </button>
    </motion.div>
  );
};

export default InternshipJobCard;