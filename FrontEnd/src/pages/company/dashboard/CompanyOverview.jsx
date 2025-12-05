// import { Globe, Users, Calendar, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

export default function CompanyOverview({ profileData }) {
  if (!profileData) return <div className="text-center py-8">No profile data available for overview.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8">
        {/* Company Description Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-3">
            Company Description
          </h2>
          <p className="text-gray-700 leading-relaxed p-4 bg-gradient-to-r from-[#667eea]/5 to-transparent rounded-xl">
            {profileData.companyDetails.description || 'No description provided'}
          </p>
        </div>

        {/* Main Details Grid */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Company Details Section */}
          <div className="grid md:grid-cols-2 border-b border-gray-100">
            {/* Company Details - Left Side */}
            <div className="p-6 border-r border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#667eea" className="w-5 h-5">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Company Details</h3>
              </div>
              <p className="text-gray-700 text-sm p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg">
                {profileData.companyDetails.description || 'No additional details provided'}
              </p>
            </div>

            {/* Company Type Info - Right Side */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="font-medium text-gray-600">Company Type:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.companyType || '-'}
                </div>

                <div className="font-medium text-gray-600">Industry Type:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.industryType || '-'}
                </div>

                <div className="font-medium text-gray-600">Employees:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.numberOfEmployees || '-'}
                </div>

                <div className="font-medium text-gray-600">Established:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.establishedYear || '-'}
                </div>

                <div className="font-medium text-gray-600">Website:</div>
                <div className="col-span-2 font-medium text-blue-600 bg-gradient-to-r from-blue-50 to-white px-3 py-2 rounded">
                  {profileData.companyDetails.websiteUrl ? (
                    <a href={profileData.companyDetails.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {profileData.companyDetails.websiteUrl}
                    </a>
                  ) : '-'}
                </div>

                <div className="font-medium text-gray-600">LinkedIn:</div>
                <div className="col-span-2 font-medium text-blue-600 bg-gradient-to-r from-blue-50 to-white px-3 py-2 rounded">
                  {profileData.companyDetails.companyLinkedin ? (
                    <a href={profileData.companyDetails.companyLinkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {profileData.companyDetails.companyLinkedin}
                    </a>
                  ) : '-'}
                </div>

                <div className="font-medium text-gray-600">Email:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  {profileData.userId?.email || '-'}
                </div>

                <div className="font-medium text-gray-600">Phone:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.phoneNumber || '-'}
                </div>

                <div className="font-medium text-gray-600">Alt Phone:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.alternatePhoneNumber || '-'}
                </div>

                <div className="font-medium text-gray-600">Country:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.country || '-'}
                </div>

                <div className="font-medium text-gray-600">State:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.state || '-'}
                </div>

                <div className="font-medium text-gray-600">City:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.city || '-'}
                </div>

                <div className="font-medium text-gray-600">Pincode:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  {profileData.companyDetails.pincode || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Hiring Preferences Section */}
          <div className="grid md:grid-cols-2 border-b border-gray-100">
            {/* Hiring Preferences - Left Side */}
            <div className="p-6 border-r border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Hiring Preferences</h3>
              </div>
              <p className="text-gray-700 text-sm p-3 bg-gradient-to-r from-yellow-50 to-white rounded-lg">
                {profileData.hiringPreferences.hiringPara || 'No hiring preferences description provided'}
              </p>
            </div>

            {/* Hiring Preferences - Right Side */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hiring Information</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="font-medium text-gray-600">Job Roles:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  {profileData.hiringPreferences.jobRoles?.join(', ') || '-'}
                </div>

                <div className="font-medium text-gray-600">Hiring Locations:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  {profileData.hiringPreferences.hiringLocations?.join(', ') || '-'}
                </div>

                <div className="font-medium text-gray-600">Looking for:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded">
                  {profileData.hiringPreferences.lookingFor || '-'}
                </div>

                <div className="font-medium text-gray-600">Employment type:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  {profileData.hiringPreferences.employmentType?.join(', ') || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* KYC Compliance Details Section */}
          <div className="grid md:grid-cols-2">
            {/* KYC Compliance - Left Side */}
            <div className="p-6 border-r border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">KYC Compliance Details</h3>
              </div>
              <p className="text-gray-700 text-sm p-3 bg-gradient-to-r from-green-50 to-white rounded-lg">
                {profileData.kycDetails.additionalInfo || 'No KYC details description provided'}
              </p>
            </div>

            {/* KYC Compliance - Right Side */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">KYC Information</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="font-medium text-gray-600">KYC Status:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  <span className={`px-2 py-1 rounded-full text-xs ${profileData.kycDetails.kycStatus === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {profileData.kycDetails.kycStatus || '-'}
                  </span>
                </div>

                <div className="font-medium text-gray-600">Photo Verification:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  <span className={`px-2 py-1 rounded-full text-xs ${profileData.kycDetails.photoVerificationStatus === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {profileData.kycDetails.photoVerificationStatus || '-'}
                  </span>
                </div>

                <div className="font-medium text-gray-600">TAN:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded">
                  {profileData.kycDetails.TAN || '-'}
                </div>

                <div className="font-medium text-gray-600">GST Number:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  {profileData.kycDetails.GSTNumber || '-'}
                </div>

                <div className="font-medium text-gray-600">Company Reg:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  {profileData.kycDetails.companyRegistrationNumber || '-'}
                </div>

                <div className="font-medium text-gray-600">GSTIN:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded">
                  {profileData.kycDetails.GSTIN || '-'}
                </div>

                <div className="font-medium text-gray-600">KYC Documents:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  {profileData.kycDetails.kycDocuments && profileData.kycDetails.kycDocuments.length > 0 ? (
                    <div className="space-y-1">
                      {profileData.kycDetails.kycDocuments.map((docUrl, index) => (
                        <a key={index} href={docUrl} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline block px-2 py-1 bg-blue-50 rounded">
                          Document {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}