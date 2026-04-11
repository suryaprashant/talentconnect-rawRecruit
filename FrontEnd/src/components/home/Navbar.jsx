import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import heroImage from "../../assets/RR-Tagline.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

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
        `You're logged in as ${role}. Switch to ${selectedRole}?`
      );
      if (confirmSwitch) {
        sessionStorage.setItem("tempSelectedRole", selectedRole);
        navigate("/login");
      }
    }
  };

  const handleGetStarted = () => {
    navigate("/userselection"); // IMPORTANT (your existing flow)
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <button onClick={() => navigate("/")} className="font-display text-xl font-bold text-foreground">
          <img src={heroImage} alt="TalentConnect" className="h-14" />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          
          <button onClick={() => handleRoleSelect("company")} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            For Companies
          </button>
          <button onClick={() => handleRoleSelect("college")} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            For Colleges
          </button>
          <button onClick={() => handleRoleSelect("student")} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            For Candidate
          </button>
          {/* <button onClick={() => navigate("/help")} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Help
          </button> */}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
            {/* <button onClick={() => navigate("/demo")} className="text-sm font-medium text-foreground px-4 py-2 hover:bg-muted rounded-lg">
              View Demo
            </button> */}

          {!isAuthenticated ? (
            <>
              <button onClick={() => navigate("/login")} className="text-sm font-medium text-foreground px-4 py-2 hover:bg-muted rounded-lg">
                Log in
              </button>
              <button onClick={handleGetStarted} className="btn-primary bg-primaryBrand text-sm py-2.5 px-5 hover:bg-white hover:text-primaryBrand hover:font-bold">
                Get Started
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/home")} className="btn-primary text-sm py-2.5 px-5">
              Dashboard
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-3">
          <button onClick={() => handleRoleSelect("candidate")} className="block text-sm">For Students</button>
          <button onClick={() => handleRoleSelect("company")} className="block text-sm">For Companies</button>
          <button onClick={() => handleRoleSelect("college")} className="block text-sm">For Colleges</button>

          <button onClick={() => navigate("/help")} className="block text-sm">Help</button>

          <div className="pt-3 flex gap-3">
            {/* <button onClick={() => navigate("/demo")} className="text-sm">View Demo</button> */}
            <button onClick={() => navigate("/login")} className="text-sm">Log in</button>
            <button onClick={handleGetStarted} className="btn-primary text-sm py-2 px-5">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;