import { useState } from 'react';
import { Mail, Phone, Upload, Globe, Linkedin } from 'lucide-react';

export default function EmployerProfileForm() {
  const [activeTab, setActiveTab] = useState('Profile');
  
  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen">
      {/* Navigation Tabs */}

      
      {/* Main Content */}
      <div className="container mx-auto py-6 px-4">
        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">About</h2>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
          </p>
        </div>
        
        {/* Main Form Sections */}
        <div className="bg-white border rounded-md">
          {/* Company Details Section */}
          <div className="border-b">
            <div className="grid md:grid-cols-12 gap-4 p-6">
              <div className="md:col-span-3">
                <h3 className="font-bold mb-2">Company Details</h3>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
                </p>
              </div>
              
              <div className="md:col-span-9">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Placeholder</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-1">
                      <a href="#" className="text-indigo-600 text-sm">Register Your Company</a>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 p-2 rounded" 
                      rows="4"
                      placeholder="Type your message..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Company Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Placeholder</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Industry Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Placeholder</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Number of Employees <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Placeholder</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Established Year <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Placeholder</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone size={16} className="text-gray-500" />
                      </div>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 pl-10 rounded"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Alternate Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone size={16} className="text-gray-500" />
                      </div>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 pl-10 rounded"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Company Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Placeholder</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">State</label>
                      <div className="relative">
                        <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                          <option>Placeholder</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium">City</label>
                      <div className="relative">
                        <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                          <option>Placeholder</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium">Country</label>
                      <div className="relative">
                        <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                          <option>Placeholder</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium">Pincode</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 rounded"
                        placeholder="Placeholder"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t">
              <button className="bg-black text-white px-6 py-2">Edit</button>
            </div>
          </div>
          
          {/* Employer Details Section */}
          <div className="border-b">
            <div className="grid md:grid-cols-12 gap-4 p-6">
              <div className="md:col-span-3">
                <h3 className="font-bold mb-2">Employer Details</h3>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
                </p>
              </div>
              
              <div className="md:col-span-9">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Enter your name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <button className="bg-gray-100 border border-gray-300 text-sm px-4 py-1 rounded">
                        Upload a new photo
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Placeholder</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Enter your work email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail size={16} className="text-gray-500" />
                      </div>
                      <input 
                        type="email" 
                        className="w-full border border-gray-300 p-2 pl-10 rounded"
                        placeholder="hello@xyz.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Enter your mobile no. <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone size={16} className="text-gray-500" />
                      </div>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 pl-10 rounded"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">LinkedIn Profile</label>
                    <div className="flex">
                      <div className="bg-gray-100 border border-gray-300 p-2 rounded-l">http://</div>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 rounded-r"
                        placeholder="www.resume.io"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t">
              <button className="bg-black text-white px-6 py-2">Edit</button>
            </div>
          </div>
          
          {/* Hiring Preferences Section */}
          <div className="border-b">
            <div className="grid md:grid-cols-12 gap-4 p-6">
              <div className="md:col-span-3">
                <h3 className="font-bold mb-2">Hiring Preferences</h3>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
                </p>
              </div>
              
              <div className="md:col-span-9">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Job Roles You Hire For</label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Multiple-select</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Preferred Hiring Locations</label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Multiple-select</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Looking for</label>
                    <div className="flex gap-2">
                      <button className="border border-gray-300 px-4 py-1 text-sm">Job</button>
                      <button className="bg-black text-white px-4 py-1 text-sm">Internship</button>
                      <button className="border border-gray-300 px-4 py-1 text-sm">Both</button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Employment type</label>
                    <div className="flex gap-2">
                      <button className="border border-gray-300 px-4 py-1 text-sm">Part-time</button>
                      <button className="bg-black text-white px-4 py-1 text-sm">Full-time</button>
                      <button className="border border-gray-300 px-4 py-1 text-sm">Contract</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t">
              <button className="bg-black text-white px-6 py-2">Edit</button>
            </div>
          </div>
          
          {/* Company Verification & KYC Section */}
          <div className="border-b">
            <div className="grid md:grid-cols-12 gap-4 p-6">
              <div className="md:col-span-3">
                <h3 className="font-bold mb-2">Company Verification & KYC</h3>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
                </p>
              </div>
              
              <div className="md:col-span-9">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Upload Verification Documents (Choose any one for verification)</label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none">
                        <option>Multiple-select</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-center">
                      <button className="border border-gray-300 px-4 py-1 text-sm flex items-center gap-1">
                        <Upload size={14} />
                        Upload Document
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">TAN (Tax Deduction and Collection Account Number)</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="10-digit alphanumeric"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">GST Number</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="15-digit alphanumeric"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Company Registration Number (CIN/LLPIN)</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="21-digit alphanumeric"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t">
              <button className="bg-black text-white px-6 py-2">Edit</button>
            </div>
          </div>
          
          {/* Company Profiles Section */}
          <div>
            <div className="grid md:grid-cols-12 gap-4 p-6">
              <div className="md:col-span-3">
                <h3 className="font-bold mb-2">Company Profiles</h3>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
                </p>
              </div>
              
              <div className="md:col-span-9">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 mb-1 text-sm font-medium">
                      <Linkedin size={18} className="text-blue-700" />
                      LinkedIn
                    </label>
                    <div className="flex">
                      <div className="bg-gray-100 border border-gray-300 p-2 rounded-l">https://</div>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 rounded-r"
                        placeholder="www.resume.io"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 mb-1 text-sm font-medium">
                      <Globe size={18} className="text-gray-700" />
                      Website
                    </label>
                    <div className="flex">
                      <div className="bg-gray-100 border border-gray-300 p-2 rounded-l">https://</div>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 rounded-r"
                        placeholder="www.resume.io"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t">
              <button className="bg-black text-white px-6 py-2">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}