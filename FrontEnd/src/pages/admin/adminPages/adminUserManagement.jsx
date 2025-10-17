import React from "react";
import { UserCheck, Building2, Briefcase, Users, Search, ChevronDown, Eye, Check, X, Trash2 } from "lucide-react";

const UserManagement = () => {
  return (
    <main className="min-h-screen">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="responsive-title font-bold text-slate-900 mb-2">
              User Management
            </h1>
            <p className="text-slate-600">
              Manage candidates, colleges, and companies on your platform
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center rounded-md border font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg px-3 py-1">
              40 users
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidate Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold leading-none tracking-tight flex items-center space-x-2 capitalize">
                <UserCheck className="w-4 h-4" />
                <span>candidates (15)</span>
              </div>
            </div>
            <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { color: "blue", label: "Total", value: 15 },
                { color: "green", label: "Active", value: 6 },
                { color: "yellow", label: "Pending", value: 6 },
                { color: "red", label: "Blocked", value: 3 },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`text-center p-3 bg-${item.color}-50 rounded-lg`}
                >
                  <div className={`text-2xl font-bold text-${item.color}-700`}>
                    {item.value}
                  </div>
                  <div className={`text-sm text-${item.color}-600`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* College Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold leading-none tracking-tight flex items-center space-x-2 capitalize">
                <Building2 className="w-4 h-4" />
                <span>colleges (10)</span>
              </div>
            </div>
            <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Same card format as above */}
              {[
                { color: "blue", label: "Total", value: 15 },
                { color: "green", label: "Active", value: 6 },
                { color: "yellow", label: "Pending", value: 6 },
                { color: "red", label: "Blocked", value: 3 },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`text-center p-3 bg-${item.color}-50 rounded-lg`}
                >
                  <div className={`text-2xl font-bold text-${item.color}-700`}>
                    {item.value}
                  </div>
                  <div className={`text-sm text-${item.color}-600`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold leading-none tracking-tight flex items-center space-x-2 capitalize">
                <Briefcase className="w-4 h-4" />
                <span>companies (15)</span>
              </div>
            </div>
            <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Same card format as above */}
              {[
                { color: "blue", label: "Total", value: 15 },
                { color: "green", label: "Active", value: 6 },
                { color: "yellow", label: "Pending", value: 6 },
                { color: "red", label: "Blocked", value: 3 },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`text-center p-3 bg-${item.color}-50 rounded-lg`}
                >
                  <div className={`text-2xl font-bold text-${item.color}-700`}>
                    {item.value}
                  </div>
                  <div className={`text-sm text-${item.color}-600`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="font-semibold leading-none tracking-tight flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>All Users</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Search, filter, and manage all platform users
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 pt-0 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Search by name, email, college, or company..."
              />
            </div>
            <button className="flex h-9 items-center justify-between w-48 border rounded-md px-3 py-2 text-sm shadow-sm">
              <span>All Types</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            <button className="flex h-9 items-center justify-between w-48 border rounded-md px-3 py-2 text-sm shadow-sm">
              <span>All Status</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">User</th>
                  <th className="p-2 text-left font-medium">Type</th>
                  <th className="p-2 text-left font-medium">Status</th>
                  <th className="p-2 text-left font-medium">Registered</th>
                  <th className="p-2 text-left font-medium">Last Active</th>
                  <th className="p-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Example user row */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="p-2">
                    <div className="space-y-1">
                      <div className="font-medium">Rahul Sharma</div>
                      <div className="text-sm text-slate-500">
                        rahul.sharma@email.com
                      </div>
                      <div className="text-xs text-slate-400">College 1</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4" />
                      <span>Candidate</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="inline-flex items-center rounded-md bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs font-semibold">
                      Pending
                    </div>
                  </td>
                  <td className="p-2">9/26/2025</td>
                  <td className="p-2">10/2/2025</td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="border rounded-md p-2 hover:bg-accent">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="border rounded-md p-2 hover:bg-accent">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="border rounded-md p-2 text-red-600 hover:text-red-700 hover:bg-accent">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserManagement;
