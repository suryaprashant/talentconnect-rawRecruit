import { useState } from "react";
import PoolEmployeeListing from "@/pages/company/employerDashboard/poolCampus/PoolEmployeeListing";
import PoolCampusDetailModal from "@/components/company/employerDashboard/poolCampus/PoolDetailModal";

const CompanyPoolCampusLayout = () => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomedView, setIsZoomedView] = useState(false);

  const handleOpportunitySelect = (opportunity) => {
    console.log('Opening details for:', opportunity?.collegePosted?.collegeUniversityDetails?.collegeName);
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
    setIsZoomedView(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOpportunity(null);
    setIsZoomedView(false);
  };

  /* ======================================================
     ZOOMED VIEW — MODAL + SIDEBAR COMBINED
  ====================================================== */
  if (isZoomedView && isModalOpen && selectedOpportunity) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop - ONLY behind the modal content, not sidebar */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        {/* Modal + Sidebar wrapper - NO backdrop here */}
        <div className="relative z-10 flex h-[82vh] w-full max-w-[1220px] mx-auto my-auto">
          
          {/* ================= MODAL (Left) ================= */}
          <div className="w-[900px] h-full rounded-l-2xl overflow-hidden shadow-2xl bg-white relative">
            <PoolCampusDetailModal
              college={selectedOpportunity}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </div>

          {/* ================= SIDEBAR (Right) ================= */}
          <div className="w-[320px] h-full border-l border-gray-200 shadow-2xl rounded-r-2xl overflow-hidden bg-white relative flex flex-col">
            
            {/* Sidebar header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Other Pool Opportunities</h2>
                  <p className="text-sm text-gray-600">Browse through other pool campus opportunities</p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sidebar list */}
            <div className="p-4 flex-1 overflow-y-auto rounded-br-2xl">
              <PoolEmployeeListing 
                compact={true}
                onOpportunitySelect={handleOpportunitySelect}
                selectedOpportunityId={selectedOpportunity?._id}
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
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="h-full overflow-y-auto p-4 md:p-6">
        <PoolEmployeeListing 
          onOpportunitySelect={handleOpportunitySelect}
        />
      </div>

      {/* Modal for normal view (fullscreen backdrop) */}
      {isModalOpen && selectedOpportunity && !isZoomedView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <PoolCampusDetailModal
            college={selectedOpportunity}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default CompanyPoolCampusLayout;