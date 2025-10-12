import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUserPlus, FiFile, FiDownload } from 'react-icons/fi';
import axios from 'axios';

function NotificationsDropdown({ notifications, setNotifications, setUnreadCount }) {
    const navigate = useNavigate();

    const handleNotificationClick = async (notification) => {
       
        if (!notification.read) {
            try {

                await axios.patch(
                    `${import.meta.env.VITE_Backend_URL}/api/notifications/${notification._id}/read`,
                    {},
                    { withCredentials: true }
                );
              
                setNotifications(prev => 
                    prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
                );
                setUnreadCount(prev => prev - 1);
            } catch (error) {
                console.error("Failed to mark notification as read:", error);
            }
        }

       
        if (notification.type === 'FILE_SHARED' && notification.fileUrl) {
            handleFileDownload(notification.fileUrl, notification.fileName);
            return;
        }

        
        if (notification.type === 'TEAM_INVITATION') {
            navigate('/invitations');
        }
        
    };

    const handleFileDownload = async (fileUrl, fileName) => {
        try {
            
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            
            
            const blobUrl = window.URL.createObjectURL(blob);
            
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'download';
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
           
            window.open(fileUrl, '_blank');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'FILE_SHARED':
                return <FiFile />;
            case 'TEAM_INVITATION':
                return <FiUserPlus />;
            default:
                return <FiUserPlus />;
        }
    };

    return (
        <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right bg-white rounded-md shadow-lg dropdown-menu">
            <div className="py-1 bg-white rounded-md ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 font-bold text-gray-700 border-b">Notifications</div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">No new notifications.</div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={()=> handleNotificationClick(notification)}
                                className={`flex items-start px-4 py-3 text-sm hover:bg-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                            >
                                <div className="p-2 mr-3 text-blue-500 bg-blue-100 rounded-full">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-800">{notification.message}</p>
                                    {notification.type === 'FILE_SHARED' && notification.eventTitle && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            Event: {notification.eventTitle}
                                        </p>
                                    )}
                                    {notification.type === 'FILE_SHARED' && notification.fileUrl && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNotificationClick(notification);
                                            }}
                                            className="mt-2 inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            <FiDownload className="mr-1" />
                                            Download {notification.fileName}
                                        </button>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 ml-2 bg-blue-500 rounded-full self-center"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default NotificationsDropdown;