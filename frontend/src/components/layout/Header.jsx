

// import { useEffect, useRef, useState } from 'react';
// import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
// import SearchBar from '../ui/SearchBar';
// import ProfileDropdown from './ProfileDropdown';
// import Avatar from '../ui/Avatar';
// import { useAuth } from '@/context/AuthProvider';
// import axios from 'axios';
// import NotificationsDropdown from './NotificationDropdown'; // ✅ Import new component

// function Header({ sidebarOpen, setSidebarOpen, profileOpen, setProfileOpen }) {
//     const [authuser, setAuthuser] = useAuth();
    
//     // ✅ State for notifications
//     const [notificationsOpen, setNotificationsOpen] = useState(false);
//     const [notifications, setNotifications] = useState([]);
//     const [unreadCount, setUnreadCount] = useState(0);

//     const profileRef = useRef(null);
//     const notificationRef = useRef(null);

//     // Fetch notifications
//     useEffect(() => {
//         const fetchNotifications = async () => {
//             try {
//                 const { data } = await axios.get(`${import.meta.env.VITE_Backend_URL}/api/notifications`, { withCredentials: true });
//                 setNotifications(data);
//                 setUnreadCount(data.filter(n => !n.read).length);
//             } catch (error) {
//                 console.error("Failed to fetch notifications:", error);
//             }
//         };
//         fetchNotifications();
//     }, []);

//     // Close dropdowns when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (profileRef.current && !profileRef.current.contains(event.target)) {
//                 setProfileOpen(false);
//             }
//             if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//                 setNotificationsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [setProfileOpen, setNotificationsOpen]);

//     return (
//         <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
//             {/* ... Mobile menu button ... */}
//             <button
//                 type="button"
//                 className="p-2 mr-4 text-gray-500 rounded-md lg:hidden"
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//                 <FiMenu className="w-6 h-6" aria-hidden="true" />
//             </button>

//             <div className="flex-1 max-w-2xl mx-auto lg:max-w-xs">
//                 <SearchBar placeholder="Search" />
//             </div>

//             <div className="flex items-center ml-4 space-x-4">
//                 {/* ✅ MODIFIED: Notifications Button */}
//                 <div className="relative" ref={notificationRef}>
//                     <button
//                         type="button"
//                         onClick={() => setNotificationsOpen(!notificationsOpen)}
//                         className="relative p-1 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
//                     >
//                         <span className="sr-only">View notifications</span>
//                         <FiBell className="w-6 h-6" aria-hidden="true" />
//                         {unreadCount > 0 && (
//                              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
//                                 {unreadCount}
//                             </span>
//                         )}
//                     </button>
//                     {notificationsOpen && (
//                         <NotificationsDropdown 
//                             notifications={notifications} 
//                             setNotifications={setNotifications} 
//                             setUnreadCount={setUnreadCount} 
//                         />
//                     )}
//                 </div>

//                 {/* Profile dropdown */}
//                 <div className="relative" ref={profileRef}>
//                     {/* ... existing profile dropdown button ... */}
//                     <button
//                         type="button"
//                         className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
//                         onClick={() => setProfileOpen(!profileOpen)}
//                     >
//                         <Avatar name={authuser?.user?.name || authuser?.user?.email} />
//                         <span className="hidden ml-2 mr-1 font-medium text-gray-700 md:block">
//                             {authuser?.user?.name ? authuser.user.name : authuser?.user?.email}
//                         </span>
//                         <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileOpen ? 'transform rotate-180' : ''}`} />
//                     </button>
//                     {profileOpen && <ProfileDropdown />}
//                 </div>
//             </div>
//         </header>
//     );
// }

// export default Header;



// // import { useEffect, useRef, useState } from 'react';
// // import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
// // import SearchBar from '../ui/SearchBar';
// // import Avatar from '../ui/Avatar';
// // import { useAuth } from '@/context/AuthProvider';
// // import axios from 'axios';
// // import NotificationsDropdown from './NotificationDropdown'; 

// // // --- 1. IMPORT BOTH DROPDOWN COMPONENTS ---
// // import ProfileSwitchDropdown from '../Employer/ProfileSwitchDropdown'; 
// // import StandardProfileDropdown from './ProfileDropdown';

// // function Header({ sidebarOpen, setSidebarOpen, profileOpen, setProfileOpen }) {
// //     const [authuser, setAuthuser] = useAuth();
    
// //     // State for notifications
// //     const [notificationsOpen, setNotificationsOpen] = useState(false);
// //     const [notifications, setNotifications] = useState([]);
// //     const [unreadCount, setUnreadCount] = useState(0);

// //     const profileRef = useRef(null);
// //     const notificationRef = useRef(null);

// //     // Fetch notifications
// //     useEffect(() => {
// //         const fetchNotifications = async () => {
// //             try {
// //                 const { data } = await axios.get(`${import.meta.env.VITE_Backend_URL}/api/notifications`, { withCredentials: true });
// //                 setNotifications(data);
// //                 setUnreadCount(data.filter(n => !n.read).length);
// //             } catch (error) {
// //                 console.error("Failed to fetch notifications:", error);
// //             }
// //         };
// //         fetchNotifications();
// //     }, []);

