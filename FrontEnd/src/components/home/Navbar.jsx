import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import heroImage from "../../assets/rawrecruit_transparent.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, user, logout } = useAuth();

  // Check if user is on home page
  const isHomePage = location.pathname === "/";

  const handleRoleSelect = (selectedRole) => {
    if (!isAuthenticated) {
      sessionStorage.setItem("tempSelectedRole", selectedRole);
      localStorage.setItem("selectedRole", selectedRole);
      navigate("/signup");
      return;
    }

    if (role === selectedRole) {
      navigate("/home");
    } else {
      const confirmSwitch = window.confirm(
        `You're logged in as ${role}. Switch to ${selectedRole}?`,
      );
      if (confirmSwitch) {
        sessionStorage.setItem("tempSelectedRole", selectedRole);
        navigate("/login");
      }
    }
  };

  const handleGetStarted = () => {
    navigate("/userselection");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setProfileOpen(false);
  };

  const handleDashboardClick = () => {
    navigate("/home");
    setProfileOpen(false);
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email;
    }
    return "User";
  };

 const handleLogoClick = () => {
  alert("logo click")
  console.log("Logo clicked");
  sessionStorage.setItem("fromLogo", "true");
  navigate("/");
};

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo - Click handler */}
        <div
          onClick={handleLogoClick}
          className="cursor-pointer font-display text-xl font-bold text-foreground"
        >
          <img src={heroImage} alt="RawRecruit Logo" className="h-14" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/signup?role=company"
            onClick={() => handleRoleSelect("company")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            For Companies
          </Link>
          <Link
            to="/signup?role=college"
            onClick={() => handleRoleSelect("college")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            For Colleges
          </Link>
          <Link
            to="/signup?role=employer"
            onClick={() => handleRoleSelect("employer")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            For Employers
          </Link>
          <Link
            to="/blogs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Blogs
          </Link>
        </div>

        {/* Desktop CTA / Profile */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-foreground px-4 py-2 hover:bg-muted rounded-lg"
              >
                Log in
              </button>
              <button
                onClick={handleGetStarted}
                className="btn-primary bg-primaryBrand text-sm py-2.5 px-5 hover:bg-white hover:text-primaryBrand hover:font-bold"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primaryBrand/10 flex items-center justify-center text-primaryBrand font-semibold text-sm">
                  {getUserInitial()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 z-50 bg-card border border-border rounded-xl shadow-lg py-2">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">
                        {getUserName()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {role || "User"}
                      </p>
                    </div>

                    <button
                      onClick={handleDashboardClick}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Dashboard
                    </button>

                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      Profile
                    </button>

                    <div className="border-t border-border my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-3">
          <button
            onClick={() => handleRoleSelect("company")}
            className="block text-sm"
          >
            For Companies
          </button>
          <button
            onClick={() => handleRoleSelect("college")}
            className="block text-sm"
          >
            For Colleges
          </button>
          <button
            onClick={() => handleRoleSelect("employer")}
            className="block text-sm"
          >
            For Employers
          </button>
          <button onClick={() => navigate("/blogs")} className="block text-sm">
            Blogs
          </button>
          <button onClick={() => navigate("/help")} className="block text-sm">
            Help
          </button>

          <div className="pt-3 flex gap-3">
            {!isAuthenticated ? (
              <>
                <button onClick={() => navigate("/login")} className="text-sm">
                  Log in
                </button>
                <button
                  onClick={handleGetStarted}
                  className="btn-primary text-sm bg-primaryBrand py-2 px-5"
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/home")} className="text-sm">
                  Dashboard
                </button>
                <button onClick={handleLogout} className="text-sm text-red-600">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
