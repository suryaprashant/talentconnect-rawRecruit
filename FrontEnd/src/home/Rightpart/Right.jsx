

import React, { useEffect } from "react";
import Chatuser from "./Chatuser";
import Messages from "./Messages";
import Typesend from "./Typesend";
import useConversation from "../../statemanage/useConversation.js";
import { useLegacyAuth } from "../../context/AuthProvider.jsx";
import { CiMenuFries } from "react-icons/ci";

function Right({ isFloating = false }) {    
    const { selectedConversation } = useConversation();

    // Debug log to verify conversation is received
    useEffect(() => {
        console.log("Right component - Received selected conversation:", selectedConversation);
    }, [selectedConversation]);

    return (
        <div className={`w-full bg-white text-gray-800 flex flex-col ${
        isFloating ? "h-full" : "h-screen"
        }`}>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    <Chatuser />
                    <div className="flex-1 overflow-y-auto">
                        <Messages />
                    </div>
                    <Typesend />
                </>
            )}
        </div>
    );
}

export default Right;

const NoChatSelected = () => {
    const [authUser] = useLegacyAuth();

    return (
        <div className={`relative flex flex-col h-full items-center justify-center ${
        isFloating ? "p-4" : ""
        } bg-blue-100`}>
            <label
                htmlFor="my-drawer-2"
                className="btn btn-ghost drawer-button lg:hidden absolute top-4 left-4"
            >
                <CiMenuFries className="text-blue-800 text-2xl" />
            </label>
            <div className="text-center p-6 max-w-md">
                <h1 className="text-2xl font-bold mb-4">
                    Welcome{" "}
                    <span className="text-blue-600">
                        {authUser?.user?.name}
                    </span>
                </h1>
                <p className="text-lg">
                    No chat selected. Please select a contact from the left panel to start a conversation.
                </p>
            </div>
        </div>
    );
};