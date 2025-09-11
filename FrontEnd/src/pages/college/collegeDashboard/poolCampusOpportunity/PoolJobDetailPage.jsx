// // // import React, { useEffect, useState } from 'react';
// // // import { useParams, Link } from 'react-router-dom';
// // // import { companyDetails } from '@/constants/collegedashboard/jobData';
// // // import { MapPin, Building, Calendar, Globe, Download, Mail, Phone, CheckCircle, Info } from 'lucide-react';

// // // const PoolJobDetailsPage = () => {
// // //   const { id } = useParams();
// // //   const [company, setCompany] = useState(null);

// // //   useEffect(() => {
// // //     if (id && companyDetails[id]) {
// // //       setCompany(companyDetails[id]);
// // //     }
// // //   }, [id]);

// // //   if (!company) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center">
// // //         <div className="text-center">
// // //           <h2 className="text-xl font-semibold mb-2">Job not found</h2>
// // //           <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
// // //           <Link to="/college-dashboard/pool-campus-opportunities" className="text-blue-600 hover:text-blue-800">
// // //             Back to job listings
// // //           </Link>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
// // //   {/* Back to listings link with better styling */}
// // //   <div className="bg-white border-b border-gray-200 py-3 px-4">
// // //     <Link 
// // //       to="/college-dashboard/pool-campus-opportunities" 
// // //       className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
// // //     >
// // //       <svg 
// // //         xmlns="http://www.w3.org/2000/svg" 
// // //         className="h-5 w-5 mr-1" 
// // //         viewBox="0 0 20 20" 
// // //         fill="currentColor"
// // //       >
// // //         <path 
// // //           fillRule="evenodd" 
// // //           d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
// // //           clipRule="evenodd" 
// // //         />
// // //       </svg>
// // //       Back to job listings
// // //     </Link>
// // //   </div>

// // //   <div className="container mx-auto px-4 py-6">
// // //     {/* Registration Open Banner */}
// // //     <div className="bg-green-50 text-green-800 py-2 px-4 text-sm mb-6 rounded-md flex items-center">
// // //       <svg 
// // //         xmlns="http://www.w3.org/2000/svg" 
// // //         className="h-4 w-4 mr-2" 
// // //         viewBox="0 0 20 20" 
// // //         fill="currentColor"
// // //       >
// // //         <path 
// // //           fillRule="evenodd" 
// // //           d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
// // //           clipRule="evenodd" 
// // //         />
// // //       </svg>
// // //       Registration Open
// // //     </div>
// // //     {/* Rest of your content */}



// // //         {/* Company Header */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <div className="flex flex-col md:flex-row justify-between">
// // //             {/* Company Info */}
// // //             <div className="flex items-start mb-4 md:mb-0">
// // //               <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center mr-4">
// // //                 <img
// // //                   src="https://via.placeholder.com/56"
// // //                   alt={`${company.companyName} logo`}
// // //                   className="w-10 h-10 object-contain"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
// // //                 <div className="flex items-center mt-1">
// // //                   <Calendar className="h-4 w-4 text-gray-500 mr-2" />
// // //                   <p className="text-sm text-gray-600">{company.registrationDates}</p>
// // //                 </div>
// // //                 <div className="flex items-center mt-1">
// // //                   <Globe className="h-4 w-4 text-gray-500 mr-2" />
// // //                   <a 
// // //                     href={`https://${company.website}`} 
// // //                     target="_blank" 
// // //                     rel="noopener noreferrer"
// // //                     className="text-sm text-blue-600 hover:text-blue-800"
// // //                   >
// // //                     {company.website}
// // //                   </a>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Action Buttons */}
// // //             <div className="flex space-x-2">
// // //               <button className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition duration-200">
// // //                 Register Now
// // //               </button>
// // //               <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
// // //                 Save
// // //               </button>
// // //               <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
// // //                 Share
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Company Stats */}
// // //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
// // //           <div className="bg-white p-4 rounded-lg shadow-sm">
// // //             <p className="text-gray-500 text-sm mb-1">Employees</p>
// // //             <p className="text-xl font-semibold">{company.stats.employees}</p>
// // //           </div>
// // //           <div className="bg-white p-4 rounded-lg shadow-sm">
// // //             <p className="text-gray-500 text-sm mb-1">Revenue</p>
// // //             <p className="text-xl font-semibold">{company.stats.revenue}</p>
// // //           </div>
// // //           <div className="bg-white p-4 rounded-lg shadow-sm">
// // //             <p className="text-gray-500 text-sm mb-1">Industries</p>
// // //             <p className="text-xl font-semibold">{company.stats.industries}</p>
// // //           </div>
// // //           <div className="bg-white p-4 rounded-lg shadow-sm">
// // //             <p className="text-gray-500 text-sm mb-1">Countries</p>
// // //             <p className="text-xl font-semibold">{company.stats.countries}</p>
// // //           </div>
// // //         </div>

// // //         {/* Program Details */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Program Details</h2>
// // //           <div className="grid md:grid-cols-2 gap-6">
// // //             <div>
// // //               <ul className="space-y-2">
// // //                 {company.programDetails.eligibility.map((criterion, index) => (
// // //                   <li key={index} className="flex items-start">
// // //                     <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
// // //                     <span className="text-gray-700">{criterion}</span>
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //             </div>
// // //             <div>
// // //               <h3 className="text-lg font-medium mb-2">Compensation</h3>
// // //               <p className="text-xl font-bold text-gray-900">{company.programDetails.compensation}</p>
// // //               <p className="text-sm text-gray-500">Base + Benefits</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* About Company */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">About {company.companyName}</h2>
// // //           <p className="text-gray-700 leading-relaxed">
// // //             {company.aboutCompany}
// // //           </p>
// // //         </div>

// // //         {/* Job Description */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Description</h2>

// // //           <div className="mb-6">
// // //             <h3 className="text-lg font-medium mb-2">About The Role:</h3>
// // //             <p className="text-gray-700 leading-relaxed mb-4">
// // //               {company.jobDescription}
// // //             </p>
// // //           </div>

// // //           <div className="mb-6">
// // //             <h3 className="text-lg font-medium mb-2">Key Responsibilities:</h3>
// // //             <ul className="list-disc pl-5 space-y-1">
// // //               {company.keyResponsibilities.map((responsibility, index) => (
// // //                 <li key={index} className="text-gray-700">{responsibility}</li>
// // //               ))}
// // //             </ul>
// // //           </div>

// // //           <div className="mb-6">
// // //             <h3 className="text-lg font-medium mb-2">What We're Looking For:</h3>
// // //             <div className="space-y-3">
// // //               <div>
// // //                 <p className="font-medium">Education:</p>
// // //                 <p className="text-gray-700">{company.requirements.education}</p>
// // //               </div>
// // //               <div>
// // //                 <p className="font-medium">Experience:</p>
// // //                 <p className="text-gray-700">{company.requirements.experience}</p>
// // //               </div>
// // //               <div>
// // //                 <p className="font-medium">Skills:</p>
// // //                 <p className="text-gray-700">{company.requirements.skills}</p>
// // //               </div>
// // //               <div>
// // //                 <p className="font-medium">Portfolio:</p>
// // //                 <p className="text-gray-700">{company.requirements.portfolio}</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Required Skills */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Required Skills</h2>

// // //           <div className="mb-6">
// // //             <h3 className="text-base font-medium mb-3">Technical Skills</h3>
// // //             <div className="flex flex-wrap gap-2">
// // //               {company.technicalSkills.map((skill, index) => (
// // //                 <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
// // //                   {skill}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           <div>
// // //             <h3 className="text-base font-medium mb-3">Soft Skills</h3>
// // //             <div className="flex flex-wrap gap-2">
// // //               {company.softSkills.map((skill, index) => (
// // //                 <div key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
// // //                   {skill}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Job Details */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Job Details</h2>
// // //           <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
// // //             <div>
// // //               <p className="text-sm text-gray-500">Job Role</p>
// // //               <p className="font-medium">{company.jobDetails.role}</p>
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-500">Industry Type</p>
// // //               <p className="font-medium">{company.jobDetails.industryType}</p>
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-500">Department</p>
// // //               <p className="font-medium">{company.jobDetails.department}</p>
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-500">Employment Type</p>
// // //               <p className="font-medium">{company.jobDetails.employmentType}</p>
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-500">Role Category</p>
// // //               <p className="font-medium">{company.jobDetails.roleCategory}</p>
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-500">Work Mode</p>
// // //               <p className="font-medium">{company.jobDetails.workMode}</p>
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-500">Job Location</p>
// // //               <p className="font-medium">{company.jobDetails.locations.join(", ")}</p>
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-500">Joining Date</p>
// // //               <p className="font-medium">{company.jobDetails.joiningDate}</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Eligibility Criteria */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
// // //           <div className="mb-4">
// // //             <h3 className="text-base font-medium mb-2">Pool Campus Drive Open To:</h3>
// // //             <p className="text-gray-700">{company.eligibilityCriteria.driveOpenTo}</p>
// // //           </div>

// // //           <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
// // //             <div>
// // //               <h3 className="text-base font-medium mb-2">Eligible Degrees:</h3>
// // //               <p className="text-gray-700">{company.eligibilityCriteria.eligibleDegrees.join(", ")}</p>
// // //             </div>
// // //             <div>
// // //               <h3 className="text-base font-medium mb-2">Eligible Branches:</h3>
// // //               <p className="text-gray-700">{company.eligibilityCriteria.eligibleBranches.join(", ")}</p>
// // //             </div>
// // //             <div>
// // //               <h3 className="text-base font-medium mb-2">Graduation Year:</h3>
// // //               <p className="text-gray-700">{company.eligibilityCriteria.graduationYear}</p>
// // //             </div>
// // //           </div>

