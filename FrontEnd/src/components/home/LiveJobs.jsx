import { motion } from "framer-motion";
import { MapPin, Users, Clock, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import CompanyJobCard from "../home/jobCards/CompanyJobCard";
import CollegeJobCard from "../home/jobCards/CollegeJobCard";
import ReferralJobCard from "../home/jobCards/ReferralJobCard";
import InternshipJobCard from "../home/jobCards/InternshipJobCard";
// ROLES
const roleFilters = ["Company", "College", "Student", "Freshers"];

// SUB FILTERS
const subFiltersMap = {
  Student: [ "Off-Campus", "Internship"],
  Company: ["On-Campus", "Pool-Campus"],
  College: ["On-Campus", "Pool-Campus"],
  Freshers: ["Off-Campus", "Referral", "Internship"],
};

const LiveJobs = () => {
  const [activeRole, setActiveRole] = useState("Company");
  const [activeType, setActiveType] = useState("On-Campus");

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

      const res = await fetch(
        `${import.meta.env.VITE_Backend_URL}${endpoint}`
      );

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("❌ Invalid response (not JSON):", text);
        setJobs([]);
        return;
      }

      const data = await res.json();

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
    

    // ROLE BASED ROUTING
    if (activeRole === "Company" && activeType === "On-Campus") {
      navigate("/company-dashboard/On-campus");
      return;
    }
    if (activeRole === "Company" && activeType === "Pool-Campus") {
      navigate("/company-dashboard/Pool-Campus");
      return;
    }

    if (activeRole === "Freshers" && activeType === "Off-Campus") {
      navigate("/fresher-dashboard/Off-campus");
      return;
    }

    if (activeRole === "Freshers" && activeType === "Internship") {
      navigate("/fresher-dashboard/Internship");
      return;
    }

    if (activeRole === "Freshers" && activeType === "Referral") {
      navigate("/fresher-dashboard/Referral");
      return;
    }

    if (activeRole === "Student" && activeType === "Off-Campus") {
      navigate("/student-dashboard/Off-campus");
      return;
    }
    if (activeRole === "Student" && activeType === "On-Campus") {
      navigate("/student-dashboard/On-campus");
      return;
    }
    if (activeRole === "Student" && activeType === "Internship") {
      navigate("/student-dashboard/Internship");
      return;
    }

    if (activeRole === "College" && activeType === "Pool-Campus") {
      navigate("/college-dashboard/Pool-Campus");
      return;
    }

    if (activeRole === "College" && activeType === "On-Campus") {
      navigate("/college-dashboard/On-campus");
      return;
    }

    // fallback
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
            .filter((job) => {
              const deadline =
                job.endDate ||
                job.proposedSchedule?.endDate ||
                job.interviewWindow?.end;

              if (!deadline) return true; // keep if no deadline

              const daysLeft = Math.ceil(
                (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
              );

              return daysLeft > 0; //  remove closed jobs
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
            .map((job, i) => {
              if (activeRole === "Company") {
                return (
                  <CollegeJobCard
                    key={job._id || i}
                    job={job}
                    i={i}
                    activeType={activeType}
                    handleApply={handleApply}
                  />
                );
              }

              if (activeRole === "College") {
                return (
                  <CompanyJobCard
                    key={job._id || i}
                    job={job}
                    i={i}
                    activeType={activeType}
                    handleApply={handleApply}
                  />
                );
              }

              if (activeType === "Referral") {
                return (
                  <ReferralJobCard
                    key={job._id || i}
                    job={job}
                    i={i}
                    activeType={activeType}
                    handleApply={handleApply}
                  />
                );
              }

              if (activeType === "Internship") {
                return (
                  <InternshipJobCard
                    key={job._id || i}
                    job={job}
                    i={i}
                    activeType={activeType}
                    handleApply={handleApply}
                  />
                );
              }

              return (
                  <CompanyJobCard
                    key={job._id || i}
                    job={job}
                    i={i}
                    activeType={activeType}
                    handleApply={handleApply}
                  />
                );
            })
        )}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <button
          onClick={handleApply}
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