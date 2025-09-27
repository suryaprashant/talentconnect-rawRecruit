// import React, { useEffect } from "react";
// import { useSocketContext } from "./SocketContext";
// import useConversation from "../statemanage/useConversation.js";
// import sound from "../assets/notification.mp3";
// const useGetSocketMessage = () => {
//   const { socket } = useSocketContext();
//   const { messages, setMessage } = useConversation();

//   useEffect(() => {
//     socket.on("newMessage", (newMessage) => {
//       const notification = new Audio(sound);
//       notification.play();
//       setMessage([...messages, newMessage]);
//     });
//     return () => {
//       socket.off("newMessage");
//     };
//   }, [socket, messages, setMessage]);
// };
// export default useGetSocketMessage;



import React, { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import useConversation from "../statemanage/useConversation.js";
import sound from "../assets/notification.mp3";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { messages, setMessage, selectedConversation } = useConversation();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const notification = new Audio(sound);
      notification.play();
      
      // Check if the message belongs to the current conversation
      if (selectedConversation && 
          (newMessage.senderId === selectedConversation._id || 
           newMessage.receiverId === selectedConversation._id)) {
        setMessage([...messages, newMessage]);
      }
      // Even if it doesn't belong to current conversation, you might want to:
      // - Show a notification
      // - Update conversation list to show "new message" indicator
    };

    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, messages, setMessage, selectedConversation]); // Added selectedConversation dependency
};

export default useGetSocketMessage;