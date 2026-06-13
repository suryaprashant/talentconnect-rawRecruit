import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessage from "../../context/useGetMessage.js";
import Loading from "../../components/Loading.jsx";
import useGetSocketMessage from "../../context/useGetSocketMessage.js";
import { MessageSquare } from 'lucide-react';

function Messages() {
  const { loading, messages } = useGetMessage();
  
  try {
    useGetSocketMessage(); // Listening for incoming messages
  } catch (error) {
    console.log("Socket message listener not available:", error);
  }

  const lastMsgRef = useRef();
  
  useEffect(() => {
    setTimeout(() => { 
      if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end"
        });
      }
    }, 100);
  }, [messages]);

  // Ensure messages is always an array
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="h-full">
      <div className="h-full flex flex-col">
        {/* Messages Content - Now takes full available space */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{
            background: "linear-gradient(to right, rgb(249 250 251), rgb(255 255 255))"
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
                <p className="mt-4 text-gray-600">Loading messages...</p>
              </div>
            </div>
          ) : safeMessages.length > 0 ? (
            <div className="space-y-6">
              {safeMessages.map((message, index) => (
                <div 
                  key={message._id || index} 
                  ref={index === safeMessages.length - 1 ? lastMsgRef : null}
                  className="transition-all duration-200"
                >
                  <div className={`p-5 rounded-2xl ${
                    message.sender === "you" 
                      ? "bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 border border-[#143694]/20 ml-auto max-w-md" 
                      : "bg-gradient-to-r from-gray-50 to-white border border-gray-200 mr-auto max-w-md"
                  }`}>
                    <Message message={message} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-[#143694]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Start a Conversation
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-8">
                Say Hi to start the conversation and connect with your contacts!
              </p>
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 max-w-md">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center">
                    <span className="text-[#143694] font-bold">H</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Hello!</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Type your first message to get started...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel - Moved outside the scrollable area */}
        {!loading && safeMessages.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-lg mr-3">
                <MessageSquare className="h-5 w-5 text-[#143694]" />
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{safeMessages.length}</span> message{safeMessages.length !== 1 ? 's' : ''} in this conversation
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Scroll to see older messages
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;