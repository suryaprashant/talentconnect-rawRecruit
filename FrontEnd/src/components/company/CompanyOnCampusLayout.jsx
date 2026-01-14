import { Outlet } from "react-router-dom";
import CollegeListingPage from "@/pages/company/employerDashboard/CollegeListingPage";

const CompanyOnCampusLayout = () => {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* LEFT SIDE: The dynamic detail content (CollegeDetailPage) */}
      <div className="flex-1 overflow-y-auto border-r bg-white">
        <Outlet />
      </div>

      {/* RIGHT SIDE: The persistent sidebar list of colleges */}
      <div className="w-[400px] overflow-y-auto bg-gray-50 border-l hidden lg:block">
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="font-bold text-gray-700">Explore Other Colleges</h2>
        </div>
        {/* Pass compact=true to trigger the simplified sidebar mode */}
        <CollegeListingPage compact={true} />
      </div>
    </div>
  );
};

export default CompanyOnCampusLayout;