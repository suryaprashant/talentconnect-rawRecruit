// src/components/layout/StudentSidebar.jsx
import SidebarNavItem from "./SidebarNavItem";
import {
  FiHome,
  FiUser,
  FiBookmark,
  FiHelpCircle,
  FiSettings,
  FiMessageCircle,
} from "react-icons/fi";

/**
 * Sidebar for student / candidate users.
 *
 * Props:
 *   - activePath: current location.pathname (string)
 */
function StudentSidebar({ activePath }) {
  const isActive = (path) => activePath === path;

  return (
    <div className="space-y-1">
      <SidebarNavItem
        to="/home"
        icon={<FiHome className="w-4 h-4" />}
        label="Home"
        active={isActive("/home")}
      />

      <SidebarNavItem
        to="/profile"
        icon={<FiUser className="w-4 h-4" />}
        label="Profile"
        active={isActive("/profile")}
      />

      <SidebarNavItem
        to="/saved-opportunities"
        icon={<FiBookmark className="w-4 h-4" />}
        label="Saved Opportunities"
        active={isActive("/saved-opportunities")}
      />

      <SidebarNavItem
        to="/help"
        icon={<FiHelpCircle className="w-4 h-4" />}
        label="Help & Support"
        active={isActive("/help")}
      />

      <SidebarNavItem
        to="/settings"
        icon={<FiSettings className="w-4 h-4" />}
        label="Settings"
        active={isActive("/settings")}
      />

      <SidebarNavItem
        to="/chats"
        icon={<FiMessageCircle className="w-4 h-4" />}
        label="Chats"
        active={isActive("/chats")}
      />
    </div>
  );
}

export default StudentSidebar;
