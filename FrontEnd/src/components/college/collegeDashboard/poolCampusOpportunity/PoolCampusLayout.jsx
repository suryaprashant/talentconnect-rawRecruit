import { useState } from "react";
import PoolJobListingPage from "@/pages/college/collegeDashboard/poolCampusOpportunity/PoolJobListingPage";
import PoolJobDetailModal from "./PoolDetailModal";

const PoolCampusLayout = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomedView, setIsZoomedView] = useState(false);

  const handleJobSelect = (job) => {
    console.log('Opening details for:', job?.companyName || job?.companyPosted?.companyDetails?.companyName);
    setSelectedJob(job);
    setIsModalOpen(true);
    setIsZoomedView(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setIsZoomedView(false);
  };

  /* ======================================================
     ZOOMED VIEW — MODAL + SIDEBAR COMBINED
  ====================================================== */
  if (isZoomedView && isModalOpen && selectedJob) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop - ONLY behind the modal content, not sidebar */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        {/* Modal + Sidebar wrapper - NO backdrop here */}
        <div className="relative z-10 flex h-[82vh] w-full max-w-[1220px] mx-auto my-auto">
          
          {/* ================= MODAL (Left) ================= */}
          <div className="w-[900px] h-full rounded-l-2xl overflow-hidden shadow-2xl bg-white relative">
            <PoolJobDetailModal
              jobId={selectedJob._id || selectedJob.id}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </div>

          {/* ================= SIDEBAR (Right) ================= */}
<div className="w-[320px] h-full border-l shadow-2xl rounded-r-2xl overflow-hidden bg-white relative flex flex-col">

  {/* ===== Sidebar Header ===== */}
  <div className="h-[88px] flex items-center border-b px-6 bg-white rounded-tr-2xl">
    <div className="flex items-center justify-between w-full">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Other Pool Opportunities
        </h2>
        <p className="text-sm text-gray-600">
          Browse through other pool campus opportunities
        </p>
      </div>

      <button
        onClick={handleCloseModal}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>

  {/* ===== Scroll Area ===== */}
  <div className="flex-1 overflow-y-auto p-4 rounded-br-2xl">
    <PoolJobListingPage
      compact={true}
      onJobSelect={handleJobSelect}
      selectedJobId={selectedJob?._id || selectedJob?.id}
    />
  </div>
</div>
        </div>
      </div>
    );
  }

  /* ======================================================
     NORMAL VIEW — LIST ONLY
  ====================================================== */
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      <div className="h-full overflow-y-auto p-4 md:p-2">
        <PoolJobListingPage 
          onJobSelect={handleJobSelect}
        />
      </div>

      {/* Modal for normal view (fullscreen backdrop) */}
      {isModalOpen && selectedJob && !isZoomedView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <PoolJobDetailModal
            jobId={selectedJob._id || selectedJob.id}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default PoolCampusLayout;