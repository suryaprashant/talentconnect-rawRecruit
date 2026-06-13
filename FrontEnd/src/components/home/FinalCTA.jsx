import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const FinalCTA = () => {
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

  return (
  <section className="py-16 relative overflow-hidden bg-[#f8fafc]">

    {/* Soft Background Blobs */}
    <div className="absolute top-[-120px] right-[-120px] w-[350px] h-[350px] bg-gradient-to-r from-primaryBrand to-[#6C8BFF] opacity-30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-120px] left-[-120px] w-[350px] h-[350px] bg-gradient-to-r from-primaryBrand to-[#6C8BFF] opacity-30 rounded-full blur-3xl"></div>
    
    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Start Hiring Freshers or Apply for Jobs & Internships{" "}
          <span className="bg-gradient-to-r from-primaryBrand to-[#6C8BFF] bg-clip-text text-transparent">
            Today
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
          Find fresher jobs, internships, and campus hiring opportunities or hire top candidates through RawRecruit.
        </p>

        <div className="sr-only">
          <h3>Join RawRecruit for Jobs, Internships and Campus Hiring</h3>
          <p>
            Companies can hire freshers, colleges can manage placements, and students can apply for jobs and internships through RawRecruit.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">

          {/* Primary */}
          <a
            href='/signup?role=company'
            onClick={() => handleRoleSelect("company")}
            className="px-6 py-3 rounded-xl bg-primaryBrand text-white font-medium shadow-md transition-all duration-300 ease-out
            hover:shadow-xl hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
          >
            Start Hiring
          </a>
          {/* College */}
          <a
            href='/signup?role=college'
            onClick={() => handleRoleSelect("college")}
            className="px-6 py-3 rounded-xl border-2 border-primaryBrand text-primaryBrand font-medium transition-all duration-300 ease-out
            hover:bg-primaryBrand hover:text-white hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            Partner as College
          </a>
          {/* Student */}
          <a
            href='/signup?role=student'
            onClick={() => handleRoleSelect("student")}
            className="px-6 py-3 rounded-xl border-2 border-primaryBrand text-primaryBrand font-medium transition-all duration-300 ease-out
            hover:bg-primaryBrand hover:text-white hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            Apply Now
          </a>

          {/* Ghost */}
          {/* <button
            onClick={() => navigate("/demo")}
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
          >
            View Demo
          </button> */}

        </div>

      </motion.div>

    </div>
  </section>
);
};

export default FinalCTA;