// // //           <div>
// // //             <h3 className="text-base font-medium mb-2">Minimum Academic Requirements:</h3>
// // //             <ul className="list-disc pl-5 space-y-1">
// // //               {company.eligibilityCriteria.academicRequirements.map((requirement, index) => (
// // //                 <li key={index} className="text-gray-700">{requirement}</li>
// // //               ))}
// // //             </ul>
// // //           </div>
// // //         </div>

// // //         {/* Compensation and Benefits */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Compensation & Benefits</h2>

// // //           <div className="grid md:grid-cols-3 gap-4 mb-6">
// // //             <div className="bg-blue-50 p-4 rounded-lg">
// // //               <p className="text-sm text-blue-600 mb-1">Total CTC</p>
// // //               <p className="text-xl font-bold text-blue-900">{company.compensationBenefits.totalCTC}</p>
// // //             </div>
// // //             <div className="bg-blue-50 p-4 rounded-lg">
// // //               <p className="text-sm text-blue-600 mb-1">Fixed Pay</p>
// // //               <p className="text-xl font-bold text-blue-900">{company.compensationBenefits.fixedPay}</p>
// // //             </div>
// // //             <div className="bg-blue-50 p-4 rounded-lg">
// // //               <p className="text-sm text-blue-600 mb-1">Joining Bonus</p>
// // //               <p className="text-xl font-bold text-blue-900">{company.compensationBenefits.joiningBonus}</p>
// // //             </div>
// // //           </div>

// // //           <div>
// // //             <h3 className="text-base font-medium mb-2">Benefits:</h3>
// // //             <ul className="grid grid-cols-2 gap-2">
// // //               {company.compensationBenefits.benefits.map((benefit, index) => (
// // //                 <li key={index} className="flex items-center">
// // //                   <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
// // //                   <span className="text-gray-700">{benefit}</span>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //           </div>
// // //         </div>

// // //         {/* Selection Process */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Selection Process</h2>
// // //           <div className="flex items-center justify-between mb-8 relative">
// // //             {company.selectionProcess.map((step, index) => (
// // //               <div key={index} className="flex flex-col items-center relative z-10">
// // //                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
// // //                   {index + 1}
// // //                 </div>
// // //                 <p className="text-xs text-center mt-2 max-w-[80px]">{step}</p>
// // //               </div>
// // //             ))}
// // //             {/* Progress line */}
// // //             <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
// // //               <div className="absolute top-0 left-0 h-full bg-blue-600" style={{ width: '20%' }}></div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Important Dates */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Important Dates</h2>
// // //           <div className="grid md:grid-cols-4 gap-4">
// // //             <div className="border border-gray-200 p-4 rounded-md">
// // //               <p className="text-sm text-gray-500 mb-1">Registration Deadline</p>
// // //               <p className="font-medium">{company.importantDates.registrationDeadline}</p>
// // //             </div>
// // //             <div className="border border-gray-200 p-4 rounded-md">
// // //               <p className="text-sm text-gray-500 mb-1">Online Test Date</p>
// // //               <p className="font-medium">{company.importantDates.onlineTestDate}</p>
// // //             </div>
// // //             <div className="border border-gray-200 p-4 rounded-md">
// // //               <p className="text-sm text-gray-500 mb-1">Interview Window</p>
// // //               <p className="font-medium">{company.importantDates.interviewWindow}</p>
// // //             </div>
// // //             <div className="border border-gray-200 p-4 rounded-md">
// // //               <p className="text-sm text-gray-500 mb-1">Offer Rollout</p>
// // //               <p className="font-medium">{company.importantDates.offerRollout}</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Required Documents */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
// // //           <ul className="space-y-2">
// // //             {company.requiredDocuments.map((document, index) => (
// // //               <li key={index} className="flex items-start">
// // //                 <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
// // //                 <span className="text-gray-700">{document}</span>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         </div>

// // //         {/* How to Apply */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">How to Apply (For Pool Drive Participants)</h2>
// // //           <p className="text-gray-700 mb-4">{company.applicationProcess}</p>

// // //           <div className="bg-blue-50 p-4 rounded-md mb-4">
// // //             <p className="text-blue-800 font-medium mb-1">Colleges must verify student profiles and confirm participation via their placement office login.</p>
// // //           </div>

// // //           <div className="mb-6">
// // //             <h3 className="text-base font-medium mb-2">Drive Venue (If Physical Round is Conducted):</h3>
// // //             <p className="text-gray-700 mb-2">{company.driveVenue}</p>
// // //             <a href="#" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
// // //               <MapPin className="h-4 w-4 mr-1" />
// // //               View on Map
// // //             </a>
// // //           </div>
// // //         </div>

// // //         {/* Participating Colleges */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Participating Colleges</h2>
// // //           <ul className="space-y-2">
// // //             {company.participatingColleges.map((college, index) => (
// // //               <li key={index} className="text-gray-700">• {college}</li>
// // //             ))}
// // //           </ul>
// // //           <p className="text-sm text-gray-500 mt-2">(And many more across South India)</p>
// // //         </div>

// // //         {/* Additional Info & Support */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Additional Info & Support</h2>

// // //           <div className="space-y-4 mb-6">
// // //             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
// // //               <Download className="h-5 w-5 mr-2" />
// // //               Download Drive Details (PDF)
// // //             </a>
// // //             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
// // //               <Calendar className="h-5 w-5 mr-2" />
// // //               Save Day to the Life at Cognizant
// // //             </a>
// // //             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
// // //               <Info className="h-5 w-5 mr-2" />
// // //               Frequently Asked Questions
// // //             </a>
// // //           </div>

// // //           <div className="border-t pt-4">
// // //             <h3 className="text-base font-medium mb-3">Pool Campus Placement Officer Contact:</h3>
// // //             <div className="bg-gray-50 p-4 rounded-md">
// // //               <p className="font-medium mb-2">{company.contactInfo.name}</p>
// // //               <div className="space-y-2">
// // //                 <a href={`mailto:${company.contactInfo.email}`} className="flex items-center text-blue-600 hover:text-blue-800">
// // //                   <Mail className="h-4 w-4 mr-2" />
// // //                   {company.contactInfo.email}
// // //                 </a>
// // //                 <a href={`tel:${company.contactInfo.phone}`} className="flex items-center text-blue-600 hover:text-blue-800">
// // //                   <Phone className="h-4 w-4 mr-2" />
// // //                   {company.contactInfo.phone}
// // //                 </a>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Important Notes */}
// // //         <div className="bg-yellow-50 rounded-lg p-6 mb-6">
// // //           <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
// // //           <ul className="space-y-3">
// // //             {company.importantNotes.map((note, index) => (
// // //               <li key={index} className="flex items-start">
// // //                 <Info className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
// // //                 <span className="text-gray-800">{note}</span>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         </div>

// // //         {/* Note to Students */}
// // //         <div className="bg-blue-50 rounded-lg p-6 mb-8">
// // //           <h2 className="text-xl font-semibold text-blue-900 mb-3">Note to Students</h2>
// // //           <p className="text-blue-800">
// // //             Please keep your TalentSprint profile updated and check your registered email for test links and interview schedules. No communication will be sent via SMS or WhatsApp.
// // //           </p>
// // //         </div>

// // //         {/* Final CTA */}
// // //         <div className="text-center mb-8">
// // //           <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition duration-200 text-lg font-medium">
// // //             Register Now
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default PoolJobDetailsPage;



// // import React, { useEffect, useState } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import axios from 'axios'; // Import axios
// // import { MapPin, Building, Calendar, Globe, Download, Mail, Phone, Linkedin, CheckCircle, Info } from 'lucide-react';
// // import { ApplyForPoolCampus } from '@/lib/College_AxiosIntance';

// // const PoolJobDetailsPage = () => {
// //   const { id } = useParams();
// //   const [jobDetails, setJobDetails] = useState(null); // Changed 'company' to 'jobDetails' for clarity
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchJobDetails = async () => {
// //       setLoading(true);
// //       setError(null);
// //       try {
// //         const backendUrl = import.meta.env.VITE_Backend_URL || 'http://localhost:5000';
// //         const response = await axios.get(`${backendUrl}/api/hiringDrive/getPoolCampusJob/${id}`);
// //         const backendJob = response.data; // The API returns the job object directly

// //         // Map backend data to frontend structure, handling "Not specified"
// //         const mappedDetails = {
// //           id: backendJob._id,
// //           companyName: backendJob.companyId?.companyDetails?.companyName || 'Not specified',
// //           logo: backendJob.companyId?.profileImageUrl || 'https://via.placeholder.com/56', // Fallback for logo
// //           registrationDates: (backendJob.placementStartDate && backendJob.placementEndDate)
// //             ? `${new Date(backendJob.placementStartDate).toLocaleDateString()} - ${new Date(backendJob.placementEndDate).toLocaleDateString()}`
// //             : 'Not specified',
// //           website: backendJob.companyId?.companyDetails?.websiteUrl || 'Not specified',

// //           stats: {
// //             employees: backendJob.companyId?.companyDetails?.numberOfEmployees || 'N/A',
// //             revenue: 'N/A', // Not directly available in your current backend schema
// //             industries: backendJob.companyId?.companyDetails?.industryType || 'N/A',
// //             countries: backendJob.companyId?.companyDetails?.country || 'N/A',
// //           },

// //           programDetails: {
// //             eligibility: backendJob.criteria ? [backendJob.criteria] : ['Eligibility criteria not specified'], // Using criteria field
// //             compensation: backendJob.minPackage?.amount
// //               ? `₹ ${backendJob.minPackage.amount} ${backendJob.minPackage.currency || 'LPA'}`
// //               : 'Not specified',
// //           },
// //           aboutCompany: backendJob.companyId?.companyDetails?.description || 'No company description available.',
// //           jobDescription: backendJob.criteria || 'No detailed job description available.', // Using criteria for now
// //           keyResponsibilities: [], // Not available in current backend schema
// //           requirements: { // Map from companyId.hiringPreferences
// //             education: 'Not specified', // Not directly available
// //             experience: 'Not specified', // Not directly available
// //             skills: backendJob.companyId?.hiringPreferences?.hiringPara || 'Not specified', // Example: Using hiringPara as a general skills field
// //             portfolio: 'Not required', // Not directly available
// //           },
// //           technicalSkills: [], // Need to populate if you add a field for this in backend
// //           softSkills: [], // Need to populate if you add a field for this in backend

// //           jobDetails: {
// //             role: backendJob.jobRoles && backendJob.jobRoles.length > 0 ? backendJob.jobRoles.join(', ') : 'Not specified',
// //             industryType: backendJob.companyId?.companyDetails?.industryType || 'Not specified',
// //             department: 'Not specified', // Not directly available
// //             employmentType: backendJob.employmentType || 'Not specified',
// //             roleCategory: 'Not specified', // Not directly available
// //             workMode: backendJob.workMode || 'Not specified',
// //             locations: backendJob.workLocations && backendJob.workLocations.length > 0 ? backendJob.workLocations : ['Not specified'],
// //             joiningDate: 'Not specified', // Not directly available
// //           },

// //           eligibilityCriteria: {
// //             driveOpenTo: backendJob.collegeTypes && backendJob.collegeTypes.length > 0 ? backendJob.collegeTypes.join(', ') : 'Not specified',
// //             eligibleDegrees: backendJob.studentStreams && backendJob.studentStreams.length > 0 ? backendJob.studentStreams : ['Not specified'],
// //             eligibleBranches: [], // Not directly available
// //             graduationYear: 'Not specified', // Not directly available
// //             academicRequirements: backendJob.criteria ? [backendJob.criteria] : ['Not specified'], // Using criteria for academic requirements
// //           },

// //           compensationBenefits: {
// //             totalCTC: backendJob.minPackage?.amount
// //               ? `₹ ${backendJob.minPackage.amount} ${backendJob.minPackage.currency || 'LPA'}`
// //               : 'Not specified',
// //             fixedPay: 'Not specified', // Not directly available
// //             joiningBonus: 'Not specified', // Not directly available
// //             benefits: [], // Not directly available
// //           },

// //           selectionProcess: backendJob.selectionProcess && backendJob.selectionProcess.length > 0 ? backendJob.selectionProcess : ['Not specified'],

// //           importantDates: {
// //             registrationDeadline: backendJob.placementStartDate ? new Date(backendJob.placementStartDate).toLocaleDateString() : 'Not specified', // Using start date as a placeholder
// //             onlineTestDate: 'Not specified', // Not directly available
// //             interviewWindow: 'Not specified', // Not directly available
// //             offerRollout: backendJob.placementEndDate ? new Date(backendJob.placementEndDate).toLocaleDateString() : 'Not specified', // Using end date as a placeholder
// //           },

// //           requiredDocuments: ['Resume', 'Educational Certificates', 'ID Proof'], // Example placeholder, not from backend
// //           applicationProcess: 'Please refer to your college placement cell for application procedures.', // Example placeholder
// //           driveVenue: backendJob.venue || 'Not specified',
// //           participatingColleges: [], // Not directly available in this schema
// //           contactInfo: {
// //             name: backendJob.contactPerson?.name || 'Not specified',
// //             email: backendJob.contactPerson?.email || 'Not specified',
// //             phone: backendJob.contactPerson?.mobile || 'Not specified',
// //             designation: backendJob.contactPerson?.designation || 'Not specified',
// //             linkedin: backendJob.contactPerson?.linkedin || 'Not specified', // Assuming you have a LinkedIn field
// //           },
// //           importantNotes: [ // Example placeholder, not from backend
// //             'Ensure all documents are verified by your college.',
// //             'Keep your profile updated on the portal.'
// //           ],
// //         };
// //         setJobDetails(mappedDetails);
// //       } catch (err) {
// //         console.error("Error fetching job details:", err);
// //         setError("Failed to fetch job details. Please try again later.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (id) {
// //       fetchJobDetails();
// //     }
// //   }, [id]);

// //   const handleApply = async () => {
// //     try {
// //       // if (jobDetail?.status === 'Open') {
// //       const response = await ApplyForPoolCampus(id);
// //       if (response.success === 'true') alert("Applied");
// //       // }
// //       // else alert("Application Closed!")
// //     } catch (error) {
// //       console.log("Error: ", error);
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center text-gray-600">Loading job details...</div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center text-red-600">Error: {error}</div>
// //       </div>
// //     );
// //   }

// //   if (!jobDetails) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <h2 className="text-xl font-semibold mb-2">Job not found</h2>
// //           <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
// //           <Link to="/college-dashboard/pool-campus-opportunities" className="text-blue-600 hover:text-blue-800">
// //             Back to job listings
// //           </Link>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="bg-white border-b border-gray-200 py-3 px-4">
// //         <Link
// //           to="/college-dashboard/pool-campus-opportunities"
// //           className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
// //         >
// //           <svg
// //             xmlns="http://www.w3.org/2000/svg"
// //             className="h-5 w-5 mr-1"
// //             viewBox="0 0 20 20"
// //             fill="currentColor"
// //           >
// //             <path
// //               fillRule="evenodd"
// //               d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
// //               clipRule="evenodd"
// //             />
// //           </svg>
// //           Back to job listings
// //         </Link>
// //       </div>

// //       <div className="container mx-auto px-4 py-6">
// //         {/* Registration Open Banner */}
// //         <div className="bg-green-50 text-green-800 py-2 px-4 text-sm mb-6 rounded-md flex items-center">
// //           <svg
// //             xmlns="http://www.w3.org/2000/svg"
// //             className="h-4 w-4 mr-2"
// //             viewBox="0 0 20 20"
// //             fill="currentColor"
// //           >
// //             <path
// //               fillRule="evenodd"
// //               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
// //               clipRule="evenodd"
// //             />
// //           </svg>
// //           Registration Open
// //         </div>

// //         {/* Company Header */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <div className="flex flex-col md:flex-row justify-between">
// //             {/* Company Info */}
// //             <div className="flex items-start mb-4 md:mb-0">
// //               <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center mr-4">
// //                 {/* <img
// //                   src={jobDetails?.logo}
// //                   alt={`${jobDetails?.companyName} logo`}
// //                   className="w-10 h-10 object-contain"
// //                   onError={(e) => {
// //                     e.target.src = "https://via.placeholder.com/56"; // Fallback image
// //                   }}
// //                 /> */}
// //               </div>
// //               <div>
// //                 <h1 className="text-2xl font-bold text-gray-900">{jobDetails.companyName}</h1>
// //                 <div className="flex items-center mt-1">
// //                   <Calendar className="h-4 w-4 text-gray-500 mr-2" />
// //                   <p className="text-sm text-gray-600">{jobDetails.registrationDates}</p>
// //                 </div>
// //                 <div className="flex items-center mt-1">
// //                   <Globe className="h-4 w-4 text-gray-500 mr-2" />
// //                   <a
// //                     href={jobDetails.website === 'Not specified' ? '#' : `https://${jobDetails.website}`}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                     className="text-sm text-blue-600 hover:text-blue-800"
// //                   >
// //                     {jobDetails.website}
// //                   </a>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex space-x-2">
// //               <button
// //                 onClick={handleApply}
// //                 className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition duration-200">
// //                 Register Now
// //               </button>
// //               <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
// //                 Save
// //               </button>
// //               <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
// //                 Share
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Company Stats */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
// //           <div className="bg-white p-4 rounded-lg shadow-sm">
// //             <p className="text-gray-500 text-sm mb-1">Employees</p>
// //             <p className="text-xl font-semibold">{jobDetails.stats.employees}</p>
// //           </div>
// //           <div className="bg-white p-4 rounded-lg shadow-sm">
// //             <p className="text-gray-500 text-sm mb-1">Revenue</p>
// //             <p className="text-xl font-semibold">{jobDetails.stats.revenue}</p>
// //           </div>
// //           <div className="bg-white p-4 rounded-lg shadow-sm">
// //             <p className="text-gray-500 text-sm mb-1">Industries</p>
// //             <p className="text-xl font-semibold">{jobDetails.stats.industries}</p>
// //           </div>
// //           <div className="bg-white p-4 rounded-lg shadow-sm">
// //             <p className="text-gray-500 text-sm mb-1">Countries</p>
// //             <p className="text-xl font-semibold">{jobDetails.stats.countries}</p>
// //           </div>
// //         </div>

// //         {/* Program Details */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Program Details</h2>
// //           <div className="grid md:grid-cols-2 gap-6">
// //             <div>
// //               <ul className="space-y-2">
// //                 {jobDetails.programDetails.eligibility.map((criterion, index) => (
// //                   <li key={index} className="flex items-start">
// //                     <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
// //                     <span className="text-gray-700">{criterion}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //             <div>
// //               <h3 className="text-lg font-medium mb-2">Compensation</h3>
// //               <p className="text-xl font-bold text-gray-900">{jobDetails.programDetails.compensation}</p>
// //               <p className="text-sm text-gray-500">Base + Benefits</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* About Company */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">About {jobDetails.companyName}</h2>
// //           <p className="text-gray-700 leading-relaxed">
// //             {jobDetails.aboutCompany}
// //           </p>
// //         </div>

// //         {/* Job Description */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Description</h2>

// //           <div className="mb-6">
// //             <h3 className="text-lg font-medium mb-2">About The Role:</h3>
// //             <p className="text-gray-700 leading-relaxed mb-4">
// //               {jobDetails.jobDescription}
// //             </p>
// //           </div>

// //           <div className="mb-6">
// //             <h3 className="text-lg font-medium mb-2">Key Responsibilities:</h3>
// //             <ul className="list-disc pl-5 space-y-1">
// //               {jobDetails.keyResponsibilities.length > 0 ? (
// //                 jobDetails.keyResponsibilities.map((responsibility, index) => (
// //                   <li key={index} className="text-gray-700">{responsibility}</li>
// //                 ))
// //               ) : (
// //                 <li className="text-gray-700">Not specified</li>
// //               )}
// //             </ul>
// //           </div>

// //           <div className="mb-6">
// //             <h3 className="text-lg font-medium mb-2">What We're Looking For:</h3>
// //             <div className="space-y-3">
// //               <div>
// //                 <p className="font-medium">Education:</p>
// //                 <p className="text-gray-700">{jobDetails.requirements.education}</p>
// //               </div>
// //               <div>
// //                 <p className="font-medium">Experience:</p>
// //                 <p className="text-gray-700">{jobDetails.requirements.experience}</p>
// //               </div>
// //               <div>
// //                 <p className="font-medium">Skills:</p>
// //                 <p className="text-gray-700">{jobDetails.requirements.skills}</p>
// //               </div>
// //               <div>
// //                 <p className="font-medium">Portfolio:</p>
// //                 <p className="text-gray-700">{jobDetails.requirements.portfolio}</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Required Skills */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Required Skills</h2>

// //           <div className="mb-6">
// //             <h3 className="text-base font-medium mb-3">Technical Skills</h3>
// //             <div className="flex flex-wrap gap-2">
// //               {jobDetails.technicalSkills.length > 0 ? (
// //                 jobDetails.technicalSkills.map((skill, index) => (
// //                   <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
// //                     {skill}
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Not specified</div>
// //               )}
// //             </div>
// //           </div>

// //           <div>
// //             <h3 className="text-base font-medium mb-3">Soft Skills</h3>
// //             <div className="flex flex-wrap gap-2">
// //               {jobDetails.softSkills.length > 0 ? (
// //                 jobDetails.softSkills.map((skill, index) => (
// //                   <div key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
// //                     {skill}
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Not specified</div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Job Details */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Job Details</h2>
// //           <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
// //             <div>
// //               <p className="text-sm text-gray-500">Job Role</p>
// //               <p className="font-medium">{jobDetails.jobDetails.role}</p>
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-500">Industry Type</p>
// //               <p className="font-medium">{jobDetails.jobDetails.industryType}</p>
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-500">Department</p>
// //               <p className="font-medium">{jobDetails.jobDetails.department}</p>
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-500">Employment Type</p>
// //               <p className="font-medium">{jobDetails.jobDetails.employmentType}</p>
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-500">Role Category</p>
// //               <p className="font-medium">{jobDetails.jobDetails.roleCategory}</p>
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-500">Work Mode</p>
// //               <p className="font-medium">{jobDetails.jobDetails.workMode}</p>
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-500">Job Location</p>
// //               <p className="font-medium">{jobDetails.jobDetails.locations.join(", ")}</p>
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-500">Joining Date</p>
// //               <p className="font-medium">{jobDetails.jobDetails.joiningDate}</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Eligibility Criteria */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
// //           <div className="mb-4">
// //             <h3 className="text-base font-medium mb-2">Pool Campus Drive Open To:</h3>
// //             <p className="text-gray-700">{jobDetails.eligibilityCriteria.driveOpenTo}</p>
// //           </div>

// //           <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
// //             <div>
// //               <h3 className="text-base font-medium mb-2">Eligible Degrees:</h3>
// //               <p className="text-gray-700">{jobDetails.eligibilityCriteria.eligibleDegrees.join(", ")}</p>
// //             </div>
// //             <div>
// //               <h3 className="text-base font-medium mb-2">Eligible Branches:</h3>
// //               <p className="text-gray-700">{jobDetails.eligibilityCriteria.eligibleBranches.join(", ")}</p>
// //             </div>
// //             <div>
// //               <h3 className="text-base font-medium mb-2">Graduation Year:</h3>
// //               <p className="text-gray-700">{jobDetails.eligibilityCriteria.graduationYear}</p>
// //             </div>
// //           </div>

// //           <div>
// //             <h3 className="text-base font-medium mb-2">Minimum Academic Requirements:</h3>
// //             <ul className="list-disc pl-5 space-y-1">
// //               {jobDetails.eligibilityCriteria.academicRequirements.length > 0 ? (
// //                 jobDetails.eligibilityCriteria.academicRequirements.map((requirement, index) => (
// //                   <li key={index} className="text-gray-700">{requirement}</li>
// //                 ))
// //               ) : (
// //                 <li className="text-gray-700">Not specified</li>
// //               )}
// //             </ul>
// //           </div>
// //         </div>

// //         {/* Compensation and Benefits */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Compensation & Benefits</h2>

// //           <div className="grid md:grid-cols-3 gap-4 mb-6">
// //             <div className="bg-blue-50 p-4 rounded-lg">
// //               <p className="text-sm text-blue-600 mb-1">Total CTC</p>
// //               <p className="text-xl font-bold text-blue-900">{jobDetails.compensationBenefits.totalCTC}</p>
// //             </div>
// //             <div className="bg-blue-50 p-4 rounded-lg">
// //               <p className="text-sm text-blue-600 mb-1">Fixed Pay</p>
// //               <p className="text-xl font-bold text-blue-900">{jobDetails.compensationBenefits.fixedPay}</p>
// //             </div>
// //             <div className="bg-blue-50 p-4 rounded-lg">
// //               <p className="text-sm text-blue-600 mb-1">Joining Bonus</p>
// //               <p className="text-xl font-bold text-blue-900">{jobDetails.compensationBenefits.joiningBonus}</p>
// //             </div>
// //           </div>

// //           <div>
// //             <h3 className="text-base font-medium mb-2">Benefits:</h3>
// //             <ul className="grid grid-cols-2 gap-2">
// //               {jobDetails.compensationBenefits.benefits.length > 0 ? (
// //                 jobDetails.compensationBenefits.benefits.map((benefit, index) => (
// //                   <li key={index} className="flex items-center">
// //                     <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
// //                     <span className="text-gray-700">{benefit}</span>
// //                   </li>
// //                 ))
// //               ) : (
// //                 <li className="flex items-center text-gray-700"><Info className="h-4 w-4 text-gray-500 mr-2" />Not specified</li>
// //               )}
// //             </ul>
// //           </div>
// //         </div>

// //         {/* Selection Process */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Selection Process</h2>
// //           <div className="flex items-center justify-between mb-8 relative">
// //             {jobDetails.selectionProcess.length > 0 && jobDetails.selectionProcess[0] !== 'Not specified' ? (
// //               jobDetails.selectionProcess.map((step, index) => (
// //                 <div key={index} className="flex flex-col items-center relative z-10">
// //                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
// //                     {index + 1}
// //                   </div>
// //                   <p className="text-xs text-center mt-2 max-w-[80px]">{step}</p>
// //                 </div>
// //               ))
// //             ) : (
// //               <div className="flex flex-col items-center relative z-10">
// //                 <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">1</div>
// //                 <p className="text-xs text-center mt-2 max-w-[80px]">Not specified</p>
// //               </div>
// //             )}
// //             {/* Progress line (adjust width dynamically based on selectionProcess.length if needed) */}
// //             {jobDetails.selectionProcess.length > 1 && (
// //               <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
// //                 <div className="absolute top-0 left-0 h-full bg-blue-600" style={{ width: `${((jobDetails.selectionProcess.length - 1) / (jobDetails.selectionProcess.length || 1)) * 100}%` }}></div>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Important Dates */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Important Dates</h2>
// //           <div className="grid md:grid-cols-4 gap-4">
// //             <div className="border border-gray-200 p-4 rounded-md">
// //               <p className="text-sm text-gray-500 mb-1">Registration Deadline</p>
// //               <p className="font-medium">{jobDetails.importantDates.registrationDeadline}</p>
// //             </div>
// //             <div className="border border-gray-200 p-4 rounded-md">
// //               <p className="text-sm text-gray-500 mb-1">Online Test Date</p>
// //               <p className="font-medium">{jobDetails.importantDates.onlineTestDate}</p>
// //             </div>
// //             <div className="border border-gray-200 p-4 rounded-md">
// //               <p className="text-sm text-gray-500 mb-1">Interview Window</p>
// //               <p className="font-medium">{jobDetails.importantDates.interviewWindow}</p>
// //             </div>
// //             <div className="border border-gray-200 p-4 rounded-md">
// //               <p className="text-sm text-gray-500 mb-1">Offer Rollout</p>
// //               <p className="font-medium">{jobDetails.importantDates.offerRollout}</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Required Documents */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
// //           <ul className="space-y-2">
// //             {jobDetails.requiredDocuments.length > 0 ? (
// //               jobDetails.requiredDocuments.map((document, index) => (
// //                 <li key={index} className="flex items-start">
// //                   <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
// //                   <span className="text-gray-700">{document}</span>
// //                 </li>
// //               ))
// //             ) : (
// //               <li className="flex items-start text-gray-700"><Info className="h-5 w-5 text-gray-500 mr-2" />Not specified</li>
// //             )}
// //           </ul>
// //         </div>

// //         {/* How to Apply */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">How to Apply (For Pool Drive Participants)</h2>
// //           <p className="text-gray-700 mb-4">{jobDetails.applicationProcess}</p>

// //           <div className="bg-blue-50 p-4 rounded-md mb-4">
// //             <p className="text-blue-800 font-medium mb-1">Colleges must verify student profiles and confirm participation via their placement office login.</p>
// //           </div>

// //           <div className="mb-6">
// //             <h3 className="text-base font-medium mb-2">Drive Venue (If Physical Round is Conducted):</h3>
// //             <p className="text-gray-700 mb-2">{jobDetails.driveVenue}</p>
// //             <a href="#" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
// //               <MapPin className="h-4 w-4 mr-1" />
// //               View on Map
// //             </a>
// //           </div>
// //         </div>

// //         {/* Participating Colleges */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Participating Colleges</h2>
// //           <ul className="space-y-2">
// //             {jobDetails.participatingColleges.length > 0 ? (
// //               jobDetails.participatingColleges.map((college, index) => (
// //                 <li key={index} className="text-gray-700">• {college}</li>
// //               ))
// //             ) : (
// //               <li className="text-gray-700">Not specified</li>
// //             )}
// //           </ul>
// //           <p className="text-sm text-gray-500 mt-2">(And many more across South India)</p>
// //         </div>

// //         {/* Additional Info & Support */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Additional Info & Support</h2>

// //           <div className="space-y-4 mb-6">
// //             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
// //               <Download className="h-5 w-5 mr-2" />
// //               Download Drive Details (PDF)
// //             </a>
// //             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
// //               <Calendar className="h-5 w-5 mr-2" />
// //               Save Day to the Life at Cognizant
// //             </a>
// //             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
// //               <Info className="h-5 w-5 mr-2" />
// //               Frequently Asked Questions
// //             </a>
// //           </div>

// //           <div className="border-t pt-4">
// //             <h3 className="text-base font-medium mb-3">Pool Campus Placement Officer Contact:</h3>
// //             <div className="bg-gray-50 p-4 rounded-md">
// //               <p className="font-medium mb-2">{jobDetails.contactInfo.name} <span> ({jobDetails.contactInfo.designation})</span></p>
// //               <div className="space-y-2">
// //                 <a href={`mailto:${jobDetails.contactInfo.email}`} className="flex items-center text-blue-600 hover:text-blue-800">
// //                   <Mail className="h-4 w-4 mr-2" />
// //                   {jobDetails.contactInfo.email}
// //                 </a>
// //                 <a href={`tel:${jobDetails.contactInfo.phone}`} className="flex items-center text-blue-600 hover:text-blue-800">
// //                   <Phone className="h-4 w-4 mr-2" />
// //                   {jobDetails.contactInfo.phone}
// //                 </a>
// //                 <a
// //                   href={jobDetails.contactInfo.linkedin}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="flex items-center text-blue-600 hover:text-blue-800"
// //                 >
// //                   <Linkedin className="h-4 w-4 mr-2" />
// //                   {jobDetails.contactInfo.linkedin}
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Important Notes */}
// //         <div className="bg-yellow-50 rounded-lg p-6 mb-6">
// //           <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
// //           <ul className="space-y-3">
// //             {jobDetails.importantNotes.length > 0 ? (
// //               jobDetails.importantNotes.map((note, index) => (
// //                 <li key={index} className="flex items-start">
// //                   <Info className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
// //                   <span className="text-gray-800">{note}</span>
// //                 </li>
// //               ))
// //             ) : (
// //               <li className="flex items-start text-gray-800"><Info className="h-5 w-5 text-gray-500 mr-2" />No important notes specified.</li>
// //             )}
// //           </ul>
// //         </div>

// //         {/* Note to Students */}
// //         <div className="bg-blue-50 rounded-lg p-6 mb-8">
// //           <h2 className="text-xl font-semibold text-blue-900 mb-3">Note to Students</h2>
// //           <p className="text-blue-800">
// //             Please keep your TalentSprint profile updated and check your registered email for test links and interview schedules. No communication will be sent via SMS or WhatsApp.
// //           </p>
// //         </div>

// //         {/* Final CTA */}
// //         <div className="text-center mb-8">
// //           <button
// //             onClick={handleApply}
// //             className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition duration-200 text-lg font-medium">
// //             Register Now
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PoolJobDetailsPage;



// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import { MapPin, Building, Calendar, Globe, Download, Mail, Phone, Linkedin, CheckCircle, Info } from 'lucide-react';
// import { ApplyForPoolCampus, SaveOppurtunity } from '@/lib/College_AxiosIntance';

// const PoolJobDetailsPage = () => {
//   const { id } = useParams();
//   const [jobDetails, setJobDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const backendUrl = import.meta.env.VITE_Backend_URL || 'http://localhost:5000';
//         const response = await axios.get(`${backendUrl}/api/student-dashboard/getPoolCampusJob/${id}`);
//         const backendJob = response.data;

//         if (!backendJob) {
//           setJobDetails(null);
//           setLoading(false);
//           return;
//         }

