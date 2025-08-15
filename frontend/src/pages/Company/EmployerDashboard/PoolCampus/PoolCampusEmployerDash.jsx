// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { mockColleges } from '@/constants/mockData';

// const PoolCampusEmployeeDash = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [college, setCollege] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call to fetch college details
//     setLoading(true);
//     // In a real app, this would be an API call using the ID
//     const foundCollege = mockColleges.find(c => c.id === parseInt(id));
    
//     if (foundCollege) {
//       setCollege(foundCollege);
//     }
//     setLoading(false);
//   }, [id]);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (!college) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <h2 className="text-2xl font-bold mb-4">College not found</h2>
//         <button 
//           onClick={() => navigate('/employer-dashboard/pool-campus-requests')}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Back to listings
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex flex-col md:flex-row justify-between mb-6">
//           <div>
//             <div className="mb-2 flex items-center">
//               <h1 className="text-2xl font-bold">Registration from:</h1>
//             </div>
//             <h2 className="text-3xl font-bold mb-2">{college.name}</h2>
//             <div className="flex items-center text-sm text-gray-600 mb-1">
//               <span className="mr-2">College Code: {college.collegeCode}</span>
//             </div>
//             <div className="flex items-center mb-1">
//               <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
//               </svg>
//               <span className="text-gray-600 text-sm">Aug 3 - Aug 5, 2025</span>
//             </div>
//             <div className="flex items-center mb-1">
//               <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//               </svg>
//               <span className="text-gray-600 text-sm">{college.location}</span>
//               <div className="flex items-center ml-2">
//                 <span className="text-yellow-500">★★★★★</span>
//                 <span className="text-gray-600 text-sm ml-1">{college.reviewCount} Reviews</span>
//               </div>
//             </div>
//             <div className="flex items-center mb-4">
//               <span className="text-gray-600 text-sm">NAAC Accredited A+ - Year {college.naacYear}</span>
//             </div>
//             <div className="mb-2">
//               <span className="text-gray-600 text-sm">Affiliated University: {college.affiliatedUniversity}</span>
//             </div>
//             <div className="flex items-center mb-4">
//               <span className="text-gray-600 text-sm">Type: {college.type}</span>
//               <span className="ml-4 text-sm bg-gray-100 px-2 py-1 rounded">Autonomous</span>
//             </div>
//           </div>
          
//           <div className="flex flex-col md:items-end">
//             <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded mb-4">
//               <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="flex gap-2">
//               <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded text-sm">Accept Invitation</button>
//               <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm">Save</button>
//               <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm flex items-center">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
//                 </svg>
//                 Share
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="border-t border-gray-200 pt-6">
//           <h3 className="text-xl font-bold mb-4">About {college.name}</h3>
//           <p className="text-gray-700 mb-6">{college.about}</p>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//             <div className="bg-white p-4 rounded border border-gray-200">
//               <h4 className="font-bold text-3xl text-blue-600">{college.placementRate}%</h4>
//               <p className="text-gray-600 text-sm">Placement Rate</p>
//             </div>
//             <div className="bg-white p-4 rounded border border-gray-200">
//               <h4 className="font-bold text-3xl text-blue-600">{college.recruiters}+</h4>
//               <p className="text-gray-600 text-sm">Recruiters</p>
//             </div>
//             <div className="bg-white p-4 rounded border border-gray-200">
//               <h4 className="font-bold text-3xl text-blue-600">{college.liveProjects}+</h4>
//               <p className="text-gray-600 text-sm">Live Projects</p>
//             </div>
//             <div className="bg-white p-4 rounded border border-gray-200">
//               <h4 className="font-bold text-3xl text-blue-600">{college.industryMOUs}+</h4>
//               <p className="text-gray-600 text-sm">Industry MOUs</p>
//             </div>
//           </div>
          
