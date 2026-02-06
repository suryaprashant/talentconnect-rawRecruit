
import React, { useEffect, useState } from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { MessageSquare, Circle, CheckCircle } from 'lucide-react';
import axios from 'axios';

function User({ user, unreadCount }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { socket, onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);
  const hasUnread = unreadCount > 0;
  const [userLogo, setUserLogo] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(true);

  // Fetch logo for the user
  useEffect(() => {
    const fetchUserLogo = async () => {
      if (!user?.userType || !user?._id) {
        setLoadingLogo(false);
        return;
      }

      try {
        let endpoint = '';
        
        // Set endpoints based on user type
        switch (user.userType) {
          case 'student':
            endpoint = `/api/student-onboarding/profile-data/${user._id}`;
            break;
          case 'fresher':
            endpoint = `/api/fresher-onboarding/profile-data/${user._id}`;
            break;
          case 'college':
            endpoint = `/api/college-onboarding/profile-data/${user._id}`;
            break;
          case 'company':
            endpoint = `/api/companyDashboard/getInformation/${user._id}`;
            break;
          case 'professional':
            endpoint = `/api/professional-onboarding/profile-data/${user._id}`;
            break;
          case 'employer':
            endpoint = `/api/dashboard/employer-data/${user._id}`;
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
        
        switch (user.userType) {
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
          setUserLogo(logoUrl);
        }
      } catch (error) {
        console.error('Error fetching user logo:', error);
        // Silently fail - will use default avatar
      } finally {
        setLoadingLogo(false);
      }
    };

    fetchUserLogo();
  }, [user]);

  return (
    <div
      className={`cursor-pointer border-b border-gray-200 last:border-b-0 duration-300 p-4 relative 
        ${isSelected 
          ? "bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 border-l-4 border-[#667eea]" 
          : "hover:bg-gradient-to-r from-gray-50/50 to-white/50"
        }`}
      onClick={() => setSelectedConversation(user)}
    >
      <div className="flex items-center space-x-4">
        {/* User Avatar/Logo */}
        <div className="relative flex-shrink-0">
          <div className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center
            ${isOnline 
              ? "ring-2 ring-green-500 ring-offset-2" 
              : "ring-2 ring-gray-300 ring-offset-2"
            }`}>
            
            {loadingLogo ? (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
            ) : userLogo ? (
              <img 
                src={userLogo} 
                alt={`${user.name || user.email} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  parent.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center text-2xl font-bold text-[#667eea]">
                      ${user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center text-2xl font-bold text-[#667eea]">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <h1 className="font-semibold text-lg text-gray-900 truncate mr-2">
                {user.name || user.email}
              </h1>
              {isOnline ? (
                <CheckCircle className="h-4 w-4 text-green-500" fill="currentColor" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
            </div>
            {hasUnread && (
              <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ml-2 flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </div>
          
          {user.name && user.email && (
            <span className="text-sm text-gray-600 truncate">{user.email}</span>
          )}
          
          <div className="flex items-center justify-between mt-2">
            {user.userType && (
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] font-medium rounded-full capitalize">
                {user.userType}
              </span>
            )}
            
            {!hasUnread && isSelected && (
              <div className="flex items-center text-xs text-gray-500">
                <MessageSquare className="h-3 w-3 mr-1" />
                <span>Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect Indicator */}
      <div className={`absolute inset-0 rounded-xl -z-10 transition-all duration-300 ${
        isSelected 
          ? "bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5" 
          : "group-hover:bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5"
      }`}></div>
    </div>
  );
}

export default User;