import { motion } from "framer-motion";
import { MapPin, Users, Clock, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

//  ROLE FILTERS
const roleFilters = ["Student", "Company", "College"];

const subFiltersMap = {
  Student: ["On-Campus", "Off-Campus", "Pool-Campus", "Internship"],
  Company: ["On-Campus", "Pool-Campus", "Internship"],
  College: ["On-Campus", "Pool-Campus"],
};

//  DUMMY API DATA (STRUCTURED)
const jobs = [
  {
    title: "Frontend Developer",
    company: "TechNova",
    location: "Bangalore",
    salary: "₹6-9 LPA",
    posted: "2h ago",
    applicants: 23,
    role: "Company",
    type: "On-Campus",
  },
  {
    title: "Marketing Intern",
    company: "GrowthCo",
    location: "Mumbai",
    salary: "₹15K/mo",
    posted: "4h ago",
    applicants: 41,
    role: "Student",
    type: "Internship",
  },
  {
    title: "Data Analyst",
    company: "FinEdge",
    location: "Remote",
    salary: "₹5-7 LPA",
    posted: "1h ago",
    applicants: 17,
    role: "Student",
    type: "Off-Campus",
  },
];

const LiveJobs = () => {
  const [activeRole, setActiveRole] = useState("Student");
  const [activeType, setActiveType] = useState("On-Campus");

  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const filtered = jobs.filter(
    (j) => j.role === activeRole && j.type === activeType
  );

  const handleApply = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem("tempSelectedRole", "candidate");
      localStorage.setItem("selectedRole", "candidate");
      navigate("/signup");
      return;
    }

    if (role !== "candidate") {
      alert("Please login as a candidate to apply for jobs.");
      return;
    }

    navigate("/jobs");
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-sm font-semibold text-primaryBrand mb-4">
            🔥 100+ new opportunities every week
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Live Opportunities
          </h2>

          {/* ROLE FILTER */}
          <div className="flex justify-center gap-3 mt-6">
            {roleFilters.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setActiveRole(r);
                  setActiveType(subFiltersMap[r][0]);
                }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeRole === r
                    ? "bg-primaryBrand text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-primaryBrand"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* TYPE FILTER */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {subFiltersMap[activeRole].map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                  activeType === t
                    ? "bg-primaryBrand text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((job, i) => (
            <motion.div
              key={job.title + job.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>

                <span className="text-[11px] bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                  Actively hiring
                </span>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <IndianRupee className="w-3.5 h-3.5" /> {job.salary}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {job.posted}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {job.applicants} applicants
                  </span>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full bg-primaryBrand text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition"
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/jobs")}
            className="px-8 py-3 border border-primaryBrand text-primaryBrand rounded-xl hover:bg-primaryBrand hover:text-white transition"
          >
            View All Jobs
          </button>
        </div>

      </div>
    </section>
  );
};

export default LiveJobs;