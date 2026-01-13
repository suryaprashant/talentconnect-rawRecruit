const JobCard = ({ job }) => {

  const normalizeArrayField = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'string' && value.trim()) return value;
  return 'N/A';
};

  const jobData = job?.job || job;

  const resolveLocation = () => {
  // 1. Work location (company-posted jobs)
  if (Array.isArray(jobData?.workLocation) && jobData.workLocation.length > 0) {
    return jobData.workLocation.join(', ');
  }

  // 2. Explicit job location
  if (Array.isArray(jobData?.location) && jobData.location.length > 0) {
    return jobData.location.join(', ');
  }

  // 3. College city (college-posted jobs)
  if (jobData?.collegePosted?.collegeUniversityDetails?.city) {
    return jobData.collegePosted.collegeUniversityDetails.city;
  }

  // 4. College full location (final fallback)
  if (jobData?.collegePosted?.collegeUniversityDetails?.collegeLocation) {
    return jobData.collegePosted.collegeUniversityDetails.collegeLocation;
  }

  return 'N/A';
};


  return (
    <div className="border rounded-md p-4 hover:shadow-md transition-shadow">
      <div className="flex">
        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md">
          {job?.logo ? (
            <img src={job?.logo} alt={`${job?.company} logo`} className="w-12 h-12 object-contain" />
          ) : (
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="ml-4 flex-1">
          <h2 className="text-xl font-bold">{job?.collegeUniversityDetails?.collegeName}ll</h2>
          {/*<div className="flex text-sm text-gray-500 mb-1">
            <span>{job?.jobDetails[0].location}</span>
            <span className="mx-2">•</span>
            <span>{job?.jobDetails[0].employmentType}</span>
            <span className="mx-2">•</span>
            <span>{job?.jobDetails[0].workMode}</span>
          </div>*/}

          <div className="flex text-sm text-gray-500 mb-1">
 <span>{resolveLocation()}</span>
  <span className="mx-2">•</span>
  <span>{normalizeArrayField(jobData?.employmentType)}</span>
  <span className="mx-2">•</span>
  <span>{normalizeArrayField(jobData?.workMode)}</span>
</div>



          <h3 className="font-bold text-xl capitalize">{job?.jobDetails[0]?.jobTitle || job?.jobDetails[0]?.jobRoles}</h3>
         
          <p className="mt-2 text-sm text-gray-600 line-clamp-3 capitalize">
            {job?.jobDetails[0]?.description}
          </p>
        </div>

      
      </div>
    </div>
  );
};

export default JobCard;