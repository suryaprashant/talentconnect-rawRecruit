import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../lib/axiosInstance";

const UserDetail = () => {
  const { userId, userType } = useParams();
  const navigate = useNavigate();

  const [userDetail, setUserDetail] = useState(null);
  const [activeType, setActiveType] = useState(
    userType === "professional"
      ? "jobsPosted"
      : ["student", "fresher"].includes(userType)
        ? "jobsapplied"
        : "oncampus"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH USER DETAILS
  // ============================================================

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_Backend_URL}/api/admin/users/`,
          {
            params: {
              userId,
              userType,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        console.log("User Detail Response:", response.data);

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to fetch user details"
          );
        }

        setUserDetail(response.data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);

        setError(
          error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message ||
          "Failed to fetch user details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId && userType) {
      fetchUserDetail();
    } else {
      setLoading(false);
      setError("User ID or user type is missing");
    }
  }, [userId, userType]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="p-6">
          <div className="rounded-xl border bg-card p-8 text-center">
            Loading user details...
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <main className="min-h-screen">
        <div className="p-6">
          <div className="rounded-xl border bg-card p-8 text-center text-red-600">
            {error}
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // USER DATA
  // ============================================================

  const user = (() => {
    if (Array.isArray(userDetail?.user?.data)) return userDetail.user.data[0];
    if (Array.isArray(userDetail?.data)) return userDetail.data[0];
    if (userDetail?.user?.data && typeof userDetail.user.data === "object" && !Array.isArray(userDetail.user.data)) {
      return userDetail.user.data;
    }
    if (userDetail?.data && typeof userDetail.data === "object" && !Array.isArray(userDetail.data)) {
      return userDetail.data;
    }
    return userDetail?.user || userDetail || null;
  })();

  // ============================================================
  // JOB TYPE SECTIONS
  // ============================================================

  const sections =
    ["professional", "student", "fresher"].includes(userType)
      ? userType === "professional"
        ? [
          { key: "jobsPosted", label: "Jobs Posted" },
          { key: "jobsapplied", label: "Applied Jobs" },
          { key: "savedJobs", label: "Saved Jobs" },
          { key: "referralAsked", label: "Asked for Referral" },
        ]
        : [
          { key: "jobsapplied", label: "Applied Jobs" },
          { key: "savedJobs", label: "Saved Jobs" },
          { key: "referralAsked", label: "Asked for Referral" },
        ]
      : userType === "college"
        ? [
          { key: "oncampus", label: "On-campus" },
          { key: "poolcampus", label: "Pool-campus" },
          { key: "jobsapplied", label: "Applied Jobs" },
          { key: "savedJobs", label: "Saved Jobs" },
        ]
        : [
          { key: "oncampus", label: "On-campus" },
          { key: "poolcampus", label: "Pool-campus" },
          { key: "offcampus", label: "Off-campus" },
          { key: "internship", label: "Internship" },
          { key: "jobsapplied", label: "Applied Jobs" },
          { key: "savedJobs", label: "Saved Jobs" },
        ];

  // ============================================================
  // CURRENT SECTION
  // ============================================================

  let currentSection;
  let isApplicationSection;
  let jobs = [];
  let totals = { applied: 0, shortlisted: 0, accepted: 0 };

  if (["professional", "student", "fresher"].includes(userType)) {
    // For professional/student/fresher
    if (activeType === "jobsPosted") {
      currentSection = userDetail?.jobsPosted;
      isApplicationSection = false;
      jobs = currentSection?.jobs || [];
      totals = currentSection?.totals || { applied: 0, shortlisted: 0, accepted: 0 };
    } else if (activeType === "jobsapplied") {
      currentSection = userDetail?.jobsapplied || [];
      isApplicationSection = true;
      jobs = currentSection;
    } else if (activeType === "savedJobs") {
      currentSection = userDetail?.savedJobs || [];
      isApplicationSection = true;
      jobs = currentSection;
    } else if (activeType === "referralAsked") {
      currentSection = userDetail?.referralAsked || [];
      isApplicationSection = false;
      jobs = currentSection;
    }
  } else {
    // For company/college/employer
    currentSection = userDetail?.[activeType];
    isApplicationSection =
      activeType === "jobsapplied" || activeType === "savedJobs";
    jobs = isApplicationSection
      ? currentSection || []
      : currentSection?.jobs || [];
    totals = isApplicationSection
      ? {
        applied:
          activeType === "jobsapplied"
            ? jobs.filter(
              (item) => item.currentStatus === "Applied"
            ).length
            : 0,
        shortlisted:
          activeType === "jobsapplied"
            ? jobs.filter(
              (item) => item.currentStatus === "Shortlisted"
            ).length
            : 0,
        accepted:
          activeType === "jobsapplied"
            ? jobs.filter(
              (item) => item.currentStatus === "Accepted"
            ).length
            : 0,
      }
      : currentSection?.totals || {
        applied: 0,
        shortlisted: 0,
        accepted: 0,
      };
  }

  // ============================================================
  // HELPERS
  // ============================================================

  const getActualJob = (item) => {
    return isApplicationSection ? item?.job : item;
  };

  const getJobTitle = (item) => {
    const job = getActualJob(item);

    const roles = Array.isArray(job?.jobRoles) ? job.jobRoles.filter(Boolean) : [];
    if (roles.length) return roles.join(", ");

    const titles = Array.isArray(job?.jobTitle) ? job.jobTitle.filter(Boolean) : [];
    if (titles.length) return titles.join(", ");

    if (typeof job?.jobTitle === "string" && job.jobTitle.trim()) {
      return job.jobTitle;
    }

    return "Untitled Job";
  };

  const getValue = (value) => {
    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "N/A";
    }

    return value || "N/A";
  };

  const activeIndex = sections.findIndex(
    (section) => section.key === activeType
  );

  // ============================================================
  // PROFILE INFORMATION
  // ============================================================

  let profileName = "User";
  let profilePerson = "N/A";
  let profileDesignation = "";
  let profileLocation = "";
  let profileEmail = "";

  if (["professional", "student", "fresher"].includes(userType)) {
    profileName = user?.name || "User";
    profilePerson = user?.name || "N/A";
    profileDesignation = user?.profileType || "";
    profileEmail = user?.email || "";
  } else if (userType === "college") {
    profileName =
      user?.collegeUniversityDetails?.collegeName ||
      "College Name";

    profilePerson =
      user?.placementCoordinatorDetails?.coordinatorName ||
      "N/A";

    profileDesignation = "Placement Coordinator";

    profileEmail =
      user?.placementCoordinatorDetails?.officialEmail ||
      "";

    profileLocation = [
      user?.collegeUniversityDetails?.city,
      user?.collegeUniversityDetails?.state,
    ]
      .filter(Boolean)
      .join(", ");
  } else if (userType === "company") {
    profileName =
      user?.companyDetails?.companyName ||
      "Company Name";

    profilePerson =
      user?.employerDetails?.name ||
      "N/A";

    profileDesignation =
      user?.employerDetails?.designation ||
      "";

    profileEmail =
      user?.employerDetails?.workEmail ||
      "";

    profileLocation = [
      user?.companyDetails?.city,
      user?.companyDetails?.state,
      user?.companyDetails?.country,
    ]
      .filter(Boolean)
      .join(", ");
  } else if (userType === "employer") {
    profileName =
      user?.companyDetails?.companyName ||
      user?.employerDetails?.name ||
      "Employer";

    profilePerson =
      user?.employerDetails?.name ||
      "N/A";

    profileDesignation =
      user?.employerDetails?.designation ||
      "";

    profileEmail =
      user?.employerDetails?.workEmail ||
      "";

    profileLocation = [
      user?.companyDetails?.city,
      user?.companyDetails?.state,
    ]
      .filter(Boolean)
      .join(", ");
  } else {
    profileName =
      user?.name ||
      user?.companyDetails?.companyName ||
      "User";

    profilePerson =
      user?.name ||
      "N/A";

    profileEmail =
      user?.email ||
      "";
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-screen">
      <div className="p-6 space-y-6 animate-fade-in">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
            title="Go back"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="responsive-title font-bold text-slate-900 mb-2">
              User Details
            </h1>

            <p className="text-slate-600">
              View user profile and recruitment activity
            </p>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">

            {/* PROFILE HEADER */}
            <div className="flex items-center gap-5">

              <div className="w-16 h-16 rounded-xl bg-blue-100 text-[#143694] flex items-center justify-center text-2xl font-bold">
                {profileName?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="flex-1">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {profileName}
                    </h2>

                    <p>
                      {user?.companyDetails?.description || ""}
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center rounded-md bg-blue-100 text-[#143694] px-3 py-1 text-xs font-semibold capitalize">
                    {userType}
                  </span>

                </div>

              </div>
            </div>

            {/* ================================================== */}
            {/* COMPANY DETAILS */}
            {/* ================================================== */}

            {["professional", "student", "fresher"].includes(userType) ? (

              <div className="mt-6 pt-6 border-t space-y-6">

                {/* BASIC INFO */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div>
                      <span className="text-slate-500">Email</span>
                      <p className="font-medium text-slate-800 break-all">
                        {user?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Phone</span>
                      <p className="font-medium text-slate-800">
                        {user?.phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Profile Type</span>
                      <p className="font-medium text-slate-800 capitalize">
                        {user?.profileType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Status</span>
                      <p className="font-medium text-slate-800 capitalize">
                        {user?.status?.type || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CURRENT EMPLOYMENT */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Current Employment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div>
                      <span className="text-slate-500">Current Company</span>
                      <p className="font-medium text-slate-800">
                        {user?.currentCompany || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Current Salary</span>
                      <p className="font-medium text-slate-800">
                        {user?.currentSalaryAmount
                          ? `${user.currentSalaryCurrency} ${user.currentSalaryAmount}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Expected Salary</span>
                      <p className="font-medium text-slate-800">
                        {user?.expectedSalaryAmount
                          ? `${user.expectedSalaryCurrency} ${user.expectedSalaryAmount}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Employment Type</span>
                      <p className="font-medium text-slate-800">
                        {user?.employmentType?.length ? user.employmentType.join(", ") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Looking For</span>
                      <p className="font-medium text-slate-800">
                        {user?.lookingFor?.length ? user.lookingFor.join(", ") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Open to Shift</span>
                      <p className="font-medium text-slate-800">
                        {user?.openToShift || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Locations</span>
                      <p className="font-medium text-slate-800">
                        {user?.locations?.length ? user.locations.join(", ") : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* EDUCATION */}
                {user?.educations && user.educations.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Education
                    </h3>
                    <div className="space-y-4">
                      {user.educations.map((edu, idx) => (
                        <div key={idx} className="relative pl-8 pb-4">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>
                          {/* Timeline line */}
                          {idx !== user.educations.length - 1 && (
                            <div className="absolute left-1.5 top-4 w-0.5 h-full bg-blue-200"></div>
                          )}

                          <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                  {edu.college || "N/A"}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                  {edu.degree ? `${edu.degree}${edu.specialization ? ` - ${edu.specialization}` : ""}` : edu.educationType || "N/A"}
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                  {(edu.startDate ? new Date(edu.startDate).toLocaleDateString("en-IN") : "N/A")} - {(edu.endDate ? new Date(edu.endDate).toLocaleDateString("en-IN") : "N/A")}
                                </p>
                              </div>
                              {edu.isCurrent && (
                                <span className="inline-flex items-center rounded-md bg-blue-100 text-[#143694] px-2 py-0.5 text-xs font-semibold">
                                  Current
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EXPERIENCE */}
                {user?.experiences && user.experiences.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Experience
                    </h3>
                    <div className="space-y-4">
                      {user.experiences.map((exp, idx) => (
                        <div key={idx} className="relative pl-8 pb-4">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                          {/* Timeline line */}
                          {idx !== user.experiences.length - 1 && (
                            <div className="absolute left-1.5 top-4 w-0.5 h-full bg-green-200"></div>
                          )}

                          <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                  {exp.role || "N/A"}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {exp.company || "N/A"}
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                  {(exp.startDate ? new Date(exp.startDate).toLocaleDateString("en-IN") : "N/A")} - {(exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-IN") : "N/A")}
                                </p>
                              </div>
                              {exp.isCurrent && (
                                <span className="inline-flex items-center rounded-md bg-green-100 text-green-700 px-2 py-0.5 text-xs font-semibold">
                                  Current
                                </span>
                              )}
                            </div>
                            {exp.description && (
                              <p className="text-sm text-slate-600 mt-2">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SKILLS & EXPERTISE */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Skills & Expertise
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div>
                      <span className="text-slate-500">Skills</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user?.skills?.length ? (
                          user.skills.map((skill, idx) => (
                            <span key={idx} className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 px-2 py-1 text-xs font-semibold">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="font-medium text-slate-800">N/A</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Tools & Platforms</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user?.toolsAndPlatforms?.length ? (
                          user.toolsAndPlatforms.map((tool, idx) => (
                            <span key={idx} className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 px-2 py-1 text-xs font-semibold">
                              {tool}
                            </span>
                          ))
                        ) : (
                          <p className="font-medium text-slate-800">N/A</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Domain Knowledge</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user?.domainKnowledge?.length ? (
                          user.domainKnowledge.map((domain, idx) => (
                            <span key={idx} className="inline-flex items-center rounded-md bg-blue-100 text-[#143694] px-2 py-1 text-xs font-semibold">
                              {domain}
                            </span>
                          ))
                        ) : (
                          <p className="font-medium text-slate-800">N/A</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Job Roles</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user?.jobRoles?.length ? (
                          user.jobRoles.map((role, idx) => (
                            <span key={idx} className="inline-flex items-center rounded-md bg-purple-100 text-purple-700 px-2 py-1 text-xs font-semibold">
                              {role}
                            </span>
                          ))
                        ) : (
                          <p className="font-medium text-slate-800">N/A</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Languages</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user?.languagesKnown?.length ? (
                          user.languagesKnown.map((lang, idx) => (
                            <span key={idx} className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 px-2 py-1 text-xs font-semibold">
                              {lang}
                            </span>
                          ))
                        ) : (
                          <p className="font-medium text-slate-800">N/A</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Industries</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user?.industry?.length ? (
                          user.industry.map((ind, idx) => (
                            <span key={idx} className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 px-2 py-1 text-xs font-semibold">
                              {ind}
                            </span>
                          ))
                        ) : (
                          <p className="font-medium text-slate-800">N/A</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACHIEVEMENTS & AWARDS */}
                {(user?.achievements?.some(a => a.title) || user?.awards?.some(a => a.title)) && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Achievements & Awards
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user?.achievements?.filter(a => a.title).map((achievement, idx) => (
                        <div key={idx} className="p-4 border rounded-lg">
                          <p className="font-medium text-slate-900">
                            {achievement.title}
                          </p>
                          {achievement.event && (
                            <p className="text-sm text-slate-600">
                              {achievement.event}
                            </p>
                          )}
                          {achievement.date && (
                            <p className="text-xs text-slate-500 mt-1">
                              {achievement.date}
                            </p>
                          )}
                        </div>
                      ))}
                      {user?.awards?.filter(a => a.title).map((award, idx) => (
                        <div key={idx} className="p-4 border rounded-lg">
                          <p className="font-medium text-slate-900">
                            {award.title}
                          </p>
                          {award.organization && (
                            <p className="text-sm text-slate-600">
                              {award.organization}
                            </p>
                          )}
                          {award.description && (
                            <p className="text-sm text-slate-600 mt-1">
                              {award.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* REFERRAL METRICS */}
                {userDetail?.referralMetrics && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Referral Metrics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-slate-800">
                          {userDetail.referralMetrics.totalReferralsPosted || 0}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Referrals Posted
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-[#143694]">
                          {userDetail.referralMetrics.totalApplicationsReceived || 0}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Applications
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-700">
                          {userDetail.referralMetrics.totalReferredToCompany || 0}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Referred
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-700">
                          {userDetail.referralMetrics.totalAcceptedByCompany || 0}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Accepted
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-700">
                          {userDetail.referralMetrics.responseRate || 0}%
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Response Rate
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-indigo-700">
                          {userDetail.referralMetrics.referralSuccessRate || 0}%
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Success Rate
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SOCIAL & LINKS */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Social & Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div>
                      <span className="text-slate-500">LinkedIn</span>
                      <p className="font-medium text-slate-800">
                        {user?.linkedin ? (
                          <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#143694] hover:underline">
                            {user.linkedin}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">GitHub</span>
                      <p className="font-medium text-slate-800">
                        {user?.github ? (
                          <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-[#143694] hover:underline">
                            {user.github}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Portfolio</span>
                      <p className="font-medium text-slate-800">
                        {user?.portfolio ? (
                          <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="text-[#143694] hover:underline">
                            {user.portfolio}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Resume</span>
                      <p className="font-medium text-slate-800">
                        {user?.resume ? (
                          <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-[#143694] hover:underline">
                            View Resume
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            ) : userType === "company" || userType === "employer" ? (

              <div className="mt-6 pt-6 border-t">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* COMPANY DETAILS */}

                  <div>

                    <h3 className="font-semibold text-slate-900 mb-4">
                      Company Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">

                      <div>
                        <span className="text-slate-500">
                          Company Type
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.companyType || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Industry Type
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.industryType || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Number of Employees
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.numberOfEmployees || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Established Year
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.establishedYear || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Phone Number
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.phoneNumber || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Alternate Phone Number
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.alternatePhoneNumber || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Country
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.country || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          State
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.state || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          City
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.city || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Pincode
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.pincode || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          LinkedIn URL
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.linkedinUrl ? (
                            <a
                              href={user.companyDetails.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#143694] hover:underline"
                            >
                              {user.companyDetails.linkedinUrl}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          College Website
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.companyDetails?.collegeWebsite ? (
                            <a
                              href={user.companyDetails.collegeWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#143694] hover:underline"
                            >
                              {user.companyDetails.collegeWebsite}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* COMPANY REPRESENTATIVE */}

                  <div>

                    <h3 className="font-semibold text-slate-900 mb-4">
                      Company Representative
                    </h3>

                    <div className="space-y-4 text-sm">

                      <div>
                        <span className="text-slate-500">
                          Name
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.employerDetails?.name || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Designation
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.employerDetails?.designation || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Work Email
                        </span>

                        <p className="font-medium text-slate-800 break-all">
                          {user?.employerDetails?.workEmail || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Mobile
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.employerDetails?.mobile || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          LinkedIn
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.employerDetails?.linkedIn ? (
                            <a
                              href={user.employerDetails.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#143694] hover:underline"
                            >
                              {user.employerDetails.linkedIn}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ) : userType === "college" ? (

              /* ================================================== */
              /* COLLEGE DETAILS + RECRUITER DETAILS */
              /* ================================================== */

              <div className="mt-6 pt-6 border-t">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* COLLEGE DETAILS */}

                  <div>

                    <h3 className="font-semibold text-slate-900 mb-4">
                      College Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">

                      <div>
                        <span className="text-slate-500">
                          Affiliated University
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.collegeUniversityDetails?.affiliatedUniversity || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          College Location
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.collegeUniversityDetails?.collegeLocation || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Country
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.collegeUniversityDetails?.country || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          State
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.collegeUniversityDetails?.state || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          City
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.collegeUniversityDetails?.city || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Pincode
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.collegeUniversityDetails?.pincode || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          College Website
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.profileAchievements?.collegeWebsite ? (
                            <a
                              href={user.profileAchievements.collegeWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#143694] hover:underline"
                            >
                              {user.profileAchievements.collegeWebsite}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          LinkedIn
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.profileAchievements?.linkedinProfile ? (
                            <a
                              href={user.profileAchievements.linkedinProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#143694] hover:underline"
                            >
                              {user.profileAchievements.linkedinProfile}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* PLACEMENT COORDINATOR */}

                  <div>

                    <h3 className="font-semibold text-slate-900 mb-4">
                      Placement Coordinator
                    </h3>

                    <div className="space-y-4 text-sm">

                      <div>
                        <span className="text-slate-500">
                          Coordinator Name
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.placementCoordinatorDetails?.coordinatorName || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Designation
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.placementCoordinatorDetails?.designation || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Official Email
                        </span>

                        <p className="font-medium text-slate-800 break-all">
                          {user?.placementCoordinatorDetails?.officialEmail || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Official Mobile
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.placementCoordinatorDetails?.officialMobile || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          LinkedIn
                        </span>

                        <p className="font-medium text-slate-800">
                          {user?.placementCoordinatorDetails?.linkedinUrl ? (
                            <a
                              href={user.placementCoordinatorDetails.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#143694] hover:underline"
                            >
                              {user.placementCoordinatorDetails.linkedinUrl}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ) : (

              /* ================================================== */
              /* OTHER USER DETAILS */
              /* ================================================== */

              <div className="mt-6 pt-6 border-t">

                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-600">

                  {profileEmail && (
                    <span>
                      Email:{" "}
                      <strong className="text-slate-800">
                        {profileEmail}
                      </strong>
                    </span>
                  )}

                  {profileLocation && (
                    <span>
                      Location:{" "}
                      <strong className="text-slate-800">
                        {profileLocation}
                      </strong>
                    </span>
                  )}

                </div>

              </div>

            )}

          </div>
        </div>

        {/* ================================================== */}
        {/* JOB TYPE SLIDER */}
        {/* ================================================== */}

        <div className="flex justify-center">

          <div
            className="relative grid rounded-lg border bg-slate-100 p-1"
            style={{
              gridTemplateColumns: `repeat(${sections.length}, minmax(0, 1fr))`,
              width: sections.length === 4 ? "600px" : "850px",
            }}
          >

            {/* Sliding background */}

            <div
              className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm transition-transform duration-300"
              style={{
                width: `calc(${100 / sections.length}% - 4px)`,
                left: "2px",
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />

            {sections.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveType(section.key)}
                className={`relative z-10 px-5 py-2.5 text-sm font-semibold rounded-md transition-colors ${activeType === section.key
                  ? "text-[#143694]"
                  : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                {section.label}
              </button>
            ))}

          </div>

        </div>

        {/* ================================================== */}
        {/* SECTION HEADER */}
        {/* ================================================== */}

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {
                sections.find(
                  (section) => section.key === activeType
                )?.label
              }
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Recruitment overview
            </p>
          </div>

          <div className="inline-flex items-center rounded-md border bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">
            {activeType === "referralAsked" ? `${jobs.length} Referrals` : `${jobs.length} Jobs`}
          </div>

        </div>

        {/* ================================================== */}
        {/* STATISTICS */}
        {/* ================================================== */}

        {activeType !== "referralAsked" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {/* Total Jobs */}

            <div className="rounded-xl border bg-card shadow text-center">
              <div className="p-6">

                <div className="text-2xl font-bold text-slate-800">
                  {jobs.length}
                </div>

                <div className="text-sm text-slate-600 mt-1">
                  Total Jobs
                </div>

              </div>
            </div>

            {/* Applied */}

            <div className="rounded-xl border bg-card shadow text-center">
              <div className="p-6">

                <div className="text-2xl font-bold text-[#143694]">
                  {totals.applied || 0}
                </div>

                <div className="text-sm text-slate-600 mt-1">
                  Total Applied
                </div>

              </div>
            </div>

            {/* Shortlisted */}

            <div className="rounded-xl border bg-card shadow text-center">
              <div className="p-6">

                <div className="text-2xl font-bold text-orange-700">
                  {totals.shortlisted || 0}
                </div>

                <div className="text-sm text-slate-600 mt-1">
                  Total Shortlisted
                </div>

              </div>
            </div>

            {/* Accepted */}

            <div className="rounded-xl border bg-card shadow text-center">
              <div className="p-6">

                <div className="text-2xl font-bold text-green-700">
                  {totals.accepted || 0}
                </div>

                <div className="text-sm text-slate-600 mt-1">
                  Total Accepted
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* JOB TABLE */}
        {/* ================================================== */}

        <div className="rounded-xl border bg-card text-card-foreground shadow">

          <div className="p-6">

            <h3 className="font-semibold text-slate-900">
              {activeType === "referralAsked"
                ? "Asked for Referral"
                : isApplicationSection
                  ? activeType === "jobsapplied"
                    ? "Applied Jobs"
                    : "Saved Jobs"
                  : "Posted Jobs"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {activeType === "referralAsked"
                ? "Referrals requested"
                : isApplicationSection
                  ? "Job activity details"
                  : "Recruitment details for each job"}
            </p>

          </div>

          <div className="px-6 pb-6">

            <div className="border rounded-lg overflow-hidden">

              <table className="w-full caption-bottom text-sm">

                <thead>

                  <tr className="border-b bg-muted/50">

                    {activeType === "referralAsked" ? (
                      <>
                        <th className="p-3 text-left font-medium">
                          Receiver Name
                        </th>

                        <th className="p-3 text-left font-medium">
                          Email
                        </th>

                        <th className="p-3 text-left font-medium">
                          Status
                        </th>

                        <th className="p-3 text-left font-medium">
                          Job Link
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="p-3 text-left font-medium">
                          Job Title
                        </th>

                        {isApplicationSection && (
                          <th className="p-3 text-left font-medium">
                            Status
                          </th>
                        )}

                        {isApplicationSection && userType === "company" && (
                          <th className="p-3 text-left font-medium">
                            College Name
                          </th>
                        )}

                        <th className="p-3 text-left font-medium">
                          End Date
                        </th>

                        <th className="p-3 text-left font-medium">
                          Employment Type
                        </th>

                        <th className="p-3 text-left font-medium">
                          Work Mode
                        </th>

                        {!isApplicationSection && (
                          <>
                            <th className="p-3 text-left font-medium">
                              Applied
                            </th>

                            <th className="p-3 text-left font-medium">
                              Shortlisted
                            </th>

                            <th className="p-3 text-left font-medium">
                              Accepted
                            </th>
                          </>
                        )}
                      </>
                    )}

                  </tr>

                </thead>

                <tbody>

                  {activeType === "referralAsked" ? (
                    jobs.length > 0 ? (
                      jobs.map((referral) => (
                        <tr
                          key={referral._id}
                          className="border-b last:border-b-0 hover:bg-slate-50"
                        >
                          <td className="p-3">
                            <div className="font-medium text-slate-900">
                              {referral.name || "N/A"}
                            </div>
                          </td>

                          <td className="p-3">
                            <p className="text-slate-700 break-all">
                              {referral.email || "N/A"}
                            </p>
                          </td>

                          <td className="p-3">
                            <span className="inline-flex items-center rounded-md bg-blue-100 text-[#143694] px-2 py-0.5 text-xs font-semibold">
                              {referral.status || "Pending"}
                            </span>
                          </td>

                          <td className="p-3">
                            {referral.jobLink ? (
                              <a
                                href={referral.jobLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#143694] hover:underline truncate"
                              >
                                View Job
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-10 text-center text-slate-500"
                        >
                          No referrals found
                        </td>
                      </tr>
                    )
                  ) : jobs.length > 0 ? (

                    jobs.map((item) => {

                      const job = getActualJob(item);

                      return (

                        <tr
                          key={item._id || job?._id}
                          className="border-b last:border-b-0 hover:bg-slate-50"
                        >

                          {/* Job */}

                          <td className="p-3">
                            {job?._id ? (
                              <Link
                                to={`/admin/job-details/${job._id}`}
                                className="font-medium text-[#143694] hover:underline"
                              >
                                {getJobTitle(item)}
                              </Link>
                            ) : (
                              <div className="font-medium text-slate-900">
                                {getJobTitle(item)}
                              </div>
                            )}
                          </td>

                          {/* Status */}

                          {isApplicationSection && (
                            <td className="p-3">

                              <span className="inline-flex items-center rounded-md bg-blue-100 text-[#143694] px-2 py-0.5 text-xs font-semibold">
                                {item.currentStatus || "N/A"}
                              </span>

                            </td>
                          )}

                          {/* College Name */}

                          {isApplicationSection && userType === "company" && (
                            <td className="p-3">
                              {job?.collegeDetails?.collegeName || job?.collegeName || "N/A"}
                            </td>
                          )}

                          {/* End Date */}

                          <td className="p-3">

                            <span className="inline-flex items-center rounded-md bg-blue-100 text-[#143694] px-2 py-0.5 text-xs font-semibold">
                              {job?.endDate
                                ? new Date(
                                  job.endDate
                                ).toLocaleDateString("en-IN")
                                : "N/A"}
                            </span>

                          </td>

                          {/* Employment */}

                          <td className="p-3">
                            {getValue(job?.employmentType)}
                          </td>

                          {/* Work Mode */}

                          <td className="p-3">
                            {getValue(job?.workMode)}
                          </td>

                          {/* Applied */}

                          {!isApplicationSection && (
                            <td className="p-3">

                              <span className="font-semibold text-[#143694]">
                                {job?.appliedCount || 0}
                              </span>

                            </td>
                          )}

                          {/* Shortlisted */}

                          {!isApplicationSection && (
                            <td className="p-3">

                              <span className="font-semibold text-orange-700">
                                {job?.shortlistedCount || 0}
                              </span>

                            </td>
                          )}

                          {/* Accepted */}

                          {!isApplicationSection && (
                            <td className="p-3">

                              <span className="font-semibold text-green-700">
                                {job?.acceptedCount || 0}
                              </span>

                            </td>
                          )}

                        </tr>

                      );
                    })

                  ) : (

                    <tr>

                      <td
                        colSpan={activeType === "referralAsked" ? 4 : (isApplicationSection ? 5 : 7)}
                        className="p-10 text-center text-slate-500"
                      >
                        No jobs found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
};

export default UserDetail;