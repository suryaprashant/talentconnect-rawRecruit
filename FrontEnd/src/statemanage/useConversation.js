// import { create } from "zustand";

// const useConversation = create((set) => ({
//   selectedConversation: null,
//   setSelectedConversation: (selectedConversation) =>
//     set({ selectedConversation }),
//   messages: [],
//   setMessage: (messages) => set({ messages }),
// }));
// export default useConversation;


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
      name: 'conversation-storage', // unique name for localStorage
    }
  )
);

export default useConversation;