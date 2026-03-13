import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUserPlus, FiFile, FiDownload, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function NotificationsDropdown({ notifications, setNotifications, setUnreadCount }) {
    const navigate = useNavigate();

    const { user, loading } = useAuth();

    if (loading || !user) return null;

    const role = user.userType; // company | employer | college | student | fresher


    const JOB_REGISTRATION_ROUTE_MAP = {
      college: {
        "On-campus": "/manage-application/campus-placement",
        "Pool-campus": "/manage-application/poolCampus-placement",
      },
      company: {
        "On-campus": "/job-management/On-campus",
        "Pool-campus": "/job-management/Pool-campus",
        "Off-campus": "/job-management/Off-campus",
        "Internship": "/job-management/Internship",
      },
      employer: {
        "On-campus": "/job-management/on-campus-listings/employer",
        "Pool-campus": "/job-management/pool-campus-listings/employer",
        "Off-campus": "/job-management/Off-campus/employer",
        "Internship": "/job-management/Internship",
      },
      
    };

    const SYSTEM_UPDATE_ROUTE_MAP = {
      company: {
        "On-campus": "/company-dashboard/On-campus",
        "Pool-campus": "/company-dashboard/Pool-campus",
      },
      employer: {
        "On-campus": "/company-dashboard/On-campus",
        "Pool-campus": "/company-dashboard/Pool-campus",
      },
      college: {
        "On-campus": "/college-dashboard/On-campus",
        "Pool-campus": "/college-dashboard/Pool-campus",
      },
      student: {
        "Off-campus": "/student-dashboard/Off-campus",
        "Internship": "/student-dashboard/Internship",
      },
      fresher: {
        "Off-campus": "/fresher-dashboard/Off-campus",
        "Internship": "/fresher-dashboard/Internship",
      }
    };

    const INTERVIEW_SCHEDULE_ROUTE_MAP = {
        college: "/college-interviews",
        employer: "/employer-interviews",
        company: "/interviews",
        student: "/student-interviews",
        fresher: "/fresher-interviews",
    }

    const APPLICATION_STATUS_ROUTE_MAP = {
      student: {
        "Off-campus": "/application-status/Off-campus",
        "Internship": "/application-status/Internship",
      },
      fresher: {
        "Off-campus": "/application-status/off-campus",
        "Internship": "/application-status/internship",
      },
      college: {
        "On-campus": "/application-status/oncampus",
        "Pool-campus": "/application-status/poolcampus",
      }
    };



    const handleNotificationClick = async (notification) => {

    // 1️⃣ Mark as read
    if (!notification.read) {
        try {
            await axios.patch(
                `${import.meta.env.VITE_Backend_URL}/api/notifications/${notification._id}/read`,
                {},
                { withCredentials: true }
            );

            setNotifications(prev =>
                prev.map(n =>
                    n._id === notification._id ? { ...n, read: true } : n
                )
            );

            setUnreadCount(prev => Math.max(prev - 1, 0));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    }

    // 2️⃣ FILE DOWNLOAD
    if (notification.type === "FILE_SHARED" && notification.fileUrl) {
        handleFileDownload(notification.fileUrl, notification.fileName);
        return;
    }

    // 3️⃣ TEAM INVITATION
    if (notification.type === "TEAM_INVITATION") {
        navigate("/invitations");
        return;
    }

    // 4️⃣ COLLEGE → COMPANY / EMPLOYER APPLICATION STATUS
    if (
        notification.type === "COLLEGE_APPLICATION_SHORTLISTED" ||
        notification.type === "COLLEGE_APPLICATION_ACCEPTED" ||
        notification.type === "COLLEGE_APPLICATION_REJECTED"
    ) {
        if (role === "company") {
            navigate("/company/application-status/oncampus");
            return;
        }

        if (role === "employer") {
            navigate("/employer/application-status/oncampus");
            return;
        }
    }

    // 🔔 JOB REGISTRATION (application related)
    if (notification.type === "JOB_REGISTRATION") {
      const jobType = notification.jobType;
      const targetRoute = JOB_REGISTRATION_ROUTE_MAP?.[role]?.[jobType];

      if (targetRoute) {
        navigate(targetRoute);
        return;
      }
    
      console.warn("No route found for JOB_REGISTRATION", { role, jobType });
      return;
    }

    // interviews scheduled
    if (notification.type === "INTERVIEW_SCHEDULED") {
        const targetRoute = INTERVIEW_SCHEDULE_ROUTE_MAP?.[role];

        if (targetRoute) {
            navigate(targetRoute);
            return;
        }

        console.warn("No route found for INTERVIEW_SCHEDULED", { role });
        return;
    }

    // 🔔 SYSTEM UPDATE (Company / Employer posted job)
    if (notification.type === "SYSTEM_UPDATE") {
        const jobType = notification.jobType;
        const targetRoute = SYSTEM_UPDATE_ROUTE_MAP?.[role]?.[jobType];

        if (targetRoute) {
            navigate(targetRoute);
            return;
        }
    
        console.warn("No route found for SYSTEM_UPDATE", { role, jobType });
        return;
    }

    // company taking action on college application
    if (
      notification.type === "APPLICATION_SHORTLISTED" ||
      notification.type === "APPLICATION_ACCEPTED" ||
      notification.type === "APPLICATION_REJECTED"
    ) {
      const jobType = notification.jobType;
      const targetRoute = APPLICATION_STATUS_ROUTE_MAP?.[role]?.[jobType];

      if (targetRoute) {
        navigate(targetRoute);
        return;
      }

      console.warn("No route found for APPLICATION status", {
        role,
        jobType,
        type: notification.type,
      });

      return;
    }

    // 💬 NEW CHAT MESSAGE — navigate to chat/inbox
    if (notification.type === "NEW_CHAT_MESSAGE") {
        navigate("/chat-application");
        return;
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
            case 'SERVICE_REQUEST_UPDATE':
                return <FiCheckCircle />;
            default:
                return <FiUserPlus />;
        }
    };

    const renderNotificationContent = (notification) => {
        // Rich UI for NEW_CHAT_MESSAGE — senderId is a populated object from socket
        if (
            notification.type === 'NEW_CHAT_MESSAGE' &&
            notification.senderId &&
            typeof notification.senderId === 'object'
        ) {
            const sender = notification.senderId;
            return (
                <div className="flex items-center gap-2">
                    {/* Avatar */}
                    {sender.profileImage ? (
                        <img
                            src={sender.profileImage}
                            alt={sender.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                            {sender.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-gray-800 text-sm">{sender.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full capitalize font-medium">
                                {sender.userType}
                            </span>
                        </div>
                        <p className="text-gray-600 text-xs truncate mt-0.5">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(notification.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            );
        }

        // Default rendering for all other notification types (unchanged)
        return (
            <>
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
                {notification.type === 'SERVICE_REQUEST_UPDATE' && notification.meetingLink && (
                    <a
                        href={notification.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                    >
                        <FiExternalLink className="mr-1" />
                        Open Link
                    </a>
                )}
                <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                </p>
            </>
        );
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
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex items-start px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                            >
                                {/* Hide generic icon for chat — avatar is shown inside renderNotificationContent */}
                                {notification.type !== 'NEW_CHAT_MESSAGE' && (
                                    <div className="p-2 mr-3 text-blue-500 bg-blue-100 rounded-full flex-shrink-0">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    {renderNotificationContent(notification)}
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 ml-2 bg-blue-500 rounded-full self-center flex-shrink-0"></div>
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