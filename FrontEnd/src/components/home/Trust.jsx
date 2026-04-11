import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const logos = [
  "IIT Delhi",
  "Delhi University",
  "TechNova",
  "FinEdge",
  "CloudBase",
  "GrowthCo"
];

const stats = [
  { val: "10,000+", label: "Applications processed" },
  { val: "500+", label: "Companies onboarded" },
  { val: "50+", label: "College partners" },
];

const TrustSection = () => {
  const navigate = useNavigate();

  return (
  <section className="py-16 bg-white">
    <div className="max-w-6xl mx-auto px-6 text-center">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Built for Modern Hiring Teams
        </h2>

        <p className="text-gray-500 text-lg">
          Used by growing startups and campuses across India
        </p>
      </motion.div>

      {/* Logos */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {logos.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-gray-100 px-6 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
          >
            {name}
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-10 max-w-3xl mx-auto mb-14">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {s.val}
            </div>

            <div className="text-sm text-gray-500">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/userselection")}
        className="px-8 py-3 text-lg rounded-xl bg-primaryBrand text-white font-medium shadow-md hover:shadow-lg transition"
      >
        Join the Network
      </button>

    </div>
  </section>
);
};

export default TrustSection;