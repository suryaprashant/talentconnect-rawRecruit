import React, { useEffect, useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";

const useGetMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      if (selectedConversation && selectedConversation._id) {
        try {
          const res = await axios.get(
            `/api/messages/get/${selectedConversation._id}`
          );

        
          
          // Ensure we're always working with an array
          const messagesData = Array.isArray(res.data) ? res.data : [];
          setMessage(messagesData);
          setLoading(false);
        } catch (error) {
          console.log("Error in getting messages", error);
          setMessage([]);
          setLoading(false);
        }
      }
      else{
        setMessage([]);  // clear messages when no conversation selected
      }
    };
    getMessages();
  }, [selectedConversation, setMessage]);
  
  return { loading, messages: Array.isArray(messages) ? messages : [] };
};

export default useGetMessage;