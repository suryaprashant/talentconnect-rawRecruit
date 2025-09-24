
import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash } from 'lucide-react';
import CollegeRequestDetail from './CollegeRequestDetail';
import { acceptCandidate, deleteJobById, getCollegeApplicationsForJob, getPostedJobs, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';


// Helper function to safely format dates
// const safeFormatDate = (dateString, formatStr = 'MMM d, yyyy') => {
//   if (!dateString) return 'Not Specified';
//   const date = new Date(dateString);
//   return isValid(date) ? format(date, formatStr) : 'Invalid Date';
// };

export default function OnCampusJobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostedJobs("Pool-campus");
      // console.log("response oncampus: ", response);
      setJobs(response?.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch drives.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollegesForJob = async (jobId, jobType) => {
    setCollegesLoading(true);
    setError(null);
    try {
      const response = await getCollegeApplicationsForJob(jobId, jobType)
      // console.log("College: ", response);
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
        case "Shortlisted":
          // console.log("res")
          response = await shortlistCandidate(applicationId, jobs?.jobRoles);
          break;
        case "Rejected":
          response = await rejectCandidate(applicationId, jobs?.jobRoles);
          break;
        case "Accepted":
          response = await acceptCandidate(applicationId, jobs?.jobRoles);
          break;
        default:
          alert("Invalid Action!");
      }
      if (response?.data?.success === true) toast.success(`Application status updated to: ${status}`);
      else toast.error(response?.response?.data.msg);
    } catch (err) {
      console.error("Error updating application status:", err);
      setError(err.response?.data?.message || err.message || "Failed to update status.");
      toast.error('Something went wrong!')
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
      if (confirmed) {
        const response = await deleteJobById(jobId);
        fetchJobs();
        alert(`Job with Id: ${jobId} deleted`);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const searchLower = searchQuery.toLowerCase();
    const locationsMatch = Array.isArray(job.location)
      ? job.location.some(location =>
        location?.toLowerCase().includes(searchLower))
      : false;

    return (
      (job.lookingFor?.toLowerCase().includes(searchLower)) ||
      locationsMatch ||
      (job._id?.toLowerCase().includes(searchLower))
    );
  });

  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  // console.log("currentJobs: ", currentJobs);

  const handleViewColleges = (job) => {
    if (job.applicationCount === 0) {
      alert("No colleges have applied for this drive yet.");
      return;
    }
    setSelectedJob(job);
    fetchCollegesForJob(job._id, job.jobType);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setColleges([]);
  };

  const displayLocations = (locations) => {
    if (!locations || locations.length === 0) return 'N/A';
    return Array.isArray(locations) ? locations.join(', ') : String(locations);
  };

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-3xl mx-auto p-4">
          <button
            onClick={handleBackToList}
            className="flex items-center text-gray-600 hover:text-black mb-6"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to drives
          </button>

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Applications for: {selectedJob.lookingFor || 'N/A'}
            </h2>
            <p className="text-gray-600 capitalize">
              {displayLocations(selectedJob.location)} • {selectedJob.employmentType || 'N/A Type'}
            </p>
          </div>
          {collegesLoading ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading college applications...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md m-4">
              Error: {error}
            </div>
          ) : colleges.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
              No colleges have applied for this drive yet.
            </div>
          ) : (
            <div className="space-y-6">
              {colleges?.map(college => (
                <CollegeRequestDetail
                  key={college._id}
                  collegeApplication={college} // Pass the fully merged college object
                  onAccept={() => handleUpdateApplicationStatus(college._id, 'Accepted')}
                  onShortlist={() => handleUpdateApplicationStatus(college._id, 'Shortlisted')}
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Pool-Campus Drives</h1>
            <p className="text-gray-600 mt-2">Track Your On-Campus Drives and College Applications</p>
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
                placeholder="Search by role or location"
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
                  <th className="px-4 py-3">Looking For</th>
                  <th className="px-4 py-3">Locations</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Applications</th>
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
                  currentJobs?.map(job => (
                    <tr key={job._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {job.jobRoles || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {job.employmentType || 'N/A Type'}
                        </div>
                      </td>
                      <td className="px-4 py-4 capitalize">
                        {displayLocations(job.location)}
                      </td>
                      <td className="px-4 py-4">
                        {new Date(job.endDate).toUTCString().slice(0, 16)}
                      </td>
                      <td className="px-4 py-4">{job.applicationCount || null}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewColleges(job)}
                            disabled={job.applicationCount === 0}
                            className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="View College Applications"
                          >
                            <Eye size={18} />
                          </button>
                          <button onClick={() => handleDelete(job._id)} className="text-gray-500 hover:text-gray-700" title="Delete Job">
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
              {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(page => (
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