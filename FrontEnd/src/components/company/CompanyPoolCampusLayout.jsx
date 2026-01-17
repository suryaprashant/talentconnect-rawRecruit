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

  // Zoomed view with modal + sidebar
  if (isZoomedView && isModalOpen && selectedOpportunity) {
    return (
      <div className="fixed inset-0 z-50 flex bg-white">
        {/* Left: Pool Campus Detail Modal - with CSS override to remove backdrop */}
        <div className="flex-1 overflow-hidden relative">
          {/* Override the modal backdrop styles */}
          <div className="h-full w-full [&_.bg-black\\/50]:!bg-white [&_.backdrop-blur-sm]:!backdrop-blur-none [&_.fixed]:!relative [&_.absolute]:!relative [&_.z-50]:!z-10 [&_.overflow-hidden]:!overflow-auto">
            <PoolCampusDetailModal
              college={selectedOpportunity}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </div>
        </div>
        
        {/* Right: Sidebar with other pool opportunities */}
        <div className="w-80 flex-shrink-0 border-l bg-white shadow-lg overflow-y-auto">
          <div className="p-6 border-b bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Other Pool Opportunities</h2>
            <p className="text-sm text-gray-600">Browse through other pool campus opportunities</p>
          </div>
          <div className="p-4">
            <PoolEmployeeListing 
              compact={true}
              onOpportunitySelect={handleOpportunitySelect}
            />
          </div>
        </div>
      </div>
    );
  }

  // Normal view - Just the listings
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="h-full overflow-y-auto">
        <div className="p-4 md:p-6">
          <PoolEmployeeListing 
            onOpportunitySelect={handleOpportunitySelect}
          />
        </div>
      </div>

      {/* Modal for normal view (not zoomed) */}
      {isModalOpen && selectedOpportunity && !isZoomedView && (
        <PoolCampusDetailModal
          college={selectedOpportunity}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CompanyPoolCampusLayout;