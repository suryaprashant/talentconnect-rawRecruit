import { useState } from "react";
import OffCampusJobs from "@/pages/students/studentDashboard/offCampusListing/offCampusJobListing";
import FOffCampusListings from "@/pages/fresher/fresherDashboard/offCampusListing/offCampusJobListing";
import OffCampusJobDetailModal from "./OffCampusJobDetailModal";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
const OffCampusLayout = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomedView, setIsZoomedView] = useState(false);
  const location = useLocation(); 
  useEffect(() => {
    if (location.state?.openCollege) {
      handleJobSelect(location.state.openCollege);
    }
  }, [location.state]);
  // Determine which component to use based on route
  const userType = window.location.pathname.includes('fresher-dashboard') ? 'fresher' : 'student';
  const ListingComponent = userType === 'fresher' ? FOffCampusListings : OffCampusJobs;

  const handleJobSelect = (job) => {
    console.log('Opening details for:', job?.companyPosted?.companyDetails?.companyName);
    setSelectedJob(job);
    setIsModalOpen(true);
    setIsZoomedView(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setIsZoomedView(false);
  };

  // Zoomed view with modal + sidebar
  if (isZoomedView && isModalOpen && selectedJob) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop - ONLY behind the modal content, not sidebar */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        {/* Modal + Sidebar wrapper */}
        <div className="relative z-10 flex h-[82vh] w-full max-w-[1220px] mx-auto my-auto rounded-2xl overflow-hidden shadow-2xl">
          
          {/* ================= MODAL (Left) ================= */}
          <div className="w-[900px] h-full bg-white">
            <OffCampusJobDetailModal
              jobId={selectedJob._id}
              matchScore={selectedJob.matchScore}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              isInZoomedView={true}
            />
          </div>

          {/* ================= SIDEBAR (Right) ================= */}
          <div className="w-[320px] h-full bg-white border-l overflow-y-auto">
            
            {/* Sidebar header */}
            <div className="sticky top-0 z-20 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">Other Jobs</h2>
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
            <div className="p-4">
              <ListingComponent 
                compact={true}
                onJobSelect={handleJobSelect}
                selectedJobId={selectedJob?._id}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal view - Just the listings
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="h-full overflow-y-auto p-4 md:p-6">
        <ListingComponent 
          onJobSelect={handleJobSelect}
        />
      </div>

      {/* Modal for normal view (fullscreen backdrop) */}
      {isModalOpen && selectedJob && !isZoomedView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <OffCampusJobDetailModal
            jobId={selectedJob._id}
            matchScore={selectedJob.matchScore}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default OffCampusLayout;