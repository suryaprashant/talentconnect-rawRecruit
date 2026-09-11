// components/PublicRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  console.log("PublicRoute", {
    pathname: location.pathname,
    isAuthenticated,
    fromLogo: sessionStorage.getItem("fromLogo"),
  });

  // Read directly from sessionStorage
  const fromLogo = sessionStorage.getItem("fromLogo") === "true";

  if (isAuthenticated && location.pathname === "/") {
    if (fromLogo) {
      sessionStorage.removeItem("fromLogo");
      return children;
    }

    return <Navigate to="/home" replace />;
  }

  return children;
};
