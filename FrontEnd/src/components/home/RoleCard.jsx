import { motion } from "framer-motion";
import { GraduationCap, Building2, Briefcase, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const roles = [
  {
    roleKey: "company",
    title: "For Companies (HR & Hiring Managers)",
    icon: Building2,
    points: [
      "Create a company profile to manage fresher hiring at scale",
      "Explore college-led on-campus and pool-campus recruitment opportunities",
      "Post on-campus, pool-campus, and off-campus hiring requirements",
      "Access workforce solutions and employee training programs",
    ],
    cta: "Start Hiring",
  },
  {
    roleKey: "college",
    title: "For Colleges (TPOs)",
    icon: BriefcaseBusiness,
    points: [
      "Register your college on a centralized campus recruitment platform",
      "Discover on-campus and pool-campus hiring requests from companies",
      "Publish on-campus and pool-campus recruitment opportunities",
      "Access student training, seminars, and institutional branding services",
    ],
    cta: "Partner as College",
  },
  {
    roleKey: "candidate",
    title: "For Candidates (Job Seekers)",
    icon: GraduationCap,
    points: [
      "Create your profile and get discovered by companies",
      "Explore internships and fresher job opportunities",
      "Apply to  off-campus drives, internship and Referral Job",
      "Access training and placement support"
    ],
    cta: "Apply Now",
  }
  // {
  //   roleKey: "employer",
  //   title: "For Employers (Staffing & Hiring Partners)",
  //   icon: Briefcase,
  //   points: [
  //     "Set up an independent employer profile",
  //     "Manage end-to-end campus and off-campus recruitment activities",
  //     "Coordinate hiring on behalf of multiple companies",
  //     "Handle company approvals, scheduling, and recruitment operations",
  //   ],
  //   cta: "Apply Now",
  // },
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
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          One Platform.{" "}
          <span className="text-primaryBrand">Three Powerful Interfaces.</span>
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
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
          >

            {/* TOP CONTENT */}
            <div>

              {/* Icon */}
              <div className="w-10 h-10 p-1.5 rounded-2xl bg-[#eef2ff] flex items-center justify-center mx-auto mb-6">
                <r.icon className="w-7 h-7 text-[#143694]" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-left">
                {r.title}
              </h3>

              {/* Points */}
              <div className="space-y-3 mb-6 text-left">
                {r.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="min-w-[24px] h-6 flex items-center justify-center text-xs rounded-md bg-gray-100 text-primaryBrand font-semibold">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

            </div>

            {/* BUTTON (ALWAYS BOTTOM) */}
            <button className="w-full bg-[#143694] text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition hover:bg-white hover:text-primaryBrand border border-primaryBrand mt-4">
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