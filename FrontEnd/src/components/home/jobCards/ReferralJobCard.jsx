import { motion } from "framer-motion";
import { MapPin, IndianRupee } from "lucide-react";

const ReferralJobCard = ({ job, i, handleApply }) => {
// 🔹 ROLE
const title =
job.jobRoles?.[0] ||
job.jobTitle ||
"Role not specified";

// 🔹 COMPANY
const company =
job.companyName ||
job.candidatePosted?.currentCompany ||
job.companyPosted?.companyDetails?.companyName ||
"Not Mentioned";

// 🔹 LOCATION
const location =
job.companyPosted?.hiringPreferences?.hiringLocations?.[0] ||
(Array.isArray(job.location) && job.location.length > 0
? job.location[0]
: null) ||
job.candidatePosted?.locations?.[0] ||
"Location not specified";

// 🔹 SALARY
const salary = job.packageDetails?.totalCTC
? `${(job.packageDetails.totalCTC / 100000).toFixed(1)} LPA`
: "Not disclosed";

// 🔹 WORK TYPE
const employmentType = job.employmentType?.[0] || job.jobType || "N/A";
const workMode = job.workMode?.[0] || "N/A";

// 🔹 NOTICE PERIOD
const noticePeriod =
job.candidatePosted?.noticePeriod || "Not specified";

// 🔹 STREAMS (optional fallback from candidate)
const streams =
job.studentStreams?.length > 0
? job.studentStreams
: job.candidatePosted?.specialization
? [job.candidatePosted.specialization]
: [];

// 🔹 SKILLS
const skills =
job.skills?.length > 0
? job.skills
: job.candidatePosted?.skills || [];

const visibleSkills = skills.slice(0, 2);
const extraSkills = skills.length - 2;
let experienceLevel = "Fresher";

if (job.yearsOfExperience) {
  experienceLevel = job.yearsOfExperience;
} else if (job.minYearofExperience) {
  experienceLevel = `${job.minYearofExperience}+ yrs`;
} else if (job.candidatePosted?.experiences?.length > 0) {
  experienceLevel = `${job.candidatePosted.experiences.length} yrs exp`;
}
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

    {/* 🔹 NOTICE PERIOD (like badge row in other cards) */}
    <div className="flex gap-3 flex-wrap mb-3">
      <div className="text-xs bg-gray-100 px-3 py-1 rounded-md">
        Notice Period: {noticePeriod}
      </div>
      <div className="text-xs bg-purple-100 px-3 py-1 rounded-md">
        Exp: {experienceLevel}
      </div>
    </div>

    {/* 🔹 PACKAGE */}
    <div className="flex justify-between text-sm text-gray-700 mb-3">
      <span>Package</span>
      <span className="font-medium flex items-center gap-1">
        <IndianRupee className="w-4 h-4" />
        {salary}
      </span>
    </div>

    {/* 🔹 WORK MODE */}
    <div className="text-xs text-gray-500 mb-3">
      {employmentType} • {workMode}
    </div>

    {/* 🔹 STREAMS */}
    {streams.length > 0 && (
      <div className="mb-3">
        <div className="text-sm font-medium mb-2">
          Relevant Background
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

export default ReferralJobCard;
