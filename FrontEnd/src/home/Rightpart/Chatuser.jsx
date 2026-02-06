import React, { useEffect, useState } from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { Circle } from 'lucide-react';
import axios from 'axios';

function Chatuser() {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const [userLogo, setUserLogo] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const isOnline = selectedConversation && onlineUsers.includes(selectedConversation._id);

  // Fetch logo for the selected conversation user
  useEffect(() => {
    const fetchUserLogo = async () => {
      if (!selectedConversation?.userType || !selectedConversation?._id) {
        setLoadingLogo(false);
        return;
      }

      try {
        let endpoint = '';
        
        // Set endpoints based on user type
        switch (selectedConversation.userType) {
          case 'student':
            endpoint = `/api/student-onboarding/profile-data/${selectedConversation._id}`;
            break;
          case 'fresher':
            endpoint = `/api/fresher-onboarding/profile-data/${selectedConversation._id}`;
            break;
          case 'college':
            endpoint = `/api/college-onboarding/profile-data/${selectedConversation._id}`;
            break;
          case 'company':
            endpoint = `/api/companyDashboard/getInformation/${selectedConversation._id}`;
            break;
          case 'professional':
            endpoint = `/api/professional-onboarding/profile-data/${selectedConversation._id}`;
            break;
          case 'employer':
            endpoint = `/api/dashboard/employer-data/${selectedConversation._id}`;
            break;
          default:
            setLoadingLogo(false);
            return;
        }

        const backendUrl = import.meta.env.VITE_Backend_URL;
        const response = await axios.get(`${backendUrl}${endpoint}`, {
          withCredentials: true,
        });

        // Extract logo based on user type and response structure
        let logoUrl = null;
        
        switch (selectedConversation.userType) {
          case 'college':
            logoUrl = response.data?.data?.collegeLogo ||
                      response.data?.data?.logoUrl ||
                      response.data?.data?.profileImage;
            break;
          case 'company':
            logoUrl = response.data?.profile?.companyLogo ||
                      response.data?.profile?.companyDetails?.logoUrl ||
                      response.data?.data?.logoUrl ||
                      response.data?.profile?.profileImageUrl;
            break;
          case 'employer':
            logoUrl = response.data?.profile?.companyLogo ||
                      response.data?.profile?.employerDetails?.logoUrl ||
                      response.data?.data?.logoUrl ||
                      response.data?.profile?.profileImageUrl;
            break;
          case 'student':
          case 'fresher':
          case 'professional':
            logoUrl = response.data?.data?.logo ||
                      response.data?.data?.logoUrl ||
                      response.data?.data?.profileImage ||
                      response.data?.data?.profileImageUrl;
            break;
        }

        if (logoUrl) {
          // Handle different URL formats
          if (!logoUrl.startsWith('http') && !logoUrl.startsWith('data:')) {
            if (logoUrl.startsWith('/')) {
              logoUrl = `${backendUrl}${logoUrl}`;
            } else {
              logoUrl = `${backendUrl}/uploads/${logoUrl}`;
            }
          }
          setUserLogo(logoUrl);
        }
      } catch (error) {
        console.error('Error fetching user logo in Chatuser:', error);
        // Silently fail - will use default avatar
      } finally {
        setLoadingLogo(false);
      }
    };

    if (selectedConversation) {
      fetchUserLogo();
    } else {
      setUserLogo(null);
      setLoadingLogo(false);
    }
  }, [selectedConversation]);

  if (!selectedConversation) {
    return null;
  }

  // Helper function to get user initials
  const getUserInitials = () => {
    const name = selectedConversation.fullname || selectedConversation.name || selectedConversation.email;
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center space-x-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-6 border-b border-gray-100/30">
      <div>
        <div className={`relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden ${isOnline ? 'ring-2 ring-green-400 shadow-lg shadow-green-400/30' : 'ring-2 ring-white/30 shadow-lg'}`}>
          {loadingLogo ? (
            <div className="w-full h-full bg-gradient-to-r from-white/20 to-white/30 animate-pulse rounded-full"></div>
          ) : userLogo ? (
            <img 
              src={userLogo} 
              className="rounded-full object-cover w-full h-full aspect-square"
              alt={selectedConversation.fullname || selectedConversation.name || selectedConversation.email}
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-r from-white/20 to-white/30 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    ${getUserInitials()}
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-white/20 to-white/30 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {getUserInitials()}
            </div>
          )}
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold tracking-tight">
          {selectedConversation.fullname || selectedConversation.name || selectedConversation.email}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center text-sm ${isOnline ? "text-green-300 font-medium" : "text-gray-300"}`}>
            {isOnline ? (
              <>
                <Circle className="w-2 h-2 mr-1.5 fill-green-400" />
                Online
              </>
            ) : (
              "Offline"
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Chatuser;