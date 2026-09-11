import { useState, useEffect } from 'react';
import { MoreHorizontal, Calendar, List, Building2 } from 'lucide-react';
import { getCompanyInterviews, getAdminInterviews } from "../../../lib/interview_AxiosClient.js";
import { useAuth } from '@/context/AuthContext';

export default function AdminInterviewScheduler() {
  const { user, loading: authLoading } = useAuth();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateSort, setDateSort] = useState("desc");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await getAdminInterviews();
        setInterviews(res.data.data || []);
      } catch (error) {
        console.error("Error fetching admin interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading user...</p>
      </div>
    );
  }

  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);

    return dateSort === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-xl mr-4">
              <Building2 className="h-6 w-6 text-[#143694]" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
              Admin Scheduled Interviews
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8">
          <div className="flex justify-end mb-6">
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#143694]"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
              <p className="mt-4 text-gray-600">Loading interviews...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No interviews scheduled by admin.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedInterviews.map((interview) => {
                const applicantName = interview.applicantSnapshot?.name;
                const applicantType = interview.applicantSnapshot?.profileType;
                const companyName = interview.companySnapshot?.companyName;
                const jobTitle = interview.jobId?.jobTitle;
                const formattedDateTime = `${interview.date} ${interview.time}`;
                const avatarLetter = applicantName?.charAt(0) || "U";

                return (
                  <div
                    key={interview._id}
                    className="border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-[#143694]">
                            {avatarLetter}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-xl text-gray-900">
                            {applicantName}
                          </h3>
                          <p className="text-gray-700 font-medium capitalize">
                            {applicantType}
                          </p>

                          <div className="mt-3 space-y-1">
                            <div>
                              <div className="text-sm text-gray-500 font-medium">
                                Company
                              </div>
                              <div className="text-gray-800 font-semibold">
                                {companyName}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm text-gray-500 font-medium">
                                Job
                              </div>
                              <div className="text-gray-800">
                                {jobTitle}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {interview.status}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="text-sm text-gray-500 font-medium mb-2">
                          Job Type
                        </div>
                        <div className="text-gray-800 font-medium">
                          {interview.jobType}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="text-sm text-gray-500 font-medium mb-2">
                          Date & Time
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-gray-800 font-medium">
                            {formattedDateTime}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <a
                        href={interview.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg text-sm font-medium hover:shadow-lg"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}