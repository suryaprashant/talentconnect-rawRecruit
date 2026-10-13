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
  ? `${job.packageDetails.totalCTC.toLocaleString("en-IN")}`
  : "Not disclosed";
// 🔹 WORK TYPE
const employmentType = job.employmentType?.[0] || job.jobType || "N/A";
const workMode = job.workMode?.[0] || "N/A";

// 🔹 NOTICE PERIOD
const noticePeriod =
job.candidatePosted?.noticePeriod || "Not specified";
const endDate = job.endDate
? new Date(job.endDate).toLocaleDateString("en-IN")
: null;
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


const experienceLevel = job.minYearofExperience && job.yearsOfExperience
                              ? `${job.minYearofExperience}-${job.yearsOfExperience} yrs.`
                              : job.minYearofExperience
                              ? `${job.minYearofExperience}+ yrs.`
                              : "Entry Level"
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
    <div className="grid grid-cols-2 gap-3 mb-3">
  
      {endDate && (
          <div className="bg-gray-100 rounded-xl py-1 text-center">
            <p className="text-[10px] text-gray-700 leading-none">
              Apply By
            </p>
            <p className="text-sm text-gray-900 leading-tight mt-0.5">
              {endDate}
            </p>
          </div>
      )}
      {experienceLevel && (
          <div className="bg-purple-100 rounded-xl py-1 text-center">
            <p className="text-[10px] text-gray-700 leading-none">
              Experience Level
            </p>
            <p className="text-sm text-gray-900 leading-tight mt-0.5">
              {experienceLevel}
            </p>
          </div>
        )}

    </div>

    {/* 🔹 PACKAGE */}
    <div className="flex justify-between text-sm text-gray-700 mb-3">
      <span>Package</span>
      <span className="font-medium flex items-center gap-1">
        <IndianRupee className="w-4 h-4" />
        {salary}
      </span>
    </div>

    <div className="flex justify-between text-sm text-gray-700 mb-3">
      <span>Employment Type</span>
      <span className="font-medium flex items-center gap-1">
        {employmentType}
      </span>
    </div>

    <div className="flex justify-between text-sm text-gray-700 mb-3">
      <span>Work Mode</span>
      <span className="font-medium flex items-center gap-1">
        {workMode}
      </span>
    </div>

    {/* 🔹 WORK MODE */}
    {/* <div className="text-xs text-gray-500 mb-3">
      {employmentType} • {workMode}
    </div> */}

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
