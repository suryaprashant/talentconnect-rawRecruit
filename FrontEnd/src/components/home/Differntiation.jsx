import { motion } from "framer-motion";
import { Building2, GraduationCap, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
  {
    icon: Building2,
    title: "On-Campus + Pool + Off-Campus",
    desc: "Run all three hiring modes in one system — no fragmented tools.",
  },
  {
    icon: GraduationCap,
    title: "Direct College Network",
    desc: "Access verified colleges and students without middle layers.",
  },
  {
    icon: Zap,
    title: "Structured Hiring Pipeline",
    desc: "Applications, shortlisting, interviews — all tracked in one flow.",
  },
  {
    icon: Users,
    title: "Built for Freshers Only",
    desc: "No noise. Only entry-level candidates and campus hiring.",
  },
];

const Differentiation = () => {
  const navigate = useNavigate();

  return (
  <section className="py-16 bg-[#f8fafc]">
    <div className="max-w-6xl mx-auto px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Why{" "}
          <span className="bg-gradient-to-r from-primaryBrand to-[#6C8BFF] bg-clip-text text-transparent">
            RawRecruit
          </span>
          ?
        </h2>

        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Not just a job portal — a complete campus recruitment system.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#eaf0ff] flex items-center justify-center mx-auto mb-5">
              <item.icon className="w-7 h-7 text-primaryBrand" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      {/* <div className="text-center">
        <button
          onClick={() => navigate("/userselection")}
          className="px-8 py-3 text-lg rounded-xl bg-primaryBrand text-white font-medium shadow-md hover:shadow-lg transition"
        >
          Get Started with RawRecruit
        </button>
      </div> */}

    </div>
  </section>
);
};

export default Differentiation;