import React from "react";

const JobDriveManagement = () => {
  return (
    <main className="min-h-screen">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="responsive-title font-bold text-slate-900 mb-2">
              Job & Drive Management
            </h1>
            <p className="text-slate-600">
              Manage all job postings, internships, and campus drives
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg px-3 py-1">
              15 positions
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { count: 15, label: "Total Jobs", color: "text-blue-700" },
            { count: 1, label: "Full-time Jobs", color: "text-green-700" },
            { count: 3, label: "Internships", color: "text-purple-700" },
            { count: 3, label: "On-campus", color: "text-orange-700" },
            { count: 3, label: "Off-campus", color: "text-teal-700" },
            { count: 5, label: "Hackathons", color: "text-pink-700" },
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
                className="lucide lucide-briefcase w-5 h-5"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
              <span>All Positions</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Browse and manage all job postings and opportunities
            </div>
          </div>

          {/* Search and Filter */}
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
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                  placeholder="Search jobs by title, company, or location..."
                />
              </div>
              <button
                type="button"
                className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm w-48"
              >
                <span>All Types</span>
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
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* Job Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b table-header">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      {[
                        "Position",
                        "Company",
                        "Type",
                        "Location",
                        "Salary",
                        "Applications",
                        "Posted",
                        "Actions",
                      ].map((header, i) => (
                        <th
                          key={i}
                          className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground ${
                            header === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="[&_tr:last-child]:border-0">
                    {/* You can dynamically map through job data here */}
                    {/* Example static row: */}
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-2 align-middle">
                        <div className="space-y-1">
                          <div className="font-medium">Software Engineer</div>
                          <div className="text-sm text-slate-500">
                            Exciting opportunity at TechCorp India...
                          </div>
                        </div>
                      </td>
                      <td className="p-2 align-middle font-medium">
                        TechCorp India
                      </td>
                      <td className="p-2 align-middle">
                        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700">
                          Internship
                        </span>
                      </td>
                      <td className="p-2 align-middle">Bangalore</td>
                      <td className="p-2 align-middle text-green-700">4 LPA</td>
                      <td className="p-2 align-middle">13 applications</td>
                      <td className="p-2 align-middle">10/4/2025</td>
                      <td className="p-2 align-middle text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="border border-input shadow-sm hover:bg-accent h-8 rounded-md px-3 text-xs">
                            View
                          </button>
                          <button className="border border-input shadow-sm hover:bg-accent h-8 rounded-md px-3 text-xs text-red-600">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-600">
                Showing 1 to 10 of 15 positions
              </div>
              <div className="flex space-x-2">
                <button
                  className="border border-input shadow-sm h-8 rounded-md px-3 text-xs"
                  disabled
                >
                  Previous
                </button>
                <button className="border border-input shadow-sm h-8 rounded-md px-3 text-xs">
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

export default JobDriveManagement;