//         const mappedDetails = {
//           id: backendJob._id,
//           companyName: backendJob.companyPosted?.companyDetails?.companyName || 'Not specified',
//           logo: backendJob.companyPosted?.profileImageUrl || 'https://via.placeholder.com/56',
//           website: backendJob.companyPosted?.companyDetails?.websiteUrl || 'Not specified',
//           registrationDates: (backendJob.startDate && backendJob.endDate)
//             ? `${new Date(backendJob.startDate).toLocaleDateString()} - ${new Date(backendJob.endDate).toLocaleDateString()}`
//             : 'Not specified',
//           stats: {
//             employees: backendJob.companyPosted?.companyDetails?.numberOfEmployees || 'N/A',
//             revenue: 'N/A',
//             industries: backendJob.companyPosted?.companyDetails?.industryType || 'N/A',
//             countries: backendJob.companyPosted?.companyDetails?.country || 'N/A',
//           },
//           programDetails: {
//             eligibility: (backendJob.degree || []).concat(backendJob.studentStreams || []),
//             compensation: backendJob.minPackage?.amount
//               ? `₹ ${backendJob.minPackage.amount} ${backendJob.minPackage.currency || 'LPA'}`
//               : 'Not specified',
//           },
//           aboutCompany: backendJob.companyPosted?.companyDetails?.description || 'No company description available.',
//           jobDescription: backendJob.description || 'No detailed job description available.',
//           keyResponsibilities: [],
//           requirements: {
//             education: backendJob.minEducation || 'Not specified',
//             experience: backendJob.yearsOfExperience || 'Not specified',
//             skills: (backendJob.skills || []).join(', ') || 'Not specified',
//             portfolio: 'Not required',
//           },
//           technicalSkills: backendJob.skills || [],
//           softSkills: [],
//           jobDetails: {
//             role: (backendJob.jobRoles || []).join(', ') || 'Not specified',
//             industryType: backendJob.companyPosted?.companyDetails?.industryType || 'Not specified',
//             department: 'Not specified',
//             employmentType: backendJob.employmentType || 'Not specified',
//             roleCategory: backendJob.jobCategory || 'Not specified',
//             workMode: backendJob.workMode || 'Not specified',
//             locations: backendJob.location || ['Not specified'],
//             joiningDate: 'Not specified',
//           },
//           eligibilityCriteria: {
//             driveOpenTo: (backendJob.collegeTypes || []).join(', ') || 'Not specified',
//             eligibleDegrees: (backendJob.degree || []).join(', ') || 'Not specified',
//             eligibleBranches: (backendJob.studentStreams || []).join(', ') || 'Not specified',
//             graduationYear: 'Not specified',
//             academicRequirements: backendJob.minEducation || 'Not specified',
//           },
//           compensationBenefits: {
//             totalCTC: backendJob.minPackage?.amount
//               ? `₹ ${backendJob.minPackage.amount} ${backendJob.minPackage.currency || 'LPA'}`
//               : 'Not specified',
//             fixedPay: 'Not specified',
//             joiningBonus: 'Not specified',
//             benefits: [],
//           },
//           selectionProcess: backendJob.selectionProcess && backendJob.selectionProcess.length > 0 ? backendJob.selectionProcess : ['Not specified'],
//           importantDates: {
//             registrationDeadline: backendJob.startDate ? new Date(backendJob.startDate).toLocaleDateString() : 'Not specified',
//             onlineTestDate: 'Not specified',
//             interviewWindow: 'Not specified',
//             offerRollout: backendJob.endDate ? new Date(backendJob.endDate).toLocaleDateString() : 'Not specified',
//           },
//           requiredDocuments: ['Resume', 'Educational Certificates', 'ID Proof'],
//           applicationProcess: 'Please refer to your college placement cell for application procedures.',
//           driveVenue: backendJob.venue || 'Not specified',
//           participatingColleges: [],
//           contactInfo: {
//             name: backendJob.contactPerson?.name || 'Not specified',
//             email: backendJob.contactPerson?.email || 'Not specified',
//             phone: backendJob.contactPerson?.mobile || 'Not specified',
//             designation: backendJob.contactPerson?.designation || 'Not specified',
//             linkedin: backendJob.contactPerson?.linkedin || 'Not specified',
//           },
//           importantNotes: [
//             'Ensure all documents are verified by your college.',
//             'Keep your profile updated on the portal.'
//           ],
//         };
//         setJobDetails(mappedDetails);
//       } catch (err) {
//         console.error("Error fetching job details:", err);
//         setError("Failed to fetch job details. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchJobDetails();
//     }
//   }, [id]);

//   const handleApply = async () => {
//     try {
//       const response = await ApplyForPoolCampus(id);
//       // console.log("apply res: ", response);

//       if (response.data?.success === true) alert("Applied");
//       // }
//       else alert(response?.response.data.msg);
//     } catch (error) {
//       console.log("Error: ", error);
//       alert(`Something went wrong`);
//     }
//   };
//   const handleSave = async (jobId, jobType) => {
//     // console.log("Save: ", jobId, jobType);

//     try {
//       const response = await SaveOppurtunity(jobId, jobType);
//       if (response.data.success === true) alert("Saved");
//       // }
//       // else alert("Application Closed!")
//     } catch (error) {
//       console.log("Error: ", error);
//       alert(`Error: ${error}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center text-gray-600">Loading job details...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center text-red-600">Error: {error}</div>
//       </div>
//     );
//   }

//   if (!jobDetails) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold mb-2">Job not found</h2>
//           <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
//           <Link to="/college-dashboard/pool-campus-opportunities" className="text-blue-600 hover:text-blue-800">
//             Back to job listings
//           </Link>
//         </div>
//       </div>
//     );
//   }

  // return (
  //   <div className="min-h-screen bg-gray-50">
  //     <div className="bg-white border-b border-gray-200 py-3 px-4">
  //       <Link
  //         to="/college-dashboard/pool-campus-opportunities"
  //         className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           className="h-5 w-5 mr-1"
  //           viewBox="0 0 20 20"
  //           fill="currentColor"
  //         >
  //           <path
  //             fillRule="evenodd"
  //             d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
  //             clipRule="evenodd"
  //           />
  //         </svg>
  //         Back to job listings
  //       </Link>
  //     </div>

  //     <div className="container mx-auto px-4 py-6">
  //       <div className="bg-green-50 text-green-800 py-2 px-4 text-sm mb-6 rounded-md flex items-center">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           className="h-4 w-4 mr-2"
  //           viewBox="0 0 20 20"
  //           fill="currentColor"
  //         >
  //           <path
  //             fillRule="evenodd"
  //             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
  //             clipRule="evenodd"
  //           />
  //         </svg>
  //         Registration Open
  //       </div>

  //       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
  //         <div className="flex flex-col md:flex-row justify-between">
  //           <div className="flex items-start mb-4 md:mb-0">
  //             <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center mr-4 overflow-hidden">
  //               {jobDetails?.logo !== 'https://via.placeholder.com/56' ? (
  //                 <img
  //                   src={jobDetails.logo}
  //                   alt={`${jobDetails.companyName} logo`}
  //                   className="w-full h-full object-contain"
  //                 />
  //               ) : (
  //                 <Building className="w-8 h-8 text-gray-500" />
  //               )}
  //             </div>
  //             <div>
  //               <h1 className="text-2xl font-bold text-gray-900">{jobDetails.companyName}</h1>
  //               <div className="flex items-center mt-1">
  //                 <Calendar className="h-4 w-4 text-gray-500 mr-2" />
  //                 <p className="text-sm text-gray-600">{jobDetails.registrationDates}</p>
  //               </div>
  //               <div className="flex items-center mt-1">
  //                 <Globe className="h-4 w-4 text-gray-500 mr-2" />
  //                 <a
  //                   href={jobDetails.website === 'Not specified' ? '#' : `https://${jobDetails.website}`}
  //                   target="_blank"
  //                   rel="noopener noreferrer"
  //                   className="text-sm text-blue-600 hover:text-blue-800"
  //                 >
  //                   {jobDetails.website}
  //                 </a>
  //               </div>
  //             </div>
  //           </div>

  //           <div className="flex space-x-2">
  //             <button
  //               onClick={() => handleApply()}
  //               className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition duration-200">
  //               Register Now
  //             </button>
  //             {/* <button
  //               onClick={() => handleSave(jobDetails._id, jobDetails.jobType)}
  //               className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
  //               Save
  //             </button> */}
  //             <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
  //               Share
  //             </button>
  //           </div>
  //         </div>
  //       </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <p className="text-gray-500 text-sm mb-1">Employees</p>
//             <p className="text-xl font-semibold">{jobDetails.stats.employees}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <p className="text-gray-500 text-sm mb-1">Revenue</p>
//             <p className="text-xl font-semibold">{jobDetails.stats.revenue}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <p className="text-gray-500 text-sm mb-1">Industries</p>
//             <p className="text-xl font-semibold">{jobDetails.stats.industries}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <p className="text-gray-500 text-sm mb-1">Countries</p>
//             <p className="text-xl font-semibold">{jobDetails.stats.countries}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Program Details</h2>
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-medium mb-2">Eligibility</h3>
//               <ul className="space-y-2">
//                 {jobDetails.eligibilityCriteria.eligibleDegrees !== 'Not specified' && (
//                   <li className="flex items-start">
//                     <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
//                     <span className="text-gray-700">Eligible Degrees: {jobDetails.eligibilityCriteria.eligibleDegrees}</span>
//                   </li>
//                 )}
//                 {jobDetails.eligibilityCriteria.eligibleBranches !== 'Not specified' && (
//                   <li className="flex items-start">
//                     <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
//                     <span className="text-gray-700">Eligible Branches: {jobDetails.eligibilityCriteria.eligibleBranches}</span>
//                   </li>
//                 )}
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-medium mb-2">Compensation</h3>
//               <p className="text-xl font-bold text-gray-900">{jobDetails.programDetails.compensation}</p>
//               <p className="text-sm text-gray-500">Base + Benefits</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">About {jobDetails.companyName}</h2>
//           <p className="text-gray-700 leading-relaxed">
//             {jobDetails.aboutCompany}
//           </p>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Description</h2>

//           <div className="mb-6">
//             <h3 className="text-lg font-medium mb-2">About The Role:</h3>
//             <p className="text-gray-700 leading-relaxed mb-4">
//               {jobDetails.jobDescription}
//             </p>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-lg font-medium mb-2">Key Responsibilities:</h3>
//             <ul className="list-disc pl-5 space-y-1">
//               {jobDetails.keyResponsibilities.length > 0 ? (
//                 jobDetails.keyResponsibilities.map((responsibility, index) => (
//                   <li key={index} className="text-gray-700">{responsibility}</li>
//                 ))
//               ) : (
//                 <li className="text-gray-700">Not specified</li>
//               )}
//             </ul>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-lg font-medium mb-2">What We're Looking For:</h3>
//             <div className="space-y-3">
//               <div>
//                 <p className="font-medium">Education:</p>
//                 <p className="text-gray-700">{jobDetails.requirements.education}</p>
//               </div>
//               <div>
//                 <p className="font-medium">Experience:</p>
//                 <p className="text-gray-700">{jobDetails.requirements.experience}</p>
//               </div>
//               <div>
//                 <p className="font-medium">Skills:</p>
//                 <p className="text-gray-700">{jobDetails.requirements.skills}</p>
//               </div>
//               <div>
//                 <p className="font-medium">Portfolio:</p>
//                 <p className="text-gray-700">{jobDetails.requirements.portfolio}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Required Skills</h2>

//           <div className="mb-6">
//             <h3 className="text-base font-medium mb-3">Skills</h3>
//             <div className="flex flex-wrap gap-2">
//               {jobDetails.technicalSkills.length > 0 ? (
//                 jobDetails.technicalSkills.map((skill, index) => (
//                   <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
//                     {skill}
//                   </div>
//                 ))
//               ) : (
//                 <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Not specified</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Job Details</h2>
//           <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
//             <div>
//               <p className="text-sm text-gray-500">Job Role</p>
//               <p className="font-medium">{jobDetails.jobDetails.role}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Industry Type</p>
//               <p className="font-medium">{jobDetails.jobDetails.industryType}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Department</p>
//               <p className="font-medium">{jobDetails.jobDetails.department}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Employment Type</p>
//               <p className="font-medium">{jobDetails.jobDetails.employmentType}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Role Category</p>
//               <p className="font-medium">{jobDetails.jobDetails.roleCategory}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Work Mode</p>
//               <p className="font-medium">{jobDetails.jobDetails.workMode}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Job Location</p>
//               <p className="font-medium">{jobDetails.jobDetails.locations.join(", ")}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Joining Date</p>
//               <p className="font-medium">{jobDetails.jobDetails.joiningDate}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
//           <div className="mb-4">
//             <h3 className="text-base font-medium mb-2">Pool Campus Drive Open To:</h3>
//             <p className="text-gray-700">{jobDetails.eligibilityCriteria.driveOpenTo}</p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
//             <div>
//               <h3 className="text-base font-medium mb-2">Eligible Degrees:</h3>
//               <p className="text-gray-700">{jobDetails.eligibilityCriteria.eligibleDegrees}</p>
//             </div>
//             <div>
//               <h3 className="text-base font-medium mb-2">Eligible Branches:</h3>
//               <p className="text-gray-700">{jobDetails.eligibilityCriteria.eligibleBranches}</p>
//             </div>
//             <div>
//               <h3 className="text-base font-medium mb-2">Graduation Year:</h3>
//               <p className="text-gray-700">{jobDetails.eligibilityCriteria.graduationYear}</p>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-base font-medium mb-2">Minimum Academic Requirements:</h3>
//             <p className="text-gray-700">{jobDetails.eligibilityCriteria.academicRequirements}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Compensation & Benefits</h2>

//           <div className="grid md:grid-cols-3 gap-4 mb-6">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-sm text-blue-600 mb-1">Total CTC</p>
//               <p className="text-xl font-bold text-blue-900">{jobDetails.compensationBenefits.totalCTC}</p>
//             </div>
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-sm text-blue-600 mb-1">Fixed Pay</p>
//               <p className="text-xl font-bold text-blue-900">{jobDetails.compensationBenefits.fixedPay}</p>
//             </div>
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-sm text-blue-600 mb-1">Joining Bonus</p>
//               <p className="text-xl font-bold text-blue-900">{jobDetails.compensationBenefits.joiningBonus}</p>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-base font-medium mb-2">Benefits:</h3>
//             <ul className="grid grid-cols-2 gap-2">
//               {jobDetails.compensationBenefits.benefits.length > 0 ? (
//                 jobDetails.compensationBenefits.benefits.map((benefit, index) => (
//                   <li key={index} className="flex items-center">
//                     <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                     <span className="text-gray-700">{benefit}</span>
//                   </li>
//                 ))
//               ) : (
//                 <li className="flex items-center text-gray-700"><Info className="h-4 w-4 text-gray-500 mr-2" />Not specified</li>
//               )}
//             </ul>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Selection Process</h2>
//           <div className="flex items-center justify-between mb-8 relative">
//             {jobDetails.selectionProcess.length > 0 && jobDetails.selectionProcess[0] !== 'Not specified' ? (
//               jobDetails.selectionProcess.map((step, index) => (
//                 <div key={index} className="flex flex-col items-center relative z-10">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
//                     {index + 1}
//                   </div>
//                   <p className="text-xs text-center mt-2 max-w-[80px]">{step}</p>
//                 </div>
//               ))
//             ) : (
//               <div className="flex flex-col items-center relative z-10">
//                 <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">1</div>
//                 <p className="text-xs text-center mt-2 max-w-[80px]">Not specified</p>
//               </div>
//             )}
//             {jobDetails.selectionProcess.length > 1 && (
//               <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
//                 <div className="absolute top-0 left-0 h-full bg-blue-600" style={{ width: `${((jobDetails.selectionProcess.length - 1) / (jobDetails.selectionProcess.length || 1)) * 100}%` }}></div>
//               </div>
//             )}
//           </div>
//         </div>

        // <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        //   <h2 className="text-xl font-semibold mb-4">Important Dates</h2>
        //   <div className="grid md:grid-cols-4 gap-4">
        //     <div className="border border-gray-200 p-4 rounded-md">
        //       <p className="text-sm text-gray-500 mb-1">Registration Deadline</p>
        //       <p className="font-medium">{jobDetails.importantDates.registrationDeadline}</p>
        //     </div>
        //     <div className="border border-gray-200 p-4 rounded-md">
        //       <p className="text-sm text-gray-500 mb-1">Online Test Date</p>
        //       <p className="font-medium">{jobDetails.importantDates.onlineTestDate}</p>
        //     </div>
        //     <div className="border border-gray-200 p-4 rounded-md">
        //       <p className="text-sm text-gray-500 mb-1">Interview Window</p>
        //       <p className="font-medium">{jobDetails.importantDates.interviewWindow}</p>
        //     </div>
        //     <div className="border border-gray-200 p-4 rounded-md">
        //       <p className="text-sm text-gray-500 mb-1">Offer Rollout</p>
        //       <p className="font-medium">{jobDetails.importantDates.offerRollout}</p>
        //     </div>
        //   </div>
        // </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
//           <ul className="space-y-2">
//             {jobDetails.requiredDocuments.length > 0 ? (
//               jobDetails.requiredDocuments.map((document, index) => (
//                 <li key={index} className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
//                   <span className="text-gray-700">{document}</span>
//                 </li>
//               ))
//             ) : (
//               <li className="flex items-start text-gray-700"><Info className="h-5 w-5 text-gray-500 mr-2" />Not specified</li>
//             )}
//           </ul>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">How to Apply (For Pool Drive Participants)</h2>
//           <p className="text-gray-700 mb-4">{jobDetails.applicationProcess}</p>

//           <div className="bg-blue-50 p-4 rounded-md mb-4">
//             <p className="text-blue-800 font-medium mb-1">Colleges must verify student profiles and confirm participation via their placement office login.</p>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-base font-medium mb-2">Drive Venue (If Physical Round is Conducted):</h3>
//             <p className="text-gray-700 mb-2">{jobDetails.driveVenue}</p>
//             <a href="#" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
//               <MapPin className="h-4 w-4 mr-1" />
//               View on Map
//             </a>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Participating Colleges</h2>
//           <ul className="space-y-2">
//             {jobDetails.participatingColleges.length > 0 ? (
//               jobDetails.participatingColleges.map((college, index) => (
//                 <li key={index} className="text-gray-700">• {college}</li>
//               ))
//             ) : (
//               <li className="text-gray-700">Not specified</li>
//             )}
//           </ul>
//           <p className="text-sm text-gray-500 mt-2">(And many more across South India)</p>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Additional Info & Support</h2>

//           <div className="space-y-4 mb-6">
//             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
//               <Download className="h-5 w-5 mr-2" />
//               Download Drive Details (PDF)
//             </a>
//             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
//               <Calendar className="h-5 w-5 mr-2" />
//               Save Day to the Life at Cognizant
//             </a>
//             <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
//               <Info className="h-5 w-5 mr-2" />
//               Frequently Asked Questions
//             </a>
//           </div>

//           <div className="border-t pt-4">
//             <h3 className="text-base font-medium mb-3">Pool Campus Placement Officer Contact:</h3>
//             <div className="bg-gray-50 p-4 rounded-md">
//               <p className="font-medium mb-2">{jobDetails.contactInfo.name} <span> ({jobDetails.contactInfo.designation})</span></p>
//               <div className="space-y-2">
//                 <a href={`mailto:${jobDetails.contactInfo.email}`} className="flex items-center text-blue-600 hover:text-blue-800">
//                   <Mail className="h-4 w-4 mr-2" />
//                   {jobDetails.contactInfo.email}
//                 </a>
//                 <a href={`tel:${jobDetails.contactInfo.phone}`} className="flex items-center text-blue-600 hover:text-blue-800">
//                   <Phone className="h-4 w-4 mr-2" />
//                   {jobDetails.contactInfo.phone}
//                 </a>
//                 <a
//                   href={jobDetails.contactInfo.linkedin}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center text-blue-600 hover:text-blue-800"
//                 >
//                   <Linkedin className="h-4 w-4 mr-2" />
//                   {jobDetails.contactInfo.linkedin}
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-yellow-50 rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
//           <ul className="space-y-3">
//             {jobDetails.importantNotes.length > 0 ? (
//               jobDetails.importantNotes.map((note, index) => (
//                 <li key={index} className="flex items-start">
//                   <Info className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
//                   <span className="text-gray-800">{note}</span>
//                 </li>
//               ))
//             ) : (
//               <li className="flex items-start text-gray-800"><Info className="h-5 w-5 text-gray-500 mr-2" />No important notes specified.</li>
//             )}
//           </ul>
//         </div>

        // <div className="bg-blue-50 rounded-lg p-6 mb-8">
        //   <h2 className="text-xl font-semibold text-blue-900 mb-3">Note to Students</h2>
        //   <p className="text-blue-800">
        //     Please keep your TalentSprint profile updated and check your registered email for test links and interview schedules. No communication will be sent via SMS or WhatsApp.
        //   </p>
        // </div>

//         <div className="text-center mb-8">
//           <button
//             onClick={() => handleApply()}
//             className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition duration-200 text-lg font-medium">
//             Register Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PoolJobDetailsPage;


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building, Calendar, Globe, Mail, Phone, Linkedin, CheckCircle, Info, Download } from 'lucide-react';
import { ApplyForPoolCampus, SaveOppurtunity, getPoolCampusJobById } from '@/lib/College_AxiosIntance';

// Utility function to format date
const formatDate = (dateString) => {
    if (!dateString || dateString === 'Not Specified') return 'Not Specified';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Not Specified';
    }
};

const PoolJobDetailsPage = () => {
    const { id } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false); // State for the save button

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getPoolCampusJobById(id);
                setJobDetails(response.data);
            } catch (err) {
                console.error("Error fetching job details:", err);
                setError("Failed to fetch job details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const handleApply = async () => {
        try {
            const response = await ApplyForPoolCampus(id);
            if (response.data?.success === true) {
                alert("Applied");
            } else {
                alert(response?.response?.data?.msg || "Could not apply.");
            }
        } catch (error) {
            console.log("Error applying: ", error);
            alert(error?.response?.data?.msg || `Something went wrong`);
        }
    };

    const handleSave = async (jobId, jobType) => {
        if (!jobId || !jobType) return;
        try {
            const response = await SaveOppurtunity(jobId, jobType);
            if (response.data.success === true) {
                alert("Saved");
                setIsSaved(true);
            }
        } catch (error) {
            console.log("Error saving: ", error);
            alert("An error occurred while saving.");
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Pool Campus Drive at ${jobDetails?.companyPosted?.companyDetails?.companyName}`,
                text: `Check out this pool campus opportunity at ${jobDetails?.companyPosted?.companyDetails?.companyName}!`,
                url: window.location.href,
            })
            .catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Link copied to clipboard!'))
            .catch(() => alert('Failed to copy link'));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading registration details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-4">
                <div>
                    <p className="text-red-600 text-xl">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!jobDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Job not found</h2>
                    <p className="text-gray-600 mb-4">The opportunity you're looking for doesn't exist or has been removed.</p>
                    <Link to="/college-dashboard/pool-campus-opportunities" className="text-blue-600 hover:text-blue-800">
                        Back to job listings
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/college-dashboard/pool-campus-opportunities" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to opportunities
                </Link>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header Section */}
                    <div className="border-b border-gray-200 p-6">
                        <div className="bg-green-50 text-green-800 py-2 px-4 text-sm mb-6 rounded-md flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                           </svg>
                           Registration Open
                        </div>
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex items-start mb-4 md:mb-0">
                                <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                                    {jobDetails.companyPosted?.profileImageUrl ? (
                                        <img
                                            src={jobDetails.companyPosted.profileImageUrl}
                                            alt={`${jobDetails.companyPosted?.companyDetails?.companyName} logo`}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building className="w-8 h-8 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{jobDetails.companyPosted?.companyDetails?.companyName || 'Not Specified'}</h1>
                                    <div className="flex items-center mt-1">
                                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                        <p className="text-sm text-gray-600">{formatDate(jobDetails.startDate)} - {formatDate(jobDetails.endDate)}</p>
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <Globe className="h-4 w-4 text-gray-500 mr-2" />
                                        <a
                                            href={jobDetails.companyPosted?.companyDetails?.websiteUrl ? `https://${jobDetails.companyPosted.companyDetails.websiteUrl}` : '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            {jobDetails.companyPosted?.companyDetails?.websiteUrl || 'Not specified'}
                                        </a>
                                    </div>
                                    {/* Hiring Venus  */}
                                     <div className="flex items-center mt-1">
                                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                        <p className="text-sm text-gray-600">{jobDetails?.venue || 'Venue Not Specified'}</p>
                                    </div>


                                    <div className="flex space-x-2 mt-5">
                                <button
                                    onClick={handleApply}
                                    className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition duration-200">
                                    Register Now
                                </button>
                                <button
                                    onClick={() => handleSave(jobDetails?._id, "poolcampus")}
                                    className={`inline-flex items-center justify-center px-4 py-2 border ${isSaved ? 'border-gray-400 bg-gray-100' : 'border-gray-300 bg-white'} text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isSaved ? 'text-blue-600 fill-current' : 'text-gray-500'}`} viewBox="0 0 20 20" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor">
                                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                    </svg>
                                    {isSaved ? 'Saved' : 'Save'}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                    </svg>
                                    Share
                                </button>
                            </div>
                                </div>

                                
                            </div>
                            
                            
                        </div>
                    </div>

                    {/* All subsequent sections */}
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About {jobDetails.companyPosted?.companyDetails?.companyName || 'the Company'}</h2>
                        <p className="text-gray-700 mb-6">{jobDetails.companyPosted?.companyDetails?.description || 'No description provided.'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{jobDetails.companyPosted?.companyDetails?.numberOfEmployees || 'N/A'}</div>
                                <div className="text-sm text-gray-600">Employees</div>
                            </div>
                            {/* <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">N/A</div>
                                <div className="text-sm text-gray-600">Revenue</div>
                            </div> */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{jobDetails.companyPosted?.companyDetails?.industryType || 'N/A'}</div>
                                <div className="text-sm text-gray-600">Industries</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{jobDetails.companyPosted?.companyDetails?.country || 'N/A'}</div>
                                <div className="text-sm text-gray-600">Countries</div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                        <div className="prose max-w-none text-gray-700">
                            <p className="mb-4">{jobDetails?.description || 'No job description provided.'}</p>
                        </div>
                    </div>
                    
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                             <div>
                                <div className="text-sm font-medium text-gray-500">Employment Type</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.employmentType || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Job Roles</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.jobRoles?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Work Mode</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.workMode || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Number of roundes to be held</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.rounds || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Job Location</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.location?.join(', ') || 'Not Specified'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {jobDetails?.skills?.length > 0 ? (
                                jobDetails.skills.map((skill, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No specific skills mentioned.</p>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Amenity/Facility Required</h2>
                        <div className="flex flex-wrap gap-2">
                            {jobDetails?.amenitiesRequired?.length > 0 ? (
                                jobDetails.amenitiesRequired.map((amenity, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium">
                                        {amenity}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No amenities specified.</p>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Drive Open To</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.collegeTypes?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Eligible Degrees</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.studentStreams?.join(' / ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Eligible Branches</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.studentStreams?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Minimum Students Required</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.minimumStudents || 'Not Specified'}</div>
                            </div>
                        </div>
                         {(typeof jobDetails.eligibilityCriteria === 'string' && jobDetails.eligibilityCriteria) && (
                            <div>
                                <div className="text-sm font-medium text-gray-500">Additional Criteria</div>
                                <p className="mt-1 text-base text-gray-700">{jobDetails.eligibilityCriteria}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Compensation & Benefits</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-gray-500">Total CTC</div>
                                <div className="text-xl font-bold text-gray-900">{jobDetails?.minPackage?.amount ? `₹ ${jobDetails.minPackage.amount} ${jobDetails.minPackage.currency || 'LPA'}` : 'Not Specified'}</div>
                            </div>
                        </div>
                        <h3 className="font-medium text-gray-900 mt-6 mb-2">Benefits Offered</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {jobDetails?.benefits?.length > 0 ? jobDetails.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            )) : <li>No benefits specified.</li>}
                        </ul>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Selection Process</h2>
                        {jobDetails?.selectionProcess?.length > 0 ? (
                            <div className="relative">
                                <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-200"></div>
                                <div className="space-y-6 pl-10">
                                    {jobDetails.selectionProcess.map((step, index) => (
                                        <div key={index} className="relative flex items-start">
                                            <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0 flex-1 rounded-lg bg-gray-50 p-4 border border-gray-200">
                                                <p className="font-medium text-gray-900">{step}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-500 text-center">Selection process details not provided.</p>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Important Dates</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="border border-gray-200 p-4 rounded-md">
                                <p className="text-sm text-gray-500 mb-1">Registration Deadline</p>
                                <p className="font-medium">{formatDate(jobDetails.endDate) || "Not Specified"}</p>
                            </div>
                            <div className="border border-gray-200 p-4 rounded-md">
                                <p className="text-sm text-gray-500 mb-1">Online Test Date</p>
                                <p className="font-medium">Not Specified</p>
                            </div>
                            <div className="border border-gray-200 p-4 rounded-md">
                                <p className="text-sm text-gray-500 mb-1">Interview Window</p>
                                <p className="font-medium">Not Specified</p>
                            </div>
                            <div className="border border-gray-200 p-4 rounded-md">
                                <p className="text-sm text-gray-500 mb-1">Offer Rollout</p>
                                <p className="font-medium">Not Specified</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 py-6 border-t border-gray-200">
                         <h2 className="text-xl font-bold text-gray-900 mb-4">Company Placement Officer Contact:</h2>
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-start">
                                <div className="mr-3 flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-base font-medium text-gray-900">{jobDetails?.contactPerson?.name || 'Not Specified'} <span className='text-sm text-gray-500 '>({jobDetails?.contactPerson?.designation || 'N/A'})</span></div>
                                    {jobDetails?.contactPerson?.email && (
                                        <div className="flex items-center mt-1">
                                            <Mail className="h-4 w-4 text-gray-500 mr-1.5" />
                                            <a href={`mailto:${jobDetails.contactPerson.email}`} className="text-blue-600 hover:text-blue-800 text-sm">{jobDetails.contactPerson.email}</a>
                                        </div>
                                    )}
                                    {jobDetails?.contactPerson?.mobile && (
                                        <div className="flex items-center mt-1">
                                            <Phone className="h-4 w-4 text-gray-500 mr-1.5" />
                                            <a href={`tel:${jobDetails.contactPerson.mobile}`} className="text-blue-600 hover:text-blue-800 text-sm">{jobDetails.contactPerson.mobile}</a>
                                        </div>
                                    )}
                                    {jobDetails?.contactPerson?.linkedin && (
                                        <a href={jobDetails.contactPerson.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center mt-1 text-blue-600 hover:text-blue-800">
                                           <Linkedin className="h-4 w-4 text-gray-500 mr-1.5" />
                                            <span className="text-sm">LinkedIn Profile</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Required Documents</h2>
                        <ul className="space-y-2">
                           {['Resume', 'Educational Certificates', 'ID Proof'].map((document, index) => (
                               <li key={index} className="flex items-start">
                                   <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                   <span className="text-gray-700">{document}</span>
                               </li>
                           ))}
                        </ul>
                    </div>
                    
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Apply (For Pool Drive Participants)</h2>
                        <p className="text-gray-700 mb-4">Please refer to your college placement cell for application procedures.</p>
                        <div className="bg-blue-50 p-4 rounded-md mb-4">
                           <p className="text-blue-800 font-medium mb-1">Colleges must verify student profiles and confirm participation via their placement office login.</p>
                        </div>
                        <div className="mb-6">
                           <h3 className="text-base font-medium mb-2">Drive Venue (If Physical Round is Conducted):</h3>
                           <p className="text-gray-700 mb-2">{jobDetails.venue || 'Not specified'}</p>
                           <a href="#" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                               <MapPin className="h-4 w-4 mr-1" />
                               View on Map
                           </a>
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Participating Colleges</h2>
                        <ul className="space-y-2">
                           <li className="text-gray-700">Not specified</li>
                        </ul>
                        <p className="text-sm text-gray-500 mt-2">(And many more across South India)</p>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                       <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Info & Support</h2>
                       <div className="space-y-4 mb-6">
                           <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                               <Download className="h-5 w-5 mr-2" />
                               Download Drive Details (PDF)
                           </a>
                           <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                               <Calendar className="h-5 w-5 mr-2" />
                               Save Day to the Life at C{jobDetails.companyPosted?.companyDetails?.companyName || 'Company'}
                           </a>
                           <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                               <Info className="h-5 w-5 mr-2" />
                               Frequently Asked Questions
                           </a>
                       </div>
                    </div>
                    
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Important Notes</h2>
                        <ul className="space-y-3">
                            {['Ensure all documents are verified by your college.', 'Keep your profile updated on the portal.'].map((note, index) => (
                               <li key={index} className="flex items-start">
                                   <Info className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                                   <span className="text-gray-800">{note}</span>
                               </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PoolJobDetailsPage;