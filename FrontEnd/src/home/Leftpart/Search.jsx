import React, { useState } from "react";
import { Search as SearchIcon } from 'lucide-react';
import useGetAllUsers from "../../context/useGetAllUsers";
import useConversation from "../../statemanage/useConversation";
import toast from "react-hot-toast";

function Search() {
  const [search, setSearch] = useState("");
  const [allUsers, loading, unreadCounts] = useGetAllUsers();
  const { setSelectedConversation } = useConversation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    
    // Search in both name and email
    const conversation = allUsers.find((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.fullname?.toLowerCase().includes(search.toLowerCase())
    );
    
    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      toast.error("User not found");
    }
  };

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-[#143694]" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl 
                       bg-gradient-to-r from-gray-50 to-white 
                       focus:outline-none focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent
                       placeholder-gray-400 text-gray-800 text-sm
                       transition-all duration-200"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <div className="p-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200">
              <SearchIcon className="h-4 w-4 text-white" />
            </div>
          </button>
        </div>
        
        {/* Search Info */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>{allUsers.length} users available</span>
          </div>
          <div className="text-gray-400">
            Press Enter to search
          </div>
        </div>
      </form>

      {/* Recent Searches (Optional) */}
      {search && allUsers.some(user => 
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.fullname?.toLowerCase().includes(search.toLowerCase())
      ) && (
        <div className="mt-4 p-3 bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5 rounded-xl border border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">Quick results for "{search}"</p>
          <div className="space-y-2">
            {allUsers
              .filter(user => 
                user.name?.toLowerCase().includes(search.toLowerCase()) ||
                user.email?.toLowerCase().includes(search.toLowerCase()) ||
                user.fullname?.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, 3)
              .map(user => (
                <button
                  key={user._id}
                  onClick={() => {
                    setSelectedConversation(user);
                    setSearch("");
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-white/50 transition-colors duration-150 flex items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-[#143694]">
                      {user.name?.charAt(0) || user.fullname?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {user.name || user.fullname}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;