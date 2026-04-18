import { motion } from "framer-motion";
import {
MapPin,
IndianRupee,
Users,
CalendarDays,
Hourglass,
} from "lucide-react";

const CollegeJobCard = ({ job, i, handleApply }) => {
const college = job.collegePosted?.collegeUniversityDetails;

const collegeName = college?.collegeName || "Unknown College";

const location =
[college?.city, college?.state].filter(Boolean).join(", ") ||
"Location not specified";

const salary = job.packageDetails?.totalCTC
? `${(job.packageDetails.totalCTC / 100000).toFixed(1)} LPA`
: "Not disclosed";

const students = job.noOfplacedStudents || "N/A";

const startDate = job.proposedSchedule?.startDate
? new Date(job.proposedSchedule.startDate).toLocaleDateString()
: null;

const endDate = job.proposedSchedule?.endDate
? new Date(job.proposedSchedule.endDate).toLocaleDateString()
: null;

const degree = job.degree?.join(", ") || "N/A";

const employmentType = job.employmentType?.[0] || "N/A";

const streams = job.studentStreams || [];
const studentCounts = job.numberOfStudent || [];

const streamData = streams.map((stream, idx) => ({
  stream,
  count: studentCounts[idx] ?? "N/A",
}));
const amenities = job.amenitiesRequired || [];
return (
<motion.div
key={job._id || i}
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.08 }}
className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition p-5 flex flex-col justify-between"
>
{/* HEADER */} <div> <h3 className="font-semibold text-gray-900 text-lg">
{collegeName} </h3>


    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
      <MapPin className="w-4 h-4" />
      {location}
    </div>

    {/* TAG */}
    {/* <div className="mt-3 inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
      {job.jobType}
    </div> */}
  </div>

  {/* STATS */}
  <div className="flex gap-6 mt-4 flex-wrap">
    {startDate && (
      <div className="text-xs bg-gray-100 px-3 py-1 rounded-md">
        <CalendarDays className="w-4 h-4 inline-block mr-1" />
        {startDate}
      </div>
    )}
    {endDate && (
      <div className="text-xs bg-orange-100 px-3 py-1 rounded-md">
        <Hourglass className="w-4 h-4 inline-block mr-1" />
        {endDate}
      </div>
    )}
    <div className="text-xs bg-blue-100 px-3 py-1 rounded-md">
      <Users className="w-4 h-4 inline-block mr-1" />
      {students} Students
    </div>
  </div>

  {/* INFO */}
  <div className="mt-4 space-y-2 text-sm text-gray-700">
    <div className="flex justify-between">
      <span>Min. Expected Package</span>
      <span className="font-medium flex items-center gap-1">
        <IndianRupee className="w-4 h-4" />
        {salary}
      </span>
    </div>

    {/* <div className="flex justify-between">
      <span>Employment Type</span>
      <span className="font-medium">{employmentType}</span>
    </div> */}
  </div>

  {/* STREAMS */}
  {streamData.length > 0 && (
    <div className="mt-4 bg-gray-50 p-3 rounded-xl">
      <div className="text-sm font-medium mb-2">
        Eligible Students
      </div>

      <div className="grid grid-cols-2 gap-2">
        {streamData.slice(0, 6).map((item, idx) => (
          <div
            key={idx}
            className="text-xs bg-white px-3 py-2 rounded-md border flex justify-between"
          >
            <span>{item.stream}</span>
            <span className="font-medium">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )}

  {amenities.length > 0 && (
    <div className="mt-4">
      <div className="text-sm font-medium mb-2">
        Facilities Provided
      </div>

      <div className="grid grid-cols-2 gap-2">
        {amenities.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            className="text-xs flex items-center gap-2 text-gray-700"
          >
            <span className="text-green-600">✔</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  )}  

  {/* FOOTER */}
  <div className="flex gap-3 mt-5">

    <button
      onClick={handleApply}
      className="flex-1 bg-primaryBrand text-white rounded-xl py-2 text-sm font-medium"
    >
      Apply Now
    </button>
  </div>
</motion.div>


);
};

export default CollegeJobCard;
