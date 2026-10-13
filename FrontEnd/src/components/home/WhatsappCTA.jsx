import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const WhatsAppCTA = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleWhatsAppJoin = () => {
    // Only candidates
    if (!isAuthenticated) {
      sessionStorage.setItem("tempSelectedRole", "candidate");
      localStorage.setItem("selectedRole", "candidate");
      navigate("/signup");
      return;
    }

    if (role !== "candidate") {
      alert("WhatsApp alerts are available for students only.");
      return;
    }

    // 👉 Replace with your actual WhatsApp link
    window.open("https://wa.me/91XXXXXXXXXX", "_blank");
  };

  return (
  <section className="py-16 bg-[#f8fafc]">
    <div className="max-w-6xl mx-auto px-6">

      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Never Miss an Opportunity
          </h2>

          <p className="text-gray-500 text-lg mb-8 max-w-md">
            Get instant job alerts on WhatsApp. Be the first to apply when new roles match your profile.
          </p>

          <button
            onClick={handleWhatsAppJoin}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium shadow-md hover:shadow-lg hover:bg-green-700 transition"
          >
            <MessageCircle className="w-5 h-5" />
            Join WhatsApp Alerts
          </button>

          <p className="text-xs text-gray-400 mt-3">
            🔒 No spam. Only relevant job updates.
          </p>
        </motion.div>

        {/* RIGHT MOCK */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex justify-center"
        >
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm w-full max-w-sm">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-900">
                  RawRecruit Alerts
                </div>
                <div className="text-xs text-green-600">
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3">

              <div className="bg-green-50 rounded-xl px-4 py-3 text-sm text-gray-800 max-w-[85%]">
                🚀 New job alert! Frontend Developer at TechNova — ₹6-9 LPA. Apply now →
              </div>

              <div className="bg-green-50 rounded-xl px-4 py-3 text-sm text-gray-800 max-w-[85%]">
                🎯 You matched 95% with Data Analyst at FinEdge!
              </div>

            </div>

          </div>
        </motion.div>

      </div>

    </div>
  </section>
);
};

export default WhatsAppCTA;