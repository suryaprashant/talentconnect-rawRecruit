import { useState, useEffect } from 'react';
import JobListSection from '@/components/Student/StudentDashboard/IntershipOpportunity/JobListSection';
// import { fetchJobs } from '@/constants/JobListing';
import { getAllInternship } from '@/lib/User_AxiosInstance';

const FInternJobListings = () => {
  const [profileInternships, setProfileInternships] = useState([]);
  const [preferenceJobs, setPreferenceJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobs = async () => {
    try {
      setIsLoading(true);

      // Fetch jobs based on profile
      const response = await getAllInternship();
      setProfileInternships(response.data);

      // Fetch jobs based on preferences
      // const preferenceJobsData = await fetchJobs({ type: 'preferences' });
      // setPreferenceJobs(preferenceJobsData);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // const handleClick=()=>{
  //   navigate
  // }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-4">
          <p className="text-xl font-semibold">{error}</p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={loadJobs}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <JobListSection
        title="Internship based on your profile"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."
        jobs={profileInternships}
        userType='fresher'
      />

      <JobListSection
        title="Intership based on your preferences"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."
        jobs={preferenceJobs}
      />
    </div>
  );
};

export default FInternJobListings;