
import React from "react";

function Message({ message }) {
  const authUser = JSON.parse(localStorage.getItem("ChatAppUser"));

  // Ensure authUser and user are available for comparison
  const itsMe = authUser && authUser.user && message.senderId === authUser.user._id;

  const createdAt = new Date(message.createdAt);
  const formattedTime = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`p-2 flex ${itsMe ? "justify-end" : "justify-start"}`}> {/* Flex container for alignment */}
      <div className={`chat ${itsMe ? "chat-end" : "chat-start"}`}> {/* Keeps chat-end/chat-start from your original */}
        <div className={`chat-bubble text-white py-2 px-4 rounded-xl max-w-xs break-words ${itsMe ? "bg-blue-600" : "bg-gray-700"}`}> {/* Blue for sent, gray for received */}
          {message.message}
        </div>
        <div className="chat-footer text-xs opacity-75 mt-1 text-gray-400"> {/* Smaller, less prominent time */}
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

export default Message;