//           <div className="mb-8">
//             <h3 className="text-xl font-bold mb-4">Point of Contact - Campus Placement Coordination</h3>
//             <p className="text-gray-700 mb-4">
//               Our Training & Placement Cell will be your single point of contact for all coordination regarding the on-campus recruitment process. Once your company confirms participation, the placement officer will assist with scheduling, logistics, student shortlisting, and post-drive follow-ups.
//             </p>
//             <p className="text-gray-700 mb-2">Please reach out for:</p>
//             <ul className="list-disc pl-6 mb-6 text-gray-700">
//               <li>Drive date confirmation</li>
//               <li>Infrastructure or tech setup queries</li>
//               <li>Shortlist finality or custom requirements</li>
//               <li>Student eligibility clarification</li>
//             </ul>
            
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="font-bold mb-2">College Placement Officer Contact:</h4>
//               <div className="flex items-center mb-2">
//                 <span className="font-medium">{college.contactPerson.name}</span>
//                 <span className="text-gray-600 ml-2">({college.contactPerson.role})</span>
//               </div>
//               <div className="flex items-center text-blue-600 mb-2">
//                 <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                   <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                 </svg>
//                 <a href={`mailto:${college.contactPerson.email}`}>{college.contactPerson.email}</a>
//               </div>
//               <div className="flex items-center text-blue-600">
//                 <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                 </svg>
//                 <a href={`tel:${college.contactPerson.phone}`}>{college.contactPerson.phone}</a>
//               </div>
              
//               <div className="mt-4 border-t border-gray-200 pt-4">
//                 <h4 className="font-bold mb-2">Alternative Contact:</h4>
//                 <div className="flex items-center mb-1">
//                   <span>{college.alternativeContact.name}</span>
//                   <span className="text-gray-600 ml-2">({college.alternativeContact.role})</span>
//                 </div>
//                 <div className="flex items-center text-blue-600">
//                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                   </svg>
//                   <a href={`tel:${college.alternativeContact.phone}`}>{college.alternativeContact.phone}</a>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="mb-8">
//             <h3 className="text-xl font-bold mb-4">Student Batch Details</h3>
//             <table className="w-full border-collapse mb-6">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="border border-gray-200 p-2 text-left">Program</th>
//                   <th className="border border-gray-200 p-2 text-left">Branches Included</th>
//                   <th className="border border-gray-200 p-2 text-left">Total Eligible Students</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {college.programs.map((program, index) => (
//                   <tr key={index}>
//                     <td className="border border-gray-200 p-2">{program.name}</td>
//                     <td className="border border-gray-200 p-2">{program.branches}</td>
//                     <td className="border border-gray-200 p-2">{program.students}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             <h3 className="text-xl font-bold mb-4">Academic Cutoff Followed:</h3>
//             <div className="mb-6">
//               <p className="font-medium mb-2">Graduation Year: 2025</p>
//               <ul className="list-disc pl-6 text-gray-700">
//                 <li>Minimum 60% in 10th and 12th</li>
//                 <li>Minimum 6.5 CGPA in UG</li>
//                 <li>No active backlogs</li>
//               </ul>
//             </div>
            
//             <div className="mb-6">
//               <h3 className="text-xl font-bold mb-4">Proposed Schedule</h3>
//               <p className="text-gray-700 mb-4">
//                 We have several available recruitment drive slots for the 2025 graduating batch. 
//                 We believe our students align well with your hiring requirements and would be an excellent fit for your GeeCo.
//                 Standard Engineer Trainee roles. Our campus is equipped with state-of-the-art infrastructure and has a
//                 strong record of successful placement drives.
//               </p>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <p className="font-medium mb-1">Preferred Drive Date:</p>
//                   <p className="text-gray-700">August 3, 2024</p>
//                 </div>
//                 <div>
//                   <p className="font-medium mb-1">Alternative Dates:</p>
//                   <p className="text-gray-700">August 4 & 5, 2024</p>
//                 </div>
//                 <div>
//                   <p className="font-medium mb-1">Preferred Mode:</p>
//                   <p className="text-gray-700">On-Campus / Hybrid</p>
//                 </div>
//                 <div>
//                   <p className="font-medium mb-1">Time Slots Available:</p>
//                   <p className="text-gray-700">Full day (9:00 AM - 5:00 PM)</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="mb-8">
//               <h3 className="text-xl font-bold mb-4">Campus Facilities</h3>
//               <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>4 Computer Labs (80+ systems each)</span>
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>High-speed Internet (1 Gbps)</span>
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Dedicated interview rooms (45)</span>
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Projector-enabled seminar halls (x2)</span>
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Conference rooms</span>
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Cafeteria and student lounge</span>
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Accommodation for visiting panel (on prior request)</span>
//                 </li>
//               </ul>
//             </div>
            
