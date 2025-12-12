import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/dashboard/PageHeader'
import Button from '@/components/ui/Button'
import { FiPlus, FiUsers, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi'
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
        
        // Remove Off-campus from the appliedByCategory when setting state
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="College Dashboard"
        label="Overview"
        status="Active"
        assignee="College Admin"
        createdAt={new Date().toLocaleDateString()}
      />

      {/* Key Metrics Cards - Updated to 5 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        
        {/* On-Campus Applications */}
        <div
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/application-status/oncampus')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">On-Campus</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {dashboardData.appliedByCategory['On-campus']}
              </p>
              <p className="text-xs text-gray-500 mt-2">Applied Companies</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiUsers className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Pool-Campus Applications */}
        <div
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/application-status/poolcampus')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pool-Campus</h3>
              <p className="text-3xl font-bold text-teal-600 mt-2">
                {dashboardData.appliedByCategory['Pool-campus']}
              </p>
              <p className="text-xs text-gray-500 mt-2">Applied Companies</p>
            </div>
            <div className="p-3 bg-teal-100 rounded-lg">
              <FiUsers className="w-8 h-8 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Application Status */}
        <div
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/applications')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Application Status</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{dashboardData.totalApplied}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Applied: {dashboardData.totalApplied}</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Shortlisted: {dashboardData.totalShortlisted}</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Rejected: {dashboardData.totalRejected}</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FiTrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Shortlisted */}
        <div
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/shortlisted/on-campus-listings')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Shortlisted</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{dashboardData.totalShortlisted}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                {dashboardData.totalShortlisted > 0 ? 'In Progress' : 'No Companies'}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiClock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Service Requests Card */}
        <div
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/service-request/workforce-solution')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Service Requests</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{dashboardData.serviceRequests.pending}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <FiCheckCircle className="w-3 h-3 mr-1" />
                Pending Requests
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Service Requests Status & Application Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Service Requests Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-700 font-medium">Pending Requests</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{dashboardData.serviceRequests.pending}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700 font-medium">Approved Requests</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{dashboardData.serviceRequests.approved}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
              className="w-full"
            >
              Manage Service Requests
            </Button>
          </div>
        </div>

        {/* Applications Overview */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Application Funnel</h2>
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Total Applied</span>
                <span className="text-sm font-bold text-gray-900">{dashboardData.totalApplied}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '100%' }}></div>
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
                  className="bg-yellow-600 h-3 rounded-full"
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
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full"
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
              className="w-full"
            >
              View Job Management
            </Button>
          </div>
        </div>
      </div>

      {/* Applications by Job Type Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Applications by Job Type</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-medium text-gray-600">Job Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Applied</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Shortlisted</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Rejected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* On-Campus Row */}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-800">On-Campus</td>
                <td className="px-4 py-2 text-blue-700">{dashboardData.appliedByCategory['On-campus']}</td>
                <td className="px-4 py-2 text-yellow-700">-</td>
                <td className="px-4 py-2 text-red-700">-</td>
              </tr>
              {/* Pool-Campus Row */}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-800">Pool-Campus</td>
                <td className="px-4 py-2 text-blue-700">{dashboardData.appliedByCategory['Pool-campus']}</td>
                <td className="px-4 py-2 text-yellow-700">-</td>
                <td className="px-4 py-2 text-red-700">-</td>
              </tr>
              {/* Totals Row */}
              <tr className="hover:bg-gray-50 bg-gray-50 font-semibold">
                <td className="px-4 py-2 font-medium text-gray-900">Total</td>
                <td className="px-4 py-2 text-blue-900">{dashboardData.totalApplied}</td>
                <td className="px-4 py-2 text-yellow-900">{dashboardData.totalShortlisted}</td>
                <td className="px-4 py-2 text-red-900">{dashboardData.totalRejected}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Applied counts are shown by category. Shortlisted and Rejected counts are totals across all categories.
        </div>
      </div>

      {/* Recent Applications & Service Requests Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Shortlisted</h2>
            <button
              onClick={() => navigate('/shortlisted/on-campus-listings')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">No shortlisted companies data available in dashboard metrics</p>
            <p className="text-xs text-gray-400 mt-2">Detailed company information available in dedicated sections</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Service Requests Overview</h2>
            <button
              onClick={() => navigate('/service-request/workforce-solution')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">Manage your service requests and track their status</p>
            <p className="text-xs text-gray-400 mt-2">Create new requests or view existing ones</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="primary"
            size="md"
            className="flex items-center justify-center"
            onClick={() => navigate('/hiring-channels/post-a-job')}
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Post New Opportunity
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/job-management/On-campus')}
          >
            Manage Applications
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/interviews')}
          >
            Schedule Interviews
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/service-request/workforce-solution')}
          >
            Service Requests
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home