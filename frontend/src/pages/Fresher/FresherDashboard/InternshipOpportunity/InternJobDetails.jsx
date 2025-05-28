import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
 import { fetchJobDetails, fetchSimilarJobs} from '../../../../constants/JobListing'
import JobCard from '@/components/Student/StudentDashboard/IntershipOpportunity/JobCard';

const FInternJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch job details
        const details = await fetchJobDetails(jobId);
        setJobDetails(details);
        
        // Fetch similar jobs
        const similar = await fetchSimilarJobs(jobId);
        setSimilarJobs(similar);
      } catch (err) {
        setError('Failed to load job details. Please try again later.');
        console.error('Error fetching job details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobDetails();
  }, [jobId]);

  const handleApply = async () => {
    try {
      // Here you would implement the application logic
      // This could be a redirect to an application form or a direct API call
      console.log('Applying for job:', jobId);
      
      // Example: navigate to application form
      // navigate(`/apply/${jobId}`);
      
      // For now, just show an alert
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying for job:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      // Implement save job functionality
      console.log('Saving job:', jobId);
      alert('Job saved successfully!');
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to save job. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !jobDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-4">
          <p className="text-xl font-semibold">{error || "Job not found"}</p>
          <button 
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/fresher-dashboard/job-listing')}
          >
            Back to Job Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{jobDetails.title}</h1>
            <p className="text-gray-600 mb-2">{jobDetails.company}</p>
            <p className="text-sm text-gray-500 mb-2">Job ID: {jobDetails.jobId}</p>
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center mr-4">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {jobDetails.experience}
              </span>
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {jobDetails.location}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button 
              onClick={handleSave}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow"
            >
              Save
            </button>
            <button 
              onClick={handleApply}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Job description</h2>
          <div className="mb-4">
            <h3 className="font-medium mb-2">About The Role:</h3>
            <p className="text-gray-700">{jobDetails.description}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">What you'll do:</h3>
            <p className="text-gray-700">{jobDetails.responsibilities}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Role:</p>
              <p className="text-gray-700">{jobDetails.roleType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Industry Type:</p>
              <p className="text-gray-700">{jobDetails.industryType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Department:</p>
              <p className="text-gray-700">{jobDetails.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Employment Type:</p>
              <p className="text-gray-700">{jobDetails.employmentType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role Category:</p>
              <p className="text-gray-700">{jobDetails.roleCategory}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Salary Range:</p>
              <p className="text-gray-700">{jobDetails.salaryRange}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Work Mode:</p>
              <p className="text-gray-700">{jobDetails.workMode}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">UG:</p>
              <p className="text-gray-700">{jobDetails.education?.ug}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">PG:</p>
              <p className="text-gray-700">{jobDetails.education?.pg}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Key Skills</h2>
          <div className="flex flex-wrap gap-2">
            {jobDetails.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">About company</h2>
          <p className="text-gray-700 mb-4">{jobDetails.aboutCompany}</p>
          
          <h3 className="font-medium mb-2">Company Info</h3>
          <p className="text-gray-700">
            <span className="font-medium">Address:</span> {jobDetails.companyAddress}
          </p>
        </div>
      </div>

      {/* Similar Jobs Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Similar Jobs</h2>
            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
          </div>
          <div className="flex items-center">
            <div className="relative mr-2">
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="relative">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none">
                <span>Sort by</span>
                <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            View all
          </button>
        </div>
      </div>
    </div>
  );
};

export default FInternJobDetails;