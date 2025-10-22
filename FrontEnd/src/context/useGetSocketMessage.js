
import React, { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import useConversation from "../statemanage/useConversation.js";
import sound from "../assets/notification.mp3";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { messages, setMessage, selectedConversation } = useConversation();

  useEffect(() => {
    // Check if socket exists before setting up listeners
    if (!socket) {
      console.log("Socket not available yet");
      return;
    }

    const handleNewMessage = (newMessage) => {
      const notification = new Audio(sound);
      notification.play();
      
      // Check if the message belongs to the current conversation
      if (selectedConversation && 
          (newMessage.senderId === selectedConversation._id || 
           newMessage.receiverId === selectedConversation._id)) {
        setMessage([...messages, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    
    return () => {
      if (socket) {
        socket.off("newMessage", handleNewMessage);
      }
    };
  }, [socket, messages, setMessage, selectedConversation]);
};

export default useGetSocketMessage;