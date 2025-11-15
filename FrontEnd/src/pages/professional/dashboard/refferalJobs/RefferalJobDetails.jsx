import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

//  import { fetchJobDetails, fetchSimilarJobs} from '../../../../constants/JobListing'
// import JobCard from '@/components/student/studentDashboard/jobListing/JobCard';
import { ApplyForJobListingOppurtunity, ApplyForReferral, getReferalJobDetails, SaveOppurtunity, viewed } from '@/lib/User_AxiosInstance';

const JobDetails = () => {
  const [searchParams] = useSearchParams();
  const isSaved = (searchParams.get('isSaved') || '').toLowerCase() === 'true';
  const isApplied = (searchParams.get('isApplied') || '').toLowerCase() === 'true';
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  //   const [similarJobs, setSimilarJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setIsLoading(true);

        // Fetch job details
        const details = await getReferalJobDetails(jobId);
        // console.log("..../", details.data[0]);
        setJobDetails(details.data[0]);
        await viewed(details.data[0]._id);

        // Fetch similar jobs
        // const similar = await fetchSimilarJobs(jobId);
        // setSimilarJobs(similar);
        setError(null);
      } catch (err) {
        setError('Failed to load job details. Please try again later.');
        toast.error('Something went wrong')
        // console.error('Error fetching job details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobDetails();
  }, [jobId]);

  const handleSave = async () => {
    try {
      const response = await SaveOppurtunity(jobId, jobDetails?.jobType);
      // console.log("Applicaiton: ", response);
      if (response?.data?.success === true) toast.success('Job saved!');
      else toast.error(response.response.data?.msg);
    } catch (err) {
      // console.error('Error applying for job:', err);
      toast.error('Something went wrong!');
    }
  };

  const handleApply = async () => {
    try {
      const response = await ApplyForReferral(jobId);
      // console.log("Applicaiton: ", response);
      if (response?.data?.success === true) toast.success('Application submitted!');
      else toast.error(response.response.data?.msg);
    } catch (err) {
      // console.error('Error applying for job:', err);
      toast.error('Something went wrong!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !jobDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4 text-center">
        <div>
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">{error || "Job not found"}</h2>
          <p className="mt-2 text-slate-600">We couldn't retrieve the details for this job posting.</p>
          <button
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            onClick={() => navigate('/student-dashboard/Job-listing')}
          >
            Back to Job Listings
          </button>
        </div>
      </div>
    );
  }

  const Section = ({ title, children }) => (
    <section>
      <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">{title}</h2>
      <div className="text-slate-700 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );

  const InfoPill = ({ icon, text }) => (
    <div className="flex items-center text-slate-500">
      {icon}
      <span className="ml-1.5">{text}</span>
    </div>
  );

  const SnapshotListItem = ({ icon, label, value }) => (
    <div className="flex-1 min-w-[200px]">
      <div className="flex items-center text-sm text-slate-500">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
      <p className="font-semibold text-slate-800 mt-0.5">{value}</p>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl">
        <main>
          <div className="bg-white p-8 rounded-xl shadow-md space-y-8">
            <header className="flex flex-col sm:flex-row items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2 capitalize">{jobDetails.jobTitle}</h1>
                <p className="text-lg text-slate-600 mb-4">at {jobDetails?.candidatePosted?.name}</p>
                <p className="text-sm text-slate-400 mb-4">Job ID: {jobDetails._id}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>} text={Array.isArray(jobDetails.location) ? jobDetails.location.join(', ') : jobDetails.location || 'Not Specified'} />
                  <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>} text={jobDetails.yearsOfExperience ? `${jobDetails.yearsOfExperience} years experience` : 'Not Specified'} />
                </div>
              </div>
              {!isApplied && (<div className="flex items-center gap-3 mt-4 sm:mt-0 flex-shrink-0">
                {!isSaved && (
                  <button onClick={handleSave} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-5 rounded-lg transition duration-300">Save</button>
                )}
                <button onClick={handleApply} className="bg-blue-500 hover:bg-indigo-500 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-300">Apply</button>
              </div>)}
            </header>

            {/* <Section title="Job Description">
              <p>{jobDetails.description || 'No job description provided.'}</p>
            </Section> */}

            {/* <Section title="Responsibilities">
                            <p>{jobDetails.responsibilities}</p>
                        </Section> */}

            <Section title="Eligibility Criteria">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Minimum Education</p>
                  <p className="text-slate-700 capitalize font-semibold">{jobDetails.minEducation || 'Not Specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Eligible Streams</p>
                  <p className="text-slate-700 capitalize font-semibold">{Array.isArray(jobDetails.studentStreams) ? jobDetails.studentStreams.join(', ') : jobDetails.studentStreams || 'Not Specified'}</p>
                </div>
              </div>
            </Section>

            <Section title="Key Skills">
              <div className="flex flex-wrap gap-2">
                {jobDetails.skills && jobDetails.skills.length > 0 ? (
                  jobDetails.skills.map((skill) => (
                    <span key={skill} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm font-medium">{skill}</span>
                  ))
                ) : (
                  <p className="text-gray-500">No specific skills mentioned.</p>
                )}
              </div>
            </Section>

            <Section title="Benefits">
              <div className="flex flex-wrap gap-2">
                {jobDetails.benefits && jobDetails.benefits.length > 0 ? (
                  jobDetails.benefits.map((benefit) => (
                    <span key={benefit} className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">{benefit}</span>
                  ))
                ) : (
                  <p className="text-gray-500">No benefits specified.</p>
                )}
              </div>
            </Section>

            <Section title="Education">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Minimum Education</p>
                  <p className="text-slate-700 capitalize font-semibold">{jobDetails.minEducation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Preferred Field of Study</p>
                  <p className="text-slate-700 capitalize font-semibold">{jobDetails.studentStreams}</p>
                </div>
              </div>
            </Section>

            <Section title="Job Overview">
              <div className="flex flex-wrap gap-y-4 gap-x-8">
                {/* <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} label="Industry" value={jobDetails.companyPosted?.companyDetails?.industryType || 'Not Specified'} /> */}
                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>} label="Work Mode" value={Array.isArray(jobDetails.location) ? jobDetails.location.join(', ') : jobDetails.location || 'Not Specified'} />
                {/* <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.162-.682zM11 12.849v-1.698c.22.071.412.164.567.267a2.5 2.5 0 001.162.682zM10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.876.762A4.5 4.5 0 007.5 7.75v5.5a4.5 4.5 0 003.376 4.408A4.5 4.5 0 0012.5 13.25v-5.5a4.5 4.5 0 00-1-2.908z" /></svg>} label="Salary (CTC)" value={jobDetails.minPackage?.amount ? `${jobDetails.minPackage.amount} ${jobDetails.minPackage?.currency || ''}` : 'Not Specified'} /> */}
                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>} label="Openings" value={jobDetails.numberOfOpenings || 'Not Specified'} />
                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>} label="Department" value={jobDetails.department || "Not Specified"} />
                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>} label="Employment Type" value={Array.isArray(jobDetails.employmentType) && jobDetails.employmentType.length ? jobDetails.employmentType.join(', ') : jobDetails.employmentType || 'Not Specified'} />
                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v11a3 3 0 003 3h8a3 3 0 003-3V4a2 2 0 00-2-2H5zm0 2h10v9a1 1 0 01-1 1H6a1 1 0 01-1-1V4z" clipRule="evenodd" /></svg>} label="Certificate Required" value={jobDetails.certifications && jobDetails.certifications.length ? jobDetails.certifications.join(', ') : 'No certification required'} />
                {/* <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.72 7.97 5 10 5c2.03 0 3.488.72 4.756 1.321l.003.001c.624.305 1.135.688 1.536 1.106l-1.091.819C14.72 7.82 14.166 7.5 13 7.5c-1.276 0-2.221.48-2.638.895l-.068.071c-.693.732-.888 1.816-.949 2.887l-2.024.091a4.502 4.502 0 01-1.008-2.324zM10 15a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" clipRule="evenodd" /></svg>} label="Work Authorization" value={jobDetails.workAuthorization || 'Not Specified'} /> */}
              </div>
            </Section>

            <Section title="Posted By">
              <p className="text-slate-700 font-semibold mb-4">{jobDetails.candidatePosted?.name || 'Not specified'}</p>
              <span className="text-slate-700 my-1">{jobDetails.candidatePosted?.experiences[0]?.company || 'Not specified'}</span><br />
              <span className="text-slate-500">{jobDetails.candidatePosted?.experiences[0]?.role || 'Not specified'}</span>
              {/* <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-600">Location:</span> {jobDetails.companyPosted?.companyDetails?.companyLocation ? `${jobDetails.companyPosted.companyDetails.companyLocation}, ${jobDetails.companyPosted.companyDetails.state || ''}, ${jobDetails.companyPosted.companyDetails.country || ''}` : 'Not specified'}
              </p> */}
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobDetails;