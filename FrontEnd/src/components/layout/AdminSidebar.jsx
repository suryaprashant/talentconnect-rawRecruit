import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaClipboardList,
  FaCog,
  
} from "react-icons/fa";
import { IoAlbums } from "react-icons/io5";



const sidebarItems = [
  { name: "Dashboard", to: "/admin/dashboard", icon: <FaTachometerAlt /> },
  { name: "User Management", to: "/admin/users", icon: <FaUsers /> },
  {name:   "referral posted", to: "/admin/referral-posted", icon :<IoAlbums />},
  { name: "Jobs & Drives", to: "/admin/jobs", icon: <FaBriefcase /> },
  { name: "Applications", to: "/admin/applications", icon: <FaClipboardList /> },
  { name: "Settings", to: "/admin/settings", icon: <FaCog /> },

];

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="w-64 bg-white h-screen border-r shadow-md fixed top-0 left-0">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800">RawRecruit</h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        <nav className="mt-6">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 
                    ${isActive ? "bg-gray-200 font-semibold" : ""}`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="ml-64 flex-1">
          <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
