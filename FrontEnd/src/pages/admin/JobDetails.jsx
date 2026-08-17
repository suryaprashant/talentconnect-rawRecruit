import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../lib/axiosInstance";
import { Briefcase, Users, Star, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // ============================================================
    // FETCH JOB DETAILS
    // ============================================================

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    `${import.meta.env.VITE_Backend_URL}/api/admin/job-n-drive/Job-detail`,
                    {
                        params: {
                            jobId,
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                if (response.data) {
                    setJob(response.data.job);
                    setApplications(response.data.applications || []);
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
                toast.error("Failed to fetch job details");
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    // ============================================================
    // HELPERS
    // ============================================================

    const formatDate = (value) => {
        if (!value) return null;

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatValue = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
        ) {
            return null;
        }

        if (Array.isArray(value)) {
            return value.join(", ");
        }

        if (typeof value === "boolean") {
            return value ? "Yes" : "No";
        }

        return value;
    };

    const isDateField = (key) => {
        return [
            "createdAt",
            "updatedAt",
            "startDate",
            "endDate",
            "expireAt",
            "onlineTestDate",
            "offerRolloutDate",
        ].includes(key);
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <main className="min-h-screen">
                <div className="p-6">
                    <div className="rounded-xl border bg-card p-10 text-center text-slate-500">
                        Loading job details...
                    </div>
                </div>
            </main>
        );
    }

    if (!job) {
        return (
            <main className="min-h-screen">
                <div className="p-6">
                    <div className="rounded-xl border bg-card p-10 text-center text-slate-500">
                        Job not found
                    </div>
                </div>
            </main>
        );
    }

    // ============================================================
    // JOB FIELD RENDERER
    // ============================================================

    const renderField = (label, value) => {
        const formattedValue = formatValue(value);

        if (!formattedValue) return null;

        return (
            <div>
                <span className="text-sm text-slate-500">
                    {label}
                </span>

                <p className="font-medium text-slate-800 mt-1 break-words">
                    {formattedValue}
                </p>
            </div>
        );
    };

    // ============================================================
    // UI
    // ============================================================

    return (
        <main className="min-h-screen">

            <div className="p-6 space-y-6 animate-fade-in">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-[#143694] hover:text-[#1e4ed8] font-medium mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div>
                    <h1 className="responsive-title font-bold text-slate-900 mb-2">
                        Job Details
                    </h1>

                    <p className="text-slate-600">
                        View complete job information and applicants
                    </p>
                </div>

                {/* ================================================== */}
                {/* JOB HEADER */}
                {/* ================================================== */}

                <div className="rounded-xl border bg-card shadow">

                    <div className="p-6">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div className="flex items-center gap-4">

                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#143694] flex items-center justify-center">
                                    <Briefcase className="w-6 h-6" />
                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        {job.jobRoles?.length
                                            ? job.jobRoles.join(", ")
                                            : "Untitled Job"}
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Posted by:{" "}
                                        <span className="font-medium text-slate-700">
                                            <Link
                                                to={`/admin/users/${job.poster.userId}/${job.poster.type}`}
                                                className="font-medium text-[#143694] hover:underline"
                                            >
                                                {job.poster?.name || "N/A"}
                                            </Link>
                                        </span>
                                        {" • "}
                                        Type:{" "}
                                        <span className="font-medium text-slate-700 capitalize">
                                            {job.poster?.type || "N/A"}
                                        </span>
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-2 flex-wrap">

                                {job.jobType && (
                                    <span className="inline-flex rounded-md bg-blue-100 text-[#143694] px-3 py-1 text-xs font-semibold">
                                        {job.jobType}
                                    </span>
                                )}

                                {job.jobStatus && (
                                    <span className="inline-flex rounded-md bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-semibold">
                                        {job.jobStatus}
                                    </span>
                                )}

                                {job.approvalStatus && (
                                    <span className="inline-flex rounded-md bg-purple-100 text-purple-700 px-3 py-1 text-xs font-semibold">
                                        {job.approvalStatus}
                                    </span>
                                )}

                            </div>

                        </div>

                    </div>
                </div>

                {/* ================================================== */}
                {/* JOB DETAILS */}
                {/* ================================================== */}

                <div className="rounded-xl border bg-card shadow">

                    <div className="p-6 border-b">

                        <div className="flex items-center gap-2">

                            <Briefcase className="w-5 h-5 text-slate-700" />

                            <h2 className="font-semibold text-slate-900">
                                Job Information
                            </h2>

                        </div>

                    </div>

                    <div className="p-6 space-y-8">

                        {/* BASIC INFORMATION */}

                        <div>

                            <h3 className="font-semibold text-slate-900 mb-4">
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

                                {renderField("Job Type", job.jobType)}

                                {renderField(
                                    "Job Title",
                                    job.jobTitle
                                )}

                                {renderField(
                                    "Job Roles",
                                    job.jobRoles
                                )}

                                {renderField(
                                    "Job Category",
                                    job.jobCategory
                                )}

                                {renderField(
                                    "Job Status",
                                    job.jobStatus
                                )}

                                {renderField(
                                    "Approval Status",
                                    job.approvalStatus
                                )}

                                {renderField(
                                    "Visible To",
                                    job.visibleTo
                                )}

                                {renderField(
                                    "Broadcast Type",
                                    job.broadcastType
                                )}

                                {renderField(
                                    "Looking For",
                                    job.lookingFor
                                )}

                                {renderField(
                                    "Employment Type",
                                    job.employmentType
                                )}

                                {renderField(
                                    "Work Mode",
                                    job.workMode
                                )}

                                {renderField(
                                    "Degree",
                                    job.degree
                                )}

                            </div>

                        </div>

                        {/* DESCRIPTION */}

                        {job.description && (
                            <div className="pt-6 border-t">

                                <h3 className="font-semibold text-slate-900 mb-3">
                                    Description
                                </h3>

                                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                    {job.description}
                                </p>

                            </div>
                        )}

                        {/* LOCATION */}

                        <div className="pt-6 border-t">

                            <h3 className="font-semibold text-slate-900 mb-4">
                                Location
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

                                {renderField(
                                    "Location",
                                    job.location
                                )}

                                {renderField(
                                    "Work Location",
                                    job.workLocation
                                )}

                                {renderField(
                                    "State",
                                    job.state
                                )}

                                {renderField(
                                    "City",
                                    job.city
                                )}

                                {renderField(
                                    "Country",
                                    job.country
                                )}

                                {renderField(
                                    "Pincode",
                                    job.pincode
                                )}

                            </div>

                        </div>

                        {/* PACKAGE */}

                        {job.packageDetails && (
                            <div className="pt-6 border-t">

                                <h3 className="font-semibold text-slate-900 mb-4">
                                    Package Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">

                                    {renderField(
                                        "Currency",
                                        job.packageDetails.currency
                                    )}

                                    {renderField(
                                        "Total CTC",
                                        job.packageDetails.totalCTC
                                    )}

                                    {renderField(
                                        "Fixed Pay",
                                        job.packageDetails.fixedPay
                                    )}

                                    {renderField(
                                        "Joining Bonus",
                                        job.packageDetails.joiningBonus
                                    )}

                                </div>

                            </div>
                        )}

                        {/* ELIGIBILITY */}

                        <div className="pt-6 border-t">

                            <h3 className="font-semibold text-slate-900 mb-4">
                                Eligibility & Requirements
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

                                {renderField(
                                    "College Types",
                                    job.collegeTypes
                                )}

                                {renderField(
                                    "College Categories",
                                    job.collegeCategories
                                )}

                                {renderField(
                                    "Student Streams",
                                    job.studentStreams
                                )}

                                {renderField(
                                    "CGPA",
                                    job.cgpa
                                )}

                                {renderField(
                                    "Eligibility Criteria",
                                    job.eligibilityCriteria
                                )}

                                {renderField(
                                    "Minimum Students",
                                    job.minimumStudents
                                )}

                                {renderField(
                                    "Skills",
                                    job.skills
                                )}

                                {renderField(
                                    "Certifications",
                                    job.certifications
                                )}

                                {renderField(
                                    "Tools & Platforms",
                                    job.toolsAndPlatforms
                                )}

                                {renderField(
                                    "Years of Experience",
                                    job.yearsOfExperience
                                )}

                                {renderField(
                                    "Minimum Years of Experience",
                                    job.minYearofExperience
                                )}

                                {renderField(
                                    "Work Authorization",
                                    job.workAuthorization
                                )}

                            </div>

                        </div>

                        {/* DATES */}

                        <div className="pt-6 border-t">

                            <h3 className="font-semibold text-slate-900 mb-4">
                                Important Dates
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

                                {renderField(
                                    "Start Date",
                                    formatDate(job.startDate)
                                )}

                                {renderField(
                                    "End Date",
                                    formatDate(job.endDate)
                                )}

                                {renderField(
                                    "Online Test Date",
                                    formatDate(job.onlineTestDate)
                                )}

                                {renderField(
                                    "Offer Rollout Date",
                                    formatDate(job.offerRolloutDate)
                                )}

                                {job.interviewWindow?.start &&
                                    renderField(
                                        "Interview Start",
                                        formatDate(job.interviewWindow.start)
                                    )}

                                {job.interviewWindow?.end &&
                                    renderField(
                                        "Interview End",
                                        formatDate(job.interviewWindow.end)
                                    )}

                                {renderField(
                                    "Expiry Date",
                                    formatDate(job.expireAt)
                                )}

                                {renderField(
                                    "Created At",
                                    formatDate(job.createdAt)
                                )}

                                {renderField(
                                    "Updated At",
                                    formatDate(job.updatedAt)
                                )}

                            </div>

                        </div>

                        {/* SELECTION */}

                        <div className="pt-6 border-t">

                            <h3 className="font-semibold text-slate-900 mb-4">
                                Selection Process
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                                {renderField(
                                    "Rounds",
                                    job.rounds
                                )}

                                {renderField(
                                    "Selection Process",
                                    job.selectionProcess
                                )}

                            </div>

                        </div>

                        {/* HIRING PREFERENCE */}

                        {job.companyHiringPreference?.preferredMode && (
                            <div className="pt-6 border-t">

                                <h3 className="font-semibold text-slate-900 mb-4">
                                    Hiring Preference
                                </h3>

                                {renderField(
                                    "Preferred Mode",
                                    job.companyHiringPreference.preferredMode
                                )}

                            </div>
                        )}

                        {/* BENEFITS */}

                        <div className="pt-6 border-t">

                            <h3 className="font-semibold text-slate-900 mb-4">
                                Benefits & Other Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

                                {renderField(
                                    "Benefits",
                                    job.benefits
                                )}

                                {renderField(
                                    "Amenities Required",
                                    job.amenitiesRequired
                                )}

                                {renderField(
                                    "Tags",
                                    job.tags
                                )}

                                {renderField(
                                    "Work Achievements",
                                    job.workAchievements
                                )}

                                {renderField(
                                    "Number of Students",
                                    job.numberOfStudent
                                )}

                                {renderField(
                                    "Batch Year",
                                    job.batchYear
                                )}

                                {renderField(
                                    "Is Ask For Referral",
                                    job.isAskForReferral
                                )}

                                {renderField(
                                    "Inactive",
                                    job.inactive
                                )}

                                {renderField(
                                    "Views",
                                    job.views
                                )}

                            </div>

                        </div>

                        {/* CONTACT PERSON */}

                        {job.contactPerson &&
                            Object.values(job.contactPerson).some(
                                (value) => value
                            ) && (
                                <div className="pt-6 border-t">

                                    <h3 className="font-semibold text-slate-900 mb-4">
                                        Contact Person
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

                                        {renderField(
                                            "Name",
                                            job.contactPerson.name
                                        )}

                                        {renderField(
                                            "Designation",
                                            job.contactPerson.designation
                                        )}

                                        {renderField(
                                            "Email",
                                            job.contactPerson.email
                                        )}

                                        {renderField(
                                            "Mobile",
                                            job.contactPerson.mobile
                                        )}

                                        {job.contactPerson?.linkedin && (
                                            <div>
                                                <span className="text-sm text-slate-500">LinkedIn</span>
                                                <a
                                                    href={
                                                        job.contactPerson.linkedin.startsWith("http")
                                                            ? job.contactPerson.linkedin
                                                            : `https://${job.contactPerson.linkedin}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-[#143694] hover:underline break-all"
                                                >
                                                    {job.contactPerson.linkedin}
                                                </a>
                                            </div>
                                        )}

                                    </div>

                                </div>
                            )}

                        {/* POSTER */}

                        {/* {job.poster?.name && (
              <div className="pt-6 border-t">

                <h3 className="font-semibold text-slate-900 mb-4">
                  Job Posted By
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                  {renderField(
                    "Name",
                    job.poster.name
                  )}

                  {renderField(
                    "Type",
                    job.poster.type
                  )}

                </div>

              </div>
            )} */}

                    </div>

                </div>

                {/* ================================================== */}
                {/* APPLICANTS */}
                {/* ================================================== */}

                <div className="rounded-xl border bg-card shadow">

                    <div className="p-6 border-b">

                        <div className="flex items-center justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <Users className="w-5 h-5 text-slate-700" />

                                    <h2 className="font-semibold text-slate-900">
                                        Applicants
                                    </h2>

                                </div>

                                <p className="text-sm text-slate-500 mt-1">
                                    {applications.length} applicant
                                    {applications.length !== 1 ? "s" : ""}
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="p-6">

                        <div className="border rounded-lg overflow-hidden">

                            <table className="w-full text-sm">

                                <thead>

                                    <tr className="border-b bg-muted/50">

                                        <th className="p-3 text-left font-medium">
                                            Applicant Name
                                        </th>

                                        <th className="p-3 text-left font-medium">
                                            Applicant Type
                                        </th>

                                        <th className="p-3 text-left font-medium">
                                            Status
                                        </th>

                                        <th className="p-3 text-left font-medium">
                                            Admin Comment
                                        </th>

                                        <th className="p-3 text-left font-medium">
                                            Rating
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {applications.length > 0 ? (
                                        applications.map((application) => (

                                            <tr
                                                key={application._id}
                                                className="border-b hover:bg-slate-50"
                                            >

                                                <td className="p-3 font-medium text-slate-800">
                                                    <Link
                                                        to={`/admin/users/${application.userId}/${application.applicantType}`}
                                                        className="font-medium text-[#143694] hover:underline"
                                                    >
                                                        {application.applicantName || "N/A"}
                                                    </Link>
                                                </td>

                                                <td className="p-3">

                                                    <span className="inline-flex rounded-md bg-blue-100 text-[#143694] px-2 py-1 text-xs font-semibold capitalize">
                                                        {application.applicantType || "N/A"}
                                                    </span>

                                                </td>

                                                <td className="p-3">

                                                    <span className="inline-flex rounded-md bg-green-100 text-green-700 px-2 py-1 text-xs font-semibold">
                                                        {application.currentStatus || "N/A"}
                                                    </span>

                                                </td>

                                                <td className="p-3 text-slate-700">
                                                    {application.adminComment || "N/A"}
                                                </td>

                                                <td className="p-3">

                                                    <div className="flex items-center gap-1">

                                                        <Star className="w-4 h-4 text-yellow-500" />

                                                        <span className="font-medium">
                                                            {application.rating ?? 0}
                                                        </span>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))
                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="p-10 text-center text-slate-500"
                                            >
                                                No applicants found
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

export default JobDetails;