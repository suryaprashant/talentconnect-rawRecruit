import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [messages, setMessages] = useState([]);
  return (
    <ChatContext.Provider
      value={{
        selectedConversation,
        setSelectedConversation,
        showFloatingChat,
        setShowFloatingChat,
        messages,
        setMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);