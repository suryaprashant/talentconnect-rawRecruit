// import PageHeader from '@/components/dashboard/PageHeader'
// import Button from '@/components/ui/Button'
// import { FiPlus } from 'react-icons/fi'

// function Home() {
//   return (
//     <div>
//       <PageHeader 
//         title="Header Title"
//         label="Label"
//         status="Active"
//         assignee="Assignee"
//         createdAt="July 1, 2023"
//       />
      
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//           <h2 className="mb-4 text-lg font-medium text-gray-900">Main Content</h2>
//           <p className="text-gray-600">
//             This is where your main content would go. You can click and paste content here as needed.
//           </p>
//           <div className="flex justify-end mt-4">
//             <Button
//               variant="primary"
//               size="md"
//               className="flex items-center"
//             >
//               <FiPlus className="w-4 h-4 mr-2" />
//               Add New
//             </Button>
//           </div>
//         </div>
        
//         <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
//           <h2 className="mb-4 text-lg font-medium text-gray-900">Additional Content</h2>
//           <p className="text-gray-600">
//             This is a secondary content area that can be used to display related information or additional features.
//           </p>
//           <div className="flex justify-end mt-4">
//             <Button
//               variant="outline"
//               size="md"
//             >
//               View Details
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Home ;




import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { 
  getCompanyDashboardMetrics, 
  getCompanyServiceRequestStatus, 
  getShortlistedCandidates, 
  getAcceptedCandidates 
} from '@/lib/Company_AxiosInstance'
import axios from 'axios';
import ActivationBlock from '@/components/dashboard/ActivationBlock'
function Home() {
  const navigate = useNavigate()
  const [employer, setEmployer] = useState(null);
  useEffect(() => {
  const fetchEmployer = async () => {
    try {
      const backendUrl = import.meta.env.VITE_Backend_URL;
      const userType = "employer";
      const response = await axios.get(`${backendUrl}/api/dashboard/employer-data`, {
          withCredentials: true,
          headers: userType 
              ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
              : {}
      });
      const data = response.data?.data || response.data;

      setEmployer(data);
      console.log('Employer information:', data); 
    }catch (error) {
    console.error('Error fetching employer information:', error);
  }
  } 
  fetchEmployer()
}, [])
  const [dashboardData, setDashboardData] = useState({
    appliedByCategory: {
      'On-campus': 0,
      'Pool-campus': 0,
      'Off-campus': 0
    },
    shortlistedByCategory: {
      'On-campus': 0,
      'Pool-campus': 0,
      'Off-campus': 0
    },
    acceptedByCategory: {
      'On-campus': 0,
      'Pool-campus': 0,
      'Off-campus': 0
    },
    rejectedByCategory: {
      'On-campus': 0,
      'Pool-campus': 0,
      'Off-campus': 0
    },
    statusTotals: {
      'Shortlisted': 0,
      'Accepted': 0,
      'Rejected': 0
    },
    totalApplied: 0,
    totalShortlisted: 0,
    totalAccepted: 0,
    totalRejected: 0,
    serviceRequests: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    },
    recentShortlisted: [],
    recentAccepted: [],
    loading: true
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
  try {
    setDashboardData(prev => ({ ...prev, loading: true }))

    const [metricsResponse, serviceRequestsResponse] = await Promise.all([
      getCompanyDashboardMetrics(),
      getCompanyServiceRequestStatus().catch(() => ({
        data: {
          success: false,
          data: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
          }
        }
      }))
    ])

    if (metricsResponse.data?.success) {
      const metricsData = metricsResponse.data.data

      let serviceRequestsData = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      }

      if (serviceRequestsResponse.data?.success && serviceRequestsResponse.data?.data) {
        serviceRequestsData = serviceRequestsResponse.data.data
      } else if (serviceRequestsResponse.data?.data) {
        serviceRequestsData = serviceRequestsResponse.data.data
      }

      // Use the metrics from the dashboard API
      const appliedByCategory = metricsData.appliedByCategory || {
        'On-campus': 0,
        'Pool-campus': 0,
        'Off-campus': 0
      }

      const shortlistedByCategory = metricsData.shortlistedByCategory || {
        'On-campus': 0,
        'Pool-campus': 0,
        'Off-campus': 0
      }

      const acceptedByCategory = metricsData.acceptedByCategory || {
        'On-campus': 0,
        'Pool-campus': 0,
        'Off-campus': 0
      }

      const rejectedByCategory = metricsData.rejectedByCategory || {
        'On-campus': 0,
        'Pool-campus': 0,
        'Off-campus': 0
      }

      const statusTotals = metricsData.statusTotals || {
        'Shortlisted': 0,
        'Accepted': 0,
        'Rejected': 0
      }

      // Calculate totals
      const totalApplied = metricsData.totalApplied || 0
      const totalShortlisted = metricsData.totalShortlisted || 0
      const totalAccepted = metricsData.totalAccepted || 0
      const totalRejected = metricsData.totalRejected || 0

      // Now fetch candidate details for display
      let recentShortlisted = [];
      let recentAccepted = [];

      try {
        // Fetch shortlisted candidates
        const shortlistedResponse = await getShortlistedCandidates();
        if (shortlistedResponse.data?.success) {
          recentShortlisted = shortlistedResponse.data.data.slice(0, 3);
        }
      } catch (error) {
        console.warn('Failed to fetch shortlisted candidates:', error);
      }

      try {
        // Fetch accepted candidates
        const acceptedResponse = await getAcceptedCandidates();
        if (acceptedResponse.data?.success) {
          recentAccepted = acceptedResponse.data.data.slice(0, 3);
        }
      } catch (error) {
        console.warn('Failed to fetch accepted candidates:', error);
      }

      // If the metrics API doesn't provide categorized shortlisted/accepted data,
      // we need to fetch it from the individual endpoints
      if (!metricsData.shortlistedByCategory || !metricsData.acceptedByCategory) {
        try {
          // Fetch detailed data to calculate categories
          const [shortlistedResponse, acceptedResponse] = await Promise.all([
            getShortlistedCandidates(),
            getAcceptedCandidates()
          ]);

          // Calculate shortlisted by category from fetched data
          if (shortlistedResponse.data?.success && shortlistedResponse.data.data) {
            const shortlistedData = shortlistedResponse.data.data;
            shortlistedByCategory['On-campus'] = shortlistedData.filter(c => c.category === 'On-campus').length;
            shortlistedByCategory['Pool-campus'] = shortlistedData.filter(c => c.category === 'Pool-campus').length;
            shortlistedByCategory['Off-campus'] = shortlistedData.filter(c => c.category === 'Off-campus').length;
          }

          // Calculate accepted by category from fetched data
          if (acceptedResponse.data?.success && acceptedResponse.data.data) {
            const acceptedData = acceptedResponse.data.data;
            acceptedByCategory['On-campus'] = acceptedData.filter(c => c.category === 'On-campus').length;
            acceptedByCategory['Pool-campus'] = acceptedData.filter(c => c.category === 'Pool-campus').length;
            acceptedByCategory['Off-campus'] = acceptedData.filter(c => c.category === 'Off-campus').length;
          }
        } catch (error) {
          console.warn('Failed to fetch categorized data:', error);
        }
      }

      setDashboardData({
        appliedByCategory,
        shortlistedByCategory,
        acceptedByCategory,
        rejectedByCategory,
        statusTotals,
        totalApplied,
        totalShortlisted,
        totalAccepted,
        totalRejected,
        serviceRequests: serviceRequestsData,
        recentShortlisted,
        recentAccepted,
        loading: false
      });
    } else {
      throw new Error('Failed to fetch dashboard data');
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    setDashboardData(prev => ({ ...prev, loading: false }));
  }
}

