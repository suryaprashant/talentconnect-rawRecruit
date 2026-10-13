import { motion } from "framer-motion";
import { Building2, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    icon: Building2,
    title: "For Companies",
    roleKey: "company",
    color: "bg-primary/10 text-primary",
    steps: [
      "Post jobs and hiring requirements",
      "Receive applications from colleges and students",
      "Shortlist, interview, and hire"
    ],
  },
  {
    icon: GraduationCap,
    title: "For Colleges",
    roleKey: "college",
    color: "bg-accent/10 text-accent",
    steps: [
      "Post campus hiring requests",
      "Connect with companies",
      "Manage placement drives"
    ],
  },
  {
    icon: Users,
    title: "For Students",
    roleKey: "candidate",
    color: "bg-green-100 text-green-700",
    steps: [
      "Build your profile",
      "Apply to jobs and internships",
      "Track application status"
    ],
  },
];

const WhatHappensNext = () => {
  const navigate = useNavigate();

  return (
  <section className="py-16 bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#e0e7ff]">
    <div className="max-w-6xl mx-auto px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          What Happens{" "}
          <span className="bg-gradient-to-r from-primaryBrand to-[#6C8BFF] bg-clip-text text-transparent">
            After Signup?
          </span>
        </h2>

        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          See how each role uses RawRecruit to achieve results.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-10">
        {roles.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-[#eef2ff] flex items-center justify-center mb-5">
              <r.icon className="w-6 h-6 text-primaryBrand" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              {r.title}
            </h3>

            {/* Steps */}
            <ol className="space-y-4">
              {r.steps.map((step, si) => (
                <li
                  key={si}
                  className="flex items-start gap-3 text-sm text-gray-500"
                >
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700">
                    {si + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);
};

export default WhatHappensNext;