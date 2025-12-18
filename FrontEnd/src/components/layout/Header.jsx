import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import axios from "axios";

import { useAuth } from "@/context/AuthProvider";
import SearchBar from "../ui/SearchBar";
import Avatar from "../ui/Avatar";

import ProfileSwitchDropdown from "../employer/ProfileSwitchDropdown";
import StandardProfileDropdown from "./ProfileDropdown";

function readStoredUser() {
  try {
    const raw = localStorage.getItem("ChatAppUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function resolveImageUrl(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) return src;

  const base = import.meta.env.VITE_Backend_URL;
  if (!base) return src;

  const normalized = src.startsWith("/") ? src : `/${src}`;
  return `${base}${normalized}`;
}

export default function Header({ sidebarOpen, setSidebarOpen, profileOpen, setProfileOpen }) {
  const [authUser] = useAuth();

  const storedUser = useMemo(() => readStoredUser(), []);
  const user = authUser?.user || storedUser || null;

  const displayName = user?.name || user?.email || "User";
  const avatarSrc = resolveImageUrl(user?.profileImage || null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_Backend_URL}/api/notifications`, {
          withCredentials: true,
        });
        const unread = Array.isArray(data) ? data.filter((n) => !n.read).length : 0;
        setUnreadCount(unread);
      } catch {
        // ignore
      }
    };

    fetchNotifications();
  }, [user?._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setProfileOpen]);

  const showProfileSwitch = user?.userType === "employer" || Boolean(user?.activeCompanyId);

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <FiMenu />
        </button>

        <div className="hidden md:block w-[420px] max-w-[45vw]">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            className="p-2 rounded hover:bg-gray-100 relative"
            onClick={() => setNotificationsOpen((v) => !v)}
            aria-label="Notifications"
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="Profile menu"
          >
            <Avatar src={avatarSrc} name={displayName} size="md" />
            <span className="hidden sm:block text-sm font-medium">{displayName}</span>
            <FiChevronDown className="hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow">
              <div className="p-2">
                {showProfileSwitch ? <ProfileSwitchDropdown /> : <StandardProfileDropdown />}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