// //     // Close dropdowns when clicking outside
// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (profileRef.current && !profileRef.current.contains(event.target)) {
// //                 setProfileOpen(false);
// //             }
// //             if (notificationRef.current && !notificationRef.current.contains(event.target)) {
// //                 setNotificationsOpen(false);
// //             }
// //         };
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => document.removeEventListener('mousedown', handleClickOutside);
// //     }, [setProfileOpen, setNotificationsOpen]);

// //     return (
// //         <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
// //             {/* Mobile menu button */}
// //             <button
// //                 type="button"
// //                 className="p-2 mr-4 text-gray-500 rounded-md lg:hidden"
// //                 onClick={() => setSidebarOpen(!sidebarOpen)}
// //             >
// //                 <FiMenu className="w-6 h-6" aria-hidden="true" />
// //             </button>

// //             {/* Search Bar */}
// //             <div className="flex-1 max-w-2xl mx-auto lg:max-w-xs">
// //                 <SearchBar placeholder="Search" />
// //             </div>

// //             <div className="flex items-center ml-4 space-x-4">
// //                 {/* Notifications Button */}
// //                 <div className="relative" ref={notificationRef}>
// //                     <button
// //                         type="button"
// //                         onClick={() => setNotificationsOpen(!notificationsOpen)}
// //                         className="relative p-1 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
// //                     >
// //                         <span className="sr-only">View notifications</span>
// //                         <FiBell className="w-6 h-6" aria-hidden="true" />
// //                         {unreadCount > 0 && (
// //                              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
// //                                  {unreadCount}
// //                             </span>
// //                         )}
// //                     </button>
// //                     {notificationsOpen && (
// //                         <NotificationsDropdown 
// //                             notifications={notifications} 
// //                             setNotifications={setNotifications} 
// //                             setUnreadCount={setUnreadCount} 
// //                         />
// //                     )}
// //                 </div>

// //                 {/* Profile Dropdown Section */}
// //                 <div className="relative" ref={profileRef}>
// //                     <button
// //                         type="button"
// //                         className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
// //                         onClick={() => setProfileOpen(!profileOpen)}
// //                     >
// //                         <Avatar name={authuser?.user?.name || authuser?.user?.email} />
// //                         <span className="hidden ml-2 mr-1 font-medium text-gray-700 md:block">
// //                             {authuser?.user?.name ? authuser.user.name : authuser?.user?.email}
// //                         </span>
// //                         <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileOpen ? 'transform rotate-180' : ''}`} />
// //                     </button>

// //                     {/* --- 2. CONDITIONALLY RENDER THE CORRECT DROPDOWN --- */}
// //                     {profileOpen && (
// //                       authuser?.user?.userType === 'employer'
// //                         ? <ProfileSwitchDropdown />       // Show this for employers
// //                         : <StandardProfileDropdown />     // Show this for everyone else
// //                     )}
// //                 </div>
// //             </div>
// //         </header>
// //     );
// // }

// // export default Header;




import { useEffect, useRef, useState } from 'react';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import SearchBar from '../ui/SearchBar';
import Avatar from '../ui/Avatar';
import NotificationsDropdown from './NotificationDropdown';

//  1. Import BOTH dropdown components
import ProfileSwitchDropdown from '../Employer/ProfileSwitchDropdown'; 
import StandardProfileDropdown from './ProfileDropdown'; // Assuming this is the correct name and path

function Header({ sidebarOpen, setSidebarOpen, profileOpen, setProfileOpen }) {
    const [authuser] = useAuth(); // No need for setAuthuser here
 
    
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    // Fetch notifications
    useEffect(() => {
        if (authuser) {
            const fetchNotifications = async () => {
                try {
                    const { data } = await axios.get(`${import.meta.env.VITE_Backend_URL}/api/notifications`, { withCredentials: true });
                    setNotifications(data);
                    setUnreadCount(data.filter(n => !n.read).length);
                } catch (error) {
                    console.error("Failed to fetch notifications:", error);
                }
            };
            fetchNotifications();
        }
    }, [authuser]);

    // Close dropdowns when clicking outside
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

    return (
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
            <button
                type="button"
                className="p-2 mr-4 text-gray-500 rounded-md lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <FiMenu className="w-6 h-6" aria-hidden="true" />
            </button>

            <div className="flex-1  max-w-2xl mx-auto  lg:max-w-xs">
                <SearchBar placeholder="Search" />
            </div>

            <div className="flex items-center ml-4 space-x-4">
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

                        {/* Profile Dropdown Section */}
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <Avatar name={authuser.user.name || authuser.user.email} />
                                <span className="hidden ml-2 mr-1 font-medium text-gray-700 md:block">
                                    {authuser.user.name || authuser.user.email}
                                </span>
                                <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileOpen ? 'transform rotate-180' : ''}`} />
                            </button>

                            {/* ✅ 2. Conditionally render the correct dropdown */}
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