//             <div className="mb-8">
//               <h3 className="text-xl font-bold mb-4">Attached Documents</h3>
//               <div className="flex flex-col gap-2">
//                 <a href="#" className="flex items-center text-blue-600 hover:underline">
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a2.5 2.5 0 01-5 0V7a1 1 0 012 0v1.5a.5.5 0 001 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
//                   </svg>
//                   Previous Year Placement Report (PDF)
//                 </a>
//                 <a href="#" className="flex items-center text-blue-600 hover:underline">
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a2.5 2.5 0 01-5 0V7a1 1 0 012 0v1.5a.5.5 0 001 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
//                   </svg>
//                   Top 10 Student Resumes (ZIP)
//                 </a>
//               </div>
//             </div>
            
//             <div className="mb-8">
//               <h3 className="text-xl font-bold mb-4">Optional Customizations (as checked by college)</h3>
//               <ul className="space-y-2">
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Willing to share shortlisted resumes before the interview</span>
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Can host online tests through college proctored platform</span>
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-500">Willing to conduct pre-placement talk (PPT) one day prior</span>
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-500">Can provide local transport for interview panel</span>
//                 </li>
//               </ul>
//             </div>
            
//             <div className="mb-8">
//               <h3 className="text-xl font-bold mb-4">Response Requested By</h3>
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <p className="text-yellow-800 font-medium mb-2">Deadline for Employer Response: July 10, 2025</p>
//                 <p className="text-gray-700 text-sm">(So we can finalize the schedule and inform students in time)</p>
//               </div>
//             </div>
            
//             <div className="mt-8 flex justify-between">
//               <div className="flex gap-2">
//                 <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm text-gray-700">
//                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                   Brochure
//                 </button>
//                 <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm text-gray-700">
//                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//                   </svg>
//                   Suggest Alternate Date
//                 </button>
//                 <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm text-gray-700">
//                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
//                     <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
//                   </svg>
//                   Message Placement Officer
//                 </button>
//               </div>
//               <div className="flex gap-2">
//                 <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium">Accept Invitation</button>
//                 <button className="border border-red-500 text-red-500 px-6 py-2 rounded font-medium">Reject Invitation</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PoolCampusEmployeeDash;



import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPoolCampusJobByIdForCompany } from '../../../../lib/College_AxiosIntance'; // Assuming the API function is in this file
import { format } from 'date-fns'; // A useful library for formatting dates