//   const fetchDashboardData = async () => {
//   try {
//     setDashboardData(prev => ({ ...prev, loading: true }))

//     // For company dashboard, we need company-specific APIs
//     const [metricsResponse, serviceRequestsResponse] = await Promise.all([
//       getCompanyDashboardMetrics(),
//       getCompanyServiceRequestStatus().catch(() => ({
//         data: {
//           success: false,
//           data: {
//             total: 0,
//             pending: 0,
//             approved: 0,
//             rejected: 0
//           }
//         }
//       }))
//     ])

//     console.log('🔍 COMPANY DASHBOARD - Metrics Response:', metricsResponse.data)
//     console.log('🔍 COMPANY DASHBOARD - Service Requests:', serviceRequestsResponse.data)

//     // Initialize with defaults
//     let appliedByCategory = {
//       'On-campus': 0,
//       'Pool-campus': 0,
//       'Off-campus': 0
//     };
//     let shortlistedByCategory = {
//       'On-campus': 0,
//       'Pool-campus': 0,
//       'Off-campus': 0
//     };
//     let acceptedByCategory = {
//       'On-campus': 0,
//       'Pool-campus': 0,
//       'Off-campus': 0
//     };
//     let rejectedByCategory = {
//       'On-campus': 0,
//       'Pool-campus': 0,
//       'Off-campus': 0
//     };

