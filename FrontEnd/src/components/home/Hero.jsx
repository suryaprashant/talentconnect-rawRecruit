import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardMock from "@/components/home/DashboardMock";
import image1 from "../../assets/companyDashboard.png";
import image2 from "../../assets/collegeDashboard.png";
import image3 from "../../assets/CandidateDashboard.png";
const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return <>{count.toLocaleString()}{suffix}</>;
};

export default function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [hoveredAction, setHoveredAction] = useState("hire");

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

  return (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#e0e7ff]">

    {/* 🔵 Background Blobs */}
    <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#7765DA]/20 rounded-full blur-3xl"></div>
    
    <div className="absolute bottom-[-120px] right-[-80px] w-[400px] h-[400px] bg-[#4F0DCE]/20 rounded-full blur-3xl"></div>

    {/* Optional soft radial highlight */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.6),transparent_60%)]"></div>

    <div className="relative container mx-auto px-6 py-14 md:py-16 lg:py-16">
      
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >

          <h1 className="font-display text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] text-foreground mb-6">
            The Fastest Way to{" "}
            <span className="text-[#143694]">Hire Freshers</span> in India
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
            Post jobs, connect with colleges, and access candidates instantly across campus and off-campus channels.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">

            <button
              onClick={() => handleRoleSelect("company")}
              onMouseEnter={() => setHoveredAction("hire")}
              onMouseLeave={() => setHoveredAction("hire")}
              className="px-6 py-3 rounded-xl bg-[#143694] text-white text-lg shadow-md hover:shadow-lg transition"
            >
              Start Hiring
            </button>
            <button
              onMouseEnter={() => setHoveredAction("college")}
              onMouseLeave={() => setHoveredAction("hire")}
              onClick={() => handleRoleSelect("college")}
              className="px-6 py-3 rounded-xl border-2 border-[#143694] text-[#143694] text-lg hover:bg-[#143694] hover:text-white transition"
            >
              Partner as College
            </button>
            <button
              onMouseEnter={() => setHoveredAction("apply")}
              onMouseLeave={() => setHoveredAction("hire")}
              onClick={() => handleRoleSelect("candidate")}
              className="px-6 py-3 rounded-xl border-2 border-[#143694] text-[#143694] text-lg hover:bg-[#143694] hover:text-white transition"
            >
              Apply for Jobs
            </button>

          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mt-4">
            <button
              onClick={() => navigate("/demo")}
              className="flex items-center gap-1 hover:text-[#143694] transition"
            >
             Watch Demo
            </button>

            <span className="w-1.5 h-1.5 rounded-full mt-2 bg-[#143694]" />

            <button
              onClick={() => navigate("/onboarding")}
              className="flex items-center gap-1 hover:text-[#143694] transition"
            >
              Request onboarding support
            </button>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <img
            src={
              hoveredAction === "hire"
                ? image1
                : hoveredAction === "apply"
                ? image3
                : hoveredAction === "college"
                ? image2
                : "/images/default.png"
            }
            alt="Preview"
            className="w-full h-auto rounded-xl shadow-lg transition-all duration-300"
          />
        </motion.div>

      </div>
    </div>
  </section>
);
};