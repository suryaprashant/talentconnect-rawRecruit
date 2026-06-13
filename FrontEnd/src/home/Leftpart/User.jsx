import React, { useEffect, useState } from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useChat } from "../../context/ChatContext";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { MessageSquare, Circle, CheckCircle } from 'lucide-react';
import axios from 'axios';

function User({ user, unreadCount }) {
  const { selectedConversation, setSelectedConversation } = useChat();
  const isSelected = selectedConversation?._id === user._id;
  const { socket, onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);
  const hasUnread = unreadCount > 0;
  const [userLogo, setUserLogo] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(true);

  // SIMPLE FETCH FUNCTION - Use a common endpoint
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) {
        setLoadingLogo(false);
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_Backend_URL;
        
        // Try multiple endpoints in sequence
        const endpoints = [
          // First try: Get from auth/user endpoint (you need to create this)
          `/api/auth/user/${user._id}`,
          // Second try: Company endpoint (we know this works)
          `/api/companyDashboard/getInformation/${user._id}`,
          // Third try: Try the profile endpoints with better error handling
          ...(user.userType ? [`/api/${user.userType}-onboarding/profile-data/${user._id}`] : []),
        ];

        let logoUrl = null;
        let lastError = null;

        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            const response = await axios.get(`${backendUrl}${endpoint}`, {
              withCredentials: true,
              timeout: 3000, // 3 second timeout
            });

            console.log(`${endpoint} response:`, response.data);

            // Extract logo from response
            const data = response.data;
            
            // Check various possible locations
            if (data?.profileImage) logoUrl = data.profileImage;
            else if (data?.avatar) logoUrl = data.avatar;
            else if (data?.image) logoUrl = data.image;
            else if (data?.logo) logoUrl = data.logo;
            else if (data?.data?.profileImage) logoUrl = data.data.profileImage;
            else if (data?.data?.avatar) logoUrl = data.data.avatar;
            else if (data?.profile?.profileImageUrl) logoUrl = data.profile.profileImageUrl;
            else if (data?.profile?.profileImage) logoUrl = data.profile.profileImage;
            
            if (logoUrl) {
              console.log(`Found logo at ${endpoint}:`, logoUrl);
              break;
            }
          } catch (error) {
            lastError = error;
            console.log(`Endpoint ${endpoint} failed:`, error.message);
            // Continue to next endpoint
            continue;
          }
        }

        if (logoUrl) {
          // Handle URL formatting
          if (!logoUrl.startsWith('http') && !logoUrl.startsWith('data:') && !logoUrl.startsWith('blob:')) {
            if (logoUrl.startsWith('/')) {
              logoUrl = `${backendUrl}${logoUrl}`;
            } else {
              logoUrl = `${backendUrl}/${logoUrl}`;
            }
          }
          setUserLogo(logoUrl);
        } else {
          console.log('No logo found for user:', user._id, 'Last error:', lastError?.message);
          setUserLogo(null);
        }
        
      } catch (error) {
        console.error('Error in fetchUserData:', error.message);
        setUserLogo(null);
      } finally {
        setLoadingLogo(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Helper function to get user initials
  const getUserInitials = () => {
    const name = user.name || user.fullname || user.email;
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`cursor-pointer border-b border-gray-200 last:border-b-0 duration-300 p-4 relative 
        ${isSelected 
          ? "bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 border-l-4 border-[#143694]" 
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
              <div className="w-full h-full bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 animate-pulse rounded-full"></div>
            ) : userLogo ? (
              <img 
                src={userLogo} 
                alt={`${user.name || user.email} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  const initials = getUserInitials();
                  parent.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-r from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center text-2xl font-bold text-[#143694]">
                      ${initials}
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center text-2xl font-bold text-[#143694]">
                {getUserInitials()}
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
                {user.name || user.fullname || user.email}
              </h1>
              {isOnline ? (
                <CheckCircle className="h-4 w-4 text-green-500" fill="currentColor" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
            </div>
            {hasUnread && (
              <span className="bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ml-2 flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </div>
          
          {user.email && user.email !== (user.name || user.fullname) && (
            <span className="text-sm text-gray-600 truncate">{user.email}</span>
          )}
          
          <div className="flex items-center justify-between mt-2">
            {user.userType && (
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] font-medium rounded-full capitalize">
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
          ? "bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5" 
          : "group-hover:bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5"
      }`}></div>
    </div>
  );
}

export default User;