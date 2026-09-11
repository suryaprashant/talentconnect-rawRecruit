import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Award,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Wrench,
  ShieldCheck,
  Calendar,
  Loader2,
  BookOpen,
  MessageSquare,
  Star,
} from "lucide-react";

import { updateReferralApplicationStatus } from "@/lib/Admin_AxiosInstance";
import InterviewSchedulerPopupAdmin from "./ScheduleInterviewAdmin";

export default function StudentDetailModal({
  application,
  onClose,
  onStatusUpdate,
}) {
  const [updating, setUpdating] = useState(null); // stores 'Approved' or 'Rejected' to show specific loader
  const [toggleScheduleInterviewPopup, setToggleScheduleInterviewPopup] =
    useState(false);
  const [loadingResume, setLoadingResume] = useState(false);

  const [adminComment, setadminComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, sethoverRating] = useState(0);

  const SectionTitle = ({ title, icon }) => (
    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
      <span className="text-indigo-500">{icon}</span> {title}
    </h3>
  );

  const handlecommentChange = (e) => {
    setadminComment(e.target.value);
  };

  const handleViewResume = async (resumeUrl, applicantName) => {
    if (!resumeUrl) return alert("No resume found");

    setLoadingResume(true);
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const newTab = window.open("", "_blank");
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${applicantName || "Applicant"} - Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body, html { height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
            .header { background: linear-gradient(135deg, #143694 0%, #1e4ed8 100%); color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000; }
            .header h1 { font-size: 18px; font-weight: 600; margin: 0; }
            .controls { display: flex; gap: 10px; }
            .controls button { background: white; color: #143694; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
            .controls button:hover { background: #f8fafc; transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .pdf-container { width: 100%; height: calc(100vh - 60px); }
            iframe { width: 100%; height: 100%; border: none; }
            .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #143694; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 15px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📄 ${applicantName || "Applicant"} - Resume</h1>
            <div class="controls">
              <button onclick="downloadPDF()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
              <button onclick="window.close()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
          </div>
          <div class="pdf-container">
            <iframe src="${pdfUrl}" title="Resume PDF Viewer"></iframe>
          </div>
          <script>
            const pdfBlobUrl = "${pdfUrl}";
            function downloadPDF() {
              const link = document.createElement('a');
              link.href = pdfBlobUrl;
              link.download = '${applicantName || "resume"}.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          </script>
        </body>
        </html>
      `);
      newTab.document.close();
    } catch (error) {
      console.error("Resume load error:", error);
      alert("Failed to load resume. Please try again.");
    } finally {
      setLoadingResume(false);
    }
  };

  if (!application) return null;

  const { applicant, applicantType, _id } = application;

  const handleStatusUpdate = async (statusAction) => {
    if (!adminComment?.trim()) {
      alert("Please enter an admin comment");
      return;
    }
    if (rating <= 0) {
      alert("Please select a rating");
      return;
    }
    setUpdating(statusAction);
    try {
      // Calling the axios instance function
      const response = await updateReferralApplicationStatus(
        application._id,
        statusAction,
        adminComment,
        rating,
      );

      if (response.data.success) {
        if (onStatusUpdate) onStatusUpdate(application._id, statusAction);
        onClose();
      }
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);

      // Detailed error handling
      const errorMsg =
        error.response?.data?.message || "Check network connection";
      alert(`Update Failed: ${errorMsg}`);
    } finally {
      setUpdating(null);
    }
  };

  const renderTags = (items, colorClass) => {
    const list = Array.isArray(items) ? items : items ? items.split(",") : [];
    if (list.length === 0)
      return (
        <span className="text-gray-400 text-sm italic">Not specified</span>
      );
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {list.map((item, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {item.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-5 border-b flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              Application Review
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          {/* Main Info Card */}
          <div className="bg-white m-6 rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-24 w-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {applicant?.name?.[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {applicant?.name}
                  </h1>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    {applicantType}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-gray-600">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-indigo-400" />{" "}
                    {applicant?.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-indigo-400" />{" "}
                    {applicant?.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-indigo-400" /> Grad:{" "}
                    {applicant?.gradYear || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-indigo-600 font-bold mb-5 border-b pb-2">
                <GraduationCap size={18} /> Education Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    College
                  </label>
                  <p className="text-gray-800 font-semibold">
                    {applicant?.college}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      Degree
                    </label>
                    <p className="text-gray-800 font-semibold">
                      {applicant?.degree || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      Specialization
                    </label>
                    <p className="text-gray-800 font-semibold">
                      {applicant?.specialization || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    CGPA
                  </label>
                  <p className="text-2xl font-black text-indigo-600">
                    {applicant?.cgpa || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tech & Skills Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-indigo-600 font-bold mb-5 border-b pb-2">
                <Wrench size={18} /> Technical Profile
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Skills
                  </label>
                  {renderTags(applicant?.skills, "bg-blue-100 text-[#143694]")}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Tools & Platforms
                  </label>
                  {renderTags(
                    applicant?.tools,
                    "bg-purple-100 text-purple-700",
                  )}
                </div>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
              <h3 className="flex items-center gap-2 text-indigo-600 font-bold mb-4 border-b pb-2">
                <ShieldCheck size={18} /> Certifications
              </h3>
              {renderTags(
                applicant?.certifications,
                "bg-emerald-100 text-emerald-700",
              )}
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              {/* Admin Comment */}
              <section className="w-full md:w-2/3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SectionTitle
                    title="Admin Comment"
                    icon={<MessageSquare size={14} />}
                  />

                  <textarea
                    id="adminComment"
                    name="adminComment"
                    rows={5}
                    value={adminComment}
                    onChange={handlecommentChange}
                    placeholder="Enter your comment here..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-black"
                  />
                </div>
              </section>

              {/* Rating */}
              <section className="w-full md:w-1/2">
                <div className="bg-white rounded-lg shadow-sm p-4 h-full">
                  <SectionTitle
                    title="Candidate Rating"
                    icon={<Star size={18} />}
                  />

                  <div className="mt-4 flex items-center gap-1 flex-wrap">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={28}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => sethoverRating(star)}
                        onMouseLeave={() => sethoverRating(0)}
                        className={`cursor-pointer transition-all duration-200 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-500 text-amber-500"
                            : "text-slate-500"
                        }`}
                      />
                    ))}

                    <span className="ml-2 text-sm font-medium text-slate-600">
                      {rating > 0 ? `${rating}/5` : "Rate"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t bg-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3 items-center">
            {applicant?.resume ? (
              <button
                onClick={() =>
                  handleViewResume(applicant.resume, applicant.name)
                }
                disabled={loadingResume}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
              >
                {loadingResume ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileText size={18} />
                )}
                {loadingResume ? "Loading..." : "View Resume"}
              </button>
            ) : (
              <span className="text-gray-400 italic">No resume uploaded</span>
            )}

            {/* 🗓️ Schedule Interview */}
            <button
              onClick={() => setToggleScheduleInterviewPopup(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
              <Calendar size={18} />
              Schedule Interview
            </button>
          </div>

          <div className="flex gap-3">
            <button
              disabled={!!updating}
              onClick={() => handleStatusUpdate("Rejected")}
              className="flex items-center gap-2 px-8 py-3 border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {updating === "Rejected" ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <XCircle size={18} />
              )}
              Reject
            </button>
            <button
              disabled={!!updating}
              onClick={() => handleStatusUpdate("Approved")}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 min-w-[180px] justify-center"
            >
              {updating === "Approved" ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              Approve Applicant
            </button>
          </div>
        </div>
      </div>

      {toggleScheduleInterviewPopup && (
        <InterviewSchedulerPopupAdmin
          setToggleScheduleInterviewPopup={setToggleScheduleInterviewPopup}
          application={application}
          job={application.job}
        />
      )}
    </div>
  );
}
