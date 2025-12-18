// src/pages/UnifiedDashboard.jsx
import React, { useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

// Candidate dashboard
import StudentHome from "./students/Dashboard";

// Role dashboards
import CompanyProfile from "./company/dashboard/CompanyProfile";
import CollegeProfile from "./college/dashboard/CollegeProfile";
import EmployerProfile from "./employer/dashboard/CompanyProfile";

// Other dashboards
import FresherDashboard from "../pages/fresher/Dashboard";
import ProfDashboard from "../pages/professional/Dashboard";

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

export default function UnifiedDashboard() {
  const [authUser] = useAuth();

  const role = useMemo(() => {
    const fromContext = authUser?.user?.userType || null;
    const fromStoredUser = readStoredUserType(); // reliable after AuthProvider fix
    const fromSelectedRole = localStorage.getItem("selectedRole") || null;

    // IMPORTANT: when logged in, prefer actual userType over selectedRole
    return normalizeRole(fromContext || fromStoredUser || fromSelectedRole);
  }, [authUser]);

  // Keep sidebar consistent after login
  useEffect(() => {
    if (role) localStorage.setItem("selectedRole", role);
  }, [role]);

  if (!role) return <Navigate to="/login" replace />;

  switch (role) {
    case "student":
      return <StudentHome />;
    case "fresher":
      return <FresherDashboard />;
    case "professional":
      return <ProfDashboard />;
    case "company":
      return <CompanyProfile />;
    case "college":
      return <CollegeProfile />;
    case "employer":
      return <EmployerProfile />;
    default:
      return <Navigate to="/login" replace />;
  }
}
