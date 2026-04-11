import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UrgencyBanner = () => {
  const navigate = useNavigate();

  return (
  <section className="py-16 bg-[#f8fafc]">
    <div className="max-w-6xl mx-auto px-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl px-6 md:px-12 py-12 md:py-16 text-center text-white"
        style={{
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
        }}
      >

        {/* Dot Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Hiring is happening right now — don’t miss out
          </h2>

          <p className="text-white/80 mb-8 text-lg">
            Join thousands of students and companies already on RawRecruit
          </p>

          {/* Button */}
          <button
            onClick={() => navigate("/userselection")}
            className="bg-white text-[#1e3a8a] font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition"
          >
            Get Started
          </button>

        </div>

      </motion.div>

    </div>
  </section>
);
};

export default UrgencyBanner;