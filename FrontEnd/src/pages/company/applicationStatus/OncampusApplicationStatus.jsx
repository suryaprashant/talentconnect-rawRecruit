import { useEffect, useState } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { statusSteps, similarJobs } from '../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { Link } from 'react-router-dom';

export default function OncampusApplicationStatus() {
  const [oncampusJobs, setOncampusJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchApplication = async () => {
    try {
      const response = await getUserApplicationStatus("On-campus");
      const rawData = response?.data?.data || [];
      // Adapted normalization to match your actual data shape
      const normalized = rawData.map((item) => {
        // Defensive checks to avoid undefined errors
        const jobDetail = Array.isArray(item.jobDetails) && item.jobDetails.length > 0 ? item.jobDetails[0] : {};
        return {
          ...item,
          id: item._id,
          status: item.currentStatus ?? item.status ?? "",
          date: item.createdAt ?? "",
          // fields adapted to your data:
          jobTitle: jobDetail?.designation ?? "N/A",
          company: jobDetail?.companyDetails?.collegeUniversityDetails?.collegeName ?? "-",
          degree: jobDetail?.degree?.join(", ") ?? "-",
          employmentType: jobDetail?.employmentType ?? "-",
          city: jobDetail?.city ?? "-",
          state: jobDetail?.state ?? jobDetail?.location[0],
          country: jobDetail?.country ?? "-",
          skills: Array.isArray(jobDetail?.skills) ? jobDetail.skills.join(", ") : "-",
          description: jobDetail?.description
        };
      });

      setOncampusJobs(normalized);
      setSelectedJob(normalized[0] || null);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const filteredJobs = oncampusJobs?.filter(job =>
    (job?.jobTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.company?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusIndex = (status) => statusSteps.findIndex(step => step === status);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Application Status</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="company">Sort by: Company</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 mt-1">
          Your current on-campus application progress and details.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Job List Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          {filteredJobs?.map(job => (
            <div
              key={job.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedJob?.id === job.id ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <h3 className="font-medium">{job?.companyDetails[0]?.collegeUniversityDetails?.collegeName}</h3>
              {/* <p className="text-sm text-gray-600">{job.company}</p> */}
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{job.degree}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-3 w-3 mr-1" />
                <span>{job.city}, {job.state}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Job Details */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedJob && (
            <>
              {/* Status Progress Bar */}
              <div className="mb-8 relative">
                <div className="flex justify-between mb-2">
                  {statusSteps?.map((step, idx) => {
                    const currentIdx = getStatusIndex(selectedJob.status);
                    const isActive = idx <= currentIdx;
                    return (
                      <div key={idx} className="flex flex-col items-center text-xs" style={{ width: `${100 / statusSteps.length}%` }}>
                        <div className={`w-4 h-4 rounded-full mb-1 ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <span className={`text-center ${isActive ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
                          {step}
                        </span>
                        <span className="text-gray-400 text-xs">{idx === 0 ? selectedJob.date : ''}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="h-1 bg-gray-200 absolute left-0 right-0 top-2">
                  <div
                    className="h-1 bg-blue-500"
                    style={{
                      width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Job Details Content */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{selectedJob?.companyDetails[0]?.collegeUniversityDetails?.collegeName}</h2>
                    {/* <p className="text-gray-600">{selectedJob.company}</p> */}
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Job ID: {selectedJob.id}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{selectedJob.degree}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{selectedJob.city}, {selectedJob.state}, {selectedJob.country}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Skills: {selectedJob.skills}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    {/* optionally display company/college initials here */}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-gray-700">
                    Job Type: {selectedJob.employmentType}
                  </p>
                </div>
                <div>
                  <h3 className='font-semibold mt-2'>Description</h3>
                  <p>{selectedJob.description}</p>
                </div>

                {/* <div className="mt-6">
                  <h3 className="font-medium mb-2">Activity on this role</h3>
                  <div className="flex border-t border-gray-200">
                    <div className="py-4 px-6 border-r border-gray-200">
                      <p className="text-lg font-semibold">1580</p>
                      <p className="text-sm text-gray-500">Total applications</p>
                    </div>
                    <div className="py-4 px-6">
                      <p className="text-lg font-semibold">83</p>
                      <p className="text-sm text-gray-500">Applications viewed by recruiter</p>
                    </div>
                  </div>
                </div> */}

                <div className="mt-4">
                  <Link to={`/company-dashboard/On-campus/${selectedJob?.jobDetails[0]?._id}?isApplied=true`} className="text-blue-500 text-sm font-medium">View full description</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}