//     let totalApplied = 0;
//     let totalShortlisted = 0;
//     let totalAccepted = 0;
//     let totalRejected = 0;

//     // Service requests
//     let serviceRequestsData = {
//       total: 0,
//       pending: 0,
//       approved: 0,
//       rejected: 0
//     };

//     // Process metrics response
//     if (metricsResponse.data?.success) {
//       const metricsData = metricsResponse.data.data;
      
//       // Check different possible response structures
//       if (metricsData.appliedByCategory) {
//         appliedByCategory = metricsData.appliedByCategory;
//       }
      
//       if (metricsData.statusTotals) {
//         totalShortlisted = metricsData.statusTotals['Shortlisted'] || 0;
//         totalAccepted = metricsData.statusTotals['Accepted'] || 0;
//         totalRejected = metricsData.statusTotals['Rejected'] || 0;
//       }
      
//       // Direct totals
//       totalApplied = metricsData.totalApplied || 0;
//       totalShortlisted = metricsData.totalShortlisted || totalShortlisted;
//       totalAccepted = metricsData.totalAccepted || totalAccepted;
//       totalRejected = metricsData.totalRejected || totalRejected;
      
//       // If we have rejected by category
//       if (metricsData.rejectedByCategory) {
//         rejectedByCategory = metricsData.rejectedByCategory;
//       }
//     } else {
//       console.warn('⚠️ Company dashboard metrics API returned unsuccessful')
//       // Try to get data from other company-specific endpoints
//       await fetchCompanyApplicationsManually();
//       return; // Exit early, the function below will update state
//     }

//     // Process service requests
//     if (serviceRequestsResponse.data?.success && serviceRequestsResponse.data?.data) {
//       serviceRequestsData = serviceRequestsResponse.data.data;
//     }

//     // For shortlisted and accepted, we might need to call company-specific APIs
//     // These might be different from user APIs
//     try {
//       // Try company-specific APIs for candidates
//       // You might need to implement these in your lib/Company_AxiosInstance
//       const [shortlistedCandidates, acceptedCandidates] = await Promise.all([
//         // getCompanyShortlistedCandidates() - if you have this
//         // getCompanyAcceptedCandidates() - if you have this
//         Promise.resolve({ data: { success: true, data: [] } }),
//         Promise.resolve({ data: { success: true, data: [] } })
//       ]);

//       if (shortlistedCandidates.data?.success) {
//         const candidates = shortlistedCandidates.data.data || [];
//         shortlistedByCategory = categorizeCandidates(candidates);
//       }

