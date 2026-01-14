import { Outlet } from "react-router-dom";
import PoolEmployeeListing from "@/pages/company/employerDashboard/poolCampus/PoolEmployeeListing";

const CompanyPoolCampusLayout = () => {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* LEFT SIDE: Dynamic Detail View (PoolCampusEmployeeDash) */}
      <div className="flex-1 overflow-y-auto border-r bg-white">
        <Outlet />
      </div>

      {/* RIGHT SIDE: Persistent Sidebar List */}
      <div className="w-[400px] overflow-y-auto bg-gray-50 border-l hidden lg:block">
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="font-bold text-gray-700">Other Pool Opportunities</h2>
        </div>
        {/* Pass compact=true to show the slim version in the sidebar */}
        <PoolEmployeeListing compact={true} />
      </div>
    </div>
  );
};

export default CompanyPoolCampusLayout;