import React, { useState } from "react";
import useConversation from "../statemanage/useConversation";
import Right from "./Rightpart/Right";
import Left from "./Leftpart/Left";
import { MessageCircle, ArrowLeft, X } from "lucide-react";

function FloatingMessenger() {
  const [open, setOpen] = useState(false);
  const { selectedConversation, setSelectedConversation } = useConversation();

  // Closed state (icon like LinkedIn)
  if (!open) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          onClick={() => setOpen(true)}
          className="bg-[#143694] text-white p-4 rounded-full shadow-lg"
        >
          <MessageCircle />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[380px] h-[500px] bg-white shadow-2xl rounded-xl z-[9999] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
        
        {/* Left side */}
        <div className="flex items-center gap-2">
          {selectedConversation && (
            <button onClick={() => setSelectedConversation(null)}>
              <ArrowLeft size={18} />
            </button>
          )}
          <span className="font-medium">
            {selectedConversation ? selectedConversation.name : "Messages"}
          </span>
        </div>

        {/* Close */}
        <button onClick={() => setOpen(false)}>
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        {!selectedConversation ? (
          <Left isFloating/>   // 👈 show users
        ) : (
          <Right isFloating/>  // 👈 show chat
        )}
      </div>
    </div>
  );
}

export default FloatingMessenger;