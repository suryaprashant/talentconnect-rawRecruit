import { React, useEffect } from "react";
import User from "./User";
import useGetAllUsers from "../../context/useGetAllUsers";
import Loading from "../../components/Loading";
import useConversation from "../../statemanage/useConversation";
import { Users as UsersIcon, MessageSquare, UserPlus } from 'lucide-react';
import { useChat } from "@/context/ChatContext";

function Users() {
  const [allUsers, loading, unreadCounts, refreshUsers] = useGetAllUsers();
  const { selectedConversation } = useChat();

  useEffect(() => {
    if (selectedConversation) {
      refreshUsers();
    }
  }, [selectedConversation]);

  const usersWithConversations = allUsers.filter(
    (user) => unreadCounts[user._id] !== undefined
  );

  const newUsers = allUsers.filter(
    (user) => unreadCounts[user._id] === undefined
  );

  // Calculate total unread messages
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="rounded-2xl overflow-hidden">
      {/* Header */}
      {/* <div className="px-6 py-4 bg-gradient-to-r from-white to-white/95 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
            <UsersIcon className="h-5 w-5 text-[#143694]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Contacts</h1>
            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                {allUsers.length} total
              </span>
              {totalUnread > 0 && (
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#143694] mr-1"></div>
                  {totalUnread} unread
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button 
          onClick={refreshUsers}
          className="p-2 text-gray-500 hover:text-[#143694] hover:bg-gradient-to-r hover:from-[#143694]/10 hover:to-[#1e4ed8]/10 rounded-lg transition-all duration-200"
          title="Refresh contacts"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div> */}

      {/* Users Container - Removed fixed height */}
      <div className="bg-gradient-to-b from-white/50 to-gray-50/30">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#143694]"></div>
              <p className="mt-3 text-sm text-gray-500">Loading contacts...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Recent Chats Section */}
            {usersWithConversations.length > 0 && (
              <div className="mb-6">
                <div className="sticky top-0 z-10 px-4 py-3 bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5 border-b border-gray-200">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 text-[#143694] mr-2" />
                    <h3 className="text-sm font-semibold text-gray-800">Recent Chats</h3>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] rounded-full">
                      {usersWithConversations.length}
                    </span>
                  </div>
                </div>
                {usersWithConversations.map((user) => (
                  <User
                    key={user._id}
                    user={user}
                    unreadCount={unreadCounts[user._id] || 0}
                  />
                ))}
              </div>
            )}

            {/* New Users Section */}
            {newUsers.length > 0 && (
              <div>
                <div className="sticky top-0 z-10 px-4 py-3 bg-gradient-to-r from-gray-100 to-white/50 border-b border-gray-200">
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 text-gray-600 mr-2" />
                    <h3 className="text-sm font-semibold text-gray-800">New Contacts</h3>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                      {newUsers.length}
                    </span>
                  </div>
                </div>
                {newUsers.map((user) => (
                  <User key={user._id} user={user} unreadCount={0} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {allUsers.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 flex items-center justify-center mb-4">
                  <UsersIcon className="h-8 w-8 text-[#143694]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Contacts Found</h3>
                <p className="text-gray-600 text-sm max-w-sm">
                  Start a conversation by searching for users or wait for them to connect with you.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Users;