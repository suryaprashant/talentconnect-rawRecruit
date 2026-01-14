import { Outlet } from "react-router-dom";
import JobsListingPage from "@/pages/college/collegeDashboard/onCampusOpportunity/JobListingPage";

const OnCampusLayout = () => {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* LEFT SIDE: Detailed content of the selected job */}
      <div className="flex-1 overflow-y-auto border-r bg-white">
        <Outlet />
      </div>

      {/* RIGHT SIDE: Vertical list of all other available jobs */}
      <div className="w-[400px] overflow-y-auto bg-gray-50 border-l">
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="font-bold text-gray-700">Other Opportunities</h2>
        </div>
        {/* Pass compact prop to hide the main page header/stats in the sidebar */}
        <JobsListingPage compact={true} />
      </div>
    </div>
  );
};
export default OnCampusLayout;