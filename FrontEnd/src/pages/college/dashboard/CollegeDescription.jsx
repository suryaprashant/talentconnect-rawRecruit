import React from 'react';

export default function CollegeDescription({ onboardingData }) {
  // Destructure relevant data with default empty objects/arrays
  const collegeUniversityDetails = onboardingData?.collegeUniversityDetails || {};
  const placementCoordinatorDetails = onboardingData?.placementCoordinatorDetails || {};
  const placementRecruitmentDetails = onboardingData?.placementRecruitmentDetails || {};
  const profileAchievements = onboardingData?.profileAchievements || {};

  const formatProgramsOffered = (programs) => {
    return programs && programs.length > 0 ? programs.join(', ') : 'Not Set';
  };

  const formatPreferredHiringCompanies = (companies) => {
    return companies && companies.length > 0 ? companies.join(', ') : 'Not Set';
  };

  const formatRecruitmentServices = (services) => {
    return services && services.length > 0 ? services.join(', ') : 'Not Set';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Page Header */}
        <div className="mb-8 -mt-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex items-center justify-between py-6 px-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                  College Description
                </h1>
              </div>
              {/* <div className="w-full max-w-md">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search college details..."
                    className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none shadow-sm"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden mb-8">
          {/* Section 1: College/University Details */}
          <div className="flex flex-wrap border-b border-gray-200/50 p-6 hover:bg-gradient-to-r from-[#93c5fd]/5 to-transparent transition-all duration-300">
            {/* Left Column - Title and Description */}
            <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#3b82f6]">
                    <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                    <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                    <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                  </svg>
                </span>
                College/University Details
              </h2>
              <p className="text-sm text-gray-600">
                Information about your institution, its location, and contact details.
              </p>
            </div>

            {/* Right Column - Details */}
            <div className="w-full md:w-1/2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">College/University Name :</div>
                  <div className="text-sm text-gray-900">{collegeUniversityDetails.collegeName || 'Not Set'}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Established Year :</div>
                  <div className="text-sm text-gray-900">
                    {collegeUniversityDetails.establishedYear ?
                      new Date(collegeUniversityDetails.establishedYear).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not Set'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">College Website URL :</div>
                  <div className="text-sm">
                    {profileAchievements.collegeWebsite ?
                      <a href={profileAchievements.collegeWebsite} target="_blank" rel="noopener noreferrer" 
                         className="text-[#3b82f6] hover:text-[#1d4ed8] hover:underline transition-colors duration-200">
                        {profileAchievements.collegeWebsite}
                      </a>
                      : 'Not Set'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Phone Number :</div>
                  <div className="text-sm text-gray-900">{collegeUniversityDetails.phoneNumber || 'Not Set'}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Alternate Phone Number :</div>
                  <div className="text-sm text-gray-900">{collegeUniversityDetails.alternatePhoneNumber || 'Not Set'}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">College Location :</div>
                  <div className="text-sm text-gray-900">
                    {collegeUniversityDetails.collegeLocation || 'Not Set'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Region :</div>
                  <div className="text-sm text-gray-900">
                    {[collegeUniversityDetails.city, collegeUniversityDetails.state, collegeUniversityDetails.country]
                      .filter(Boolean)
                      .join(', ') || 'Not Set'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Pincode :</div>
                  <div className="text-sm text-gray-900">{collegeUniversityDetails.pincode || 'Not Set'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Placement Coordinator Details */}
          <div className="flex flex-wrap border-b border-gray-200/50 p-6 hover:bg-gradient-to-r from-[#f9a8d4]/5 to-transparent transition-all duration-300">
            {/* Left Column - Title and Description */}
            <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#f9a8d4]/30 to-[#ec4899]/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#ec4899]">
                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                    <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                  </svg>
                </span>
                Placement Coordinator Details
              </h2>
              <p className="text-sm text-gray-600">
                Key contact information for the college's placement and recruitment activities.
              </p>
            </div>

            {/* Right Column - Details */}
            <div className="w-full md:w-1/2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Coordinator Name :</div>
                  <div className="text-sm text-gray-900">{placementCoordinatorDetails.coordinatorName || 'Not Set'}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Designation :</div>
                  <div className="text-sm text-gray-900">{placementCoordinatorDetails.designation || 'Not Set'}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Official Email ID :</div>
                  <div className="text-sm">
                    {placementCoordinatorDetails.officialEmail ?
                      <a href={`mailto:${placementCoordinatorDetails.officialEmail}`} 
                         className="text-[#3b82f6] hover:text-[#1d4ed8] hover:underline transition-colors duration-200">
                        {placementCoordinatorDetails.officialEmail}
                      </a>
                      : 'Not Set'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Official Contact Number :</div>
                  <div className="text-sm text-gray-900">{placementCoordinatorDetails.officialMobile || 'Not Set'}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">LinkedIn Profile :</div>
                  <div className="text-sm">
                    {placementCoordinatorDetails.linkedinUrl ?
                      <a href={placementCoordinatorDetails.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-[#3b82f6] hover:text-[#1d4ed8] hover:underline transition-colors duration-200">
                        {placementCoordinatorDetails.linkedinUrl}
                      </a>
                      : 'Not Set'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Placement & Recruitment Details */}
          <div className="flex flex-wrap p-6 hover:bg-gradient-to-r from-[#a7f3d0]/5 to-transparent transition-all duration-300">
            {/* Left Column - Title and Description */}
            <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#a7f3d0]/30 to-[#10b981]/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#10b981]">
                    <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                  </svg>
                </span>
                Placement & Recruitment Details
              </h2>
              <p className="text-sm text-gray-600">
                Information regarding academic programs, recruitment preferences, and services.
              </p>
            </div>

            {/* Right Column - Details */}
            <div className="w-full md:w-1/2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Programs Offered :</div>
                  <div className="text-sm text-gray-900">{formatProgramsOffered(placementRecruitmentDetails.programsOffered)}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Preferred Hiring Companies :</div>
                  <div className="text-sm text-gray-900">{formatPreferredHiringCompanies(placementRecruitmentDetails.preferredHiringCompanies)}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Recruitment Services Required :</div>
                  <div className="text-sm text-gray-900">{formatRecruitmentServices(placementRecruitmentDetails.recruitmentServicesRequired)}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">College Brochure :</div>
                  <div className="text-sm">
                    {placementRecruitmentDetails.collegeBrochureUrl ?
                      <a href={placementRecruitmentDetails.collegeBrochureUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-[#3b82f6] hover:text-[#1d4ed8] hover:underline transition-colors duration-200">
                        View Brochure
                      </a>
                      : 'No Brochure Uploaded'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}