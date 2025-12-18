// src/components/layout/SidebarNavItem.jsx
import { Link } from "react-router-dom";
import clsx from "clsx";

function SidebarNavItem({ to, icon, label, active = false, badge = null, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={clsx(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100",
        active && "bg-gray-100 text-gray-900"
      )}
    >
      {icon && (
        <span className="text-lg text-gray-500 group-hover:text-gray-900">
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {badge && <span className="ml-auto text-xs">{badge}</span>}
    </Link>
  );
}

export default SidebarNavItem;
