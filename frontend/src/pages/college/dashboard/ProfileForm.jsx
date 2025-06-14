import { useState } from 'react';

export default function ProfileForm() {
  const [activeTab, setActiveTab] = useState('about');
  
  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">About</h1>
          <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
        </div>
        
        {/* College/University Details */}
        <div className="border border-gray-300 rounded-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">College/University Details</h2>
          <p className="text-sm text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">College Name *</label>
              <input type="text" placeholder="Placeholder" className="w-full border border-gray-300 rounded p-2" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">College Location *</label>
              <select className="w-full border border-gray-300 rounded p-2 bg-white">
                <option>Placeholder</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input type="text" placeholder="Placeholder" className="w-full border border-gray-300 rounded p-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input type="text" placeholder="Placeholder" className="w-full border border-gray-300 rounded p-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input type="text" placeholder="Placeholder" className="w-full border border-gray-300 rounded p-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Pincode</label>
              <input type="text" placeholder="Placeholder" className="w-full border border-gray-300 rounded p-2" />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button className="bg-black text-white px-4 py-2 rounded">Edit</button>
          </div>
        </div>
        
        {/* Placement Coordinator Details */}
        <div className="border border-gray-300 rounded-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Placement Coordinator Details</h2>
          <p className="text-sm text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Coordinator name *</label>
              <input type="text" placeholder="Placeholder" className="w-full border border-gray-300 rounded p-2" />
            </div>
            
            <div className="md:col-span-2 flex justify-center">
              <div className="mb-4 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <button className="bg-white border border-gray-300 text-sm px-4 py-1 rounded">Upload a new photo</button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Designation *</label>
              <select className="w-full border border-gray-300 rounded p-2 bg-white">
                <option>Placeholder</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Official email ID *</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </span>
                <input type="email" placeholder="hello@xyz.com" className="flex-1 border border-gray-300 rounded-r-md p-2" />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">official mobile no. *</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </span>
                <input type="tel" placeholder="1234567890" className="flex-1 border border-gray-300 rounded-r-md p-2" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button className="bg-black text-white px-4 py-2 rounded">Edit</button>
          </div>
        </div>
        
        {/* Placement & Recruitment Details */}
        <div className="border border-gray-300 rounded-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Placement & Recruitment Details</h2>
          <p className="text-sm text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Programs Offered</label>
              <select className="w-full border border-gray-300 rounded p-2 bg-white">
                <option>Multiple-select</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Popular Courses for Recruitment</label>
              <select className="w-full border border-gray-300 rounded p-2 bg-white">
                <option>Multiple-select</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Hiring Companies</label>
              <select className="w-full border border-gray-300 rounded p-2 bg-white">
                <option>Multiple-select</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Recruitment Services Required?</label>
              <div className="flex flex-wrap gap-2 mt-2">
                <button className="border border-gray-300 px-3 py-1 rounded text-sm">Job Fairs</button>
                <button className="bg-black text-white px-3 py-1 rounded text-sm">Internship Support</button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm">Company Tie-ups</button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm">All</button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Upload College Brochure</label>
              <div className="mt-1 flex">
                <input type="file" id="file-upload" className="hidden" />
                <label htmlFor="file-upload" className="cursor-pointer flex-1 border border-gray-300 rounded p-2 bg-white flex justify-between items-center">
                  <span className="text-gray-500">Upload PDF</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button className="bg-black text-white px-4 py-2 rounded">Edit</button>
          </div>
        </div>
        
        {/* College Profile & Achievements */}
        <div className="border border-gray-300 rounded-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">College Profile & Achievements</h2>
          <p className="text-sm text-gray-600 mb-6">Showcase your institution's key highlights, achievements, and online presence!</p>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">College Website *</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  http://
                </span>
                <input type="text" placeholder="www.institute.io" className="flex-1 border border-gray-300 rounded-r-md p-2" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  http://
                </span>
                <input type="text" placeholder="www.linkedin.in" className="flex-1 border border-gray-300 rounded-r-md p-2" />
              </div>
            </div>
          </div>
          
          {/* Workshop & Training Programs */}
          <div className="mt-8">
            <h3 className="text-md font-medium mb-4">Workshop & Training Programs</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Workshop Name *</label>
                <input type="text" placeholder="Placeholder" className="w-full border border-gray-300 rounded p-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <select className="w-full border border-gray-300 rounded p-2 bg-white">
                    <option>Placeholder</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <select className="w-full border border-gray-300 rounded p-2 bg-white">
                    <option>Placeholder</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" placeholder="Description" className="w-full border border-gray-300 rounded p-2" />
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <button className="text-purple-600 text-sm">Add workshop</button>
            </div>
          </div>
          
          {/* Volunteering & Community Engagement */}
          <div className="mt-8">
            <h3 className="text-md font-medium mb-4">Volunteering & Community Engagement</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input type="text" placeholder="Placeholder" className="w-full border border-gray-300 rounded p-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <select className="w-full border border-gray-300 rounded p-2 bg-white">
                    <option>Placeholder</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <select className="w-full border border-gray-300 rounded p-2 bg-white">
                    <option>Placeholder</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" placeholder="Description" className="w-full border border-gray-300 rounded p-2" />
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <button className="text-purple-600 text-sm">Add volunteering experience</button>
            </div>
          </div>
          
          {/* Awards & Recognitions */}
          <div className="mt-8">
            <h3 className="text-md font-medium mb-4">Awards & Recognitions</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Award Title *</label>
                <input type="text" placeholder="Placeholder" className="w-full border border-gray-300 rounded p-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <select className="w-full border border-gray-300 rounded p-2 bg-white">
                    <option>Placeholder</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <select className="w-full border border-gray-300 rounded p-2 bg-white">
                    <option>Placeholder</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Awarding Organization *</label>
                <select className="w-full border border-gray-300 rounded p-2 bg-white">
                  <option>Placeholder</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <button className="text-purple-600 text-sm">Add award</button>
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <button className="bg-black text-white px-4 py-2 rounded">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}