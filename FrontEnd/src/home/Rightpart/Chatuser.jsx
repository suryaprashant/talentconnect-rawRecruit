
import React from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { Circle } from 'lucide-react';

function Chatuser() {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const isOnline = selectedConversation && onlineUsers.includes(selectedConversation._id);

  if (!selectedConversation) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-6 border-b border-gray-100/30">
      <div>
        <div className={`relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden ${isOnline ? 'ring-2 ring-green-400 shadow-lg shadow-green-400/30' : 'ring-2 ring-white/30 shadow-lg'}`}>
          <img 
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            className="rounded-full object-cover w-full h-full aspect-square"
            alt={selectedConversation.fullname || selectedConversation.name || selectedConversation.email}
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold tracking-tight">
          {selectedConversation.fullname || selectedConversation.name || selectedConversation.email}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center text-sm ${isOnline ? "text-green-300 font-medium" : "text-gray-300"}`}>
            {isOnline ? (
              <>
                <Circle className="w-2 h-2 mr-1.5 fill-green-400" />
                Online
              </>
            ) : (
              "Offline"
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Chatuser;