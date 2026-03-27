import { useState } from "react";
import InternJobListings from "@/pages/students/studentDashboard/internshipOpportunity/InternJobListing";
import FInternJobListings from "@/pages/fresher/fresherDashboard/internshipOpportunity/InternJobListing";
import InternshipDetailModal from "./InternshipDetailModal";
import { X } from "lucide-react";

const InternshipLayout = ({ userType = 'student' }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomedView, setIsZoomedView] = useState(false);

  // Determine which listing component to use
  const ListingComponent = userType === 'fresher' ? FInternJobListings : InternJobListings;

  const handleJobSelect = (job) => {
    console.log('Opening internship details for:', job?.companyPosted?.companyDetails?.companyName);
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
        <div className="relative z-10 flex h-[82vh] w-full max-w-[1220px] mx-auto my-auto rounded-2xl overflow-hidden shadow-2xl">
          
          {/* ================= MODAL (Left) ================= */}
          <div className="w-[900px] h-full bg-white">
            <InternshipDetailModal
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
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">Other Internships</h2>
                  <p className="text-sm text-gray-600">Browse through other opportunities</p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Sidebar list */}
            <div className="p-4">
              <ListingComponent 
                compact={true}
                onJobSelect={handleJobSelect}
                selectedJobId={selectedJob?._id}
                hideSelected={true}
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
        <ListingComponent 
          onJobSelect={handleJobSelect}
        />
      </div>

      {/* Modal for normal view (fullscreen backdrop) */}
      {isModalOpen && selectedJob && !isZoomedView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <InternshipDetailModal
          matchScore={selectedJob.matchScore}
            jobId={selectedJob._id}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default InternshipLayout;