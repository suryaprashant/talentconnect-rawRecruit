import { motion } from "framer-motion";

const DashboardMock = () => {
  const candidates = [
    { name: "Priya Sharma", role: "Frontend Developer", match: 95 },
    { name: "Arjun Patel", role: "Data Analyst", match: 91 },
    { name: "Sneha Reddy", role: "UI Designer", match: 88 },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">

      {/* Main Dashboard Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-gray-800">
            Recruiter Dashboard
          </h3>

          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Live
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Open Jobs", val: "24" },
            { label: "Applications", val: "847" },
            { label: "Hired", val: "56" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center"
            >
              <div className="font-bold text-lg text-gray-800">
                {s.val}
              </div>
              <div className="text-xs text-gray-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Candidates */}
        <div className="space-y-3">
          {candidates.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                  {c.name[0]}
                </div>

                {/* Info */}
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {c.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.role}
                  </div>
                </div>
              </div>

              {/* Match */}
              <span className="text-sm font-semibold text-[#143694]">
                {c.match}% match
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Notification */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1 }}
        className="absolute -bottom-6 -left-6 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-3 max-w-[240px]"
      >
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">
          ✓
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-800">
            New Application
          </div>
          <div className="text-[11px] text-gray-500">
            Rohit applied just now
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardMock;