import { Link } from "react-router-dom";
import clsx from "clsx";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

function SidebarNavItem({
  to,
  icon,
  label,
  active = false,
  badge = null,
  onHelp, // ✅ ADD
}) {
  return (
    <div className="group">
      <Link
        to={to}
        className={clsx("sidebar-link flex items-center", active && "active")}
      >
        <span className="inline-flex items-center justify-center w-6 h-6 mr-3">
          {icon}
        </span>

        <span className="flex-1">{label}</span>

        {badge && (
          <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold text-white bg-primary-600 rounded-full">
            {badge}
          </span>
        )}

        {/* ⓘ HELP ICON */}
        {onHelp && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onHelp();
            }}
            className="opacity-100 transition text-gray-400 hover:text-primary-600"
          >
            <InformationCircleIcon className="w-5 h-5" />
          </button>
        )}
      </Link>
    </div>
  );
}

export default SidebarNavItem;
