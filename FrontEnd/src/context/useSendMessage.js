// import React, { useState } from "react";
// import useConversation from "../statemanage/useConversation.js";



// const useSendMessage = () => {
//   const [loading, setLoading] = useState(false);
//   const { messages, setMessage, selectedConversation } = useConversation();
//   const sendMessages = async (message) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `/api/messages/send/${selectedConversation._id}`,
//         { message }
//       );
//       setMessage([...messages, res.data]);
//       setLoading(false);
//     } catch (error) {
//       console.log("Error in send messages", error);
//       setLoading(false);
//     }
//   };
//   return { loading, sendMessages };
// };

// export default useSendMessage;




// Enhanced useSendMessage hook
import React, { useState } from "react";
import axios from "../lib/axiosInstance.js";
import toast from "react-hot-toast";
import { useChat } from "./ChatContext.jsx";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { setMessages, selectedConversation } = useChat();

  const sendMessages = async (message) => {
    if (!selectedConversation || !selectedConversation._id) {
      toast.error("No conversation selected");
      return;
    }

    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/messages/send/${selectedConversation._id}`,
        { message },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data && res.data._id) {
        setMessages((prev) => [
          ...prev,
          {
            ...res.data,
            sender: "you", // 👈 FIX
          },
        ]);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error in send messages:", error);
      toast.error(error.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;