import { motion } from "framer-motion";
import {
  Briefcase, Users, Rocket,
  UserPlus, Search, Send,
  School, Link2, BarChart3
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// ---------------- DATA ----------------
const companySteps = [
  { icon: Briefcase, title: "Post Hiring Request", desc: "Create on-campus, pool-campus, off-campus, or internship hiring needs." },
  { icon: Users, title: "Receive Applications", desc: "Colleges apply for on-campus, pool-campus drives. Candidates apply for off-campus/internship roles." },
  { icon: Rocket, title: "Hire & Track Progress", desc: "Manage applications, interviews, and offers in one dashboard." },
];

const candidateSteps = [
  { icon: UserPlus, title: "Build Your Profile", desc: "Showcase skills, projects, and resume to recruiters." },
  { icon: Search, title: "Explore Opportunities", desc: "Find off-campus and internship roles." },
  { icon: Send, title: "Apply & Track", desc: "Apply instantly and track your application progress." },
];

const collegeSteps = [
  { icon: School, title: "Post Campus Drives", desc: "Create on-campus or pool-campus hiring opportunities." },
  { icon: Link2, title: "Connect with Companies", desc: "Collaborate with companies for placement drives." },
  { icon: BarChart3, title: "Track Placements", desc: "Monitor placement performance and outcomes." },
];

const tabs = [
  { key: "company", label: "For Companies" },
  { key: "college", label: "For Colleges" },
  { key: "candidate", label: "For Candidates" }, 
];

const stepsMap = {
  company: companySteps,
  candidate: candidateSteps,
  college: collegeSteps,
};

// ---------------- COMPONENT ----------------
const HowItWorks = () => {
  const [tab, setTab] = useState("company");
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const steps = stepsMap[tab];

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
  <section className="py-16 bg-[#f8fafc]">
    <div className="max-w-6xl mx-auto px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          How RawRecruit Works
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-3 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${
                tab === t.key
                  ? "bg-primaryBrand text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>
      <div className="sr-only">
        <h3>How Companies Hire Freshers</h3>
        <p>Post jobs, receive applications, and manage hiring processes.</p>

        <h3>How Students Apply for Jobs</h3>
        <p>Explore internships, referral jobs, and apply to opportunities.</p>

        <h3>How Colleges Manage Placements</h3>
        <p>Connect with companies and manage campus recruitment drives.</p>
      </div>
      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#eaf0ff] flex items-center justify-center mx-auto mb-6">
              <s.icon className="w-7 h-7 text-primaryBrand" />
            </div>

            {/* Step */}
            <div className="text-sm font-semibold text-primaryBrand mb-2">
              Step {i + 1}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {s.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA
      <div className="text-center mt-14">
        <button
          onClick={() => handleRoleSelect(tab)}
          className="px-8 py-3 rounded-xl bg-primaryBrand text-white font-medium shadow-md hover:shadow-lg transition"
        >
          Get Started as {tabs.find(t => t.key === tab)?.label}
        </button>
      </div> */}

    </div>
  </section>
);
};

export default HowItWorks;