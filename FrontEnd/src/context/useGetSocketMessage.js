import React, { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import sound from "../assets/notification.mp3";
import { useChat } from "./ChatContext";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { setMessages, selectedConversation } = useChat();

  useEffect(() => {
    if (!socket) {
      console.log("Socket not available yet");
      return;
    }

    const handleNewMessage = (newMessage) => {
      const isSameConversation =
        selectedConversation &&
        (
          String(newMessage.senderId) === String(selectedConversation._id) ||
          String(newMessage.receiverId) === String(selectedConversation._id)
        );

      if (isSameConversation) {
        const formattedMessage = {
          ...newMessage,
          sender:
            String(newMessage.senderId) === String(selectedConversation._id)
              ? "them"
              : "you",
        };

        setMessages((prev) => [...prev, formattedMessage]);
      }

      // play sound only for incoming
      if (String(newMessage.senderId) !== String(selectedConversation?._id)) {
        const notification = new Audio(sound);
        notification.play();
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation, setMessages]); // ✅ removed messages

};

export default useGetSocketMessage;
// import React, { useEffect } from "react";
// import { useSocketContext } from "./SocketContext";
// import useConversation from "../statemanage/useConversation.js";
// import sound from "../assets/notification.mp3";
// import { useChat } from "./ChatContext";
// const useGetSocketMessage = () => {
//   const { socket } = useSocketContext();
//   const { messages, setMessages, selectedConversation } = useChat();

//   useEffect(() => {
//     // Check if socket exists before setting up listeners
//     if (!socket) {
//       console.log("Socket not available yet");
//       return;
//     }

//     const handleNewMessage = (newMessage) => {
//       const notification = new Audio(sound);
//       notification.play();
      
//       // Check if the message belongs to the current conversation
//       if (selectedConversation && 
//           (newMessage.senderId === selectedConversation._id || 
//            newMessage.receiverId === selectedConversation._id)) {
//         setMessages([...messages, newMessage]);
//       }
//     };

//     socket.on("newMessage", handleNewMessage);
    
//     return () => {
//       if (socket) {
//         socket.off("newMessage", handleNewMessage);
//       }
//     };
//   }, [socket, messages, setMessages, selectedConversation]);
// };

// export default useGetSocketMessage;