import React from "react";
import Search from "./Search";
import Users from "./Users";
import { Building2, Users as UsersIcon } from 'lucide-react';

function Left() {
  return (
    <div className="w-[30%] min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 text-gray-800 flex flex-col border-r border-gray-200">
      {/* Header Section */}
      {/* <div className="p-6 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-xl mr-4">
            <Building2 className="h-6 w-6 text-[#143694]" />
          </div>
          <div>
            <h1 className="font-bold text-2xl bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
              Rawrecruit
            </h1>
            <p className="text-gray-600 text-sm mt-1">Talent Connection Platform</p>
          </div>
        </div>
      </div> */}

      {/* Search Section */}
      <div className="p-6 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mb-4 flex items-center">
          <UsersIcon className="h-5 w-5 text-[#143694] mr-2" />
          <h2 className="font-semibold text-lg text-gray-800">Active Connections</h2>
        </div>
        <Search />
      </div>

      {/* Users List Section */}
      <div className="flex-1 overflow-y-auto p-4 bg-white/50 backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800 text-lg">All Users</h3>
            {/* <span className="px-3 py-1 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 backdrop-blur-sm rounded-full text-sm border border-[#143694]/20">
              <span className="font-bold text-[#143694]">24</span> 
              <span className="text-gray-600 ml-1">online</span>
            </span> */}
          </div>
          <Users />
        </div>
        
      </div>

      {/* Footer */}
      {/* <div className="p-4 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-xs text-gray-500">© 2024 Rawrecruit Platform</p>
          <p className="text-xs text-gray-400 mt-1">Secure • Encrypted • Reliable</p>
        </div>
      </div> */}
    </div>
  );
}

export default Left;