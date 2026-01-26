import { useEffect, useRef, useState } from 'react';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { useLegacyAuth } from '@/context/AuthProvider';
import axios from 'axios';
import NotificationsDropdown from './NotificationDropdown';
import ProfileSwitchDropdown from '../employer/ProfileSwitchDropdown';
import StandardProfileDropdown from './ProfileDropdown';
import useGetSocketNotification from '@/context/useGetSocketNotification';


function Header({ sidebarOpen, setSidebarOpen, profileOpen, setProfileOpen }) {
    const [authuser] = useLegacyAuth();
    const [profileImage, setProfileImage] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);

    const [notificationsOpen, setNotificationsOpen] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    // 🔔 Real-time notifications (same idea as chat)
    useGetSocketNotification(
      notifications,
      setNotifications,
      setUnreadCount
    );


    // Fetch profile image based on user type
    useEffect(() => {
        const fetchProfileImage = async () => {
            if (!authuser?.user?.userType || !authuser?.user?.email) {
                setLoadingImage(false);
                return;
            }

            try {
                const userType = authuser.user.userType;
                let endpoint = '';
                
                // Set endpoints based on user type
                switch (userType) {
                    case 'student':
                        endpoint = '/api/student-onboarding/profile-data';
                        break;
                    case 'fresher':
                        endpoint = '/api/fresher-onboarding/profile-data';
                        break;
                    case 'college':
                        endpoint = '/api/college-onboarding/profile-data';
                        break;
                    case 'company':
                        endpoint = '/api/companyDashboard/getInformation';
                        break;
                    case 'professional':
                        endpoint = '/api/professional-onboarding/profile-data';
                        break;
                    case 'employer':
                        endpoint = '/api/dashboard/employer-data';
                        break;
                    default:
                        setLoadingImage(false);
                        return;
                }

                const backendUrl = import.meta.env.VITE_Backend_URL;
                const response = await axios.get(`${backendUrl}${endpoint}`, {
                    withCredentials: true,
                    headers: userType === 'company' || userType === 'employer' 
                        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        : {}
                });

                console.log('Profile data response:', response.data);

                // Extract profile image based on user type and response structure
                let imageUrl = null;
                
                switch (userType) {
                    case 'college':
                        imageUrl = response.data?.data?.profileImage || 
                                  response.data?.data?.placementCoordinatorDetails?.profilePictureUrl;
                        break;
                    case 'company':
                        // For company type - matches CompanyProfile component structure
                        imageUrl = response.data?.profile?.profileImageUrl || 
                                  response.data?.profile?.companyDetails?.profileImageUrl ||
                                  response.data?.data?.profileImageUrl;
                        break;
                    case 'employer':
                        // For employer type - matches EmployerProfile component structure
                        imageUrl = response.data?.profile?.profileImageUrl ||
                                  response.data?.profile?.employerDetails?.profileImageUrl ||
                                  response.data?.data?.profileImageUrl;
                        break;
                    case 'student':
                    case 'fresher':
                    case 'professional':
                        // For other user types
                        imageUrl = response.data?.data?.profileImage ||
                                  response.data?.data?.profileImageUrl;
                        break;
                }

                if (imageUrl) {
                    setProfileImage(imageUrl);
                }
            } catch (error) {
                console.error('Error fetching profile image:', error);
                // Silently fail - will use default avatar
            } finally {
                setLoadingImage(false);
            }
        };

        if (authuser) {
            fetchProfileImage();
        }
    }, [authuser]);

    useEffect(() => {
        if (authuser) {
            const fetchNotifications = async () => {
                try {
                    const { data } = await axios.get(
                        `${import.meta.env.VITE_Backend_URL}/api/notifications`,
                        { withCredentials: true }
                    );

                    const notificationsList = Array.isArray(data)
                        ? data
                        : data.notifications || [];

                    setNotifications(notificationsList);
                    setUnreadCount(notificationsList.filter(n => !n.read).length);

                } catch (error) {
                    console.error("Failed to fetch notifications:", error);
                }
            };

            fetchNotifications();
        }
    }, [authuser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setProfileOpen]);

    // Get user's name for avatar fallback
    const getUserName = () => {
        let name = authuser?.user?.name || authuser?.user?.email || 'User';
        return name;
    };

    // Get the first letter of user name for avatar
    const getUserInitial = () => {
        return getUserName().charAt(0).toUpperCase();
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
            <button
                type="button"
                className="p-2 text-gray-500 rounded-md lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <FiMenu className="w-6 h-6" aria-hidden="true" />
            </button>
            
            <div className="flex items-center ml-auto space-x-4">
                {authuser && (
                    <>
                        {/* Notifications Section */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                type="button"
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative p-1 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            >
                                <FiBell className="w-6 h-6" aria-hidden="true" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                                
                            </button>
                           
                            {notificationsOpen && (
                                <NotificationsDropdown
                                    notifications={notifications}
                                    setNotifications={setNotifications}
                                    setUnreadCount={setUnreadCount}
                                />
                            )}
                        </div>

                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                {loadingImage ? (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                                ) : profileImage ? (
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                        <img 
                                            src={profileImage} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // If image fails to load, show default avatar
                                                e.target.style.display = 'none';
                                                const parent = e.target.parentElement;
                                                parent.innerHTML = `
                                                    <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                        ${getUserInitial()}
                                                    </div>
                                                `;
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                        {getUserInitial()}
                                    </div>
                                )}
                                <span className="hidden ml-2 mr-1 font-medium text-gray-700 md:block">
                                    {getUserName()}
                                </span>
                                <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileOpen ? 'transform rotate-180' : ''}`} />
                            </button>

                            {profileOpen && (
                                authuser.user.userType === 'employer'
                                    ? <ProfileSwitchDropdown />
                                    : <StandardProfileDropdown />
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;