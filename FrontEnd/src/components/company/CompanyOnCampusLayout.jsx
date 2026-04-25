import { useState } from "react";
import CollegeListingPage from "@/pages/company/employerDashboard/CollegeListingPage";
import CollegeDetailModal from "@/components/company/employerDashboard/CollegeDetailModal";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
const CompanyOnCampusLayout = () => {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomedView, setIsZoomedView] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openCollege) {
      handleCollegeSelect(location.state.openCollege);
    }
  }, [location.state]);

  const handleCollegeSelect = (college) => {
    console.log('Opening details for:', college?.collegePosted?.collegeUniversityDetails?.collegeName);
    setSelectedCollege(college);
    setIsModalOpen(true);
    setIsZoomedView(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCollege(null);
    setIsZoomedView(false);
  };

  /* ======================================================
     ZOOMED VIEW — MODAL + SIDEBAR COMBINED
  ====================================================== */
  if (isZoomedView && isModalOpen && selectedCollege) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop - ONLY behind the modal content, not sidebar */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        {/* Modal + Sidebar wrapper - NO backdrop here */}
        <div className="relative z-10 flex h-[82vh] w-full max-w-[1220px] mx-auto my-auto">
          
          {/* ================= MODAL (Left) ================= */}
          <div className="w-[900px] h-full rounded-l-2xl overflow-hidden shadow-2xl bg-white relative">
            <CollegeDetailModal
              college={selectedCollege}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </div>

          {/* ================= SIDEBAR (Right) ================= */}
          <div className="w-[320px] h-full border-l border-gray-200 shadow-2xl rounded-r-2xl overflow-hidden bg-white relative flex flex-col">
            
            {/* Sidebar header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-6 mt-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Other Opportunities</h2>
                  <p className="text-sm text-gray-600">Browse through other opportunities</p>
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
              <CollegeListingPage 
                compact={true}
                onCollegeSelect={handleCollegeSelect}
                selectedCollegeId={selectedCollege?._id}
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
    <div className="h-[calc(100vh-64px)] overflow-hidden min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="h-full overflow-y-auto p-4 md:p-6">
        <CollegeListingPage 
          onCollegeSelect={handleCollegeSelect}
        />
      </div>

      {/* Modal for normal view (fullscreen backdrop) */}
      {isModalOpen && selectedCollege && !isZoomedView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <CollegeDetailModal
            college={selectedCollege}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default CompanyOnCampusLayout;