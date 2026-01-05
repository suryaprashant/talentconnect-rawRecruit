import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/dashboard/PageHeader'
import Button from '@/components/ui/Button'
import { FiSearch, FiUsers, FiCheckCircle, FiClock, FiTrendingUp, FiBriefcase, FiTarget, FiFileText, FiBarChart2 } from 'react-icons/fi'
import { getCollegeServiceRequestStatus } from '@/lib/College_AxiosIntance'
import { getCompanyDashboardMetrics } from '@/lib/Company_AxiosInstance'

function Home() {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState({
    appliedByCategory: {
      'On-campus': 0,
      'Pool-campus': 0,
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
        getCollegeServiceRequestStatus().catch(() => ({
          data: {
            success: false,
            data: {
              total: 0,
              pending: 0,
              approved: 0,
              rejected: 0
            }
          }
        })),
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
        
        const { 'Off-campus': offCampus, ...appliedByCategoryWithoutOffCampus } = metricsData.appliedByCategory || {};

        setDashboardData({
          appliedByCategory: appliedByCategoryWithoutOffCampus,
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
      console.error('Failed to fetch college dashboard data:', error)
      setDashboardData(prev => ({ ...prev, loading: false }))
    }
  }

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93c5fd]"></div>
      </div>
    )
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-[#d8c4e8]/50 via-[#a8d1e0]/45 to-[#9fd8c5]/50">
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Page Header with search box */}
        <div className="mb-8 -mt-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex items-center justify-between py-6 px-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                  College Dashboard  
                </h1>
              </div>
              {/* <div className="w-full max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search across dashboard..."
                    className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none shadow-sm"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
  
  {/* Card 1 - On-Campus */}
  <div
    className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
    onClick={() => navigate('/manage-application/campus-placement')}
  >
    {/* Bottom accent border */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4c1d95] to-[#5b21b6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    {/* Glow effect on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95]/10 via-transparent to-[#5b21b6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    
    {/* Additional glow border */}
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4c1d95]/20 rounded-2xl transition-all duration-300"></div>

    <div className="relative z-10 flex flex-col flex-grow">
      {/* Top row: Icon + Title + Button */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-[#4c1d95]/10 to-[#5b21b6]/10 rounded-lg border border-[#4c1d95]/20 mt-0.5">
            <FiBriefcase className="w-4 h-4 text-[#4c1d95]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 leading-tight">On-Campus</h3>
          </div>
        </div>
        <div className="p-1 bg-gradient-to-r from-[#4c1d95] to-[#5b21b6] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Number section */}
      <div className="flex items-baseline space-x-1 mt-auto">
        <p className="text-xl font-bold text-[#4c1d95]">{dashboardData.appliedByCategory['On-campus']}</p>
        <span className="text-xs text-gray-500">Companies</span>
      </div>
    </div>
  </div>

  {/* Card 2 - Pool-Campus */}
  <div
    className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
    onClick={() => navigate('/manage-application/poolCampus-placement')}
  >
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5b21b6] to-[#6d28d9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-[#5b21b6]/10 via-transparent to-[#6d28d9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#5b21b6]/20 rounded-2xl transition-all duration-300"></div>

    <div className="relative z-10 flex flex-col flex-grow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-[#5b21b6]/10 to-[#6d28d9]/10 rounded-lg border border-[#5b21b6]/20 mt-0.5">
            <FiTarget className="w-4 h-4 text-[#5b21b6]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 leading-tight">Pool-Campus</h3>
          </div>
        </div>
        <div className="p-1 bg-gradient-to-r from-[#5b21b6] to-[#6d28d9] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="flex items-baseline space-x-1 mt-auto">
        <p className="text-xl font-bold text-[#5b21b6]">{dashboardData.appliedByCategory['Pool-campus']}</p>
        <span className="text-xs text-gray-500">Companies</span>
      </div>
    </div>
  </div>

  {/* Card 3 - Status */}
  <div
    className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
    onClick={() => navigate('/application-status/oncampus')}
  >
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-[#6d28d9]/10 via-transparent to-[#7c3aed]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#6d28d9]/20 rounded-2xl transition-all duration-300"></div>

    <div className="relative z-10 flex flex-col flex-grow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-[#6d28d9]/10 to-[#7c3aed]/10 rounded-lg border border-[#6d28d9]/20 mt-0.5">
            <FiBarChart2 className="w-4 h-4 text-[#6d28d9]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 leading-tight">Status</h3>
          </div>
        </div>
        <div className="p-1 bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-2 gap-1.5 mt-auto">
        <div className="text-center">
          <div className="text-sm font-bold text-[#4c1d95]">{dashboardData.totalApplied}</div>
          <div className="text-[10px] text-gray-500 truncate">Applied</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-[#8b5cf6]">{dashboardData.totalRejected}</div>
          <div className="text-[10px] text-gray-500 truncate">Rejected</div>
        </div>
      </div>
    </div>
  </div>

  {/* Card 4 - Shortlisted */}
  <div
    className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
    onClick={() => navigate('/shortlisted/on-campus-listings')}
  >
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/10 via-transparent to-[#8b5cf6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#7c3aed]/20 rounded-2xl transition-all duration-300"></div>

    <div className="relative z-10 flex flex-col flex-grow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-[#7c3aed]/10 to-[#8b5cf6]/10 rounded-lg border border-[#7c3aed]/20 mt-0.5">
            <FiClock className="w-4 h-4 text-[#7c3aed]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 leading-tight">Shortlisted</h3>
          </div>
        </div>
        <div className="p-1 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="flex items-baseline space-x-1 mt-auto">
        <p className="text-xl font-bold text-[#7c3aed]">{dashboardData.totalShortlisted}</p>
        <span className="text-xs text-gray-500">Companies</span>
      </div>
      
      <div className="text-[10px] text-gray-500 mt-0.5">
        {dashboardData.totalShortlisted > 0 ? 'In Progress' : 'No Companies'}
      </div>
    </div>
  </div>

  {/* Card 5 - Service Requests */}
  <div
    className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
    onClick={() => navigate('/service-request/workforce-solution')}
  >
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-transparent to-[#a78bfa]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#8b5cf6]/20 rounded-2xl transition-all duration-300"></div>

    <div className="relative z-10 flex flex-col flex-grow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-[#8b5cf6]/10 to-[#a78bfa]/10 rounded-lg border border-[#8b5cf6]/20 mt-0.5">
            <FiFileText className="w-4 h-4 text-[#8b5cf6]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 leading-tight">Requests</h3>
          </div>
        </div>
        <div className="p-1 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="flex items-baseline space-x-1 mt-auto">
        <p className="text-xl font-bold text-[#8b5cf6]">{dashboardData.serviceRequests.pending}</p>
        <span className="text-xs text-gray-500">Pending</span>
      </div>
      
      <div className="text-[10px] text-gray-500 mt-0.5">
        Service Requests
      </div>
    </div>
  </div>
</div>

        {/* Service Requests Status & Application Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Requests Status */}
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Service Requests Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#fde68a]/20 to-transparent backdrop-blur-sm rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#f59e0b] rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">Pending Requests</span>
                </div>
                <span className="text-2xl font-bold text-[#f59e0b]">{dashboardData.serviceRequests.pending}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#a7f3d0]/20 to-transparent backdrop-blur-sm rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#10b981] rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">Approved Requests</span>
                </div>
                <span className="text-2xl font-bold text-[#10b981]">{dashboardData.serviceRequests.approved}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#fca5a5]/20 to-transparent backdrop-blur-sm rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ef4444] rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">Rejected Requests</span>
                </div>
                <span className="text-2xl font-bold text-[#ef4444]">{dashboardData.serviceRequests.rejected}</span>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/service-request/workforce-solution')}
                className="w-full border-[#93c5fd] text-[#3b82f6] hover:bg-gradient-to-r hover:from-[#93c5fd] hover:to-[#3b82f6] hover:text-white transition-all duration-200 backdrop-blur-sm"
              >
                Manage Service Requests
              </Button>
            </div>
          </div>

          {/* Applications Overview */}
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Application Funnel</h2>
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Total Applied</span>
                  <span className="text-sm font-bold text-gray-900">{dashboardData.totalApplied}</span>
                </div>
                <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-full h-3">
                  <div className="bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] h-3 rounded-full" style={{ width: '100%' }}></div>
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
                <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#fde68a] to-[#f59e0b] h-3 rounded-full"
                    style={{
                      width: dashboardData.totalApplied > 0 ?
                        `${Math.min(100, (dashboardData.totalShortlisted / dashboardData.totalApplied) * 100)}%` : '0%'
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
                <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#fca5a5] to-[#ef4444] h-3 rounded-full"
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
                className="w-full border-[#93c5fd] text-[#3b82f6] hover:bg-gradient-to-r hover:from-[#93c5fd] hover:to-[#3b82f6] hover:text-white transition-all duration-200 backdrop-blur-sm"
              >
                View Job Management
              </Button>
            </div>
          </div>
        </div>

        {/* Applications by Job Type Breakdown */}
<div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 mb-8">
  <h2 className="mb-4 text-lg font-semibold text-gray-900">Applications by Job Type</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200/50 text-sm">
      <thead>
        <tr className="bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 backdrop-blur-sm">
          <th className="px-4 py-3 text-left font-medium text-gray-600">Job Type</th>
          <th className="px-4 py-3 text-left font-medium text-gray-600">Applied</th>
          <th className="px-4 py-3 text-left font-medium text-gray-600">Shortlisted</th>
          <th className="px-4 py-3 text-left font-medium text-gray-600">Rejected</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100/50">
        {/* On-Campus Row */}
        <tr className="hover:bg-gradient-to-r from-[#93c5fd]/5 to-transparent transition-colors duration-200">
          <td className="px-4 py-3 font-medium text-gray-800">On-Campus</td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#93c5fd]/20 text-[#3b82f6] backdrop-blur-sm">
              {dashboardData.appliedByCategory['On-campus']}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fde68a]/20 text-[#f59e0b] backdrop-blur-sm">
              {dashboardData.totalApplied > 0 ? 
                Math.round((dashboardData.appliedByCategory['On-campus'] / dashboardData.totalApplied) * dashboardData.totalShortlisted) : 0
              }
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fca5a5]/20 text-[#ef4444] backdrop-blur-sm">
              {dashboardData.totalApplied > 0 ? 
                Math.round((dashboardData.appliedByCategory['On-campus'] / dashboardData.totalApplied) * dashboardData.totalRejected) : 0
              }
            </span>
          </td>
        </tr>
        {/* Pool-Campus Row */}
        <tr className="hover:bg-gradient-to-r from-[#f9a8d4]/5 to-transparent transition-colors duration-200">
          <td className="px-4 py-3 font-medium text-gray-800">Pool-Campus</td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f9a8d4]/20 text-[#ec4899] backdrop-blur-sm">
              {dashboardData.appliedByCategory['Pool-campus']}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fde68a]/20 text-[#f59e0b] backdrop-blur-sm">
              {dashboardData.totalApplied > 0 ? 
                Math.round((dashboardData.appliedByCategory['Pool-campus'] / dashboardData.totalApplied) * dashboardData.totalShortlisted) : 0
              }
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fca5a5]/20 text-[#ef4444] backdrop-blur-sm">
              {dashboardData.totalApplied > 0 ? 
                Math.round((dashboardData.appliedByCategory['Pool-campus'] / dashboardData.totalApplied) * dashboardData.totalRejected) : 0
              }
            </span>
          </td>
        </tr>
        {/* Totals Row */}
        <tr className="hover:bg-gradient-to-r from-gray-100/20 to-transparent font-semibold bg-white/50 backdrop-blur-sm">
          <td className="px-4 py-3 font-medium text-gray-900">Total</td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#93c5fd]/30 text-[#3b82f6] backdrop-blur-sm">
              {dashboardData.totalApplied}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fde68a]/30 text-[#f59e0b] backdrop-blur-sm">
              {dashboardData.totalShortlisted}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fca5a5]/30 text-[#ef4444] backdrop-blur-sm">
              {dashboardData.totalRejected}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div className="mt-4 text-xs text-gray-500 flex items-start">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
    <span>
      Shortlisted and Rejected counts are estimated based on application proportions. Actual category-specific data may vary.
    </span>
  </div>
</div>

        {/* Recent Applications & Service Requests Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Shortlisted</h2>
              <button
                onClick={() => navigate('/shortlisted/on-campus-listings')}
                className="text-sm text-[#3b82f6] hover:text-[#1d4ed8] font-medium transition-colors duration-200"
              >
                View All →
              </button>
            </div>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fde68a]/20 rounded-full mb-4 backdrop-blur-sm">
                <FiClock className="w-8 h-8 text-[#f59e0b]" />
              </div>
              <p className="text-gray-500">No shortlisted companies data available in dashboard metrics</p>
              <p className="text-xs text-gray-400 mt-2">Detailed company information available in dedicated sections</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Service Requests Overview</h2>
              <button
                onClick={() => navigate('/service-request/workforce-solution')}
                className="text-sm text-[#10b981] hover:text-[#047857] font-medium transition-colors duration-200"
              >
                View All →
              </button>
            </div>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#a7f3d0]/20 rounded-full mb-4 backdrop-blur-sm">
                <FiFileText className="w-8 h-8 text-[#10b981]" />
              </div>
              <p className="text-gray-500">Manage your service requests and track their status</p>
              <p className="text-xs text-gray-400 mt-2">Create new requests or view existing ones</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 backdrop-blur-sm"
              onClick={() => navigate('/hiring-channels/post-a-job')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Post New Opportunity
            </Button>
            {/* <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 backdrop-blur-sm"
              onClick={() => navigate('/hiring-channels/post-a-job')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Post New Opportunity
            </Button> */}
            <Button
              variant="outline"
              size="md"
              className="border-[#93c5fd] text-[#3b82f6] hover:bg-gradient-to-r hover:from-[#93c5fd] hover:to-[#3b82f6] hover:text-white transition-all duration-200 backdrop-blur-sm"
              onClick={() => navigate('/job-management/On-campus')}
            >
              Manage Applications
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-[#93c5fd] text-[#3b82f6] hover:bg-gradient-to-r hover:from-[#93c5fd] hover:to-[#3b82f6] hover:text-white transition-all duration-200 backdrop-blur-sm"
              onClick={() => navigate('/interviews')}
            >
              Schedule Interviews
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-[#93c5fd] text-[#3b82f6] hover:bg-gradient-to-r hover:from-[#93c5fd] hover:to-[#3b82f6] hover:text-white transition-all duration-200 backdrop-blur-sm"
              onClick={() => navigate('/service-request/workforce-solution')}
            >
              Service Requests
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home


// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import PageHeader from '@/components/dashboard/PageHeader'
// import Button from '@/components/ui/Button'
// import { FiSearch, FiCheckCircle, FiClock, FiTrendingUp, FiBriefcase, FiTarget, FiFileText, FiBarChart2, FiArrowRight, FiUsers, FiEye, FiChevronRight, FiExternalLink } from 'react-icons/fi'
// import { getCollegeServiceRequestStatus } from '@/lib/College_AxiosIntance'
// import { getCompanyDashboardMetrics } from '@/lib/Company_AxiosInstance'

// function Home() {
//   const navigate = useNavigate()
//   const [dashboardData, setDashboardData] = useState({
//     appliedByCategory: {
//       'On-campus': 0,
//       'Pool-campus': 0,
//     },
//     statusTotals: {
//       'Shortlisted': 0,
//       'Accepted': 0,
//       'Rejected': 0
//     },
//     totalApplied: 0,
//     totalShortlisted: 0,
//     totalAccepted: 0,
//     totalRejected: 0,
//     serviceRequests: {
//       total: 0,
//       pending: 0,
//       approved: 0,
//       rejected: 0
//     },
//     loading: true
//   })

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setDashboardData(prev => ({ ...prev, loading: true }))

//       const [metricsResponse, serviceRequestsResponse] = await Promise.all([
//         getCompanyDashboardMetrics(),
//         getCollegeServiceRequestStatus().catch(() => ({
//           data: {
//             success: false,
//             data: {
//               total: 0,
//               pending: 0,
//               approved: 0,
//               rejected: 0
//             }
//           }
//         })),
//       ])

//       if (metricsResponse.data?.success) {
//         const metricsData = metricsResponse.data.data

//         let serviceRequestsData = {
//           total: 0,
//           pending: 0,
//           approved: 0,
//           rejected: 0
//         }

//         if (serviceRequestsResponse.data?.success && serviceRequestsResponse.data?.data) {
//           serviceRequestsData = serviceRequestsResponse.data.data
//         } else if (serviceRequestsResponse.data?.data) {
//           serviceRequestsData = serviceRequestsResponse.data.data
//         }
        
//         const { 'Off-campus': offCampus, ...appliedByCategoryWithoutOffCampus } = metricsData.appliedByCategory || {};

//         setDashboardData({
//           appliedByCategory: appliedByCategoryWithoutOffCampus,
//           statusTotals: metricsData.statusTotals,
//           totalApplied: metricsData.totalApplied,
//           totalShortlisted: metricsData.totalShortlisted,
//           totalAccepted: metricsData.totalAccepted,
//           totalRejected: metricsData.totalRejected,
//           serviceRequests: serviceRequestsData,
//           loading: false
//         })
//       } else {
//         throw new Error('Failed to fetch dashboard data')
//       }
//     } catch (error) {
//       console.error('Failed to fetch college dashboard data:', error)
//       setDashboardData(prev => ({ ...prev, loading: false }))
//     }
//   }

//   if (dashboardData.loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
//         <div className="relative">
//           <div className="w-16 h-16 border-2 border-gray-200 rounded-full"></div>
//           <div className="absolute top-0 left-0 w-16 h-16 border-2 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
//       {/* Elegant background pattern */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-white/90 to-transparent"></div>
//         <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-white/90 to-transparent"></div>
//         {/* Subtle geometric pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(30deg,#667eea_1px,transparent_1px),linear-gradient(-30deg,#667eea_1px,transparent_1px)] bg-[size:60px_60px]"></div>
//         </div>
//       </div>

//       <div className="relative z-10 container mx-auto px-4 py-8 pt-22">
//         {/* Elegant Header */}
//         <div className="mb-12">
//   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
//     <div className="flex-1">
//       <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-3">
//         <span className="font-semibold">College Dashboard</span>
//       </h1>
      
//       <div className="flex flex-wrap items-center gap-6 mt-4">
//         {/* Overview Label */}
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//           <div>
//             <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Label</div>
//             <div className="text-sm font-medium text-gray-900">Overview</div>
//           </div>
//         </div>
        
//         {/* Status */}
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
//           <div>
//             <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</div>
//             <div className="flex items-center gap-1.5">
//               <span className="text-sm font-medium text-gray-900">Active</span>
//               <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
//                 Online
//               </span>
//             </div>
//           </div>
//         </div>
        
//         {/* Assignee */}
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//           <div>
//             <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</div>
//             <div className="text-sm font-medium text-gray-900">College Admin</div>
//           </div>
//         </div>
        
//         {/* Created Date */}
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//           <div>
//             <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</div>
//             <div className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}</div>
//           </div>
//         </div>
//       </div>
//     </div>
    
//     <div className="relative w-full lg:w-80">
//       <div className="relative group">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
//         <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
//         <input
//           type="text"
//           placeholder="Search across dashboard..."
//           className="relative w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 group-hover:border-gray-300 shadow-sm"
//         />
//       </div>
//     </div>
//   </div>
// </div>

//         {/* Main Stats Grid - Elegant Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
//           {/* On-Campus */}
//           <div 
//             onClick={() => navigate('/application-status/oncampus')}
//             className="group relative bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 cursor-pointer hover:-translate-y-1"
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl"></div>
            
//             <div className="flex items-start justify-between mb-5">
//               <div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-4">
//                   <FiBriefcase className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">On-Campus</h3>
//               </div>
//               <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
//                 <FiExternalLink className="w-5 h-5 text-blue-400" />
//               </div>
//             </div>
            
//             <div className="mb-5">
//               <div className="text-3xl font-light text-gray-900 mb-1">{dashboardData.appliedByCategory['On-campus']}</div>
//               <p className="text-sm text-gray-600">Companies Applied</p>
//             </div>
            
//             <div className="flex items-center text-sm text-blue-600 font-medium">
//               View Details
//               <FiChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
//             </div>
//           </div>

//           {/* Pool-Campus */}
//           <div 
//             onClick={() => navigate('/application-status/poolcampus')}
//             className="group relative bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-500 cursor-pointer hover:-translate-y-1"
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl"></div>
            
//             <div className="flex items-start justify-between mb-5">
//               <div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center mb-4">
//                   <FiTarget className="w-6 h-6 text-purple-600" />
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Pool-Campus</h3>
//               </div>
//               <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
//                 <FiExternalLink className="w-5 h-5 text-purple-400" />
//               </div>
//             </div>
            
//             <div className="mb-5">
//               <div className="text-3xl font-light text-gray-900 mb-1">{dashboardData.appliedByCategory['Pool-campus']}</div>
//               <p className="text-sm text-gray-600">Companies Applied</p>
//             </div>
            
//             <div className="flex items-center text-sm text-purple-600 font-medium">
//               View Details
//               <FiChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
//             </div>
//           </div>

//           {/* Application Status */}
//           <div 
//             onClick={() => navigate('/applications')}
//             className="group relative bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500 cursor-pointer hover:-translate-y-1"
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-t-xl"></div>
            
//             <div className="flex items-start justify-between mb-5">
//               <div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
//                   <FiBarChart2 className="w-6 h-6 text-indigo-600" />
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Status Overview</h3>
//               </div>
//               <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
//                 <FiExternalLink className="w-5 h-5 text-indigo-400" />
//               </div>
//             </div>
            
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Applied</span>
//                 <span className="font-medium text-blue-600">{dashboardData.totalApplied}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Shortlisted</span>
//                 <span className="font-medium text-amber-600">{dashboardData.totalShortlisted}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Rejected</span>
//                 <span className="font-medium text-rose-600">{dashboardData.totalRejected}</span>
//               </div>
//             </div>
//           </div>

//           {/* Shortlisted */}
//           <div 
//             onClick={() => navigate('/shortlisted/on-campus-listings')}
//             className="group relative bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-amber-100 transition-all duration-500 cursor-pointer hover:-translate-y-1"
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-xl"></div>
            
//             <div className="flex items-start justify-between mb-5">
//               <div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center mb-4">
//                   <FiClock className="w-6 h-6 text-amber-600" />
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Shortlisted</h3>
//               </div>
//               <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
//                 <FiExternalLink className="w-5 h-5 text-amber-400" />
//               </div>
//             </div>
            
//             <div className="mb-5">
//               <div className="text-3xl font-light text-gray-900 mb-1">{dashboardData.totalShortlisted}</div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <FiTrendingUp className="w-4 h-4 mr-2 text-amber-500" />
//                 {dashboardData.totalShortlisted > 0 ? 'Active Companies' : 'No Active Listings'}
//               </div>
//             </div>
            
//             <div className="flex items-center text-sm text-amber-600 font-medium">
//               Manage Listings
//               <FiChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
//             </div>
//           </div>

//           {/* Service Requests */}
//           <div 
//             onClick={() => navigate('/service-request/workforce-solution')}
//             className="group relative bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 cursor-pointer hover:-translate-y-1"
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-xl"></div>
            
//             <div className="flex items-start justify-between mb-5">
//               <div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center mb-4">
//                   <FiFileText className="w-6 h-6 text-emerald-600" />
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Service Requests</h3>
//               </div>
//               <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
//                 <FiExternalLink className="w-5 h-5 text-emerald-400" />
//               </div>
//             </div>
            
//             <div className="mb-5">
//               <div className="text-3xl font-light text-gray-900 mb-1">{dashboardData.serviceRequests.pending}</div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <FiCheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
//                 Pending for Review
//               </div>
//             </div>
            
//             <div className="flex items-center text-sm text-emerald-600 font-medium">
//               Handle Requests
//               <FiChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
//             </div>
//           </div>
//         </div>

//         {/* Metrics Section - Two Columns */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//           {/* Service Requests Analysis */}
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-7">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h3 className="text-xl font-light text-gray-900 mb-2">Service Requests</h3>
//                 <p className="text-gray-600">Status distribution and management</p>
//               </div>
//               <div className="px-4 py-2 bg-gray-50 rounded-lg">
//                 <span className="text-sm font-medium text-gray-700">{dashboardData.serviceRequests.total} Total</span>
//               </div>
//             </div>

//             <div className="space-y-5">
//               <div className="group hover:bg-gray-50/50 p-4 rounded-lg transition-all duration-300">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center mr-3">
//                       <FiClock className="w-4 h-4 text-amber-600" />
//                     </div>
//                     <span className="font-medium text-gray-900">Pending Requests</span>
//                   </div>
//                   <span className="text-2xl font-light text-gray-900">{dashboardData.serviceRequests.pending}</span>
//                 </div>
//                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
//                     style={{ 
//                       width: dashboardData.serviceRequests.total > 0 ? 
//                         `${(dashboardData.serviceRequests.pending / dashboardData.serviceRequests.total) * 100}%` : '0%'
//                     }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="group hover:bg-gray-50/50 p-4 rounded-lg transition-all duration-300">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center mr-3">
//                       <FiCheckCircle className="w-4 h-4 text-emerald-600" />
//                     </div>
//                     <span className="font-medium text-gray-900">Approved Requests</span>
//                   </div>
//                   <span className="text-2xl font-light text-gray-900">{dashboardData.serviceRequests.approved}</span>
//                 </div>
//                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
//                     style={{ 
//                       width: dashboardData.serviceRequests.total > 0 ? 
//                         `${(dashboardData.serviceRequests.approved / dashboardData.serviceRequests.total) * 100}%` : '0%'
//                     }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="group hover:bg-gray-50/50 p-4 rounded-lg transition-all duration-300">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg flex items-center justify-center mr-3">
//                       <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
//                     </div>
//                     <span className="font-medium text-gray-900">Rejected Requests</span>
//                   </div>
//                   <span className="text-2xl font-light text-gray-900">{dashboardData.serviceRequests.rejected}</span>
//                 </div>
//                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full"
//                     style={{ 
//                       width: dashboardData.serviceRequests.total > 0 ? 
//                         `${(dashboardData.serviceRequests.rejected / dashboardData.serviceRequests.total) * 100}%` : '0%'
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={() => navigate('/service-request/workforce-solution')}
//               className="w-full mt-8 py-3.5 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
//             >
//               <FiFileText className="w-5 h-5" />
//               Manage Service Requests
//               <FiChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
//             </button>
//           </div>

//           {/* Application Funnel */}
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-7">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h3 className="text-xl font-light text-gray-900 mb-2">Application Funnel</h3>
//                 <p className="text-gray-600">Progress and conversion metrics</p>
//               </div>
//               <div className="px-4 py-2 bg-gray-50 rounded-lg">
//                 <span className="text-sm font-medium text-gray-700">{dashboardData.totalApplied} Total</span>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center">
//                     <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-2"></div>
//                     <span className="font-medium text-gray-900">Total Applied</span>
//                   </div>
//                   <span className="font-medium text-gray-900">{dashboardData.totalApplied}</span>
//                 </div>
//                 <div className="w-full h-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full overflow-hidden">
//                   <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '100%' }}></div>
//                 </div>
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center">
//                     <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-2"></div>
//                     <span className="font-medium text-gray-900">Shortlisted</span>
//                   </div>
//                   <span className="font-medium text-gray-900">
//                     {dashboardData.totalApplied > 0 ?
//                       Math.round((dashboardData.totalShortlisted / dashboardData.totalApplied) * 100) : 0}%
//                     ({dashboardData.totalShortlisted})
//                   </span>
//                 </div>
//                 <div className="w-full h-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
//                     style={{
//                       width: dashboardData.totalApplied > 0 ?
//                         `${Math.min(100, (dashboardData.totalShortlisted / dashboardData.totalApplied) * 100)}%` : '0%'
//                     }}
//                   ></div>
//                 </div>
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center">
//                     <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mr-2"></div>
//                     <span className="font-medium text-gray-900">Rejected</span>
//                   </div>
//                   <span className="font-medium text-gray-900">
//                     {dashboardData.totalApplied > 0 ?
//                       Math.round((dashboardData.totalRejected / dashboardData.totalApplied) * 100) : 0}%
//                     ({dashboardData.totalRejected})
//                   </span>
//                 </div>
//                 <div className="w-full h-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-1000 ease-out"
//                     style={{
//                       width: dashboardData.totalApplied > 0 ?
//                         `${Math.min(100, (dashboardData.totalRejected / dashboardData.totalApplied) * 100)}%` : '0%'
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={() => navigate('/job-management/On-campus')}
//               className="w-full mt-8 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-2 group"
//             >
//               <FiBarChart2 className="w-5 h-5" />
//               View Detailed Analytics
//               <FiChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
//             </button>
//           </div>
//         </div>

//         {/* Applications Breakdown */}
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-7 mb-12">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h3 className="text-xl font-light text-gray-900 mb-2">Applications Breakdown</h3>
//               <p className="text-gray-600">Detailed analysis by category</p>
//             </div>
//             <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium text-gray-700">
//               Export Report
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <div className="min-w-full">
//               <div className="grid grid-cols-5 gap-4 mb-4 px-2">
//                 <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Job Type</div>
//                 <div className="text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Applied</div>
//                 <div className="text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Shortlisted</div>
//                 <div className="text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Rejected</div>
//                 <div className="text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Status</div>
//               </div>

//               <div className="space-y-3">
//                 {/* On-Campus Row */}
//                 <div className="group grid grid-cols-5 gap-4 p-4 bg-gray-50/50 hover:bg-blue-50/50 rounded-lg border border-transparent hover:border-blue-100 transition-all duration-300">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mr-3">
//                       <FiBriefcase className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">On-Campus</div>
//                       <div className="text-xs text-gray-500">Direct campus recruitment</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-lg font-medium text-blue-600">{dashboardData.appliedByCategory['On-campus']}</span>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-gray-400">-</span>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-gray-400">-</span>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
//                       Active
//                     </span>
//                   </div>
//                 </div>

//                 {/* Pool-Campus Row */}
//                 <div className="group grid grid-cols-5 gap-4 p-4 bg-gray-50/50 hover:bg-purple-50/50 rounded-lg border border-transparent hover:border-purple-100 transition-all duration-300">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center mr-3">
//                       <FiTarget className="w-5 h-5 text-purple-600" />
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">Pool-Campus</div>
//                       <div className="text-xs text-gray-500">Multi-campus recruitment</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-lg font-medium text-purple-600">{dashboardData.appliedByCategory['Pool-campus']}</span>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-gray-400">-</span>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-gray-400">-</span>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
//                       Active
//                     </span>
//                   </div>
//                 </div>

//                 {/* Total Row */}
//                 <div className="grid grid-cols-5 gap-4 p-4 bg-gray-900 text-white rounded-lg">
//                   <div className="flex items-center">
//                     <div className="font-medium">Total</div>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-lg font-medium">{dashboardData.totalApplied}</span>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-lg font-medium text-amber-300">{dashboardData.totalShortlisted}</span>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-lg font-medium text-rose-300">{dashboardData.totalRejected}</span>
//                   </div>
//                   <div className="flex items-center justify-end">
//                     <span className="text-sm text-gray-300">Summary</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
//             Applied counts are shown by category. Shortlisted and Rejected counts are totals across all categories.
//           </div>
//         </div>

//         {/* Quick Actions & Recent */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//           {/* Recent Activity */}
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-7">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h3 className="text-xl font-light text-gray-900 mb-2">Recent Activity</h3>
//                 <p className="text-gray-600">Latest updates and notifications</p>
//               </div>
//               <button
//                 onClick={() => navigate('/shortlisted/on-campus-listings')}
//                 className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 View All →
//               </button>
//             </div>

//             <div className="text-center py-10">
//               <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <FiUsers className="w-10 h-10 text-gray-400" />
//               </div>
//               <p className="text-gray-600 mb-3">No recent shortlisted companies available</p>
//               <p className="text-sm text-gray-500">Detailed company information is available in the dedicated sections</p>
//             </div>

//             <div className="mt-6 pt-6 border-t border-gray-100">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">Last updated</span>
//                 <span className="text-sm font-medium text-gray-900">Just now</span>
//               </div>
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-7">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h3 className="text-xl font-light text-gray-900 mb-2">Quick Actions</h3>
//                 <p className="text-gray-600">Common operations and shortcuts</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 onClick={() => navigate('/hiring-channels/post-a-job')}
//                 className="group p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 text-left"
//               >
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
//                   <FiBriefcase className="w-6 h-6 text-white" />
//                 </div>
//                 <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600">Post Opportunity</h4>
//                 <p className="text-sm text-gray-600">Create new job posting</p>
//               </button>

//               <button
//                 onClick={() => navigate('/job-management/On-campus')}
//                 className="group p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 text-left"
//               >
//                 <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
//                   <FiEye className="w-6 h-6 text-white" />
//                 </div>
//                 <h4 className="font-medium text-gray-900 mb-1 group-hover:text-emerald-600">Manage Applications</h4>
//                 <p className="text-sm text-gray-600">Review and process</p>
//               </button>

//               <button
//                 onClick={() => navigate('/interviews')}
//                 className="group p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-100 hover:border-amber-200 hover:shadow-md transition-all duration-300 text-left"
//               >
//                 <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-4">
//                   <FiClock className="w-6 h-6 text-white" />
//                 </div>
//                 <h4 className="font-medium text-gray-900 mb-1 group-hover:text-amber-600">Schedule Interviews</h4>
//                 <p className="text-sm text-gray-600">Plan campus sessions</p>
//               </button>

//               <button
//                 onClick={() => navigate('/service-request/workforce-solution')}
//                 className="group p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100 hover:border-purple-200 hover:shadow-md transition-all duration-300 text-left"
//               >
//                 <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
//                   <FiFileText className="w-6 h-6 text-white" />
//                 </div>
//                 <h4 className="font-medium text-gray-900 mb-1 group-hover:text-purple-600">Service Requests</h4>
//                 <p className="text-sm text-gray-600">Handle all requests</p>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center py-8 border-t border-gray-100">
//           <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
//               <span>System Status: Online</span>
//             </div>
//             <div>•</div>
//             <div>Last Refresh: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
//             <div>•</div>
//             <div>Dashboard v2.1</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Home