//       if (acceptedCandidates.data?.success) {
//         const candidates = acceptedCandidates.data.data || [];
//         acceptedByCategory = categorizeCandidates(candidates);
//       }
//     } catch (error) {
//       console.log('Candidate APIs not available, using metrics data:', error)
//     }

//     // If we still have zeros, try to calculate from available data
//     // Since you have 2 applications (1 Applied, 1 Shortlisted) for On-campus
//     // Let's manually set for testing
//     if (totalApplied === 0 && totalShortlisted === 0 && totalAccepted === 0) {
//       console.log('⚠️ Using manual counts for testing - remove when APIs work')
      
//       // Based on your data: 2 applications, both On-campus
//       // 1 with status "Applied", 1 with status "Shortlisted"
//       appliedByCategory = {
//         'On-campus': 2,
//         'Pool-campus': 0,
//         'Off-campus': 0
//       };
      
//       shortlistedByCategory = {
//         'On-campus': 1, // The shortlisted one
//         'Pool-campus': 0,
//         'Off-campus': 0
//       };
      
//       totalApplied = 2;
//       totalShortlisted = 1;
//       totalAccepted = 0;
//       totalRejected = 0;
//     }

//     console.log('✅ FINAL DASHBOARD DATA:', {
//       appliedByCategory,
//       shortlistedByCategory,
//       acceptedByCategory,
//       totalApplied,
//       totalShortlisted,
//       totalAccepted,
//       totalRejected
//     });

//     setDashboardData({
//       appliedByCategory,
//       shortlistedByCategory,
//       acceptedByCategory,
//       rejectedByCategory,
//       statusTotals: {
//         'Shortlisted': totalShortlisted,
//         'Accepted': totalAccepted,
//         'Rejected': totalRejected
//       },
//       totalApplied,
//       totalShortlisted,
//       totalAccepted,
//       totalRejected,
//       serviceRequests: serviceRequestsData,
//       recentShortlisted: [], // Would come from company candidates API
//       recentAccepted: [], // Would come from company candidates API
//       loading: false
//     });

//   } catch (error) {
//     console.error('❌ Failed to fetch company dashboard data:', error)
//     // Fallback for testing
//     setDashboardData({
//       appliedByCategory: { 'On-campus': 2, 'Pool-campus': 0, 'Off-campus': 0 },
//       shortlistedByCategory: { 'On-campus': 1, 'Pool-campus': 0, 'Off-campus': 0 },
//       acceptedByCategory: { 'On-campus': 0, 'Pool-campus': 0, 'Off-campus': 0 },
//       rejectedByCategory: { 'On-campus': 0, 'Pool-campus': 0, 'Off-campus': 0 },
//       statusTotals: { 'Shortlisted': 1, 'Accepted': 0, 'Rejected': 0 },
//       totalApplied: 2,
//       totalShortlisted: 1,
//       totalAccepted: 0,
//       totalRejected: 0,
//       serviceRequests: { total: 0, pending: 0, approved: 0, rejected: 0 },
//       recentShortlisted: [],
//       recentAccepted: [],
//       loading: false
//     })
//   }
// }

// // Helper to fetch applications manually if main API fails
// const fetchCompanyApplicationsManually = async () => {
//   try {
//     console.log('🔄 Trying to fetch company applications manually...')
    
//     // You might need these company-specific APIs:
//     // 1. API to get all applications to company's jobs
//     // 2. API to get counts by status
    
//     // Temporary: Use hardcoded data based on what you showed
//     const companyApplications = [
//       { jobType: 'On-campus', status: 'Applied' },
//       { jobType: 'On-campus', status: 'Shortlisted' }
//     ];
    
//     // Calculate counts
//     const appliedByCategory = {
//       'On-campus': companyApplications.filter(app => app.jobType === 'On-campus').length,
//       'Pool-campus': companyApplications.filter(app => app.jobType === 'Pool-campus').length,
//       'Off-campus': companyApplications.filter(app => app.jobType === 'Off-campus').length
//     };
    
