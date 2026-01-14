import { Outlet } from "react-router-dom";
import OffCampusJobs from "@/pages/students/studentDashboard/offCampusListing/offCampusJobListing";

const OffCampusLayout = () => {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* LEFT SIDE: Dynamic Detail View (OffCampusJobDetail) */}
      <div className="flex-1 overflow-y-auto border-r bg-white">
        <Outlet />
      </div>

      {/* RIGHT SIDE: Persistent Sidebar List */}
      <div className="w-[400px] overflow-y-auto bg-gray-50 border-l hidden lg:block">
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="font-bold text-gray-700">Explore Other Jobs</h2>
        </div>
        {/* Pass compact=true to trigger sidebar mode */}
        <OffCampusJobs compact={true} />
      </div>
    </div>
  );
};

export default OffCampusLayout;