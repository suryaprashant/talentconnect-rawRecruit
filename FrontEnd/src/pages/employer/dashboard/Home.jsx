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
import { FiPlus, FiUsers, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp, FiXCircle, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getCompanyDashboardMetrics, getCompanyServiceRequestStatus } from '@/lib/Company_AxiosInstance'

function Home() {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState({
    appliedByCategory: {
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

        setDashboardData({
          appliedByCategory: metricsData.appliedByCategory,
          statusTotals: metricsData.statusTotals,
          totalApplied: metricsData.totalApplied,
          totalShortlisted: metricsData.totalShortlisted,
          totalAccepted: metricsData.totalAccepted,
          totalRejected: metricsData.totalRejected,
          serviceRequests: serviceRequestsData,
          loading: false
        })
      } else {
        throw new Error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setDashboardData(prev => ({ ...prev, loading: false }))
    }
  }

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Page Header with only search box */}
        <div className="mb-8 -mt-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex items-center justify-between py-6 px-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Company Dashboard
                </h1>
              </div>
              <div className="w-full max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search across dashboard..."
                    className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {/* On-Campus Applications Card */}
          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-white to-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => navigate('/job-management/On-campus')}
          >
            {/* Background Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 via-transparent to-[#764ba2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#667eea]/20 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#667eea" className="w-5 h-5">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea]">
                  ON-CAMPUS
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-gray-900 mb-1">On-Campus</h3>
              <div className="flex items-baseline space-x-1 mb-2">
                <p className="text-2xl font-bold text-[#667eea]">{dashboardData.appliedByCategory['On-campus']}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">View details</span>
                <div className="p-1.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pool-Campus Applications Card */}
          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-white to-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => navigate('/job-management/Pool-campus')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#f093fb]/5 via-transparent to-[#f5576c]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#f093fb]/20 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-[#f093fb]/20 to-[#f5576c]/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f093fb" className="w-5 h-5">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 text-[#f093fb]">
                  POOL-CAMPUS
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-gray-900 mb-1">Pool-Campus</h3>
              <div className="flex items-baseline space-x-1 mb-2">
                <p className="text-2xl font-bold text-[#f093fb]">{dashboardData.appliedByCategory['Pool-campus']}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">View details</span>
                <div className="p-1.5 bg-gradient-to-r from-[#f093fb] to-[#f5576c] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Off-Campus Applications Card */}
          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-white to-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => navigate('/job-management/Off-campus')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4facfe]/5 via-transparent to-[#00f2fe]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#4facfe]/20 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-[#4facfe]/20 to-[#00f2fe]/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4facfe" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131a1.126 1.126 0 01-1.699.11l-.108-.106a1.14 1.14 0 00-1.59 0l-1.034 1.034a3.75 3.75 0 102.5.5l.2-.2c.322-.321.752-.566 1.218-.708a8.216 8.216 0 002.013-.336 9.02 9.02 0 00-.96-2.646.75.75 0 00-.42-.42 9.04 9.04 0 00-2.645-.961 8.202 8.202 0 00-.336 2.013 3.747 3.747 0 00-.708 1.218l-.2.2a.75.75 0 00.5 1.25h.004a.75.75 0 00.745-.748V9.5l.001-.001a.75.75 0 00-.745-.748H9.5a.75.75 0 00-.75.75v.004c0 .414.336.75.75.75h.004a.75.75 0 00.5-1.25l-.2-.2a5.25 5.25 0 01-1.357-1.318L6.262 6.072z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#4facfe]/10 to-[#00f2fe]/10 text-[#4facfe]">
                  OFF-CAMPUS
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-gray-900 mb-1">Off-Campus</h3>
              <div className="flex items-baseline space-x-1 mb-2">
                <p className="text-2xl font-bold text-[#4facfe]">{dashboardData.appliedByCategory['Off-campus']}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">View details</span>
                <div className="p-1.5 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Application Status Card */}
          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-white to-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => navigate('/applications')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 via-transparent to-[#764ba2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#667eea]/20 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#667eea" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea]">
                  STATUS
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-gray-900 mb-1">Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Applied</span>
                  <span className="font-bold text-[#667eea]">{dashboardData.totalApplied}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Shortlisted</span>
                  <span className="font-bold text-yellow-500">{dashboardData.totalShortlisted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Accepted</span>
                  <span className="font-bold text-green-500">{dashboardData.totalAccepted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Rejected</span>
                  <span className="font-bold text-red-500">{dashboardData.totalRejected}</span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-600">View analytics</span>
                <div className="p-1.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Shortlisted Card */}
          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-white to-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => navigate('/shortlisted/on-campus-listings')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-yellow-500/20 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V6zm-1.5 9.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 text-yellow-600">
                  SHORTLISTED
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-gray-900 mb-1">Shortlisted</h3>
              <div className="flex items-baseline space-x-1 mb-2">
                <p className="text-2xl font-bold text-yellow-500">{dashboardData.totalShortlisted}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
              
              <div className="flex items-center text-xs mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1 text-yellow-500">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V6zm-1.5 9.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500">
                  {dashboardData.totalShortlisted > 0 ? 'In Progress' : 'No Candidates'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">View details</span>
                <div className="p-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Accepted Card */}
          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-white to-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => navigate('/accepted/on-campus-listings')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-green-500/20 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-600">
                  ACCEPTED
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-gray-900 mb-1">Accepted</h3>
              <div className="flex items-baseline space-x-1 mb-2">
                <p className="text-2xl font-bold text-green-500">{dashboardData.totalAccepted}</p>
                <span className="text-xs text-gray-500">candidates</span>
              </div>
              
              <div className="flex items-center text-xs mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1 text-green-500">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500">Final Hires</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">View details</span>
                <div className="p-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Requests Status */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Service Requests Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#667eea]/5 to-transparent rounded-xl">
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
                className="w-full border-[#667eea] text-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white"
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
                  <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] h-3 rounded-full" style={{ width: '100%' }}></div>
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
                        `${Math.min(100, (dashboardData.totalShortlisted / dashboardData.totalApplied) * 100)}%` : '0%' 
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
                        `${Math.min(100, (dashboardData.totalAccepted / dashboardData.totalApplied) * 100)}%` : '0%' 
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
                        `${Math.min(100, (dashboardData.totalRejected / dashboardData.totalApplied) * 100)}%` : '0%' 
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
                className="w-full border-[#667eea] text-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white"
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
                <tr className="bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Job Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Applied</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Shortlisted</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Accepted</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Rejected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* On-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#667eea]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">On-Campus</td>
                  <td className="px-4 py-3 text-[#667eea] font-semibold">{dashboardData.appliedByCategory['On-campus']}</td>
                  <td className="px-4 py-3 text-yellow-600">-</td>
                  <td className="px-4 py-3 text-green-600">-</td>
                  <td className="px-4 py-3 text-red-600">-</td>
                </tr>
                {/* Pool-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#f093fb]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">Pool-Campus</td>
                  <td className="px-4 py-3 text-[#f093fb] font-semibold">{dashboardData.appliedByCategory['Pool-campus']}</td>
                  <td className="px-4 py-3 text-yellow-600">-</td>
                  <td className="px-4 py-3 text-green-600">-</td>
                  <td className="px-4 py-3 text-red-600">-</td>
                </tr>
                {/* Off-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#4facfe]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">Off-Campus</td>
                  <td className="px-4 py-3 text-[#4facfe] font-semibold">{dashboardData.appliedByCategory['Off-campus']}</td>
                  <td className="px-4 py-3 text-yellow-600">-</td>
                  <td className="px-4 py-3 text-green-600">-</td>
                  <td className="px-4 py-3 text-red-600">-</td>
                </tr>
                {/* Totals Row */}
                <tr className="hover:bg-gradient-to-r from-gray-100 to-transparent font-semibold bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">Total</td>
                  <td className="px-4 py-3 text-[#667eea]">{dashboardData.totalApplied}</td>
                  <td className="px-4 py-3 text-yellow-600">{dashboardData.totalShortlisted}</td>
                  <td className="px-4 py-3 text-green-600">{dashboardData.totalAccepted}</td>
                  <td className="px-4 py-3 text-red-600">{dashboardData.totalRejected}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Applied counts are shown by category. Shortlisted, Accepted, and Rejected counts are totals across all categories.
          </div>
        </div>

        {/* Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Shortlisted</h2>
              <button 
                onClick={() => navigate('/shortlisted/on-campus-listings')}
                className="text-sm text-[#667eea] hover:text-[#764ba2] font-medium"
              >
                View All →
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500">No shortlisted candidates data available in dashboard metrics</p>
              <p className="text-xs text-gray-400 mt-2">Detailed candidate information available in dedicated sections</p>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Accepted</h2>
              <button 
                onClick={() => navigate('/accepted/on-campus-listings')}
                className="text-sm text-[#667eea] hover:text-[#764ba2] font-medium"
              >
                View All →
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500">No accepted candidates data available in dashboard metrics</p>
              <p className="text-xs text-gray-400 mt-2">Detailed candidate information available in dedicated sections</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="primary" 
              size="md" 
              className="flex items-center justify-center bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-[#667eea]/30"
              onClick={() => navigate('/hiring-channels/post-a-job')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Post New Job
            </Button>
            <Button 
              variant="outline" 
              size="md"
              className="border-[#667eea] text-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white"
              onClick={() => navigate('/job-management/On-campus')}
            >
              Manage Applications
            </Button>
            <Button 
              variant="outline" 
              size="md"
              className="border-[#667eea] text-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white"
              onClick={() => navigate('/interviews')}
            >
              Schedule Interviews
            </Button>
            <Button 
              variant="outline" 
              size="md"
              className="border-[#667eea] text-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white"
              onClick={() => navigate('/hosting-management')}
            >
              Hosting Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home