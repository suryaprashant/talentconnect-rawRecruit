// src/components/layout/Sidebar.jsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../ui/Logo";
import { useAuth } from "@/context/AuthProvider";

import CompanySidebar from "./CompanySidebar";
import CollegeSidebar from "./CollegeSidebar";
import StudentSidebar from "./StudentSidebar";
import FresherSidebar from "./FresherSidebar";
import ProfessionalSidebar from "./ProfessionalSidebar";
import EmployerSidebar from "./EmployerSidebar";

function normalizeRole(role) {
  if (!role) return null;
  return role === "candidate" ? "student" : role;
}

function readStoredUserType() {
  try {
    const raw = localStorage.getItem("ChatAppUser");
    const user = raw ? JSON.parse(raw) : null;
    return user?.userType || null;
  } catch {
    return null;
  }
}

export default function Sidebar({ open }) {
  const location = useLocation();
  const [authUser] = useAuth();

  const isAuthenticated = Boolean(localStorage.getItem("token") && localStorage.getItem("ChatAppUser"));

  const role = useMemo(() => {
    const fromContext = authUser?.user?.userType || null;
    const fromStored = readStoredUserType();
    const fromSelectedRole = localStorage.getItem("selectedRole") || null;

    // When authenticated, do NOT let selectedRole override the real userType
    return normalizeRole(fromContext || fromStored || fromSelectedRole);
  }, [authUser]);

  const shellClass =
    "h-screen sticky top-0 border-r bg-white " +
    (open ? "w-64" : "w-20") +
    " transition-all duration-200";

  return (
    <aside className={shellClass}>
      <div className="p-4 border-b">
        <Logo />
      </div>

      <div className="p-3">
        {!isAuthenticated ? (
          <StudentSidebar activePath={location.pathname} open={open} />
        ) : role === "college" ? (
          <CollegeSidebar activePath={location.pathname} open={open} />
        ) : role === "company" ? (
          <CompanySidebar activePath={location.pathname} open={open} />
        ) : role === "employer" ? (
          <EmployerSidebar activePath={location.pathname} open={open} />
        ) : role === "professional" ? (
          <ProfessionalSidebar activePath={location.pathname} open={open} />
        ) : role === "fresher" ? (
          <FresherSidebar activePath={location.pathname} open={open} />
        ) : (
          <StudentSidebar activePath={location.pathname} open={open} />
        )}
      </div>
    </aside>
  );
}
