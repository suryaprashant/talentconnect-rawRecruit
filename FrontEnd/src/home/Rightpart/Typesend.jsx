import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import useSendMessage from "../../context/useSendMessage.js";
import { Send } from 'lucide-react';

function Typesend() {
  const [message, setMessage] = useState("");
  const { loading, sendMessages } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return; // Prevent sending empty messages
    await sendMessages(message);
    setMessage("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 bg-white/90 backdrop-blur-sm border-t border-gray-100"
    >
      <div className="flex space-x-3 items-center">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 py-3 px-4 rounded-full border border-[#667eea]/30 bg-gradient-to-r from-gray-50 to-white outline-none focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-200"
        />
        <button
          type="submit"
          className="p-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-[#667eea]/30 duration-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <Send className="text-xl" />
          )}
        </button>
      </div>
    </form>
  );
}

export default Typesend;