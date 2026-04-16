import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductDepth = () => {
  const navigate = useNavigate();

  return (
  <section className="py-16 bg-white">
    <div className="max-w-6xl mx-auto px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Powerful Tools,{" "}
          <span className="bg-gradient-to-r from-primaryBrand to-[#6C8BFF] bg-clip-text text-transparent">
            One Platform
          </span>
        </h2>

        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Manage on-campus, pool-campus, and off-campus hiring — all from one system.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-14">

        {/* Block 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <span className="text-xs font-semibold text-primaryBrand uppercase tracking-wide">
            Hiring Dashboard
          </span>

          <div className="mt-5 space-y-3">
            {[
              "Track all hiring channels",
              "Manage job postings",
              "View candidate pipeline",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3"
              >
                <div className="w-2 h-2 rounded-full bg-primaryBrand" />
                <span className="text-sm text-gray-700 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Block 2 (highlighted) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md -translate-y-2"
        >
          <span className="text-xs font-semibold text-primaryBrand uppercase tracking-wide">
            Application System
          </span>

          <div className="mt-5 space-y-3">
            {[
              "Real-time application tracking",
              "Shortlist & interview management",
              "Centralized candidate data",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3"
              >
                <div className="w-2 h-2 rounded-full bg-primaryBrand" />
                <span className="text-sm text-gray-700 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Block 3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <span className="text-xs font-semibold text-primaryBrand uppercase tracking-wide">
            Campus Network Insights
          </span>

          <div className="mt-5 space-y-3">
            {[
              "Student Talent Data",
              "Training & Placement Programs",
              "Institution Branding"
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3"
              >
                <div className="w-2 h-2 rounded-full bg-primaryBrand" />
                <span className="text-sm text-gray-700 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* CTA */}
      {/* <div className="text-center">
        <button
          onClick={() => navigate("/demo")}
          className="px-8 py-3 text-lg rounded-xl bg-primaryBrand text-white font-medium shadow-md hover:shadow-lg transition"
        >
          Explore Platform Demo
        </button>
      </div> */}

    </div>
  </section>
);
};

export default ProductDepth;