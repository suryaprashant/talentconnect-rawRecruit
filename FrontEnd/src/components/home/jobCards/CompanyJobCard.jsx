import { motion } from "framer-motion";
import { MapPin, IndianRupee } from "lucide-react";

const CompanyJobCard = ({ job, i, handleApply }) => {
  // ✅ TITLE
  const title = job.jobRoles?.[0] || "Role not specified";

  // ✅ COMPANY
  const company =
    job.companyPosted?.companyDetails?.companyName || "Unknown Company";

  // ✅ LOCATION
  const location =
    job.companyPosted?.hiringPreferences?.hiringLocations?.[0] ||
    job.workLocation?.[0] ||
    "Location not specified";

  // ✅ SALARY
  const salary = job.packageDetails?.totalCTC
    ? `${(job.packageDetails.totalCTC / 100000).toFixed(1)} LPA`
    : "Not disclosed";

  // ✅ EMPLOYMENT + WORK MODE
  const employmentType = job.employmentType?.join(", ") || "N/A";
  const workMode = job.workMode?.join(", ") || "N/A";

  // ✅ APPLY BEFORE
  const applyBefore = job.endDate
    ? new Date(job.endDate).toLocaleDateString()
    : null;

  // ✅ EXTRA INFO
  const minimumStudents = job.minimumStudents || "N/A";

  const streams = job.studentStreams || [];
  const visibleStreams = streams.slice(0, 2);
  const extraStreams = streams.length - 2;

  const collegeCategories = job.collegeCategories || [];
  const  collegeTypes =
  job.collegeTypes?.length > 0
    ? job.collegeTypes
    : job.degree?.length > 0
    ? job.degree
    : [];

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
      {/* APPLY BEFORE */}
      {applyBefore && (
        <div className="absolute top-4 right-4">
          <span className="text-[10px] px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-600">
            Apply Before: {applyBefore}
          </span>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-grow">

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{company}</p>
        </div>

        {/* META */}
        <div className="space-y-2 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> {location}
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="w-3.5 h-3.5" /> {salary}
          </div>

          <div className="flex gap-3 text-xs text-gray-500">
            <span>{employmentType}</span>
            <span>•</span>
            <span>{workMode}</span>
          </div>
        </div>

        {/* EXTRA INFO */}
        <div className="space-y-2 mb-3 text-xs text-gray-500">

          <div>Min Students: {minimumStudents}</div>

          {/* STREAMS */}
          {visibleStreams.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {visibleStreams.map((stream, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                  {stream}
                </span>
              ))}
              {extraStreams > 0 && (
                <span className="bg-blue-200 px-2 py-0.5 rounded-md">
                  +{extraStreams} more
                </span>
              )}
            </div>
          )}

          {/* COLLEGE CATEGORY */}
          {collegeCategories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {collegeCategories.slice(0, 2).map((cat, idx) => (
                <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* COLLEGE TYPE */}
          {collegeTypes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {collegeTypes.slice(0, 2).map((type, idx) => (
                <span key={idx} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                  {type}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* SKILLS */}
        <div className="flex flex-wrap gap-2 mb-3">
          {visibleSkills.map((skill, idx) => (
            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-md">
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

      {/* BUTTON (FIXED BOTTOM) */}
      <button
        onClick={handleApply}
        className="mt-auto w-full bg-primaryBrand text-white py-3 rounded-xl font-medium"
      >
        Apply Now
      </button>
    </motion.div>
  );
};

export default CompanyJobCard;