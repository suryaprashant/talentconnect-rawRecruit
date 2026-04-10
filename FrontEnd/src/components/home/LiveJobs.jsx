import { motion } from "framer-motion";
import { MapPin, Users, Clock, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// ROLES
const roleFilters = ["Student", "Company", "College", "Freshers"];

// SUB FILTERS
const subFiltersMap = {
  Student: [ "Off-Campus", "Internship"],
  Company: ["On-Campus", "Pool-Campus"],
  College: ["On-Campus", "Pool-Campus"],
  Freshers: ["Referral", "Off-Campus", "Internship"],
};

const LiveJobs = () => {
  const [activeRole, setActiveRole] = useState("Student");
  const [activeType, setActiveType] = useState("Off-Campus");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  // API MAPPING
  const getApiEndpoint = (role, type) => {
    // STUDENT
    if (role === "Student") {
      if (type === "Off-Campus") return "/api/student-dashboard/off-campus";
      if (type === "Internship") return "/api/student-dashboard/internship-postings";
    }

    // COLLEGE
    if (role === "College") {
      if (type === "Pool-Campus") return "/api/student-dashboard/getAllPoolCampusJobs";
      if (type === "On-Campus") return "/api/student-dashboard/on-campus/college";
    }

    // COMPANY
    if (role === "Company") {
      if (type === "On-Campus") return "/api/student-dashboard/on-campus";
      if (type === "Pool-Campus") return "/api/student-dashboard/pool-campus/company";
    }

    // FRESHERS
    if (role === "Freshers") {
      if (type === "Referral") return "/api/student-dashboard/referral-jobs";
      if (type === "Off-Campus") return "/api/student-dashboard/off-campus";
      if (type === "Internship") return "/api/student-dashboard/internship-postings";
    }

    return null;
  };

  // FETCH JOBS
  const fetchJobs = async () => {
    const endpoint = getApiEndpoint(activeRole, activeType);
    if (!endpoint) {
      setJobs([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(endpoint);
      const data = await res.json();

      // adjust if backend structure differs
      setJobs(data?.data || data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // TRIGGER ON CHANGE
  useEffect(() => {
    fetchJobs();
  }, [activeRole, activeType]);

  // APPLY BUTTON
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

      {/* HEADER */}
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
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
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

      {/* JOB GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-center col-span-3">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center col-span-3">No jobs found</p>
        ) : (
          [...jobs]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 3)
  .map((job, i) => {
    const title = job.jobRoles?.[0] || job.jobTitle || job.collegePosted.collegeUniversityDetails.collegeName ||"Role not specified";

    const company =
      job.companyName ||
      job.companyPosted?.companyDetails?.companyName ||
      "Company";

    const location =
      job.companyPosted?.hiringPreferences?.hiringLocations?.[0] ||
      (Array.isArray(job.location) && job.location.length > 0
        ? job.location[0]
        : null) ||
      job.collegePosted?.collegeUniversityDetails?.collegeLocation ||
      "Location not specified";

    const salary = job.packageDetails?.totalCTC
      ? `${(job.packageDetails.totalCTC / 100000).toFixed(1)} LPA`
      : "Not disclosed";

    const employmentType = job.employmentType?.[0] || job.jobType || "N/A";
    const workMode = job.workMode?.[0] || job.jobType || "N/A";

    const skills = job.skills || [];
    const visibleSkills = skills.slice(0, 2);
    const extraSkills = skills.length - 2;

    const tag = job.tags?.[0]; // only first tag

    return (
      <motion.div
        key={job._id || i}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}
        className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
      >
        {/* TAG TOP RIGHT */}
        {tag && (
          <span className="absolute top-3 right-3 text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            {tag}
          </span>
        )}

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{company}</p>
        </div>

        {/* META */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> {location}
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="w-3.5 h-3.5" /> {salary}
          </div>

          <div className="flex gap-3 text-xs text-gray-500">
            <span>{employmentType}</span>
            <span>•</span>
            <span>{workMode}</span>
          </div>
        </div>

        {/* SKILLS */}
        <div className="flex flex-wrap gap-2 mb-3">
          {visibleSkills.map((skill, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-100 px-2 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}

          {extraSkills > 0 && (
            <span className="text-xs bg-gray-200 px-2 py-1 rounded-md">
              +{extraSkills} more
            </span>
          )}
        </div>

        <button
          onClick={handleApply}
          className="w-full bg-primaryBrand text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition"
        >
          Apply Now
        </button>
      </motion.div>
    );
  })
        )}
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