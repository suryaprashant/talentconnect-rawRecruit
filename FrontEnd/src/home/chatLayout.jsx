// import React, { useEffect } from "react";
// import Left from "./Leftpart/Left";
// import Right from "./Rightpart/Right";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthProvider";
// import { Toaster } from "react-hot-toast";
// import useConversation from "../statemanage/useConversation";

// function ChatLayout() {
//   const [authUser] = useAuth();
//   const location = useLocation();
//   const { selectedConversation } = useConversation();

  

//   useEffect(() => {
//     console.log("Current selected conversation in ChatLayout:", selectedConversation);
//   }, [selectedConversation]);

//   if (!authUser) {
//     return <Navigate to="/login" />;
//   }

//   return (
//     <div className="flex h-screen bg-fixed">
//       <Toaster />
//       <Left />
//       <Right />
//     </div>
//   );
// }

// export default ChatLayout;


import React, { useEffect } from "react";
import Left from "./Leftpart/Left";
import Right from "./Rightpart/Right";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { Toaster } from "react-hot-toast";
import useConversation from "../statemanage/useConversation";

function ChatLayout() {
    const [authUser] = useAuth();
    const location = useLocation();
    const { selectedConversation } = useConversation();

    // Debug log to track conversation state
    useEffect(() => {
        console.log("ChatLayout - Current selected conversation:", selectedConversation);
    }, [selectedConversation]);

    if (!authUser) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen bg-fixed">
            <Toaster />
            <Left />
            <Right />
        </div>
    );
}

export default ChatLayout;