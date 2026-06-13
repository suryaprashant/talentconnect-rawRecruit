import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptCandidate, getApplicationsForJob, rejectCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { useChat } from '@/context/ChatContext';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';
import { Send } from 'lucide-react';
import InterviewSchedulerPopup from '@/components/ui/ScheduleInterview';


const EmployerApplicantDetails = ({ job, onClose }) => {
  const jobId = job._id;
  const jobType = job.jobType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toggleScheduleInterviewPopup, setToggleScheduleInterviewPopup] = useState(false);
  const [applications, setApplications] = useState();
  const navigate = useNavigate();
  const { setSelectedConversation, setShowFloatingChat } = useChat();  

  const getApplicants = async (jobId, jobType) => {
    setIsSubmitting(true);
    try {
      const response = await getApplicationsForJob(jobId, jobType, "Shortlisted");
      // console.log("ye wala response: ", response.data);
      setApplications(response.data);
    } catch (error) {
      console.log("Error: ", error);
    };
    setIsSubmitting(false);
  }

  const acceptApplicant = async (applicantionId) => {
    try {
      const response = await acceptCandidate(applicantionId, job?.jobTitle);
      // console.log("shortlist: ", response)
      if (response?.data?.success === true) toast.success("Accpeted!");
      else toast.error(response.response?.data?.msg);
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!')
    }
  }

  const rejectApplicant = async (applicantionId) => {
    try {
      const response = await rejectCandidate(applicantionId, job?.jobTitle);
      if (response?.data?.success === true) toast.success("Rejected!");
      else toast.error(response.response?.data?.msg);
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!')
    }
  }

  useEffect(() => {
    getApplicants(jobId, jobType);
  }, [jobId]);

  const handleMessageClick = async (applicant) => {
    if (!applicant?.applicant?._id) {
      toast.error("Applicant data is missing.");
      return;
    }

    const userId = applicant.applicant._id;
    try {
      const response = await conversationWithCollege(userId);
      if (response.data) {
        const conversationUser = {
          _id: userId,
          name: applicant.applicant.name || 'Unknown Applicant',
          email: applicant.applicant.email || '',
          profileImage: applicant.applicant.profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          userType: 'candidate',
          fullname: applicant.applicant.name || 'Unknown Applicant'
        };

        setSelectedConversation(conversationUser);

        setTimeout(() => {
              setShowFloatingChat(true);
            }, 0);

      } else {
        toast.error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Error starting conversation');
    }
  };


  return (
    <>
      <button onClick={() => onClose()}>Back</button>
      <div className="bg-white min-h-screen flex">
        {/* Filters Sidebar */}
        <div className="w-1/4 p-6 border-r border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button className="text-sm text-gray-500">Clear all</button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Showing 0 of 100</p>
          <div className="relative mb-6">
            <input type="text" placeholder="Search by Job" className="w-full pl-10 pr-4 py-2 border rounded-md" />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mb-2">Job status</h3>
            <button className="text-sm text-gray-500 mb-4">Clear</button>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Active Jobs
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Closed Jobs
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked className="mr-2" />
                Expired Jobs
              </label>
            </div>
          </div>
        </div>

        {/* Applicant Details */}
        <div className="flex-1 p-8">
          <h1 className=''>{job?.jobRoles[0]}</h1>
          {
            applications?.map((applicant) => (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200" key={applicant._id}>
                {/* Header Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mr-6"></div>
                      <div>
                        <h1 className="text-3xl font-bold">{applicant?.applicant.name}</h1>
                        <p className="text-sm text-gray-600 mt-1">{applicant?.applicant.locations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Current Salary:</p> <span>{applicant?.applicant.currentSalaryCurrency} {applicant?.applicant.currentSalaryAmount}</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Expected Salary:</p> <span>{applicant?.applicant.expectedSalaryCurrency} {applicant?.applicant.expectedSalaryAmount}</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Email:</p> <span className="underline">{applicant?.applicant.email}</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Phone:</p> <span>{applicant?.applicant.phone}</span>
                    </div>
                  </div>

                  <h3 className='font-bold text-gray-700 mb-2'>Related Links</h3>
                  <div className="flex space-x-4 mb-8">
                    <button className="px-6 py-2 border rounded-md">
                      {applicant?.applicant.linkedIn}
                      {/* <LinkedInLogo className="w-5 h-5" /> */}
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 30 30">
                        <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                      </svg>
                    </button>
                    <button className="px-6 py-2 border rounded-md">
                      {applicant?.applicant.github}
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                        <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                      </svg>
                    </button>
                    <button className="px-6 py-2 border rounded-md">{applicant?.applicant.portfolio}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>

                    </button>
                    <button className="px-6 py-2 border rounded-md">{applicant?.applicant.cv}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>

                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Key Info:</p>
                      <div className="flex items-center">
                        <span className="mr-4 capitalize">{applicant?.applicant.degree} ({applicant?.applicant.specialization})</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Language:</p> <span className="mr-4">Not Specified</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Designation:</p> <span>Not Specified</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Industry:</p> <span>{applicant?.applicant.industry}</span>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="mt-8">
                    <p className="font-bold text-gray-700 mb-3">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {applicant?.applicant.skills?.map((skill, index) => (
                        <span key={index} className="px-4 py-1.5 text-sm border rounded-full bg-gray-100 text-gray-700">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <hr className="my-6 border-t border-gray-200" />

                {/* Action Buttons */}
                <div className="flex justify-end p-6 space-x-4">
                  <button
                    onClick={() => handleMessageClick(applicant)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md border rounded-md text-gray-700 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Send size={14} className="mr-2" /> Chat
                  </button>
                  {/* <button className="px-6 py-2 shadow hover:shadow-md border rounded-md text-gray-700">View Details</button> */}
                  <button
                    onClick={() => acceptApplicant(applicant._id)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md text-green-500 font-medium rounded-md hover:bg-gray-200 disabled:opacity-50"
                  >
                    Accepte Candidate
                  </button>
                  <button
                    onClick={() => setToggleScheduleInterviewPopup(true)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md text-yellow-500 font-medium rounded-md hover:bg-gray-200 disabled:opacity-50"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => rejectApplicant(applicant._id)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md border rounded-md text-red-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    Reject Application
                  </button>
                </div>

                {toggleScheduleInterviewPopup && (
                  <div>
                    <InterviewSchedulerPopup
                      setToggleScheduleInterviewPopup={setToggleScheduleInterviewPopup}
                      applicantId={applicant.applicant._id}
                      applicantType={applicant.applicant.profileType}
                      jobRole={job?.jobTitle}
                    />
                  </div>
                )}
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
};

export default EmployerApplicantDetails;