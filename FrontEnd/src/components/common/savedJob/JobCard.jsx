const JobCard = ({ job, userType = 'student' }) => {
  // Available user types: 'college', 'company', 'employer', 'student', 'fresher'

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

  const getDisplayData = () => {
    switch (userType) {
      case 'college':
        return {
          title: jobData?.collegeUniversityDetails?.collegeName || 'College',
          subtitle: 'Posted by College',
          mainHeading: jobData?.jobTitle || jobData?.jobRoles || 'Job Opportunity',
          description: jobData?.description || 'No description available',
          metaInfo: [
            { label: 'Posted Date', value: jobData?.createdAt ? new Date(jobData.createdAt).toLocaleDateString('en-IN') : 'N/A' },
            { label: 'Eligible Courses', value: normalizeArrayField(jobData?.eligibleCourses) },
            { label: 'Batch', value: normalizeArrayField(jobData?.eligibleBatches) }
          ]
        };

      case 'company':
        return {
          title: jobData?.companyName || jobData?.company || 'Company',
          subtitle: `${jobData?.industry || 'Company'} • Posted by Company`,
          mainHeading: jobData?.jobTitle || jobData?.jobRoles || 'Position',
          description: jobData?.description || 'No description available',
          metaInfo: [
            { label: 'Experience', value: jobData?.experienceRequired || 'Fresher' },
            { label: 'Salary', value: jobData?.salary || 'Not disclosed' },
            { label: 'Posted', value: jobData?.createdAt ? new Date(jobData.createdAt).toLocaleDateString('en-IN') : 'N/A' }
          ]
        };

      case 'employer':
        return {
          title: jobData?.employerName || jobData?.company || 'Employer',
          subtitle: `${jobData?.designation || 'Employer'} • Hiring`,
          mainHeading: jobData?.jobTitle || jobData?.jobRoles || 'Opening',
          description: jobData?.description || 'No description available',
          metaInfo: [
            { label: 'Department', value: jobData?.department || 'N/A' },
            { label: 'Positions', value: jobData?.numberOfPositions || '1' },
            { label: 'Deadline', value: jobData?.applicationDeadline ? new Date(jobData.applicationDeadline).toLocaleDateString('en-IN') : 'N/A' }
          ]
        };

      case 'student':
        return {
          title: jobData?.collegeUniversityDetails?.collegeName || jobData?.company || 'Opportunity',
          subtitle: `${jobData?.jobType || 'Job'} • For Students`,
          mainHeading: jobData?.jobTitle || jobData?.jobRoles || 'Position',
          description: jobData?.description || 'No description available',
          metaInfo: [
            { label: 'Stipend', value: jobData?.stipend || jobData?.salary || 'Not specified' },
            { label: 'Duration', value: jobData?.internshipDuration || 'Not specified' },
            { label: 'Apply By', value: jobData?.lastDateToApply ? new Date(jobData.lastDateToApply).toLocaleDateString('en-IN') : 'N/A' }
          ]
        };

      case 'fresher':
        return {
          title: jobData?.company || jobData?.collegeUniversityDetails?.collegeName || 'Opportunity',
          subtitle: 'Entry Level • Fresher Friendly',
          mainHeading: jobData?.jobTitle || jobData?.jobRoles || 'Fresher Job',
          description: jobData?.description || 'No description available',
          metaInfo: [
            { label: 'Eligibility', value: jobData?.eligibility || 'Graduate' },
            { label: 'Skills', value: normalizeArrayField(jobData?.requiredSkills) },
            { label: 'Location', value: resolveLocation() }
          ]
        };

      default:
        return {
          title: jobData?.company || jobData?.collegeUniversityDetails?.collegeName || 'Job',
          subtitle: 'Career Opportunity',
          mainHeading: jobData?.jobTitle || jobData?.jobRoles || 'Position',
          description: jobData?.description || 'No description available',
          metaInfo: []
        };
    }
  };

  const displayData = getDisplayData();

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
          {/* Dynamic title based on user type */}
          <h2 className="text-xl font-bold">{displayData.title}</h2>

          {/* Subtitle based on user type */}
          <p className="text-sm text-gray-500 mb-1">{displayData.subtitle}</p>

          {/* Location and job type info (common for all) */}
          <div className="flex text-sm text-gray-500 mb-2">
            <span>{resolveLocation()}</span>
            <span className="mx-2">•</span>
            <span>{normalizeArrayField(jobData?.employmentType)}</span>
            <span className="mx-2">•</span>
            <span>{normalizeArrayField(jobData?.workMode)}</span>
          </div>

          {/* Main heading */}
          <h3 className="font-bold text-xl capitalize">{displayData.mainHeading}</h3>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-600 line-clamp-3 capitalize">
            {displayData.description}
          </p>

          {/* Dynamic meta information based on user type */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {displayData.metaInfo.map((info, index) => (
              info.value !== 'N/A' && info.value !== 'Not specified' && (
                <div key={index} className="bg-gray-100 px-2 py-1 rounded">
                  <span className="font-semibold">{info.label}:</span> {info.value}
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;