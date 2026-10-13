import { useEffect, useState } from "react";
import { useChat } from "./ChatContext"; 
import axios from "../lib/axiosInstance.js";

const useGetMessage = () => {
  const [loading, setLoading] = useState(false);

  const { selectedConversation, messages, setMessages } = useChat();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) {
        setMessages([]);
        return;
      }

      setLoading(true);

      try {
        const res = await axios.get(
          `/api/messages/get/${selectedConversation._id}`
        );

        const messagesData = Array.isArray(res.data) ? res.data : [];

        // 👉 IMPORTANT: format messages here
        const formattedMessages = messagesData.map((msg) => ({
          ...msg,
          sender:
            String(msg.senderId) === String(selectedConversation._id)
              ? "them"
              : "you",
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.log("Error in getting messages", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation, setMessages]);

  return { loading, messages };
};

export default useGetMessage;
// import React, { useEffect, useState } from "react";
// import useConversation from "../statemanage/useConversation.js";
// import axios from "../lib/axiosInstance.js";

// const useGetMessage = () => {
//   const [loading, setLoading] = useState(false);
//   const { messages, setMessage, selectedConversation } = useConversation();

//   useEffect(() => {
//     const getMessages = async () => {
//       setLoading(true);
//       if (selectedConversation && selectedConversation._id) {
//         try {
//           const res = await axios.get(
//             `/api/messages/get/${selectedConversation._id}`
//           );

        
          
         
//           const messagesData = Array.isArray(res.data) ? res.data : [];
//           setMessage(messagesData);
//           setLoading(false);
//         } catch (error) {
//           console.log("Error in getting messages", error);
//           setMessage([]);
//           setLoading(false);
//         }
//       }
//       else{
//         setMessage([]);  
//       }
//     };
//     getMessages();
//   }, [selectedConversation, setMessage]);
  
//   return { loading, messages: Array.isArray(messages) ? messages : [] };
// };

// export default useGetMessage;