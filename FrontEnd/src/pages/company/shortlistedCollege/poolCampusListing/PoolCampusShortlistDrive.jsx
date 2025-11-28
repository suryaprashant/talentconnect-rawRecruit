import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash } from 'lucide-react';
import CollegeRequestDetail from './CollegeRequestDetail';
import { acceptCandidate, deleteJobById, getCollegeApplicationsForJob, getPostedJobs, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function PoolCampusJobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostedJobs("Pool-campus", "Shortlisted");
      console.log("Fetched jobs:", response?.data);
      setJobs(response?.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch drives.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollegesForJob = async (jobId, jobType, isVisited) => {
    setCollegesLoading(true);
    setError(null);
    try {
      let response;
      if (isVisited === false) response = await getCollegeApplicationsForJob(jobId, jobType, "Shortlisted", isVisited);
      else {
        response = await getCollegeApplicationsForJob(jobId, jobType, "Shortlisted");
      }
      setColleges(response.data);
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch colleges.");
      setColleges([]);
    } finally {
      setCollegesLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      let response;
      switch (status) {
        case "Rejected":
          response = await rejectCandidate(applicationId, selectedJob?.jobRoles);
          break;
        case "Accepted":
          response = await acceptCandidate(applicationId, selectedJob?.jobRoles);
          break;
        default:
          alert("Invalid Action!");
      }
      if (response?.data?.success === true) {
        toast.success(`Application status updated to: ${status}`);
        // Refresh the colleges list after status update
        if (selectedJob) {
          fetchCollegesForJob(selectedJob._id, selectedJob.jobType);
        }
      } else {
        toast.error(response?.response?.data?.msg || 'Failed to update status');
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      setError(err.response?.data?.message || err.message || "Failed to update status.");
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
      if (confirmed) {
        await deleteJobById(jobId);
        fetchJobs();
        toast.success(`Job deleted successfully`);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Failed to delete job');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const searchLower = searchQuery.toLowerCase();

    // Check job roles
    const jobRolesMatch = Array.isArray(job.jobRoles)
      ? job.jobRoles.some(role => role?.toLowerCase().includes(searchLower))
      : false;

    // Check work locations
    const workLocations = job.workLocation || [];
    const workLocationsMatch = Array.isArray(workLocations)
      ? workLocations.some(location => location?.toLowerCase().includes(searchLower))
      : false;

    return (
      jobRolesMatch ||
      workLocationsMatch ||
      (job._id?.toLowerCase().includes(searchLower)) ||
      (job.lookingFor?.toLowerCase().includes(searchLower))
    );
  });

  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleViewColleges = (job) => {
    // if (job.applicationCount === 0) {
    //   alert("No colleges have applied for this drive yet.");
    //   return;
    // }
    setSelectedJob(job);
    fetchCollegesForJob(job._id, job.jobType);
  };

  const showNewApplication = async (job) => {
    try {
      setSelectedJob(job);
      await fetchCollegesForJob(job._id, job.jobType, false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleBackToList = () => {
    setSelectedJob(null);
    setColleges([]);
  };

  const displayWorkLocations = (job) => {
    const workLocations = job.workLocation || [];
    if (!workLocations || workLocations.length === 0) return 'N/A';
    return Array.isArray(workLocations) ? workLocations.join(', ') : String(workLocations);
  };

  const displayJobRoles = (job) => {
    const jobRoles = job.jobRoles || [];
    if (!jobRoles || jobRoles.length === 0) return 'N/A';
    return Array.isArray(jobRoles) ? jobRoles.join(', ') : String(jobRoles);
  };

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-4xl mx-auto p-4">
          <button
            onClick={handleBackToList}
            className="flex items-center text-gray-600 hover:text-black mb-6"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to drives
          </button>



          {collegesLoading ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading college applications...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md">
              Error: {error}
            </div>
          ) : colleges.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
              No colleges have applied for this drive yet.
            </div>
          ) : (
            <div className="space-y-6">
              {colleges.map(college => (
                <CollegeRequestDetail
                  key={college._id}
                  collegeApplication={college}
                  driveDetails={selectedJob} // Pass drive details separately
                  jobRole={selectedJob?.jobRoles}
                  onAccept={() => handleUpdateApplicationStatus(college._id, 'Accepted')}
                  onReject={() => handleUpdateApplicationStatus(college._id, 'Rejected')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto p-4 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 mb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shortlisted Pool-Campus Drives</h1>
            <p className="text-gray-600 mt-2">Track Your Shortlisted Pool-Campus Drives</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg mt-10 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-grow w-full sm:max-w-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by job role or work location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md m-4">
              Error: {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-700">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3">Job Roles</th>
                  <th className="px-4 py-3">Work Locations</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">New Applications</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
                      <p className="mt-4 text-gray-600">Loading drives...</p>
                    </td>
                  </tr>
                ) : currentJobs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No drives found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  currentJobs.map(job => (
                    <tr key={job._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-4" onClick={() => navigate(`/company-dashboard/preview/Pool-campus/${job._id}?isApplied=true`)}>
                        <div className="font-medium text-gray-900">
                          {displayJobRoles(job)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Array.isArray(job.employmentType) ? job.employmentType.join(', ') : job.employmentType || 'N/A Type'}
                        </div>
                      </td>
                      <td className="px-4 py-4 capitalize">
                        {displayWorkLocations(job)}
                      </td>
                      <td className="px-4 py-4">
                        {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4">{job.views || 0}</td>
                      <td className="px-4 py-4 hover:bg-gray-200" onClick={() => showNewApplication(job)}>{job.applicationCount || 0}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewColleges(job)}
                            // disabled={!job.applicationCount || job.applicationCount === 0}
                            className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="View College Applications"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="text-gray-500 hover:text-red-600 p-1 rounded-md hover:bg-gray-200"
                            title="Delete Job"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${currentPage === page ? 'bg-black text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}