import React from "react";

const ServiceRequestManagement = () => {
  return (
    <main className="min-h-screen">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="responsive-title font-bold text-slate-900 mb-2">
              Service Request Management
            </h1>
            <p className="text-slate-600">
              Manage and track service requests from candidates, colleges, and companies
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg px-3 py-1">
              25 requests
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Requests", count: 25, color: "text-slate-700" },
            { label: "Pending", count: 4, color: "text-yellow-700" },
            { label: "In Progress", count: 7, color: "text-blue-700" },
            { label: "Completed", count: 11, color: "text-green-700" },
            { label: "Rejected", count: 3, color: "text-red-700" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card text-card-foreground shadow text-center"
            >
              <div className="p-6 pt-6">
                <div className={`text-2xl font-bold ${item.color}`}>
                  {item.count}
                </div>
                <div className="text-sm text-slate-600">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Type Breakdown */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="font-semibold leading-none tracking-tight">
              Service Type Breakdown
            </div>
            <div className="text-sm text-muted-foreground">
              Overview of different types of service requests
            </div>
          </div>

          <div className="p-6 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                "Career Counseling",
                "Career Craft",
                "Mock Interview",
                "Seminar",
                "Training Program",
                "Campus Branding",
                "Campus Placement",
              ].map((type, i) => (
                <div
                  key={i}
                  className="text-center p-3 bg-slate-50 rounded-lg"
                >
                  <div className="text-lg font-bold text-slate-800">
                    {Math.floor(Math.random() * 6) + 2}
                  </div>
                  <div className="text-xs text-slate-600 capitalize">
                    {type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="font-semibold leading-none tracking-tight flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-settings w-5 h-5"
              >
                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>All Service Requests</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Manage and respond to service requests from platform users
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 pt-0">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
              <div className="flex-1 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                >
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                  placeholder="Search by requester, service type, or description..."
                />
              </div>

              <button className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm w-48">
                <span>All Requesters</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>

              <button className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm w-48">
                <span>All Status</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>

            {/* Table Placeholder */}
            <div className="border rounded-lg overflow-hidden">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-slate-50">
                    <tr>
                      <th className="text-left px-2 py-3 font-medium text-slate-600">
                        Requester
                      </th>
                      <th className="text-left px-2 py-3 font-medium text-slate-600">
                        Service Type
                      </th>
                      <th className="text-left px-2 py-3 font-medium text-slate-600">
                        Description
                      </th>
                      <th className="text-left px-2 py-3 font-medium text-slate-600">
                        Status
                      </th>
                      <th className="text-left px-2 py-3 font-medium text-slate-600">
                        Requested Date
                      </th>
                      <th className="text-left px-2 py-3 font-medium text-slate-600">
                        Assigned To
                      </th>
                      <th className="text-right px-2 py-3 font-medium text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-slate-50 border-b">
                      <td className="p-2">Rahul Sharma</td>
                      <td className="p-2">Career Craft</td>
                      <td className="p-2">Request for branding service</td>
                      <td className="p-2 text-blue-700">In Progress</td>
                      <td className="p-2">10/3/2025</td>
                      <td className="p-2">Unassigned</td>
                      <td className="p-2 text-right">👁️</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-600">
                Showing 1 to 10 of 25 requests
              </div>
              <div className="flex space-x-2">
                <button
                  disabled
                  className="inline-flex items-center justify-center border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                >
                  Previous
                </button>
                <button className="inline-flex items-center justify-center border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServiceRequestManagement;
