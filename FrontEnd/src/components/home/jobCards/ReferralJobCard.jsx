import { motion } from "framer-motion";
import { MapPin, IndianRupee } from "lucide-react";

const ReferralJobCard = ({ job, i, activeType, handleApply }) => {
  const title =
    job.jobRoles?.[0] ||
    job.jobTitle ||
    job.collegePosted?.collegeUniversityDetails?.collegeName ||
    "Role not specified";

  const company =
    job.companyName ||
    job.candidatePosted?.currentCompany ||
    job.companyPosted?.companyDetails?.companyName ||
    job.degreeType ||
    "Not Mentioned";

  const location =
    job.companyPosted?.hiringPreferences?.hiringLocations?.[0] ||
    (Array.isArray(job.location) && job.location.length > 0
      ? job.location[0]
      : null) ||
    job.collegePosted?.collegeUniversityDetails?.collegeLocation ||
    "Location not specified";

  const salary = job.packageDetails?.totalCTC
    ? `${(job.packageDetails.totalCTC / 100000).toFixed(1)} LPA`
    : "Not disclosed";

  const employmentType = job.employmentType?.[0] || job.jobType || "N/A";
  const workMode = job.workMode?.[0] || job.jobType || "N/A";

  const skills = job.skills || [];
  const visibleSkills = skills.slice(0, 2);
  const extraSkills = skills.length - 2;

  const tag = job.tags?.[0];
  const deadline =
    job.endDate ||
    job.proposedSchedule?.endDate ||
    job.interviewWindow?.end;

  const daysLeft = deadline
    ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      key={job._id || i}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08 }}
      className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
    >
      {/* TAG + DEADLINE */}
      <div className="absolute top-6 right-3 flex flex-col items-end gap-1">
        {tag && (
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            {tag}
          </span>
        )}

        {daysLeft !== null && (
          <span className="text-[10px] px-2 py-1 mt-1 rounded-full font-medium bg-blue-100 text-blue-600">
            {daysLeft > 0 ? `${daysLeft} days left` : "Closed"}
          </span>
        )}
      </div>

      {/* HEADER */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{company}</p>
      </div>

      {/* META */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
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

      <button
        onClick={handleApply}
        className="w-full bg-primaryBrand text-white py-3 rounded-xl font-medium"
      >
        Apply Now
      </button>
    </motion.div>
  );
};

export default ReferralJobCard;