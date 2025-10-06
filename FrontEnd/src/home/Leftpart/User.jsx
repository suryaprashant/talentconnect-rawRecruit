
import React from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";

function User({ user, unreadCount }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { socket, onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);
  const hasUnread = unreadCount > 0;

  return (
    <div
      className={`cursor-pointer border-b border-blue-700 last:border-b-0
        ${isSelected ? "bg-blue-700" : "hover:bg-blue-600"} 
        duration-200 p-3 relative`}
      onClick={() => setSelectedConversation(user)}
    >
      <div className="flex items-center space-x-4">
        {/* User Avatar */}
        <div className={`relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden ${isOnline ? 'ring-2 ring-green-500' : 'ring-2 ring-blue-500'}`}>
          <img 
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            className="object-cover w-full h-full rounded-full aspect-square"
            alt={user.name || user.email}
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-blue-800"></div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-lg text-white truncate">
              {user.name || user.email}
            </h1>
            {hasUnread && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-2 flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </div>
          {user.name && user.email && (
            <span className="text-sm text-blue-200 truncate">{user.email}</span>
          )}
          {user.userType && (
            <span className="text-xs text-blue-300 capitalize">{user.userType}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;