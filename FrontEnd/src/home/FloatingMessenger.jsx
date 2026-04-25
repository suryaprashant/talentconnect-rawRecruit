import React, { useEffect, useState } from "react";
import useConversation from "../statemanage/useConversation";
import { useLegacyAuth } from '../context/AuthProvider';
import Right from "./Rightpart/Right";
import Left from "./Leftpart/Left";
import { MessageCircle, ArrowLeft, X, ChevronUp, ChevronDown } from "lucide-react";
import axios from "axios";
import { useChat } from "../context/ChatContext";

function FloatingMessenger() {
  // const [open, setOpen] = useState(false);
  const { showFloatingChat, setShowFloatingChat } = useChat();
  const { selectedConversation, setSelectedConversation } = useChat();
  const [authuser] = useLegacyAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!authuser?.user?.userType) {
        setLoadingImage(false);
        return;
      }

      try {
        const userType = authuser.user.userType;
        let endpoint = "";

        switch (userType) {
          case "student":
            endpoint = "/api/student-onboarding/profile-data";
            break;
          case "fresher":
            endpoint = "/api/fresher-onboarding/profile-data";
            break;
          case "college":
            endpoint = "/api/college-onboarding/profile-data";
            break;
          case "company":
            endpoint = "/api/companyDashboard/getInformation";
            break;
          case "professional":
            endpoint = "/api/professional-onboarding/profile-data";
            break;
          case "employer":
            endpoint = "/api/dashboard/employer-data";
            break;
          default:
            setLoadingImage(false);
            return;
        }

        const backendUrl = import.meta.env.VITE_Backend_URL;

        const response = await axios.get(`${backendUrl}${endpoint}`, {
          withCredentials: true,
          headers:
            userType === "company" || userType === "employer"
              ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
              : {},
        });

        let imageUrl = null;

        switch (userType) {
          case "college":
            imageUrl =
              response.data?.data?.profileImage ||
              response.data?.data?.placementCoordinatorDetails?.profilePictureUrl;
            break;

          case "company":
            imageUrl =
              response.data?.profile?.profileImageUrl ||
              response.data?.profile?.companyDetails?.profileImageUrl ||
              response.data?.data?.profileImageUrl;
            break;

          case "employer":
            imageUrl =
              response.data?.profile?.profileImageUrl ||
              response.data?.profile?.employerDetails?.profileImageUrl ||
              response.data?.data?.profileImageUrl;
            break;

          default:
            imageUrl =
              response.data?.data?.profileImage ||
              response.data?.data?.profileImageUrl;
        }

        if (imageUrl) setProfileImage(imageUrl);
      } catch (err) {
        console.log("Profile image error:", err);
      } finally {
        setLoadingImage(false);
      }
    };

    // 🔥 IMPORTANT FIX (prevents multiple API calls)
    if (authuser && !profileImage) {
      fetchProfileImage();
    }
  }, [authuser]);

  const getUserName = () => {
        let name = authuser?.user?.name || authuser?.user?.email || 'User';
        return name;
    };

    // Get the first letter of user name for avatar
  const getUserInitial = () => {
        return getUserName().charAt(0).toUpperCase();
    };


  // ✅ CLOSED (LinkedIn bar)
  if (!showFloatingChat) {
    return (
      <div className="fixed bottom-0 right-6 z-[9999]">
        <div
          onClick={() => setShowFloatingChat(true)}
          className="bg-white border border-gray-300 border-b-0 rounded-t-xl px-4 py-3 w-[260px] flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition"
        >
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <div className="relative">
        {profileImage ? (
          <img
            src={profileImage}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#143694] flex items-center justify-center text-white text-sm font-semibold">
            {getUserInitial()}
          </div>
        )}

        {/* GREEN DOT */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      <span className="text-sm font-medium text-gray-800">
        Messaging
      </span>
    </div>

    {/* RIGHT (this is what you're missing) */}
    <div className="flex items-center gap-3 text-gray-500">
      <ChevronUp size={20} />
    </div>
  </div>
</div>
    );
  }

  // ✅ OPEN (LinkedIn dock panel)
  return (
    <div className="fixed bottom-0 right-6 z-[9999] flex flex-col">

      {/* HEADER TAB */}
      <div className="bg-white border border-gray-300 border-b-0 rounded-t-xl px-4 py-2 flex items-center justify-between shadow-md">
  
        {/* LEFT */}
        <div className="flex items-center gap-3">
          
          {selectedConversation && (
            <button onClick={() => setSelectedConversation(null)}>
              <ArrowLeft size={16} />
            </button>
          )}

          {/* AVATAR */}
          {!selectedConversation && (
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#143694] flex items-center justify-center text-white text-sm font-semibold">
                  {getUserInitial()}
                </div>
              )}

              {/* GREEN DOT */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          )}

          {/* NAME */}
          <span className="text-sm font-semibold text-gray-800">
            {selectedConversation
              ? selectedConversation.name
              : "Messaging"}
          </span>
        </div>

        {/* RIGHT */}
        <button onClick={() => setShowFloatingChat(false)}>
          <ChevronDown size={20} />
        </button>
      </div>

      {/* PANEL */}
      <div className="w-[340px] h-[480px] bg-white border border-gray-300 shadow-xl flex flex-col overflow-hidden">

        <div className="flex-1 overflow-hidden">
          {!selectedConversation ? (
            <Left isFloating />
          ) : (
            <Right isFloating />
          )}
        </div>

      </div>
    </div>
  );
}

export default FloatingMessenger;