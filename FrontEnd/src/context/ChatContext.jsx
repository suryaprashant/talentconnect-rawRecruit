import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showFloatingChat, setShowFloatingChat] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        selectedConversation,
        setSelectedConversation,
        showFloatingChat,
        setShowFloatingChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);