//     const shortlistedByCategory = {
//       'On-campus': companyApplications.filter(app => app.jobType === 'On-campus' && app.status === 'Shortlisted').length,
//       'Pool-campus': companyApplications.filter(app => app.jobType === 'Pool-campus' && app.status === 'Shortlisted').length,
//       'Off-campus': companyApplications.filter(app => app.jobType === 'Off-campus' && app.status === 'Shortlisted').length
//     };
    
//     const totalApplied = companyApplications.length;
//     const totalShortlisted = companyApplications.filter(app => app.status === 'Shortlisted').length;
    
//     console.log('📊 Manual calculation:', {
//       appliedByCategory,
//       shortlistedByCategory,
//       totalApplied,
//       totalShortlisted
//     });
    
//     setDashboardData({
//       appliedByCategory,
//       shortlistedByCategory,
//       acceptedByCategory: { 'On-campus': 0, 'Pool-campus': 0, 'Off-campus': 0 },
//       rejectedByCategory: { 'On-campus': 0, 'Pool-campus': 0, 'Off-campus': 0 },
//       statusTotals: {
//         'Shortlisted': totalShortlisted,
//         'Accepted': 0,
//         'Rejected': 0
//       },
//       totalApplied,
//       totalShortlisted,
//       totalAccepted: 0,
//       totalRejected: 0,
//       serviceRequests: { total: 0, pending: 0, approved: 0, rejected: 0 },
//       recentShortlisted: [],
//       recentAccepted: [],
//       loading: false
//     });
    
//   } catch (error) {
//     console.error('Manual fetch failed:', error);
//     setDashboardData(prev => ({ ...prev, loading: false }));
//   }
// }

// // Helper function (same as before)
// const categorizeCandidates = (candidates) => {
//   const categories = {
//     'On-campus': 0,
//     'Pool-campus': 0,
//     'Off-campus': 0
//   };

//   candidates.forEach(candidate => {
//     const jobType = candidate.jobType || 
//                    candidate.hiringType || 
//                    candidate.category || 
//                    candidate.jobDetails?.[0]?.jobType ||
//                    candidate.applicationDetails?.jobType ||
//                    '';
    
//     const jobTypeLower = jobType.toLowerCase();
    
//     if (jobTypeLower.includes('on-campus') || jobTypeLower.includes('oncampus')) {
//       categories['On-campus']++;
//     } else if (jobTypeLower.includes('pool-campus') || jobTypeLower.includes('poolcampus') || jobTypeLower.includes('pool')) {
//       categories['Pool-campus']++;
//     } else if (jobTypeLower.includes('off-campus') || jobTypeLower.includes('offcampus') || jobTypeLower.includes('off')) {
//       categories['Off-campus']++;
//     } else {
//       categories['On-campus']++;
//     }
//   });

