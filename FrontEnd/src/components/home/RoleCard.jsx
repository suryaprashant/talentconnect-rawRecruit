import { motion } from "framer-motion";
import { GraduationCap, Building2, School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const roles = [
  {
    icon: GraduationCap,
    title: "Student",
    roleKey: "candidate", // IMPORTANT
    desc: "Discover jobs, internships and build your career from day one.",
    cta: "Apply to Jobs",
    color: "from-blue-50 to-blue-100/50",
    border: "hover:border-accent",
  },
  {
    icon: Building2,
    title: "Company",
    roleKey: "company",
    desc: "Post jobs, access verified freshers, and hire faster than ever.",
    cta: "Start Hiring",
    color: "from-indigo-50 to-indigo-100/50",
    border: "hover:border-primary",
  },
  {
    icon: School,
    title: "College",
    roleKey: "college",
    desc: "Manage campus placements and connect with top employers.",
    cta: "Partner With Us",
    color: "from-sky-50 to-sky-100/50",
    border: "hover:border-sky-500",
  },
];

const RoleCards = () => {
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
  <section className="py-20 bg-[#f8fafc]">
    <div className="max-w-6xl mx-auto px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          How do you want to use{" "}
          <span className="text-[#143694]">RawRecruit</span>?
        </h2>

        <p className="text-gray-500 text-lg">
          Choose your path and get started in seconds
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-10">

        {roles.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            onClick={() => handleRoleSelect(r.roleKey)}
            className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#eef2ff] flex items-center justify-center mx-auto mb-6">
              <r.icon className="w-7 h-7 text-[#143694]" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {r.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 mb-6 leading-relaxed">
              {r.desc}
            </p>

            {/* Button */}
            <button className="w-full bg-[#143694] text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition">
              {r.cta}
            </button>
          </motion.div>
        ))}

      </div>
    </div>
  </section>
);
};

export default RoleCards;