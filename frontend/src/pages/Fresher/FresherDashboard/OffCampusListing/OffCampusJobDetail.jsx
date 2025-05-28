import { useParams, useNavigate } from 'react-router-dom';
import { jobListings, detailedJobData } from '@/constants/offCampusListing'

function FOffCampusJobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you would fetch the specific job data using the jobId
  // For now, we'll use the mock data
  const job = detailedJobData;

  const handleBackToList = () => {
    navigate('/fresher-dashboard/off-campus-listings');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 mr-4"></div>
          <div>
            <h2 className="text-xl font-bold">{job.company} - {job.program}</h2>
            <p className="text-sm text-gray-600">Applications Open · Revenue</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleBackToList} className="p-2 border border-gray-300 rounded hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
          <button className="px-4 py-2 bg-black text-white rounded">Apply</button>
        </div>
      </div>

      {/* About Company */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-3">About {job.company}</h3>
        <p className="text-gray-700 mb-4">{job.companyDescription}</p>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="border border-gray-200 p-4">
            <div className="font-bold text-lg">{job.employees}</div>
            <div className="text-sm text-gray-600">Employees</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-bold text-lg">{job.revenue}</div>
            <div className="text-sm text-gray-600">Revenue</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-bold text-lg">{job.industries}</div>
            <div className="text-sm text-gray-600">Industries</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-bold text-lg">{job.countries}</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Program Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 mt-0.5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
            </svg>
            <div>
              <div className="font-medium">{job.education}</div>
            </div>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 mt-0.5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <div>
              <div className="font-medium">Compensation</div>
              <div className="text-gray-700">{job.compensation}</div>
              <div className="text-sm text-gray-600">{job.benefits}</div>
            </div>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 mt-0.5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <div>
              <div className="font-medium">{job.academics}</div>
            </div>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 mt-0.5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <div>
              <div className="font-medium">{job.locations}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Job Details</h3>
        <div className="grid grid-cols-2 gap-y-4">
          <div>
            <div className="text-sm text-gray-600">Job Role</div>
            <div>{job.jobRole}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Industry Type</div>
            <div>{job.industryType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Department</div>
            <div>{job.department}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Employment Type</div>
            <div>{job.employmentType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Role Category</div>
            <div>{job.roleCategory}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Work Mode</div>
            <div>{job.workMode}</div>
          </div>
        </div>
      </section>

      {/* Selection Process */}
      <section className="mb-8">
  <h3 className="text-lg font-semibold mb-3">Selection Process</h3>
  <div className="relative flex items-center justify-between overflow-x-auto px-4">
    {/* Connecting line behind all steps */}
    <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 z-0" />

    {job.selectionProcess.map((step, index) => (
      <div
        key={index}
        className="flex flex-col items-center z-10 relative min-w-[100px] mx-4"
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            index === 0 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {step.step}
        </div>
        <div className="text-sm mt-1 text-center whitespace-nowrap">{step.name}</div>
      </div>
    ))}
  </div>
</section>

      {/* Required Skills */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
        <div className="mb-4">
          <h4 className="font-medium mb-2">Technical Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job.technicalSkills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded text-sm">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Soft Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job.softSkills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded text-sm">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Important Dates</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="border border-gray-200 p-3">
            <div className="text-sm text-gray-600">Registration Deadline</div>
            <div className="font-medium">{job.dates.registration}</div>
          </div>
          <div className="border border-gray-200 p-3">
            <div className="text-sm text-gray-600">Test Date</div>
            <div className="font-medium">{job.dates.test}</div>
          </div>
          <div className="border border-gray-200 p-3">
            <div className="text-sm text-gray-600">Interview Window</div>
            <div className="font-medium">{job.dates.interview}</div>
          </div>
          <div className="border border-gray-200 p-3">
            <div className="text-sm text-gray-600">Results</div>
            <div className="font-medium">{job.dates.results}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FOffCampusJobDetail;