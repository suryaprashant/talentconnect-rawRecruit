import { useLegacyAuth } from '@/context/AuthProvider'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { getStudentDashboardMetrics, getUserApplicationStatus } from '@/lib/User_AxiosInstance'

function Dashboard() {
  const [authuser, setAuthUser] = useLegacyAuth();
  const navigate = useNavigate()
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      'Off-Campus': 0,
      'Internship': 0,
      'Counselling': 0,
      'Career Craft': 0,
      'Mock Interview': 0
    },
    byCategory: {
      'Off-Campus': {
        'Applied': 0,
        'Shortlisted': 0,
        'Accepted': 0,
        'Rejected': 0
      },
      'Internship': {
        'Applied': 0,
        'Shortlisted': 0,
        'Accepted': 0,
        'Rejected': 0
      }
    },
    recentApplications: [],
    upcomingInterviews: [],
    loading: true
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }))

      // Fetch data for Off-Campus and Internship separately
      const [offCampusRes, internshipRes] = await Promise.all([
        getUserApplicationStatus("Off-campus").catch(() => ({ data: { data: [] } })),
        getUserApplicationStatus("Internship").catch(() => ({ data: { data: [] } }))
      ])

      const offCampusApps = offCampusRes.data?.data || []
      const internshipApps = internshipRes.data?.data || []
      
      // Calculate stats for each category
      const offCampusStats = calculateCategoryStats(offCampusApps)
      const internshipStats = calculateCategoryStats(internshipApps)

      // Calculate main stats (count of applications)
      const stats = {
        'Off-Campus': offCampusApps.length,
        'Internship': internshipApps.length,
        'Counselling': 0, // Placeholder - you'll need to fetch this data separately
        'Career Craft': 0, // Placeholder - you'll need to fetch this data separately
        'Mock Interview': 0 // Placeholder - you'll need to fetch this data separately
      }

      // Format recent applications
      const allApplications = [...offCampusApps, ...internshipApps]
      const formattedRecentApps = allApplications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(app => ({
          ...app,
          date: new Date(app.date || app.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          category: app.jobType || 'Off-Campus'
        }))

      setDashboardData({
        stats,
        byCategory: {
          'Off-Campus': offCampusStats,
          'Internship': internshipStats
        },
        recentApplications: formattedRecentApps,
        upcomingInterviews: [],
        loading: false
      })

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setDashboardData(prev => ({ ...prev, loading: false }))
    }
  }

  const calculateCategoryStats = (applications) => {
    const stats = {
      'Applied': 0,
      'Shortlisted': 0,
      'Accepted': 0,
      'Rejected': 0
    }
    
    applications.forEach(app => {
      const status = app.currentStatus || app.status || 'Applied'
      const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      
      if (stats[normalizedStatus] !== undefined) {
        stats[normalizedStatus]++
      } else {
        stats['Applied']++ // Default to Applied if status not in our list
      }
    })
    
    return stats
  }

  const getTotalForStatus = (status) => {
    let total = 0
    Object.values(dashboardData.byCategory).forEach(category => {
      total += category[status] || 0
    })
    return total
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
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Page Header */}
        <div className="mb-8 -mt-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex items-center justify-between py-6 px-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Student Dashboard
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards - 5 New Cards in a Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 auto-rows-fr gap-3 mb-8">
          {/* Off-Campus Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/application-status/Off-campus')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9333ea] to-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#9333ea]/10 via-transparent to-[#7c3aed]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#9333ea]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#9333ea]/10 to-[#7c3aed]/10 rounded-lg border border-[#9333ea]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9333ea" className="w-4 h-4">
                      <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Off-Campus</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#9333ea] to-[#7c3aed] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#9333ea]">{dashboardData.stats['Off-Campus']}</p>
                <span className="text-xs text-gray-500">jobs</span>
              </div>
            </div>
          </div>

          {/* Internship Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/application-status/Internship')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/10 via-transparent to-[#6d28d9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#7c3aed]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#7c3aed]/10 to-[#6d28d9]/10 rounded-lg border border-[#7c3aed]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7c3aed" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V6zm-1.5 9.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Internship</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#7c3aed]">{dashboardData.stats['Internship']}</p>
                <span className="text-xs text-gray-500">internships</span>
              </div>
            </div>
          </div>

          {/* Counselling Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/service-request/counselling')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6d28d9] to-[#5b21b6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#6d28d9]/10 via-transparent to-[#5b21b6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#6d28d9]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#6d28d9]/10 to-[#5b21b6]/10 rounded-lg border border-[#6d28d9]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6d28d9" className="w-4 h-4">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Counselling</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#6d28d9] to-[#5b21b6] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#6d28d9]">{dashboardData.stats['Counselling']}</p>
                <span className="text-xs text-gray-500">sessions</span>
              </div>
            </div>
          </div>

          {/* Career Craft Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/service-request/career-craft')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5b21b6] to-[#4c1d95] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#5b21b6]/10 via-transparent to-[#4c1d95]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#5b21b6]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#5b21b6]/10 to-[#4c1d95]/10 rounded-lg border border-[#5b21b6]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5b21b6" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9.53 16.47a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-2.47 2.47-1.47-1.47a.75.75 0 00-1.06 1.06l2 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Career Craft</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#5b21b6] to-[#4c1d95] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#5b21b6]">{dashboardData.stats['Career Craft']}</p>
                <span className="text-xs text-gray-500">activities</span>
              </div>
            </div>
          </div>

          {/* Mock Interview Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/service-request/mock-interview')}
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4c1d95] to-[#3b0764] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95]/10 via-transparent to-[#3b0764]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4c1d95]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#4c1d95]/10 to-[#3b0764]/10 rounded-lg border border-[#4c1d95]/20 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4c1d95" className="w-4 h-4">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Mock Interview</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#4c1d95] to-[#3b0764] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#4c1d95]">{dashboardData.stats['Mock Interview']}</p>
                <span className="text-xs text-gray-500">interviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Applications by Type - Updated to include Internship */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Applications by Type</h2>
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
                {/* Off-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#9333ea]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">Off-Campus</td>
                  <td className="px-4 py-3 text-[#9333ea] font-semibold">{dashboardData.byCategory['Off-Campus']?.Applied || 0}</td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">{dashboardData.byCategory['Off-Campus']?.Shortlisted || 0}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{dashboardData.byCategory['Off-Campus']?.Accepted || 0}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">{dashboardData.byCategory['Off-Campus']?.Rejected || 0}</td>
                </tr>
                
                {/* Internship Row */}
                <tr className="hover:bg-gradient-to-r from-[#7c3aed]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">Internship</td>
                  <td className="px-4 py-3 text-[#7c3aed] font-semibold">{dashboardData.byCategory['Internship']?.Applied || 0}</td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">{dashboardData.byCategory['Internship']?.Shortlisted || 0}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{dashboardData.byCategory['Internship']?.Accepted || 0}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">{dashboardData.byCategory['Internship']?.Rejected || 0}</td>
                </tr>
                
                {/* Totals Row */}
                <tr className="hover:bg-gradient-to-r from-gray-100 to-transparent font-semibold bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">Total</td>
                  <td className="px-4 py-3 text-[#667eea]">{getTotalForStatus('Applied')}</td>
                  <td className="px-4 py-3 text-yellow-600">{getTotalForStatus('Shortlisted')}</td>
                  <td className="px-4 py-3 text-green-600">{getTotalForStatus('Accepted')}</td>
                  <td className="px-4 py-3 text-red-600">{getTotalForStatus('Rejected')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Applications are tracked by type and status for better career management.
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-[#667eea]/30"
              onClick={() => navigate('/student-dashboard/Off-campus')}
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Browse Jobs
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-[#667eea]/30"
              onClick={() => navigate('/profile')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
              Edit Profile
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-[#667eea]/30"
              onClick={() => navigate('/profile')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
              </svg>
              Upload Resume
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-[#667eea] text-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white"
              onClick={() => navigate('/application-status/Off-campus')}
            >
              My Applications
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-[#667eea] text-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white"
              onClick={() => navigate('/student-interviews')}
            >
              Schedule Interview
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard