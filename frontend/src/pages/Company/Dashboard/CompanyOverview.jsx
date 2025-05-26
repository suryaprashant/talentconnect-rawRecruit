import { useState } from 'react';
import { Globe, Users, Calendar, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState('Overview');
  
  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen">
      {/* Header and Navigation */}
      {/* <div className="bg-white shadow mb-4">
        <div className="flex border-b">
          {['Overview', 'Profile', 'Users'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 ${activeTab === tab ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div> */}
      
      {/* Content Area */}
      <div className="container mx-auto px-4 pb-8">
        {/* Company Description */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Company Description</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
          </p>
        </div>
        
        {/* Main Details Grid */}
        <div className="bg-white border border-gray-200 rounded mb-6">
          <div className="grid md:grid-cols-2 border-b">
            {/* Company Details - Left Side */}
            <div className="p-6 border-r">
              <h3 className="font-bold mb-3">Company Details</h3>
              <p className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
              </p>
            </div>
            
            {/* Company Type Info - Right Side */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">Company Type:</div>
                <div className="col-span-2">Corporate/House</div>
                
                <div className="font-medium">Industry Type:</div>
                <div className="col-span-2">IT Services & Consulting</div>
                
                <div className="font-medium">Number of Employees:</div>
                <div className="col-span-2">11 - 50</div>
                
                <div className="font-medium">Established Year:</div>
                <div className="col-span-2">July 1, 2023</div>
                
                <div className="font-medium">Website URL:</div>
                <div className="col-span-2">-</div>
                
                <div className="font-medium">Company LinkedIn:</div>
                <div className="col-span-2">-</div>
                
                <div className="font-medium">Phone Number:</div>
                <div className="col-span-2">1234567890</div>
                
                <div className="font-medium">Alternate Phone Number:</div>
                <div className="col-span-2">-</div>
                
                <div className="font-medium">Company Location:</div>
                <div className="col-span-2">-</div>
                
                <div className="font-medium">Pincode:</div>
                <div className="col-span-2">-</div>
              </div>
            </div>
          </div>
          
          {/* Employee Details Section */}
          <div className="grid md:grid-cols-2 border-b">
            {/* Employee Details - Left Side */}
            <div className="p-6 border-r">
              <h3 className="font-bold mb-3">Employee Details</h3>
              <p className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
              </p>
            </div>
            
            {/* Employee Details - Right Side */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">Employee Name:</div>
                <div className="col-span-2">Priyanka Pandhi</div>
                
                <div className="font-medium">Designation:</div>
                <div className="col-span-2">Product Designer</div>
                
                <div className="font-medium">Work Email:</div>
                <div className="col-span-2">priyanka.telkommen@gmail.com</div>
                
                <div className="font-medium">Phone Number:</div>
                <div className="col-span-2">1234567890</div>
                
                <div className="font-medium">LinkedIn Profile:</div>
                <div className="col-span-2">-</div>
              </div>
            </div>
          </div>
          
          {/* Hiring Preferences Section */}
          <div className="grid md:grid-cols-2 border-b">
            {/* Hiring Preferences - Left Side */}
            <div className="p-6 border-r">
              <h3 className="font-bold mb-3">Hiring Preferences</h3>
              <p className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
              </p>
            </div>
            
            {/* Hiring Preferences - Right Side */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">Job Roles:</div>
                <div className="col-span-2">-</div>
                
                <div className="font-medium">Hiring Locations:</div>
                <div className="col-span-2">-</div>
                
                <div className="font-medium">Looking for:</div>
                <div className="col-span-2">Internship</div>
                
                <div className="font-medium">Employment type:</div>
                <div className="col-span-2">Full-time</div>
              </div>
            </div>
          </div>
          
          {/* KYC Compliance Details Section */}
          <div className="grid md:grid-cols-2">
            {/* KYC Compliance - Left Side */}
            <div className="p-6 border-r">
              <h3 className="font-bold mb-3">KYC Compliance Details</h3>
              <p className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
              </p>
            </div>
            
            {/* KYC Compliance - Right Side */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">KYC Status:</div>
                <div className="col-span-2">APPROVED</div>
                
                <div className="font-medium">Photo Verification Status:</div>
                <div className="col-span-2">APPROVED</div>
                
                <div className="font-medium">Aadhar Number:</div>
                <div className="col-span-2">XXXX-XXXX-XXXX-5676</div>
                
                <div className="font-medium">Name on Aadhar Card:</div>
                <div className="col-span-2">Priyanka Pandhi</div>
                
                <div className="font-medium">Address Label:</div>
                <div className="col-span-2">Primary Address</div>
                
                <div className="font-medium">Address:</div>
                <div className="col-span-2">parikyahospital@purusahulkec</div>
                
                <div className="font-medium">Country:</div>
                <div className="col-span-2">India</div>
                
                <div className="font-medium">State:</div>
                <div className="col-span-2">Karnataka</div>
                
                <div className="font-medium">City:</div>
                <div className="col-span-2">Bangalore</div>
                
                <div className="font-medium">Pincode:</div>
                <div className="col-span-2">564578</div>
                
                <div className="font-medium">GSTIN:</div>
                <div className="col-span-2">Unregistered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}