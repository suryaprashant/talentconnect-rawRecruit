import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyDetails } from '@/constants/collegedashboard/jobData';
import { MapPin, Building, Calendar, Globe, Download, Mail, Phone, CheckCircle, Info } from 'lucide-react';

const PoolJobDetailsPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  
  useEffect(() => {
    if (id && companyDetails[id]) {
      setCompany(companyDetails[id]);
    }
  }, [id]);
  
  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Job not found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/college-dashboard/pool-campus-opportunities" className="text-blue-600 hover:text-blue-800">
            Back to job listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
  {/* Back to listings link with better styling */}
  <div className="bg-white border-b border-gray-200 py-3 px-4">
    <Link 
      to="/college-dashboard/pool-campus-opportunities" 
      className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-1" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
          clipRule="evenodd" 
        />
      </svg>
      Back to job listings
    </Link>
  </div>

  <div className="container mx-auto px-4 py-6">
    {/* Registration Open Banner */}
    <div className="bg-green-50 text-green-800 py-2 px-4 text-sm mb-6 rounded-md flex items-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 mr-2" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
          clipRule="evenodd" 
        />
      </svg>
      Registration Open
    </div>
    {/* Rest of your content */}
  

        
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Company Info */}
            <div className="flex items-start mb-4 md:mb-0">
              <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                <img
                  src="https://via.placeholder.com/56"
                  alt={`${company.companyName} logo`}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-600">{company.registrationDates}</p>
                </div>
                <div className="flex items-center mt-1">
                  <Globe className="h-4 w-4 text-gray-500 mr-2" />
                  <a 
                    href={`https://${company.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {company.website}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition duration-200">
                Register Now
              </button>
              <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                Save
              </button>
              <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                Share
              </button>
            </div>
          </div>
        </div>
        
        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Employees</p>
            <p className="text-xl font-semibold">{company.stats.employees}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Revenue</p>
            <p className="text-xl font-semibold">{company.stats.revenue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Industries</p>
            <p className="text-xl font-semibold">{company.stats.industries}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Countries</p>
            <p className="text-xl font-semibold">{company.stats.countries}</p>
          </div>
        </div>
        
        {/* Program Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Program Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2">
                {company.programDetails.eligibility.map((criterion, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Compensation</h3>
              <p className="text-xl font-bold text-gray-900">{company.programDetails.compensation}</p>
              <p className="text-sm text-gray-500">Base + Benefits</p>
            </div>
          </div>
        </div>
        
        {/* About Company */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">About {company.companyName}</h2>
          <p className="text-gray-700 leading-relaxed">
            {company.aboutCompany}
          </p>
        </div>
        
        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">About The Role:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              {company.jobDescription}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Key Responsibilities:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {company.keyResponsibilities.map((responsibility, index) => (
                <li key={index} className="text-gray-700">{responsibility}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">What We're Looking For:</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Education:</p>
                <p className="text-gray-700">{company.requirements.education}</p>
              </div>
              <div>
                <p className="font-medium">Experience:</p>
                <p className="text-gray-700">{company.requirements.experience}</p>
              </div>
              <div>
                <p className="font-medium">Skills:</p>
                <p className="text-gray-700">{company.requirements.skills}</p>
              </div>
              <div>
                <p className="font-medium">Portfolio:</p>
                <p className="text-gray-700">{company.requirements.portfolio}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Required Skills */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
          
          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {company.technicalSkills.map((skill, index) => (
                <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3">Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {company.softSkills.map((skill, index) => (
                <div key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Job Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm text-gray-500">Job Role</p>
              <p className="font-medium">{company.jobDetails.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Industry Type</p>
              <p className="font-medium">{company.jobDetails.industryType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{company.jobDetails.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employment Type</p>
              <p className="font-medium">{company.jobDetails.employmentType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role Category</p>
              <p className="font-medium">{company.jobDetails.roleCategory}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Work Mode</p>
              <p className="font-medium">{company.jobDetails.workMode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Location</p>
              <p className="font-medium">{company.jobDetails.locations.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joining Date</p>
              <p className="font-medium">{company.jobDetails.joiningDate}</p>
            </div>
          </div>
        </div>
        
        {/* Eligibility Criteria */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Pool Campus Drive Open To:</h3>
            <p className="text-gray-700">{company.eligibilityCriteria.driveOpenTo}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <div>
              <h3 className="text-base font-medium mb-2">Eligible Degrees:</h3>
              <p className="text-gray-700">{company.eligibilityCriteria.eligibleDegrees.join(", ")}</p>
            </div>
            <div>
              <h3 className="text-base font-medium mb-2">Eligible Branches:</h3>
              <p className="text-gray-700">{company.eligibilityCriteria.eligibleBranches.join(", ")}</p>
            </div>
            <div>
              <h3 className="text-base font-medium mb-2">Graduation Year:</h3>
              <p className="text-gray-700">{company.eligibilityCriteria.graduationYear}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Minimum Academic Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {company.eligibilityCriteria.academicRequirements.map((requirement, index) => (
                <li key={index} className="text-gray-700">{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Compensation and Benefits */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Compensation & Benefits</h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total CTC</p>
              <p className="text-xl font-bold text-blue-900">{company.compensationBenefits.totalCTC}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Fixed Pay</p>
              <p className="text-xl font-bold text-blue-900">{company.compensationBenefits.fixedPay}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Joining Bonus</p>
              <p className="text-xl font-bold text-blue-900">{company.compensationBenefits.joiningBonus}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Benefits:</h3>
            <ul className="grid grid-cols-2 gap-2">
              {company.compensationBenefits.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Selection Process */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Selection Process</h2>
          <div className="flex items-center justify-between mb-8 relative">
            {company.selectionProcess.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  {index + 1}
                </div>
                <p className="text-xs text-center mt-2 max-w-[80px]">{step}</p>
              </div>
            ))}
            {/* Progress line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
              <div className="absolute top-0 left-0 h-full bg-blue-600" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Important Dates */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Important Dates</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="border border-gray-200 p-4 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Registration Deadline</p>
              <p className="font-medium">{company.importantDates.registrationDeadline}</p>
            </div>
            <div className="border border-gray-200 p-4 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Online Test Date</p>
              <p className="font-medium">{company.importantDates.onlineTestDate}</p>
            </div>
            <div className="border border-gray-200 p-4 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Interview Window</p>
              <p className="font-medium">{company.importantDates.interviewWindow}</p>
            </div>
            <div className="border border-gray-200 p-4 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Offer Rollout</p>
              <p className="font-medium">{company.importantDates.offerRollout}</p>
            </div>
          </div>
        </div>
        
        {/* Required Documents */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
          <ul className="space-y-2">
            {company.requiredDocuments.map((document, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{document}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* How to Apply */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">How to Apply (For Pool Drive Participants)</h2>
          <p className="text-gray-700 mb-4">{company.applicationProcess}</p>
          
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <p className="text-blue-800 font-medium mb-1">Colleges must verify student profiles and confirm participation via their placement office login.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-base font-medium mb-2">Drive Venue (If Physical Round is Conducted):</h3>
            <p className="text-gray-700 mb-2">{company.driveVenue}</p>
            <a href="#" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              View on Map
            </a>
          </div>
        </div>
        
        {/* Participating Colleges */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Participating Colleges</h2>
          <ul className="space-y-2">
            {company.participatingColleges.map((college, index) => (
              <li key={index} className="text-gray-700">• {college}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 mt-2">(And many more across South India)</p>
        </div>
        
        {/* Additional Info & Support */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Additional Info & Support</h2>
          
          <div className="space-y-4 mb-6">
            <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
              <Download className="h-5 w-5 mr-2" />
              Download Drive Details (PDF)
            </a>
            <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
              <Calendar className="h-5 w-5 mr-2" />
              Save Day to the Life at Cognizant
            </a>
            <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
              <Info className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </a>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-base font-medium mb-3">Pool Campus Placement Officer Contact:</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium mb-2">{company.contactInfo.name}</p>
              <div className="space-y-2">
                <a href={`mailto:${company.contactInfo.email}`} className="flex items-center text-blue-600 hover:text-blue-800">
                  <Mail className="h-4 w-4 mr-2" />
                  {company.contactInfo.email}
                </a>
                <a href={`tel:${company.contactInfo.phone}`} className="flex items-center text-blue-600 hover:text-blue-800">
                  <Phone className="h-4 w-4 mr-2" />
                  {company.contactInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Important Notes */}
        <div className="bg-yellow-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
          <ul className="space-y-3">
            {company.importantNotes.map((note, index) => (
              <li key={index} className="flex items-start">
                <Info className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">{note}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Note to Students */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Note to Students</h2>
          <p className="text-blue-800">
            Please keep your TalentSprint profile updated and check your registered email for test links and interview schedules. No communication will be sent via SMS or WhatsApp.
          </p>
        </div>
        
        {/* Final CTA */}
        <div className="text-center mb-8">
          <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition duration-200 text-lg font-medium">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolJobDetailsPage;