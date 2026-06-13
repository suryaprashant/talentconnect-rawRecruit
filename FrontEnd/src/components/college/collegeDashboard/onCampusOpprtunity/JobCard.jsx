import React, { useState } from "react";
import { MapPin, Heart } from "lucide-react";
import { SaveOppurtunity } from "@/lib/Company_AxiosInstance";
import toast from "react-hot-toast";

const JobCard = ({ job, onClick }) => {
  const [isSaved, setIsSaved] = useState(job?.isSaved || false);
  const [imageError, setImageError] = useState(false);

  if (!job) return null;

  const companyName =
    job.companyPosted?.companyDetails?.companyName || "Company";
  const logo = job.companyPosted?.profileImageUrl || "";

  // ---------------- STATUS ----------------
  const getJobStatus = () => {
    if (!job?.startDate || !job?.endDate) {
      return { status: "Unknown" };
    }

    const now = new Date();
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);

    if (now < startDate) return { status: "Upcoming" };
    if (now >= startDate && now <= endDate) return { status: "Active" };
    return { status: "Completed" };
  };

  const jobStatus = getJobStatus();

  // ---------------- HELPERS ----------------
  const getInitials = (name = "") => {
    const words = name.split(" ");
    if (words.length === 1) return words[0][0];
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const formatLocation = () =>
    job.workLocation?.slice(0, 2).join(", ") || "Location not specified";

  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    onClick?.(job);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    onClick?.(job);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await SaveOppurtunity(job._id, job.jobType);
      if (res?.data?.success) {
        setIsSaved(true);
        toast.success("Saved");
      } else {
        toast.error("Unable to save");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  // ---------------- NEW DATA (FROM COMPANY CARD) ----------------

  const startDate = job.startDate
    ? new Date(job.startDate).toLocaleDateString()
    : null;

  const endDate = job.endDate
    ? new Date(job.endDate).toLocaleDateString()
    : null;
  const offerDate = job.offerRolloutDate
    ? new Date(job.offerRolloutDate).toLocaleDateString()
    : null;
  const onlineTestDate = job.onlineTestDate
    ? new Date(job.onlineTestDate).toLocaleDateString()
    : null;
  const streams = job.studentStreams || [];
  const visibleStreams = streams.slice(0, 4);

  const skills = job.skills || [];
  const visibleSkills = skills.slice(0, 2);
  const extraSkills = skills.length - 2;

  const salary = job.packageDetails?.totalCTC
    ? `${Number(job.packageDetails.totalCTC).toLocaleString("en-IN")}`
    : "Not disclosed";

  const minStudents = job.minimumStudents || "Not Specified";

  // ---------------- UI ----------------

  return (
    <div
      onClick={handleCardClick}
      className="w-full max-w-[350px] mx-auto rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col cursor-pointer h-full"
    >
      {/* TOP SECTION */}
      <div className="p-5 flex-1 flex flex-col bg-primaryBrand/15">
        {/* STATUS + SAVE */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#143694]/10 text-[#143694]">
            {jobStatus.status}
          </span>

          <button
            onClick={handleSave}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100"
          >
            <Heart
              className={`h-5 w-5 ${
                isSaved ? "text-red-500 fill-red-500" : "text-gray-500"
              }`}
            />
          </button>
        </div>

        {/* ROLE + COMPANY */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1">
            <h3 className="text-[#143694] font-semibold text-lg truncate">
              {job.jobRoles?.[0] || "Role not specified"}
            </h3>

            <p className="text-sm text-gray-600 font-medium">
              {companyName}
            </p>
          </div>

          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden border">
            {logo && !imageError ? (
              <img
                src={logo}
                alt="logo"
                className="w-12 h-12 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-sm font-semibold text-gray-700">
                {getInitials(companyName)}
              </span>
            )}
          </div>
        </div>

        {/* DATES */}
        <div className="mt-0 mb-3 grid grid-cols-3 gap-2">

          {/* LEFT */}
          <div className="col-span-1 bg-gray-100 rounded-xl px-1 py-1 border border-gray-200 flex flex-col items-center justify-center text-center leading-tight">
            <p className="text-[10px] text-gray-600 leading-tight">
              {/* Application<br />Deadline */}
              Apply By
            </p>
            <p className="text-xs font-semibold text-gray-900">
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
        <div className="text-sm text-gray-700 space-y-1 mb-2">
          {/* <div className="flex justify-between">
            <span>Package</span>
            <span className="font-medium">{salary}</span>
          </div> */}

          <div className="flex justify-between">
            <span>Min Students</span>
            <span className="font-medium">{minStudents}</span>
          </div>

          <div className="flex justify-between">
            <span>Employment Type</span>
            <span className="font-medium">{job.employmentType?.join(", ") || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span>Work Mode</span>
            <span className="font-medium">{job.workMode?.join(", ") || "N/A"}</span>
          </div>

          {/* <div className="text-xs text-gray-500">
            {job.employmentType?.join(", ") || "N/A"} •{" "}
            {job.workMode?.join(", ") || "N/A"}
          </div> */}
        </div>

        {/* STREAMS */}
        {streams.length > 0 && (
          <div className="bg-gray-50 p-2 rounded-lg mb-2">
            <p className="text-xs font-medium mb-1">
              Eligible Streams
            </p>

            <div className="flex flex-wrap gap-1">
              {visibleStreams.map((s, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-white px-2 py-0.5 border rounded"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-1">Skills</p>

            <div className="flex flex-wrap gap-1">
              {visibleSkills.map((s, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-gray-100 px-2 py-0.5 rounded"
                >
                  {s}
                </span>
              ))}

              {extraSkills > 0 && (
                <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded">
                  +{extraSkills}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION (UNCHANGED) */}
      <div className="px-5 py-4 bg-white border-t border-gray-100 flex justify-between items-center">
        <div>
          <p className="font-semibold text-sm text-gray-900">
            {salary}
          </p>

          <div className="flex items-center text-xs text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {formatLocation()}
          </div>
        </div>

        <button
          onClick={handleDetailsClick}
          className="px-4 py-2 bg-[#143694] text-white rounded-lg text-sm"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;