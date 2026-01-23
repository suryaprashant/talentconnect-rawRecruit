import { useState } from "react";
import PoolCollegeListingPage from "@/pages/employer/employerDashboard/poolCampus/PoolEmployeeListing";
import EmployerPoolDetailsModal from "./EmployerPoolDetailsModal";

const EmployerPoolLayout = () => {
  const [selectedPool, setSelectedPool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomedView, setIsZoomedView] = useState(false);

  const handlePoolSelect = (pool) => {
    setSelectedPool(pool);
    setIsModalOpen(true);
    setIsZoomedView(true);
  };

  const handleCloseModal = () => {
    setSelectedPool(null);
    setIsModalOpen(false);
    setIsZoomedView(false);
  };

  /* ======================================================
     ZOOMED VIEW — MODAL + SIDEBAR COMBINED
  ====================================================== */
  if (isZoomedView && isModalOpen && selectedPool) {
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop - ONLY behind the modal content, not sidebar */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        {/* Modal + Sidebar wrapper - NO backdrop here */}
        <div className="relative z-10 flex h-[82vh] w-full max-w-[1220px] mx-auto my-auto">
          
          {/* ================= MODAL (Left) ================= */}
          <div className="w-[900px] h-full rounded-l-2xl overflow-hidden shadow-2xl bg-white relative">
            <EmployerPoolDetailsModal
              pool={selectedPool}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </div>

          {/* ================= SIDEBAR (Right) ================= */}
          <div className="w-[320px] h-full bg-white border-l shadow-2xl rounded-r-2xl overflow-y-auto relative">
            
            {/* Sidebar header */}
            <div className="sticky top-0 z-20 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Other Pool Campuses
                  </h2>
                  <p className="text-sm text-gray-500">
                    Browse through other pool campuses
                  </p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sidebar list */}
            <div className="p-4">
              <PoolCollegeListingPage
                compact
                onPoolSelect={handlePoolSelect}
                selectedPoolId={selectedPool?._id}
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

      <div className="h-full overflow-y-auto p-4 md:p-6">
        <PoolCollegeListingPage onPoolSelect={handlePoolSelect} />
      </div>

      {/* Normal modal view */}
      {isModalOpen && selectedPool && !isZoomedView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <EmployerPoolDetailsModal
            pool={selectedPool}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default EmployerPoolLayout;