import { motion } from "framer-motion";
import { MapPin, IndianRupee, Users, CalendarDays } from "lucide-react";

const CollegeJobCard = ({ job, i, handleApply }) => {
  const collegeName =
    job.collegePosted?.collegeUniversityDetails?.collegeName ||
    "Unknown College";

  const city = job.collegePosted?.collegeUniversityDetails?.city;
  const state = job.collegePosted?.collegeUniversityDetails?.state;
  const location =
    [city, state].filter(Boolean).join(", ") || "Location not specified";

  const salary = job.packageDetails?.totalCTC
    ? `${(job.packageDetails.totalCTC / 100000).toFixed(1)} LPA`
    : "Not disclosed";

  const employmentType = job.employmentType?.join(", ") || "N/A";

  const skills = job.skills || [];
  const visibleSkills = skills.slice(0, 2);
  const extraSkills = skills.length - 2;

  const students = job.noOfplacedStudents || "N/A";

  const startDate = job.proposedSchedule?.startDate
    ? new Date(job.proposedSchedule.startDate).toLocaleDateString()
    : null;

  const endDate = job.proposedSchedule?.endDate
    ? new Date(job.proposedSchedule.endDate).toLocaleDateString()
    : null;

  const degree = job.degree?.join(", ") || "N/A";

  const streams = job.studentStreams?.slice(0, 2) || [];
  const extraStreams = (job.studentStreams?.length || 0) - 2;

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

        {/* Students */}
        <div className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          <Users className="w-3 h-3" />
          {students}
        </div>

        {/* Dates */}
        {startDate && endDate && (
          <div className="flex items-center gap-1 text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
            <CalendarDays className="w-3 h-3" />
            {startDate} → {endDate}
          </div>
        )}
      </div>
      <div className="flex-grow">
      {/* HEADER */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">
          {collegeName}
        </h3>
        <p className="text-sm text-gray-500">
          Hiring for: {degree}
        </p>
      </div>

      {/* META */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          {location}
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee className="w-3.5 h-3.5" />
          Min Package: {salary}
        </div>

        <div className="text-xs text-gray-500">
          {employmentType}
        </div>
      </div>

      {/* STREAMS */}
      <div className="flex flex-wrap gap-2 mb-3">
        {streams.map((stream, idx) => (
          <span
            key={idx}
            className="text-xs bg-blue-100 px-2 py-1 rounded-md"
          >
            {stream}
          </span>
        ))}

        {extraStreams > 0 && (
          <span className="text-xs bg-blue-200 px-2 py-1 rounded-md">
            +{extraStreams} more
          </span>
        )}
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
        className="w-full bg-primaryBrand text-white py-3 rounded-xl font-medium"
      >
        Apply Now
      </button>
    </motion.div>
  );
};

export default CollegeJobCard;