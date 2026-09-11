import { motion } from "framer-motion";
import { UserPlus, FileText, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: UserPlus,
    title: "Choose Your Role",
    desc: "Sign up as Company, College, or Candidate(Student, Fresher, Professional) to access hiring, internships, and job opportunities."
  },
  {
    icon: FileText,
    title: "Complete Profile",
    desc: "Complete your profile to manage campus hiring or apply for jobs and internships efficiently."
  },
  {
    icon: Rocket,
    title: "Start Using Platform",
    desc: "Start hiring freshers, applying to jobs, or managing placements through one unified platform."
  },
];

const GettingStarted = () => {
  const navigate = useNavigate();

  return (
  <section className="py-16 bg-white">
    <div className="max-w-5xl mx-auto px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Get Started with RawRecruit in{" "}
          <span className="bg-gradient-to-r from-primaryBrand to-[#6C8BFF] bg-clip-text text-transparent">
            3 Simple Steps
          </span>
        </h2>

        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          From signup to hiring or applying — everything takes just minutes.
        </p>
      </motion.div>
      <div className="sr-only">
        <h3>How to Start Using RawRecruit</h3>
        <p>
          Sign up, complete your profile, and start applying to jobs, internships, or hiring freshers through a centralized campus hiring platform.
        </p>
      </div>
      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto mb-14 text-center">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
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
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <a
          href="/signup"
          className="px-8 py-3 text-lg rounded-xl bg-primaryBrand text-white font-medium shadow-md hover:shadow-lg transition"
        >
          Get Started Now
        </a>
      </div>

    </div>
  </section>
);
};

export default GettingStarted;