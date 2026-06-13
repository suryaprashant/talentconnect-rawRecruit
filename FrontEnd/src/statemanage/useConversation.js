import { create } from "zustand";
import { persist } from 'zustand/middleware';

const useConversation = create(
  persist(
    (set) => ({
      selectedConversation: null,
      setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
      messages: [],
      setMessage: (messages) => set({ messages }),
    }),
    {
      name: 'conversation-storage', 
    }
  )
);

export default useConversation;