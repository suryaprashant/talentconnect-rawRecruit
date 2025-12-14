import React from 'react';
import { User, Briefcase, Mail, Phone, Linkedin, MapPin, Calendar, Users, Globe, Building2 } from 'lucide-react';

export default function Overview() {
  return (
    <div className="flex flex-col w-full bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        {/* Company Description Card */}
        <div className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl mr-3">
              <Building2 className="w-5 h-5 text-[#667eea]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Company Description</h2>
              <p className="text-sm text-gray-600">An overview of your company's mission and values</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-[#667eea]/5 to-transparent rounded-xl">
            <p className="text-gray-700 leading-relaxed">
              No company description available. You can add one in the Profile section.
            </p>
          </div>
        </div>

        {/* Your Details Card */}
        {/* <div className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl mr-3">
                <User className="w-5 h-5 text-[#667eea]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Your Details</h3>
                <p className="text-sm text-gray-600">Your contact information as the primary recruiter</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl">
              <p className="text-gray-700">
                This section displays your contact information as the primary recruiter.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  emp
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  HR Manager
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-500 mr-2" />
                    emp@gmail.com
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-500 mr-2" />
                    1234567890
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50">
                  <div className="text-gray-400">Not provided</div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Company Details Card */}
        <div className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl mr-3">
                <Briefcase className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Company Details</h3>
                <p className="text-sm text-gray-600">Information about your company and location</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl">
              <p className="text-gray-700">
                Information about your company, its location, and industry.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  Tech Corp
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Location</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-500 mr-2" />
                    -
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  Northern Territory
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  Darwin
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  Australia
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  123456
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  -
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  -
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-500 mr-2" />
                    -
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-500 mr-2" />
                    -
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hiring Preferences Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hiring Preferences</h3>
                <p className="text-sm text-gray-600">Define your hiring needs and preferred criteria</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-white rounded-xl">
              <p className="text-gray-700">
                This section outlines the types of roles and employment your company is seeking.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Roles</label>
                <div className="border border-gray-200 rounded-xl p-3 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] px-3 py-1.5 rounded-full text-sm font-medium">
                      software_engineer
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Locations</label>
                <div className="border border-gray-200 rounded-xl p-3 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 text-[#f093fb] px-3 py-1.5 rounded-full text-sm font-medium">
                      Abhaneri
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Looking for</label>
                <div className="border border-gray-200 rounded-xl p-3 bg-gradient-to-r from-gray-50 to-white text-gray-700">
                  job
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment type</label>
                <div className="border border-gray-200 rounded-xl p-3 bg-gradient-to-r from-gray-50 to-white">
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