import React from 'react';
import { User, Briefcase, Mail, Phone, Linkedin, MapPin, Calendar, Users, Globe, Building2 } from 'lucide-react';

export default function Overview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8">
        {/* Company Description Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-3">
            Company Description
          </h2>
          <p className="text-gray-700 leading-relaxed p-4 bg-gradient-to-r from-[#667eea]/5 to-transparent rounded-xl">
            No company description available. You can add one in the Profile section.
          </p>
        </div>

        {/* Main Details Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Your Details Section */}
          <div className="grid md:grid-cols-2 border-b border-gray-100">
            <div className="p-6 border-r border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <User className="w-5 h-5 text-[#667eea]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Your Details</h3>
              </div>
              <p className="text-gray-700 text-sm p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg">
                Your contact information as the primary recruiter
              </p>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="font-medium text-gray-600">Name:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  emp
                </div>

                <div className="font-medium text-gray-600">Designation:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  HR Manager
                </div>

                <div className="font-medium text-gray-600">Email:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded flex items-center">
                  <Mail size={14} className="mr-2" />
                  emp@gmail.com
                </div>

                <div className="font-medium text-gray-600">Phone:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded flex items-center">
                  <Phone size={14} className="mr-2" />
                  1234567890
                </div>

                <div className="font-medium text-gray-600">LinkedIn:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-blue-50 to-white px-3 py-2 rounded">
                  <div className="text-gray-400">Not provided</div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="grid md:grid-cols-2 border-b border-gray-100">
            <div className="p-6 border-r border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg mr-3">
                  <Briefcase className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Company Details</h3>
              </div>
              <p className="text-gray-700 text-sm p-3 bg-gradient-to-r from-yellow-50 to-white rounded-lg">
                Information about your company, its location, and industry.
              </p>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="font-medium text-gray-600">Name:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  Tech Corp
                </div>

                <div className="font-medium text-gray-600">Location:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded flex items-center">
                  <MapPin size={14} className="mr-2" />
                  -
                </div>

                <div className="font-medium text-gray-600">State:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded">
                  Northern Territory
                </div>

                <div className="font-medium text-gray-600">City:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  Darwin
                </div>

                <div className="font-medium text-gray-600">Country:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  Australia
                </div>

                <div className="font-medium text-gray-600">Pincode:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded">
                  123456
                </div>

                <div className="font-medium text-gray-600">Type:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  -
                </div>

                <div className="font-medium text-gray-600">Industry:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  -
                </div>

                <div className="font-medium text-gray-600">Established:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded flex items-center">
                  <Calendar size={14} className="mr-2" />
                  -
                </div>

                <div className="font-medium text-gray-600">Contact:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded flex items-center">
                  <Phone size={14} className="mr-2" />
                  -
                </div>
              </div>
            </div>
          </div>

          {/* Hiring Preferences Section */}
          <div className="grid md:grid-cols-2">
            <div className="p-6 border-r border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Hiring Preferences</h3>
              </div>
              <p className="text-gray-700 text-sm p-3 bg-gradient-to-r from-green-50 to-white rounded-lg">
                This section outlines the types of roles and employment your company is seeking.
              </p>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hiring Information</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="font-medium text-gray-600">Job Roles:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  <span className="inline-flex bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] px-2 py-1 rounded text-xs">
                    software_engineer
                  </span>
                </div>

                <div className="font-medium text-gray-600">Locations:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#f093fb]/5 to-transparent px-3 py-2 rounded">
                  <span className="inline-flex bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 text-[#f093fb] px-2 py-1 rounded text-xs">
                    Abhaneri
                  </span>
                </div>

                <div className="font-medium text-gray-600">Looking for:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#4facfe]/5 to-transparent px-3 py-2 rounded">
                  job
                </div>

                <div className="font-medium text-gray-600">Employment type:</div>
                <div className="col-span-2 font-medium text-gray-800 bg-gradient-to-r from-[#667eea]/5 to-transparent px-3 py-2 rounded">
                  <div className="text-gray-400">Not specified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}