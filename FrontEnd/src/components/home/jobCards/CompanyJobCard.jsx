import { motion } from "framer-motion";
import {
MapPin,
IndianRupee,
CalendarDays,
Hourglass,
} from "lucide-react";

const CompanyJobCard = ({ job, i, handleApply }) => {
const title = job.jobRoles?.[0] || "Role not specified";

const company =
job.companyPosted?.companyDetails?.companyName || "Unknown Company";

const location =
job.companyPosted?.hiringPreferences?.hiringLocations?.[0] ||
job.workLocation?.[0] ||
"Location not specified";

const salary = job.packageDetails?.totalCTC
  ? `${job.packageDetails.totalCTC.toLocaleString("en-IN")}`
  : "Not disclosed";
const employmentType = job.employmentType?.join(", ") || "N/A";
const workMode = job.workMode?.join(", ") || "N/A";

// ✅ DATE (like previous card)
const startDate = job.startDate
? new Date(job.startDate).toLocaleDateString("en-IN")
: null;

const endDate = job.endDate
? new Date(job.endDate).toLocaleDateString("en-IN")
: null;
const offerDate = job.offerRolloutDate
? new Date(job.offerRolloutDate).toLocaleDateString("en-IN")
: null;
const onlineTestDate = job.onlineTestDate
? new Date(job.onlineTestDate).toLocaleDateString("en-IN")
: null;

// ✅ STREAMS
const streams = job.studentStreams || [];
const visibleStreams = streams.slice(0, 4);

// ✅ SKILLS
const skills = job.skills || [];
const visibleSkills = skills.slice(0, 2);
const extraSkills = skills.length - 2;
const minStudents = job.minimumStudents || "Not Specified";
return (
<motion.div
key={job._id || i}
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.08 }}
className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition flex flex-col h-full"
>
{/* HEADER */} <div> <h3 className="font-semibold text-gray-900 text-lg">
{title} </h3> <p className="text-sm text-gray-500">{company}</p>


    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
      <MapPin className="w-4 h-4" />
      {location}
    </div>
  </div>

  {/* DATES (LIKE COLLEGE CARD) */}
  <div className="mt-4 grid grid-cols-3 gap-3">

    {/* LEFT */}
    <div className="col-span-1 bg-gray-100 rounded-xl px-1 py-1 border border-gray-200 flex flex-col items-center justify-center text-center">
      <p className="text-[10px] text-gray-900 mb-0">
        Apply By
      </p>
      <p className="text-xs font-semibold text-gray-900 whitespace-nowrap">
        {endDate || "-"}
      </p>
    </div>

    {/* RIGHT */}
    <div className="col-span-2 bg-orange-100 rounded-xl px-1 py-1 border border-orange-200 flex flex-col items-center justify-center text-center">
      <p className="text-[10px] text-gray-900 mb-0">
        Test Date - Offer Rollout Date
      </p>
      <p className="text-xs font-semibold text-gray-900 whitespace-nowrap">
        {onlineTestDate || "-"} → {offerDate || "-"}
      </p>
    </div>

  </div>

  {/* INFO */}
  <div className="mt-4 space-y-2 text-sm text-gray-700">
    <div className="flex justify-between">
      <span>Package</span>
      <span className="font-medium flex items-center gap-1">
        <IndianRupee className="w-4 h-4" />
        {salary}
      </span>
    </div>
    <div className="flex justify-between">
      <span>Minimum Students</span>
      <span className="font-medium flex items-center gap-1">
        {minStudents}
      </span>
    </div>
    <div className="flex justify-between">
      <span>Employment Type</span>
      <span className="font-medium flex items-center gap-1">
        {employmentType}
      </span>
    </div>
    <div className="flex justify-between">
      <span>Work Mode</span>
      <span className="font-medium flex items-center gap-1">
        {workMode}
      </span>
    </div>
    {/* <div className="text-xs text-gray-500">
      {employmentType} • {workMode}
    </div> */}
  </div>

  {/* STREAMS */}
  {streams.length > 0 && (
    <div className="mt-4 bg-gray-50 p-3 rounded-xl">
      <div className="text-sm font-medium mb-2">
        Eligible Streams
      </div>

      <div className="flex flex-wrap gap-2">
        {visibleStreams.map((stream, idx) => (
          <span
            key={idx}
            className="text-xs bg-white px-2 py-1 rounded-md border"
          >
            {stream}
          </span>
        ))}
      </div>
    </div>
  )}

  {/* SKILLS */}
  <div className="mt-3">
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

  {/* BUTTON */}
  <button
    onClick={handleApply}
    className=" w-full bg-primaryBrand text-white py-3 rounded-xl font-medium mt-2"
  >
    Apply Now
  </button>
</motion.div>


);
};

export default CompanyJobCard;
