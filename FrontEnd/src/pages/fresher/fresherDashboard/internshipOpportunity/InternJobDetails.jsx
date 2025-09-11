import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { fetchJobDetails, fetchSimilarJobs } from '../../../../constants/JobListing' // Keep commented if not used
import JobCard from '@/components/student/studentDashboard/intershipOpportunity/JobCard'; // Ensure this path is correct
import { ApplyForInternship, getInternshipDetail, SaveOppurtunity } from '@/lib/User_AxiosInstance';

const InternJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]); // Still unused if fetchSimilarJobs is commented
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setIsLoading(true);

        // Fetch job details
        const response = await getInternshipDetail(jobId);
        // Backend's findJobListingOpportunityById returns { data: jobObject }, so response.data is the job object directly.
        // No need for response.data.data here.
        setJobDetails(response.data);
        console.log("Internship Details:", response.data);

        // Fetch similar jobs (currently commented out, so no change needed here)
        // const similar = await fetchSimilarJobs(jobId);
        // setSimilarJobs(similar);

        setError(null);
      } catch (err) {
        setError('Failed to load internship details. Please try again later.');
        console.error('Error fetching internship details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) { // Only load if jobId is available
      loadJobDetails();
    }
  }, [jobId]);

  const handleApply = async () => {
    try {
      const response = await ApplyForInternship(jobId);
      console.log(response)
      if (response && response.success === true) {
        alert("Application submitted successfully!");
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error('Error applying for internship:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      const response = await SaveOppurtunity(jobId, jobDetails?.jobType);
      // console.log(response)
      if (response.response?.data?.success===true) alert('Job saved!');
      else alert(response.response.data?.msg)
    } catch (err) {
      console.error('Error applying for job:', err);
      alert('Failed to submit application. Please try again.');
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
                    <h2 className="mt-4 text-2xl font-bold text-slate-800">{error || "Internship Not Found"}</h2>
                    <p className="mt-2 text-slate-600">We couldn't retrieve the details for this internship posting.</p>
                    <button
                        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                        onClick={() => navigate('/student-dashboard/internship-opportunities')}
                    >
                        Back to Internships
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
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{jobDetails.jobTitle}</h1>
                            <p className="text-lg text-slate-600 mb-4">at {jobDetails.companyPosted?.companyDetails?.companyName}</p>
                            <p className="text-sm text-slate-400 mb-4">Internship ID: {jobDetails._id}</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>} text={Array.isArray(jobDetails.location) ? jobDetails.location.join(', ') : jobDetails.location} />
                                <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>} text={jobDetails.internshipDuration} />
                            </div>
                           </div>
                           <div className="flex items-center gap-3 mt-4 sm:mt-0 flex-shrink-0">
                             <button onClick={handleSave} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-5 rounded-lg transition duration-300">Save</button>
                             <button onClick={handleApply} className="bg-blue-600 hover:bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-300">Apply</button>
                           </div>
                        </header>

                        <Section title="Internship Description">
                            <p>{jobDetails.description}</p>
                        </Section>
                        
                        {/* <Section title="Responsibilities">
                            <p>{jobDetails.responsibilities || 'Not specified'}</p>
                        </Section> */}

                        <Section title="Eligibility Criteria">
                            <p>{jobDetails.eligibilityCriteria}</p>
                        </Section>

                        <Section title="Key Skills">
                            <div className="flex flex-wrap gap-2">
                                {jobDetails.skills?.map((skill) => (
                                    <span key={skill} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm font-medium">{skill}</span>
                                ))}
                            </div>
                        </Section>

                        <Section title="Benefits & Perks">
                           <div className="flex flex-wrap gap-2">
                                {jobDetails.benefits?.map((benefit) => (
                                    <span key={benefit} className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">{benefit}</span>
                                ))}
                            </div>
                        </Section>

                        <Section title="Education">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div>
                                 <p className="text-sm font-medium text-slate-500">Minimum Education</p>
                                 <p className="text-slate-700 capitalize font-semibold">{jobDetails.minEducation}</p>
                               </div>
                               <div>
                                 <p className="text-sm font-medium text-slate-500">Preferred Streams</p>
                                 <p className="text-slate-700 capitalize font-semibold">{jobDetails.studentStreams?.join(', ') || 'N/A'}</p>
                               </div>
                             </div>
                        </Section>

                        <Section title="Opportunity Snapshot">
                            <div className="flex flex-wrap gap-y-4 gap-x-8">
                                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} label="Industry" value={jobDetails.companyPosted?.companyDetails?.industryType} />
                                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>} label="Work Mode" value={jobDetails.workMode} />
                                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.162-.682zM11 12.849v-1.698c.22.071.412.164.567.267a2.5 2.5 0 001.162.682zM10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.876.762A4.5 4.5 0 007.5 7.75v5.5a4.5 4.5 0 003.376 4.408A4.5 4.5 0 0012.5 13.25v-5.5a4.5 4.5 0 00-1-2.908z" /></svg>} label="Stipend" value={`${jobDetails.minPackage?.amount} ${jobDetails.minPackage?.currency}`} />
                                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>} label="Openings" value={jobDetails.numberOfOpenings} />
                                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v11a3 3 0 003 3h8a3 3 0 003-3V4a2 2 0 00-2-2H5zm0 2h10v9a1 1 0 01-1 1H6a1 1 0 01-1-1V4z" clipRule="evenodd" /></svg>} label="Certificate Required" value={jobDetails.certifications || "Not Required"} />
                                <SnapshotListItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.72 7.97 5 10 5c2.03 0 3.488.72 4.756 1.321l.003.001c.624.305 1.135.688 1.536 1.106l-1.091.819C14.72 7.82 14.166 7.5 13 7.5c-1.276 0-2.221.48-2.638.895l-.068.071c-.693.732-.888 1.816-.949 2.887l-2.024.091a4.502 4.502 0 01-1.008-2.324zM10 15a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" clipRule="evenodd" /></svg>} label="Work Authorization" value={jobDetails.workAuthorization} />
                            </div>
                        </Section>

                        <Section title="About The Company">
                           <p className="text-slate-700 mb-4">{jobDetails.companyPosted?.companyDetails?.description}</p>
                           <p className="text-sm text-slate-500">
                               <span className="font-semibold text-slate-600">Location:</span> {`${jobDetails.companyPosted?.companyDetails?.companyLocation || 'N/A'}, ${jobDetails.companyPosted?.companyDetails?.state || ''}, ${jobDetails.companyPosted?.companyDetails?.country || ''}`}
                           </p>
                        </Section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InternJobDetails;