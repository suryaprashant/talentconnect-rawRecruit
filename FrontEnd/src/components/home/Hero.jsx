import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardMock from "@/components/home/DashboardMock";
import image1 from "../../assets/companyDashboard.png";
import image2 from "../../assets/collegeDashboard.png";
import image3 from "../../assets/CandidateDashboard.png";
import OnboardingForm from "./OnboardingRequestForm";
import { CirclePlay, HelpCircle, Star } from "lucide-react";
// import demoVideo2 from "../../assets/college.mp4";
// import demoVideo from "../../assets/company.mp4";
const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const currentVideo =
      hoveredAction === "college"
        ? demoVideo2
        : demoVideo; // default = company

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
  const [showModal, setShowModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
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

  const contentMap = {
    hire: {
      title: "Hire Fresher Talent",
      highlight: "Faster",
      desc: "Run On-Campus, Pool-Campus, and Off-Campus hiring from one unified platform — connect with colleges, manage drives, and hire freshers faster."
    },
    college: {
      title: "Connect with",
      highlight: "Hiring Companies",
      desc: "Run On-Campus and Pool-Campus placement drives from one unified platform — connect with employers and improve student placement outcomes."
    },
    apply: {
      title: "Become a",
      highlight: "Hiring Partner",
      desc: "Collaborate with companies and colleges, provide referrals, conduct interviews, and help organizations discover high-potential fresher talent."
    }
  };
  const videoMap = {
    hire: "4qG45O8zE9g",      // 🔥 company video
    college: "cO26ecStWTI",   // 🔥 college video
    apply: "4qG45O8zE9g"      // optional (or fallback)
  };
  return (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#e0e7ff]">

    {/* 🔵 Background Blobs */}
    <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#7765DA]/20 rounded-full blur-3xl"></div>
    
    <div className="absolute bottom-[-120px] right-[-80px] w-[400px] h-[400px] bg-[#4F0DCE]/20 rounded-full blur-3xl"></div>

    {/* Optional soft radial highlight */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.6),transparent_60%)]"></div>

    <div className="relative container mx-auto px-6 py-6 md:py-8 lg:py-10">
      
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <motion.div
          key={hoveredAction}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 2,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <span className="inline-block text-xs md:text-sm font-medium px-4 py-1.5 rounded-full 
            bg-[#7765DA]/10 text-primaryBrand border border-[#7765DA]/20 backdrop-blur-sm
            transition-all duration-300 hover:scale-105 mb-2"
          >
            <Star size={14} className="inline-block -mt-1 mr-1 text-primaryBrand" />
            India’s First
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] text-foreground mb-6">
            {contentMap[hoveredAction].title}{" "}
            <span className="text-[#143694]">
              {contentMap[hoveredAction].highlight}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
            {contentMap[hoveredAction].desc}
          </p>

          <div className="flex flex-wrap gap-4 mb-10">

  <button
    onClick={() => handleRoleSelect("company")}
    onMouseEnter={() => setHoveredAction("hire")}
    className={`px-6 py-3 rounded-xl border-2 font-medium shadow-md transition-all duration-300 ease-out
      ${hoveredAction === "hire"
        ? "bg-primaryBrand text-white border-primaryBrand shadow-md"
        : "border-primaryBrand text-primaryBrand hover:bg-primaryBrand hover:text-white hover:shadow-md hover:-translate-y-0.5"}
      active:scale-95`}
  >
    Start Hiring
  </button>

  <button
    onClick={() => handleRoleSelect("college")}
    onMouseEnter={() => setHoveredAction("college")}
    className={`px-6 py-3 rounded-xl border-2 font-medium transition-all duration-300 ease-out
      ${hoveredAction === "college"
        ? "bg-primaryBrand text-white border-primaryBrand shadow-md"
        : "border-primaryBrand text-primaryBrand hover:bg-primaryBrand hover:text-white hover:shadow-md hover:-translate-y-0.5"}
      active:scale-95`}
  >
    Partner as College
  </button>

  <button
    onClick={() => handleRoleSelect("employer")}
    onMouseEnter={() => setHoveredAction("apply")}
    className={`px-6 py-3 rounded-xl border-2 font-medium transition-all duration-300 ease-out
      ${hoveredAction === "apply"
        ? "bg-primaryBrand text-white border-primaryBrand shadow-md"
        : "border-primaryBrand text-primaryBrand hover:bg-primaryBrand hover:text-white hover:shadow-md hover:-translate-y-0.5"}
      active:scale-95`}
  >
    Join as Employer
  </button>

</div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mt-4">
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center gap-1 hover:text-[#143694] transition"
            >
            <CirclePlay size={16} />
             Watch Demo
            </button>

            <span className="w-1.5 h-1.5 rounded-full mt-2 ml-1 bg-[#143694]" />

            <button
              onClick={() => setShowModal(true)} 
              className="flex items-center gap-1 hover:text-[#143694] transition"
            >
              Request onboarding support
              <HelpCircle size={16} />
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
            alt="Campus hiring dashboard for companies managing on-campus and off-campus recruitment"
            className="w-full h-auto rounded-xl shadow-lg transition-all duration-300"
          />
        </motion.div>

      </div>
    </div>
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative">

          {/* Close */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            ✕
          </button>

          <h2 className="text-xl font-semibold mb-4">
            Request Onboarding Support
          </h2>

          <OnboardingForm onClose={() => setShowModal(false)} />
        </div>
      </div>
    )}
    {showVideoModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl mx-4">
          
          {/* Close Button */}
          <button
            onClick={() => setShowVideoModal(false)}
            className="absolute -top-10 right-0 text-white text-xl hover:scale-110 transition"
          >
            ✕
          </button>

          {/* Video Container */}
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            <iframe
              className="w-full h-[400px] md:h-[500px] rounded-xl"
              src={`https://www.youtube.com/embed/${
                videoMap[hoveredAction] || videoMap.hire
              }?autoplay=1`}
              title="Demo Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    )}

  </section>
);
};