import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessage from "../../context/useGetMessage.js";
import Loading from "../../components/Loading.jsx";
import useGetSocketMessage from "../../context/useGetSocketMessage.js";

function Messages() {
  const { loading, messages } = useGetMessage();
  //useGetSocketMessage(); // Listening for incoming messages

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
          block: "end" // Scroll to the end of the element
        });
      }
    }, 100);
  }, [messages]);

   // Ensure messages is always an array
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div
      className="flex-1 overflow-y-auto p-4 custom-scrollbar" // Added padding and a custom-scrollbar class (define in your global CSS if needed)
      style={{ minHeight: "calc(92vh - 8vh)" }} // This height looks correct relative to parent
    >
      {loading ? (
        <Loading />
      ) : (
        // messages.length > 0 ? (
        //   messages.map((message) => (
        //     <div key={message._id} ref={lastMsgRef}> {/* Only last message gets the ref */}
        //       <Message message={message} />
        //     </div>
        //   ))
          safeMessages.length > 0 ? (
          safeMessages.map((message, index) => (
            <div 
              key={message._id || index} 
              ref={index === safeMessages.length - 1 ? lastMsgRef : null}
            >
              <Message message={message} />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full"> {/* Center content */}
            <p className="text-center text-blue-700 mt-52 text-2xl">
              Say Hi to start the conversation!
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default Messages;