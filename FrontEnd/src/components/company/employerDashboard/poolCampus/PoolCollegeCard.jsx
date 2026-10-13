import React, { useState } from "react";
import { MapPin, Heart, Users, CalendarDays, Hourglass } from "lucide-react";
import { SaveOppurtunity } from "@/lib/Company_AxiosInstance";
import toast from "react-hot-toast";

const CollegeCard = ({ college, onClick }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!college) return null;

  const collegeDetails = college.collegePosted;
  const collegeName =
    collegeDetails?.collegeUniversityDetails?.collegeName || "College";

  const logo = collegeDetails?.profileImage || "";

  // ---------------- STATUS ----------------
  const getCollegeStatus = () => {
    const now = new Date();
    const start = college.proposedSchedule?.startDate
      ? new Date(college.proposedSchedule.startDate)
      : null;
    const end = college.proposedSchedule?.endDate
      ? new Date(college.proposedSchedule.endDate)
      : null;

    if (!start || !end) return { status: "Not Scheduled" };
    if (now < start) return { status: "Upcoming" };
    if (now >= start && now <= end) return { status: "Active" };
    return { status: "Completed" };
  };

  const collegeStatus = getCollegeStatus();

  // ---------------- NEW DATA (FROM OLD CARD) ----------------

  const location =
    [collegeDetails?.collegeUniversityDetails?.city,
     collegeDetails?.collegeUniversityDetails?.state]
      .filter(Boolean)
      .join(", ") || "Location not specified";

  const salary = college.packageDetails?.totalCTC
    ? `${(college.packageDetails.totalCTC / 100000).toFixed(1)} LPA`
    : "Not disclosed";

  const students = college.noOfplacedStudents || "N/A";
  const lastDateToApply = college.endDate
    ? new Date(college.endDate).toLocaleDateString("en-IN")
    : "N/A";
  const startDate = college.proposedSchedule?.startDate
    ? new Date(college.proposedSchedule.startDate).toLocaleDateString("en-IN")
    : null;

  const endDate = college.proposedSchedule?.endDate
    ? new Date(college.proposedSchedule.endDate).toLocaleDateString("en-IN")
    : null;
  const employmentType = college.employmentType?.[0] || "N/A";
  const streams = college.studentStreams || [];
  const counts = college.numberOfStudent || [];

  const streamData = streams.map((s, i) => ({
    stream: s,
    count: counts[i] ?? "N/A",
  }));

  const amenities = college.amenitiesRequired || [];

  // ---------------- HELPERS ----------------

  const getInitials = (name = "") => {
    const words = name.split(" ");
    if (words.length === 1) return words[0][0];
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    onClick?.(college);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    onClick?.(college);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await SaveOppurtunity(college._id, college.jobType);
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

  const formatLocation = () => {
    if (college.location?.length) {
      return college.location.slice(0, 2).join(", ");
    }
    return "no";
  };

  const formatPackage = () => {
    if (college.packageDetails?.totalCTC) {
      return `₹${college.packageDetails.totalCTC.toLocaleString()}`;
    }
    return "Not Disclosed";
  };

  // ---------------- UI ----------------

  return (
    <div
      onClick={handleCardClick}
      className="w-full max-w-[350px] mx-auto rounded-2xl overflow-hidden border-2 border-gray-300 bg-white shadow-sm hover:shadow-md transition flex flex-col h-full cursor-pointer"
    >
      {/* TOP SECTION */}
      <div className="p-5 flex-1 flex flex-col bg-primaryBrand/15">

        {/* STATUS + SAVE */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#143694]/10 text-[#143694]">
            {collegeStatus.status}
          </span>

          <button onClick={handleSave} className="p-2 bg-white rounded-full">
            <Heart
              className={`h-5 w-5 ${
                isSaved ? "text-red-500 fill-red-500" : "text-gray-500"
              }`}
            />
          </button>
        </div>

        {/* HEADER */}
        <div className="flex justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {collegeName}
            </h3>

            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {location}
            </p>
          </div>

          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border">
            {logo && !imageError ? (
              <img
                src={logo}
                className="w-12 h-12 object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <span>{getInitials(collegeName)}</span>
            )}
          </div>
        </div>

        {/* DATES + STUDENTS */}
        {(startDate || endDate || lastDateToApply) && (
          <div className="mb-2 grid grid-cols-3 gap-3">

            {/* LEFT */}
            <div className="col-span-1 bg-gray-100 rounded-xl px-1 py-1 border border-gray-200 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] text-gray-900 mb-0">
                Apply By
              </p>
              <p className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                {lastDateToApply || "-"}
              </p>
            </div>

            {/* RIGHT */}
            <div className="col-span-2 bg-orange-100 rounded-xl px-1 py-1 border border-orange-200 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] text-gray-900 mb-0">
                Tentative Dates
              </p>
              <p className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                {startDate || "-"} → {endDate || "-"}
              </p>
            </div>

          </div>
        )}

        {/* PACKAGE */}
        {/* <div className="text-sm text-gray-700 mb-1 flex justify-between">
          <span>Min Package</span>
          <span className="font-medium">{salary}</span>
        </div> */}
        <div className="text-sm text-gray-700 mb-2 flex justify-between">
          <span>Min Hiring Commitment</span>
          <span className="font-medium">{students}</span>
        </div>
        <div className="text-sm text-gray-700 mb-2 flex justify-between">
          <span>Employment Type</span>
          <span className="font-medium">{employmentType}</span>
        </div>
        {/* STREAMS */}
        {streamData.length > 0 && (
          <div className="bg-gray-50 p-2 rounded-lg mb-2">
            <p className="text-xs font-medium mb-1">Students</p>

            <div className="grid grid-cols-2 gap-1">
              {streamData.slice(0, 4).map((s, i) => (
                <div
                  key={i}
                  className="text-[10px] bg-white px-2 py-1 rounded border flex justify-between"
                >
                  <span>{s.stream}</span>
                  <span>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AMENITIES */}
        {amenities.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-1">Facilities</p>

            <div className="grid grid-cols-2 gap-1">
              {amenities.slice(0, 4).map((a, i) => (
                <div key={i} className="text-[10px] flex gap-1">
                  <span className="text-green-600">✔</span> 
                  {a}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION (UNCHANGED) */}
      <div className="px-5 py-4 bg-white border-t flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-900">Min. Expected Package</span>
          <p className="font-semibold text-sm text-gray-900">
            {formatPackage()}
          </p>

          {/* {formatLocation() !== "no" && (
            <div className="flex text-xs text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {formatLocation()}
            </div>
          )} */}
        </div>

        <button
          onClick={handleDetailsClick}
          className="px-4 py-2 bg-primaryBrand text-white rounded-lg text-sm"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default CollegeCard;
