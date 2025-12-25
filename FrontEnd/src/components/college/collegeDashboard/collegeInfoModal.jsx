import { useEffect } from "react";
import { X } from "lucide-react";

const CollegeInfoModal = ({ college, position, onClose }) => {
  if (!college || !position) return null;

  const { collegeUniversityDetails = {}, placementRecruitmentDetails = {} } = college;

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

   const MODAL_WIDTH = 360;
const GAP = -50;

// Place modal relative to college name
let topPosition = position.top - 100; // ⬅️ key change
let leftPosition = position.right + GAP;

// Flip left if overflow
if (leftPosition + MODAL_WIDTH > window.innerWidth - 16) {
  leftPosition = position.left - MODAL_WIDTH - GAP;
}

  return (
    <div
  className="fixed inset-0 z-50"
  onClick={onClose}
>
      <div
    className="absolute bg-gray-100 rounded-2xl p-2 shadow-md"
    style={{
          top: topPosition,
            left: leftPosition
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="bg-white w-[360px] rounded-xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="border-b pb-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {collegeUniversityDetails.collegeName}
            </h2>
            <p className="text-sm text-gray-500">
              {collegeUniversityDetails.collegeLocation ||
                `${collegeUniversityDetails.city || ""}, ${collegeUniversityDetails.state || ""}`}
            </p>
          </div>

          <X className="cursor-pointer text-gray-500" onClick={onClose} />
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Info label="Phone">
              {collegeUniversityDetails.phoneNumber || "Not specified"}
            </Info>

            <Info label="Established">
              {collegeUniversityDetails.establishedYear || "Not specified"}
            </Info>

            <div className="sm:col-span-2">
              <Info label="Programs Offered">
                {placementRecruitmentDetails.programsOffered?.join(", ") || "Not specified"}
              </Info>
            </div>

            <div className="sm:col-span-2">
              <Info label="Popular Courses">
                {placementRecruitmentDetails.popularCoursesForRecruitment?.join(", ") || "Not specified"}
              </Info>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, children }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{children}</p>
  </div>
);

export default CollegeInfoModal;
