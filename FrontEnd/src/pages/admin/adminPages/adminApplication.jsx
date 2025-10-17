import React from "react";

const ApplicationTracking = () => {
  return (
    <main className="min-h-screen">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="responsive-title font-bold text-slate-900 mb-2">
              Application Tracking
            </h1>
            <p className="text-slate-600">
              Monitor and track all candidate applications across positions
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors 
                         focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                         disabled:pointer-events-none disabled:opacity-50 
                         border border-input shadow-sm hover:bg-accent hover:text-accent-foreground 
                         h-9 px-4 py-2 flex items-center space-x-2"
              data-testid="export-applications-btn"
            >
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
                className="lucide lucide-download w-4 h-4"
                aria-hidden="true"
              >
                <path d="M12 15V3"></path>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <path d="m7 10 5 5 5-5"></path>
              </svg>
              <span>Export</span>
            </button>

            <div
              className="inline-flex items-center rounded-md border font-semibold transition-colors 
                         focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                         border-transparent bg-secondary text-secondary-foreground 
                         hover:bg-secondary/80 text-lg px-3 py-1"
            >
              40 applications
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Applications", count: 40, color: "text-slate-700" },
            { label: "Applied", count: 12, color: "text-blue-700" },
            { label: "Shortlisted", count: 10, color: "text-yellow-700" },
            { label: "Accepted", count: 11, color: "text-green-700" },
            { label: "Rejected", count: 7, color: "text-red-700" },
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
                className="lucide lucide-file-text w-5 h-5"
                aria-hidden="true"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 9H8"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
              </svg>
              <span>All Applications</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Track and manage candidate applications across all positions
            </div>
          </div>

          {/* Search & Filter */}
          <div className="p-6 pt-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
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
                  aria-hidden="true"
                >
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors 
                             placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                             disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                  placeholder="Search by candidate, job title, company, or college..."
                  data-testid="application-search-input"
                />
              </div>

              <button
                type="button"
                className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent 
                           px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed 
                           disabled:opacity-50 w-48"
              >
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
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>

            {/* Applications Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="table-header">
                    <tr className="border-b hover:bg-muted/50">
                      <th className="h-10 px-2 text-left font-medium text-muted-foreground">
                        Candidate
                      </th>
                      <th className="h-10 px-2 text-left font-medium text-muted-foreground">
                        Position
                      </th>
                      <th className="h-10 px-2 text-left font-medium text-muted-foreground">
                        Company
                      </th>
                      <th className="h-10 px-2 text-left font-medium text-muted-foreground">
                        College
                      </th>
                      <th className="h-10 px-2 text-left font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-10 px-2 text-left font-medium text-muted-foreground">
                        Applied Date
                      </th>
                      <th className="h-10 px-2 text-left font-medium text-muted-foreground">
                        Last Updated
                      </th>
                      <th className="h-10 px-2 text-right font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Example row (repeat with map if dynamic) */}
                    <tr className="border-b hover:bg-slate-50">
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
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
                            className="lucide lucide-user w-4 h-4 text-slate-400"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span className="font-medium">Rahul Sharma</span>
                        </div>
                      </td>
                      <td className="p-2">Software Engineer</td>
                      <td className="p-2">TechCorp India</td>
                      <td className="p-2">College 1</td>
                      <td className="p-2">
                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold 
                                       bg-blue-100 text-blue-700">
                          Applied
                        </div>
                      </td>
                      <td className="p-2">9/22/2025</td>
                      <td className="p-2">10/7/2025</td>
                      <td className="p-2 text-right">
                        <button className="inline-flex items-center justify-center gap-2 rounded-md border border-input shadow-sm 
                                           hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs">
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
                            className="lucide lucide-eye w-4 h-4"
                          >
                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-600">
                Showing 1 to 10 of 40 applications
              </div>
              <div className="flex space-x-2">
                <button
                  className="inline-flex items-center justify-center gap-2 border border-input shadow-sm 
                             hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                  disabled
                >
                  Previous
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 border border-input shadow-sm 
                             hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                >
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

export default ApplicationTracking;