//   return categories;
// };

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
      </div>
    )
  }
  const employerName = employer?.profile?.employerDetails?.name || "Employer";
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Page Header with only search box */}
        <div className="mb-8 -mt-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex items-center justify-between py-6 px-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primaryBrand to-[#6C8BFF] bg-clip-text text-transparent">
                  Employer Dashboard
                </h1>
              </div>
              {/* <div className="w-full max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search across dashboard..."
                    className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none shadow-sm"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <ActivationBlock
          greeting="Welcome back !"
          subtitle={employerName}
          steps={[
            { number: 1, label: "Post Job" },
            { number: 2, label: "Get Applications" },
            { number: 3, label: "Shortlist" },
          ]}
        >
          <div className="flex flex-col items-center lg:items-end gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-600 bg-slate-300 px-2 py-1 mx-auto rounded-full">
              Start Hiring
            </span>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'On Campus', path: '/hiring-channels/on-campus-hiring/employer' },
                { label: 'Off Campus', path: '/hiring-channels/off-campus-hiring/employer' },
                { label: 'Pool Campus', path: '/hiring-channels/pool-campus-hiring/employer' },
                { label: 'Internship', path: '/hiring-channels/post-an-internship/employer' }
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => navigate(btn.path)}
                  className="group relative flex items-center justify-center min-w-[140px] px-4 py-2.5 bg-blue-900 text-white rounded-xl transition-all duration-300 hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95"
                >
                  <span className="text-[11px] font-bold uppercase tracking-tight">
                    {btn.label}
                  </span>
                  {/* Subtle arrow that appears on hover */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-3 w-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </ActivationBlock>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 auto-rows-fr gap-3 mb-8">
          {/* On-Campus Applications Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/job-management/On-campus')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9333ea] to-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#9333ea]/5 via-transparent to-[#7c3aed]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#9333ea]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#9333ea]/10 to-[#7c3aed]/10 rounded-lg border border-[#9333ea]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9333ea" className="w-4 h-4">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">On-Campus</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#9333ea] to-[#7c3aed] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#9333ea]">{dashboardData.appliedByCategory['On-campus']}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
            </div>
          </div>

          {/* Pool-Campus Applications Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/job-management/Pool-campus')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/5 via-transparent to-[#6d28d9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#7c3aed]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#7c3aed]/10 to-[#6d28d9]/10 rounded-lg border border-[#7c3aed]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7c3aed" className="w-4 h-4">
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Pool-Campus</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#7c3aed]">{dashboardData.appliedByCategory['Pool-campus']}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
            </div>
          </div>

          {/* Off-Campus Applications Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/job-management/Off-campus')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6d28d9] to-[#5b21b6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#6d28d9]/5 via-transparent to-[#5b21b6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#6d28d9]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#6d28d9]/10 to-[#5b21b6]/10 rounded-lg border border-[#6d28d9]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6d28d9" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131a1.126 1.126 0 01-1.699.11l-.108-.106a1.14 1.14 0 00-1.59 0l-1.034 1.034a3.75 3.75 0 102.5.5l.2-.2c.322-.321.752-.566 1.218-.708a8.216 8.216 0 002.013-.336 9.02 9.02 0 00-.96-2.646.75.75 0 00-.42-.42 9.04 9.04 0 00-2.645-.961 8.202 8.202 0 00-.336 2.013 3.747 3.747 0 00-.708 1.218l-.2.2a.75.75 0 00.5 1.25h.004a.75.75 0 00.745-.748V9.5l.001-.001a.75.75 0 00-.745-.748H9.5a.75.75 0 00-.75.75v.004c0 .414.336.75.75.75h.004a.75.75 0 00.5-1.25l-.2-.2a5.25 5.25 0 01-1.357-1.318L6.262 6.072z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Off-Campus</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#6d28d9] to-[#5b21b6] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#6d28d9]">{dashboardData.appliedByCategory['Off-campus']}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
            </div>
          </div>

          {/* Application Status Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/company/application-status/oncampus')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5b21b6] to-[#4c1d95] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#5b21b6]/5 via-transparent to-[#4c1d95]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#5b21b6]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#5b21b6]/10 to-[#4c1d95]/10 rounded-lg border border-[#5b21b6]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5b21b6" className="w-4 h-4">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Status</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#5b21b6] to-[#4c1d95] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mt-auto">
                <div className="text-center">
                  <div className="text-sm font-bold text-[#9333ea]">{dashboardData.totalApplied}</div>
                  <div className="text-[10px] text-gray-500 truncate">Applied</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-[#6d28d9]">{dashboardData.totalRejected}</div>
                  <div className="text-[10px] text-gray-500 truncate">Rejected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Shortlisted Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/shortlisted/on-campus-listings')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4c1d95] to-[#3b0764] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95]/5 via-transparent to-[#3b0764]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4c1d95]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#4c1d95]/10 to-[#3b0764]/10 rounded-lg border border-[#4c1d95]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4c1d95" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V6zm-1.5 9.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Shortlisted</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#4c1d95] to-[#3b0764] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#4c1d95]">{dashboardData.totalShortlisted}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
              
              <div className="text-[10px] text-gray-500 mt-0.5">
                {dashboardData.totalShortlisted > 0 ? 'In Progress' : 'No Candidates'}
              </div>
            </div>
          </div>

          {/* Accepted Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/accepted/on-campus-listings')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3b0764] to-[#2d044e] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#3b0764]/5 via-transparent to-[#2d044e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#3b0764]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#3b0764]/10 to-[#2d044e]/10 rounded-lg border border-[#3b0764]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b0764" className="w-4 h-4">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Accepted</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#3b0764] to-[#2d044e] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#3b0764]">{dashboardData.totalAccepted}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
              
              <div className="text-[10px] text-gray-500 mt-0.5">
                Final Hires
              </div>
            </div>
          </div>
        </div>

        {/* Service Requests & Applications Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Requests Status */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Service Requests Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#143694]/5 to-transparent rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">Pending Requests</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{dashboardData.serviceRequests.pending}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#43e97b]/5 to-transparent rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">Approved Requests</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{dashboardData.serviceRequests.approved}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f5576c]/5 to-transparent rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">Rejected Requests</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{dashboardData.serviceRequests.rejected}</span>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/service-request/workforce-solution')}
                className="w-full border-[#143694] text-[#143694] hover:bg-gradient-to-r hover:from-[#143694] hover:to-[#1e4ed8] hover:text-white"
              >
                Manage Service Requests
              </Button>
            </div>
          </div>

          {/* Applications Overview */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Application Funnel</h2>
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Total Applied</span>
                  <span className="text-sm font-bold text-gray-900">{dashboardData.totalApplied}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-[#143694] to-[#1e4ed8] h-3 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Shortlisted</span>
                  <span className="text-sm font-bold text-gray-900">
                    {dashboardData.totalApplied > 0 ?
                      Math.round((dashboardData.totalShortlisted / dashboardData.totalApplied) * 100) : 0}%
                    ({dashboardData.totalShortlisted})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full"
                    style={{
                      width: dashboardData.totalApplied > 0 ?
                        `${Math.max(1, (dashboardData.totalShortlisted / dashboardData.totalApplied) * 100)}%` : '1%'
                    }}
                  ></div>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Accepted</span>
                  <span className="text-sm font-bold text-gray-900">
                    {dashboardData.totalApplied > 0 ?
                      Math.round((dashboardData.totalAccepted / dashboardData.totalApplied) * 100) : 0}%
                    ({dashboardData.totalAccepted})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full"
                    style={{
                      width: dashboardData.totalApplied > 0 ?
                        `${Math.max(1, (dashboardData.totalAccepted / dashboardData.totalApplied) * 100)}%` : '1%'
                    }}
                  ></div>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Rejected</span>
                  <span className="text-sm font-bold text-gray-900">
                    {dashboardData.totalApplied > 0 ?
                      Math.round((dashboardData.totalRejected / dashboardData.totalApplied) * 100) : 0}%
                    ({dashboardData.totalRejected})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full"
                    style={{
                      width: dashboardData.totalApplied > 0 ?
                        `${Math.max(1, (dashboardData.totalRejected / dashboardData.totalApplied) * 100)}%` : '1%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/job-management/On-campus')}
                className="w-full border-[#143694] text-[#143694] hover:bg-gradient-to-r hover:from-[#143694] hover:to-[#1e4ed8] hover:text-white"
              >
                View Job Management
              </Button>
            </div>
          </div>
        </div>

        {/* Applications by Job Type Breakdown */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Applications by Job Type</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Job Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Applied</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Shortlisted</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Accepted</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Rejected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* On-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#143694]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">On-Campus</td>
                  <td className="px-4 py-3 text-[#143694] font-semibold">{dashboardData.appliedByCategory['On-campus']}</td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">{dashboardData.shortlistedByCategory['On-campus']}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{dashboardData.acceptedByCategory['On-campus']}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">{dashboardData.rejectedByCategory['On-campus']}</td>
                </tr>
                {/* Pool-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#f093fb]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">Pool-Campus</td>
                  <td className="px-4 py-3 text-[#f093fb] font-semibold">{dashboardData.appliedByCategory['Pool-campus']}</td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">{dashboardData.shortlistedByCategory['Pool-campus']}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{dashboardData.acceptedByCategory['Pool-campus']}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">{dashboardData.rejectedByCategory['Pool-campus']}</td>
                </tr>
                {/* Off-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#4facfe]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">Off-Campus</td>
                  <td className="px-4 py-3 text-[#4facfe] font-semibold">{dashboardData.appliedByCategory['Off-campus']}</td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">{dashboardData.shortlistedByCategory['Off-campus']}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{dashboardData.acceptedByCategory['Off-campus']}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">{dashboardData.rejectedByCategory['Off-campus']}</td>
                </tr>
                {/* Totals Row */}
                <tr className="hover:bg-gradient-to-r from-gray-100 to-transparent font-semibold bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">Total</td>
                  <td className="px-4 py-3 text-[#143694]">{dashboardData.totalApplied}</td>
                  <td className="px-4 py-3 text-yellow-600">{dashboardData.totalShortlisted}</td>
                  <td className="px-4 py-3 text-green-600">{dashboardData.totalAccepted}</td>
                  <td className="px-4 py-3 text-red-600">{dashboardData.totalRejected}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Applied, Shortlisted, Accepted, and Rejected counts are shown by category.
          </div>
        </div>

        {/* Recent Applications */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Shortlisted</h2>
              <button
                onClick={() => navigate('/shortlisted/on-campus-listings')}
                className="text-sm text-[#143694] hover:text-[#1e4ed8] font-medium"
              >
                View All →
              </button>
            </div>
            {dashboardData.recentShortlisted.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentShortlisted.map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/50 to-transparent rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                        {candidate.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{candidate.name || 'Candidate'}</p>
                        <p className="text-xs text-gray-500 capitalize">{candidate.jobType || 'On-Campus'} • {candidate.role || 'Role'}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      Shortlisted
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No shortlisted candidates yet</p>
                <p className="text-xs text-gray-400 mt-2">Shortlisted candidates will appear here</p>
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Accepted</h2>
              <button
                onClick={() => navigate('/accepted/on-campus-listings')}
                className="text-sm text-[#143694] hover:text-[#1e4ed8] font-medium"
              >
                View All →
              </button>
            </div>
            {dashboardData.recentAccepted.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentAccepted.map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/50 to-transparent rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                        {candidate.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{candidate.name || 'Candidate'}</p>
                        <p className="text-xs text-gray-500 capitalize">{candidate.jobType || 'On-Campus'} • {candidate.role || 'Role'}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      Accepted
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No accepted candidates yet</p>
                <p className="text-xs text-gray-400 mt-2">Accepted candidates will appear here</p>
              </div>
            )}
          </div>
        </div> */}

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white hover:shadow-lg hover:shadow-[#143694]/30"
              onClick={() => navigate('/hiring-channels/on-campus-hiring')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Post On-Campus
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white hover:shadow-lg hover:shadow-[#143694]/30"
              onClick={() => navigate('/hiring-channels/pool-campus-hiring')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Post Pool-Campus
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white hover:shadow-lg hover:shadow-[#143694]/30"
              onClick={() => navigate('/hiring-channels/off-campus-hiring')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Post Off-Campus
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-[#143694] text-[#143694] hover:bg-gradient-to-r hover:from-[#143694] hover:to-[#1e4ed8] hover:text-white"
              onClick={() => navigate('/job-management/On-campus')}
            >
              Manage Applications
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-[#143694] text-[#143694] hover:bg-gradient-to-r hover:from-[#143694] hover:to-[#1e4ed8] hover:text-white"
              onClick={() => navigate('/employer-interviews')}
            >
              Schedule Interviews
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home