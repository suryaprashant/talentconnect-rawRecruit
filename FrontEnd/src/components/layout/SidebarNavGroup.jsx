import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

function SidebarNavGroup({
  icon,
  label,
  to,
  active = false,
  children,
  onHelp, // ✅ ADD
}) {
  const [expanded, setExpanded] = useState(active);

  return (
    <div className="group">
      <Link
        to={to || "#"}
        className={clsx("sidebar-link flex items-center", active && "active")}
        onClick={(e) => {
          if (!to) {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <span className="inline-flex items-center justify-center w-6 h-6 mr-3">
          {icon}
        </span>

        <span className="flex-1">{label}</span>

        {children && (
          <span className="ml-2">
            {expanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
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
            className="ml-2 opacity-100 transition text-gray-400 hover:text-primary-600"
          >
            <InformationCircleIcon className="w-5 h-5" />
          </button>
        )}
      </Link>

      {children && expanded && (
        <div className="pl-10 mt-1 space-y-1">{children}</div>
      )}
    </div>
  );
}

export default SidebarNavGroup;