const PoolCampusEmployeeDash = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [posting, setPosting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostingDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                setError(null);
                const response = await getPoolCampusJobByIdForCompany(id);
                if (response && response.data) {
                    setPosting(response.data);
                } else {
                    throw new Error('Posting not found.');
                }
            } catch (err) {
                console.error("Failed to fetch posting details:", err);
                setError('Could not load the requested resource. It might have been removed.');
            } finally {
                setLoading(false);
            }
        };

        fetchPostingDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !posting) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">{error || 'Posting not found'}</h2>
                <button
                    onClick={() => navigate('/employer-dashboard/pool-campus-requests')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Back to Listings
                </button>
            </div>
        );
    }

    // Convenience variables for easier access
    const collegeDetails = posting.collegePosted;
    const collegeName = collegeDetails?.collegeUniversityDetails?.collegeName || 'the College';
    const coordinator = collegeDetails?.placementCoordinatorDetails;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Pool-Campus Drive Request from:</h1>
                        <h2 className="text-3xl font-bold mb-2">{collegeName}</h2>
                        <div className="flex items-center mb-1">
                             <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z"/></svg>
                             <span className="text-gray-600 text-sm">
                                {posting.startDate ? format(new Date(posting.startDate), 'MMM d') : 'N/A'} - {posting.endDate ? format(new Date(posting.endDate), 'MMM d, yyyy') : 'N/A'}
                            </span>

                             <a 
                                href={collegeDetails?.profileAchievements?.collegeWebsite || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                title="Visit College Website"
                                className="flex items-center hover:text-blue-500 ml-5"
                              >
                                <svg className="w-5 h-5 text-gray-600 hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                </svg>
                              </a>
                        </div>
                        <div className="flex items-center mb-1 ">
                           <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            <span className="text-gray-600 text-sm">{posting.location || 'Location not specified'}</span>
                        </div>
                        {/* <div className="flex items-center mb-4">
                            <span className="text-gray-600 text-sm">Job Title: <strong>{posting.jobTitle || 'Not specified'}</strong></span>
                        </div> */}
                    </div>

                    <div className="flex flex-col md:items-end mt-2">
                        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded mb-4 overflow-hidden">
                           {collegeDetails.profileImage ? (
                               <img src={collegeDetails.profileImage} alt={`${collegeName} Logo`} className="w-full h-full object-cover" />
                           ) : (
                                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                           )}
                        </div>
                         <div className="flex gap-2">
                             <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded text-sm">Accept Invitation</button>
                             <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm">Save</button>
                         </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-bold mb-4">About This Opportunity</h3>
                    <p className="text-gray-700 mb-6">{posting.description || 'No description provided.'}</p>
                    
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 rounded border border-gray-200">
                             <h4 className="font-bold text-3xl text-blue-600">{posting.minPackage?.amount ? `${posting.minPackage.amount} LPA` : 'N/A'}</h4>
                            <p className="text-gray-600 text-sm">Minimum Package</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="font-bold text-3xl text-blue-600">{posting.numberOfOpenings || 'N/A'}</h4>
                            <p className="text-gray-600 text-sm">Openings</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="font-bold text-3xl text-blue-600">{posting.employmentType || 'N/A'}</h4>
                            <p className="text-gray-600 text-sm">Employment</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="font-bold text-3xl text-blue-600">{posting.workMode || 'N/A'}</h4>
                            <p className="text-gray-600 text-sm">Work Mode</p>
                        </div>
                    </div>

                    <div className="mb-8">
                         <h3 className="text-xl font-bold mb-4">Point of Contact - Campus Placement</h3>
                         <div className="bg-gray-50 p-4 rounded-lg">
                             <h4 className="font-bold mb-2">College Placement Officer Contact:</h4>
                             <div className="flex items-center mb-2">
                                <span className="font-medium">{posting?.contactPerson?.name || 'Not specified'}</span>
                                <span className="text-gray-600 ml-2">({posting?.contactPerson?.designation || 'TPO'})</span>
                            </div>
                            <div className="flex items-center text-blue-600 mb-2">
                               <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                               <a href={`mailto:${posting?.contactPerson?.email}`}>{posting?.contactPerson?.email || 'No email provided'}</a>
                            </div>
                            <div className="flex items-center text-blue-600">
                               <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                               <a href={`tel:${posting?.contactPerson?.mobile}`}>{ posting?.contactPerson?.mobile || 'No mobile provided'}</a>
                            </div>
                             <div className="flex items-center text-blue-600 mt-2">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16 0H4C1.79 0 0 1.79 0 4v12c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zM6.5 16H3V7h3.5v9zm-1.75-10a1.75 1.75 0 110-3.5A1.75 1.75 0 014.75 6zm11.25 10h-3.5v-5c0-1.38-.28-2.5-2-2.5s-2 .88-2 2v5H7V7h3v1h-.01c1-.88 2-.88 3-.88s3 .88 3 .88V16z" />
                </svg>
                {posting?.contactPerson?.linkedin ? (
                  <a href={posting.contactPerson.linkedin} target="_blank" rel="noopener noreferrer">
                    {posting.contactPerson.linkedin}
                  </a>
                ) : (
                  <span>N/A</span>
                )}
              </div>
                         </div>
                    </div>

                     <div className="mb-8">
                         <h3 className="text-xl font-bold mb-4">Eligible Student Streams</h3>
                         <div className="flex flex-wrap gap-2">
                            {posting.studentStreams?.length > 0 ? (
                                posting.studentStreams.map((stream, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{stream}</span>
                                ))
                            ) : <p className="text-gray-600">No specific streams listed.</p>}
                         </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                         <div className="flex gap-2">
                            <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm text-gray-700">Message Officer</button>
                            <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm text-gray-700">Suggest Alternate Date</button>
                         </div>
                         <div className="flex gap-2">
                             <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium">Accept Invitation</button>
                             <button className="border border-red-500 text-red-500 px-6 py-2 rounded font-medium">Reject Invitation</button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoolCampusEmployeeDash;