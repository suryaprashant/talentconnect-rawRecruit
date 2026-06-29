import React, { useEffect, useState } from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useChat } from "../../context/ChatContext";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { Circle } from 'lucide-react';
import axios from '../../lib/axiosInstance.js';

function Chatuser() {
  const { selectedConversation } = useChat();
  const { onlineUsers } = useSocketContext();
  const [userLogo, setUserLogo] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const isOnline = selectedConversation && onlineUsers.includes(selectedConversation._id);

  // Fetch logo for the selected conversation user
  useEffect(() => {
    let isMounted = true;

    const fetchUserLogo = async () => {
      if (!selectedConversation?._id) {
        if (isMounted) {
          setUserLogo(null);
          setLoadingLogo(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setUserLogo(null);
          setLoadingLogo(true);
        }

        const backendUrl = import.meta.env.VITE_Backend_URL;
        
        // Try multiple endpoints in sequence
        const endpoints = [
          // First try: Auth user endpoint (you need to create this)
          `/api/auth/user/${selectedConversation._id}`,
          // Second try: Company endpoint (we know this works for company type)
          `/api/companyDashboard/getInformation/${selectedConversation._id}`,
          // Third try: Try specific profile endpoints based on user type
          ...(selectedConversation.userType === 'company' ? [] : 
             selectedConversation.userType === 'employer' ? 
               [`/api/dashboard/employer-data/${selectedConversation._id}`] :
               [`/api/${selectedConversation.userType}-onboarding/profile-data/${selectedConversation._id}`]
          ),
        ];

        console.log(`Trying to fetch logo for ${selectedConversation.userType}:`, endpoints);

        let logoUrl = null;
        let lastError = null;

        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${backendUrl}${endpoint}`);
            const response = await axios.get(`${backendUrl}${endpoint}`, {
              withCredentials: true,
              timeout: 3000, // 3 second timeout
            });

            console.log(`${endpoint} response:`, response.data);

            // Extract logo from response - check multiple possible locations
            const data = response.data;
            
            // Check various possible locations in order of likelihood
            if (data?.profileImage) logoUrl = data.profileImage;
            else if (data?.avatar) logoUrl = data.avatar;
            else if (data?.image) logoUrl = data.image;
            else if (data?.logo) logoUrl = data.logo;
            else if (data?.profile?.profileImage) logoUrl = data.profile.profileImage;
            else if (data?.profile?.profileImageUrl) logoUrl = data.profile.profileImageUrl;
            else if (data?.profile?.avatar) logoUrl = data.profile.avatar;
            else if (data?.profile?.image) logoUrl = data.profile.image;
            else if (data?.profile?.companyLogo) logoUrl = data.profile.companyLogo;
            else if (data?.data?.profileImage) logoUrl = data.data.profileImage;
            else if (data?.data?.profileImageUrl) logoUrl = data.data.profileImageUrl;
            else if (data?.data?.avatar) logoUrl = data.data.avatar;
            else if (data?.data?.image) logoUrl = data.data.image;
            else if (data?.data?.logo) logoUrl = data.data.logo;
            else if (data?.data?.collegeLogo) logoUrl = data.data.collegeLogo;
            else if (data?.data?.logoUrl) logoUrl = data.data.logoUrl;
            
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

        if (!isMounted) return;

        if (logoUrl) {
          // Handle URL formatting
          if (!logoUrl.startsWith('http') && !logoUrl.startsWith('data:') && !logoUrl.startsWith('blob:')) {
            if (logoUrl.startsWith('/')) {
              logoUrl = `${backendUrl}${logoUrl}`;
            } else {
              logoUrl = `${backendUrl}/${logoUrl}`;
            }
          }
          
          // Create a new image object to check if it loads successfully
          const img = new Image();
          img.src = logoUrl;
          
          img.onload = () => {
            if (isMounted) {
              setUserLogo(logoUrl);
              setLoadingLogo(false);
            }
          };
          
          img.onerror = () => {
            if (isMounted) {
              console.log(`Image failed to load: ${logoUrl}`);
              setUserLogo(null);
              setLoadingLogo(false);
            }
          };
        } else {
          console.log('No logo found for user:', selectedConversation._id, 'Last error:', lastError?.message);
          setUserLogo(null);
          setLoadingLogo(false);
        }
      } catch (error) {
        console.error('Error in fetchUserLogo:', error);
        if (isMounted) {
          setUserLogo(null);
          setLoadingLogo(false);
        }
      }
    };

    if (selectedConversation) {
      fetchUserLogo();
    } else {
      setUserLogo(null);
      setLoadingLogo(false);
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [selectedConversation]);

  if (!selectedConversation) {
    return null;
  }

  // Helper function to get user initials
  const getUserInitials = () => {
    const name = selectedConversation.fullname || selectedConversation.name || selectedConversation.email;
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Generate a consistent color based on user ID or name
  const getAvatarColor = () => {
    const str = selectedConversation._id || selectedConversation.email || selectedConversation.name || 'default';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'from-[#143694] to-[#1e4ed8]',    // Purple gradient
      'from-[#f093fb] to-[#f5576c]',    // Pink gradient
      'from-[#4facfe] to-[#00f2fe]',    // Blue gradient
      'from-[#43e97b] to-[#38f9d7]',    // Green gradient
      'from-[#fa709a] to-[#fee140]',    // Orange gradient
      'from-[#30cfd0] to-[#330867]',    // Teal gradient
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const avatarColor = getAvatarColor();

  return (
    <div className="flex items-center space-x-4 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white p-6 border-b border-gray-100/30">
      <div>
        <div className={`relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden ${isOnline ? 'ring-2 ring-green-400 shadow-lg shadow-green-400/30' : 'ring-2 ring-white/30 shadow-lg'}`}>
          {loadingLogo ? (
            <div className="w-full h-full bg-gradient-to-r from-white/20 to-white/30 animate-pulse rounded-full"></div>
          ) : userLogo ? (
            <img 
              src={userLogo} 
              className="rounded-full object-cover w-full h-full aspect-square"
              alt={selectedConversation.fullname || selectedConversation.name || selectedConversation.email}
              key={`logo-${selectedConversation._id}`}
              onError={(e) => {
                // Fallback to colored initials
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                const initials = getUserInitials();
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-r ${avatarColor} rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    ${initials}
                  </div>
                `;
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${avatarColor} rounded-full flex items-center justify-center text-2xl font-bold text-white`}>
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
          {selectedConversation.userType && (
            <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full capitalize">
              {selectedConversation.userType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatuser;