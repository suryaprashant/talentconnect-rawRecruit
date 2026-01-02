import { useAuth } from '@/context/AuthProvider'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { getStudentDashboardMetrics } from '@/lib/User_AxiosInstance'

function Dashboard() {
  const [authuser, setAuthUser] = useAuth();
  const navigate = useNavigate()
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      'Applied': 0,
      'Shortlisted': 0,
      'Accepted': 0,
      'Rejected': 0
    },
    byCategory: {
      'On-campus': 0,
      'Pool-campus': 0,
      'Off-campus': 0
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

      // Fetch student dashboard metrics - similar to company dashboard
      const response = await getStudentDashboardMetrics()
      console.log("Student dashboard metrics response:", response)

      if (response.data?.success) {
        const data = response.data.data

        // Format dates for display
        const formattedRecentApps = data.recentApplications?.map(app => ({
          ...app,
          date: new Date(app.date || app.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        })) || []

        const formattedInterviews = data.upcomingInterviews?.map(interview => ({
          ...interview,
          date: new Date(interview.date || interview.interviewDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          time: interview.time || interview.interviewTime || '10:00 AM'
        })) || []

        setDashboardData({
          stats: data.stats || {
            'Applied': 0,
            'Shortlisted': 0,
            'Accepted': 0,
            'Rejected': 0
          },
          byCategory: data.byCategory || {
            'On-campus': 0,
            'Pool-campus': 0,
            'Off-campus': 0
          },
          recentApplications: formattedRecentApps,
          upcomingInterviews: formattedInterviews,
          loading: false
        })
      } else {
        throw new Error('Failed to fetch dashboard data')
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      
      // Fallback: Use existing application APIs (similar to your OffcampusStatus component)
      try {
        const fallbackData = await fetchFallbackData()
        setDashboardData({
          ...fallbackData,
          loading: false
        })
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
        setDashboardData(prev => ({ ...prev, loading: false }))
      }
    }
  }

  // Fallback function - aggregates data from your existing APIs
const fetchFallbackData = async () => {
  try {
    // Import the individual API functions
    const { getUserApplicationStatus, getJobDetails } = await import('@/lib/User_AxiosInstance')
    
    // Fetch all application types
    const [onCampusRes, poolCampusRes, offCampusRes] = await Promise.all([
      getUserApplicationStatus("On-campus").catch(() => ({ data: { data: [] } })),
      getUserApplicationStatus("Pool-campus").catch(() => ({ data: { data: [] } })),
      getUserApplicationStatus("Off-campus").catch(() => ({ data: { data: [] } }))
    ])

    const onCampusApps = onCampusRes.data?.data || []
    const poolCampusApps = poolCampusRes.data?.data || []
    const offCampusApps = offCampusRes.data?.data || []
    
    const allApplications = [...onCampusApps, ...poolCampusApps, ...offCampusApps]

    // Calculate stats
    const stats = { Applied: 0, Shortlisted: 0, Accepted: 0, Rejected: 0 }
    const byCategory = {
      'On-campus': onCampusApps.length,
      'Pool-campus': poolCampusApps.length,
      'Off-campus': offCampusApps.length
    }

    // Count statuses
    allApplications.forEach(app => {
      const status = app.currentStatus || app.status || 'Applied'
      const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      
      if (stats[normalized] !== undefined) {
        stats[normalized]++
      } else {
        stats.Applied++
      }
    })

    // Get recent apps (last 5) - Fetch job details for each
    const recentApplicationsPromises = allApplications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(async (app) => {
        try {
          // Extract company and position from application
          let company = "Company"
          let position = "Position"
          
          // Try to get job details if jobId exists
          const jobId = app.job || app.jobDetails?.[0]?._id || app._id
          
          if (jobId) {
            try {
              const jobResponse = await getJobDetails(jobId)
              const jobDetails = jobResponse.data?.[0] || jobResponse.data
              
              if (jobDetails) {
                // Extract company name (same logic as OffcampusStatus)
                company = jobDetails.companyPosted?.companyDetails?.companyName || 
                         jobDetails.company || 
                         "Company"
                
                // Extract position (same logic as OffcampusStatus)
                if (Array.isArray(jobDetails.jobRoles) && jobDetails.jobRoles.length > 0) {
                  position = jobDetails.jobRoles[0]
                } else if (jobDetails.jobTitle) {
                  position = jobDetails.jobTitle
                } else {
                  position = "Position"
                }
              }
            } catch (jobError) {
              console.warn(`Could not fetch job details for ${jobId}:`, jobError)
              // Use fallback extraction
              company = extractCompanyName(app)
              position = extractPosition(app)
            }
          } else {
            // Use fallback extraction if no jobId
            company = extractCompanyName(app)
            position = extractPosition(app)
          }
          
          return {
            company,
            position,
            date: new Date(app.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            status: app.currentStatus || app.status || 'Applied',
            _id: app._id,
            jobId: jobId
          }
        } catch (error) {
          console.error("Error processing application:", error)
          // Return basic info if there's an error
          return {
            company: extractCompanyName(app),
            position: extractPosition(app),
            date: new Date(app.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            status: app.currentStatus || app.status || 'Applied',
            _id: app._id
          }
        }
      })

    // Wait for all job details to be fetched
    const recentApplications = await Promise.all(recentApplicationsPromises)

    return {
      stats,
      byCategory,
      recentApplications,
      upcomingInterviews: [] // Need separate API for this
    }

  } catch (error) {
    console.error("Fallback data error:", error)
    throw error
  }
}

// Improved helper functions to extract data from application objects
const extractCompanyName = (app) => {
  if (app.company) return app.company
  if (app.job?.company) return app.job.company
  if (app.jobDetails?.[0]?.company) return app.jobDetails[0].company
  if (app.fullJobDetails?.companyPosted?.companyDetails?.companyName) 
    return app.fullJobDetails.companyPosted.companyDetails.companyName
  if (app.fullJobDetails?.company) return app.fullJobDetails.company
  return "Company"
}

const extractPosition = (app) => {
  if (app.jobTitle) return app.jobTitle
  if (app.position) return app.position
  if (app.job?.jobTitle) return app.job.jobTitle
  if (app.jobDetails?.[0]?.jobTitle) return app.jobDetails[0].jobTitle
  if (app.fullJobDetails?.jobRoles?.[0]) return app.fullJobDetails.jobRoles[0]
  if (app.fullJobDetails?.jobTitle) return app.fullJobDetails.jobTitle
  return "Position"
}

  const processOffcampusData = (applications) => {
    // Process off-campus applications to get stats
    const stats = {
      'Applied': 0,
      'Shortlisted': 0,
      'Accepted': 0,
      'Rejected': 0
    }
    
    const byCategory = {
      'On-campus': 0,
      'Pool-campus': 0,
      'Off-campus': applications.length
    }
    
    applications.forEach(app => {
      const status = app.currentStatus || app.status || 'Applied'
      if (stats[status]) {
        stats[status]++
      } else {
        stats['Applied']++ // Default to Applied if status not in our list
      }
    })
    
    return { stats, byCategory }
  }

  // Add this helper function to get status counts from your existing APIs
  const getAllApplicationStats = async () => {
    try {
      // Fetch applications from all categories
      const [onCampusRes, poolCampusRes, offCampusRes] = await Promise.all([
        getUserApplicationStatus("On-campus").catch(() => ({ data: { data: [] } })),
        getUserApplicationStatus("Pool-campus").catch(() => ({ data: { data: [] } })),
        getUserApplicationStatus("Off-campus").catch(() => ({ data: { data: [] } }))
      ])
      
      const allApplications = [
        ...(onCampusRes.data?.data || []),
        ...(poolCampusRes.data?.data || []),
        ...(offCampusRes.data?.data || [])
      ]
      
      // Calculate stats
      const stats = {
        'Applied': 0,
        'Shortlisted': 0,
        'Accepted': 0,
        'Rejected': 0
      }
      
      const byCategory = {
        'On-campus': onCampusRes.data?.data?.length || 0,
        'Pool-campus': poolCampusRes.data?.data?.length || 0,
        'Off-campus': offCampusRes.data?.data?.length || 0
      }
      
      allApplications.forEach(app => {
        const status = app.currentStatus || app.status || 'Applied'
        const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        
        if (stats[normalizedStatus] !== undefined) {
          stats[normalizedStatus]++
        } else {
          stats['Applied']++
        }
      })
      
      // Get recent applications (last 5)
      const recentApplications = allApplications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(app => ({
          company: app.company || "Unknown",
          position: app.jobTitle || "Position",
          date: new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: app.currentStatus || app.status || 'Applied'
        }))
      
      return {
        stats,
        byCategory,
        recentApplications,
        upcomingInterviews: [] // You'll need to fetch this separately
      }
      
    } catch (error) {
      console.error("Error fetching all application stats:", error)
      return null
    }
  }

  // Update the useEffect to use the new function
  useEffect(() => {
    const loadData = async () => {
      setDashboardData(prev => ({ ...prev, loading: true }))
      
      try {
        // Try to get all stats from existing APIs
        const allStats = await getAllApplicationStats()
        
        if (allStats) {
          setDashboardData({
            stats: allStats.stats,
            byCategory: allStats.byCategory,
            recentApplications: allStats.recentApplications,
            upcomingInterviews: allStats.upcomingInterviews,
            loading: false
          })
        } else {
          // Fallback to the original method
          fetchDashboardData()
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        setDashboardData(prev => ({ ...prev, loading: false }))
      }
    }
    
    loadData()
  }, [])

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

        {/* Key Metrics Cards - 5 Cards in a Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 auto-rows-fr gap-3 mb-8">
          {/* Applications Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/applications')}
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
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Applied</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#9333ea] to-[#7c3aed] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#9333ea]">{dashboardData.stats.Applied}</p>
                <span className="text-xs text-gray-500">jobs</span>
              </div>
            </div>
          </div>

          {/* Shortlisted Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/shortlisted')}
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
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Shortlisted</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#7c3aed]">{dashboardData.stats.Shortlisted}</p>
                <span className="text-xs text-gray-500">jobs</span>
              </div>
            </div>
          </div>

          {/* Accepted Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/accepted')}
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
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Accepted</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#6d28d9] to-[#5b21b6] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#6d28d9]">{dashboardData.stats.Accepted}</p>
                <span className="text-xs text-gray-500">jobs</span>
              </div>
            </div>
          </div>

          {/* Rejected Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/applications')}
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
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Rejected</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#5b21b6] to-[#4c1d95] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#5b21b6]">{dashboardData.stats.Rejected}</p>
                <span className="text-xs text-gray-500">jobs</span>
              </div>
            </div>
          </div>

          {/* Status Card - Showing only Off-Campus */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/application-status/Off-campus')}
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
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight">Off-Campus</h3>
                  </div>
                </div>
                <div className="p-1 bg-gradient-to-r from-[#4c1d95] to-[#3b0764] rounded-full group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline space-x-1 mt-auto">
                <p className="text-xl font-bold text-[#4c1d95] mb-1">{dashboardData.byCategory['Off-campus']}</p>
                <span className="text-xs text-gray-500">applied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Applications */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <button
                onClick={() => navigate('/applications')}
                className="text-sm text-[#667eea] hover:text-[#764ba2] font-medium"
              >
                View All →
              </button>
            </div>
            {dashboardData.recentApplications.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentApplications.map((application, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/50 to-transparent rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                        {application.company?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{application.position || 'Position'}</p>
                        <p className="text-xs text-gray-500">{application.company || 'Company'} • {application.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      application.status === 'Shortlisted' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : application.status === 'Accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent applications</p>
                <p className="text-xs text-gray-400 mt-2">Apply to jobs to see them here</p>
              </div>
            )}
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
              <button
                onClick={() => navigate('/interviews')}
                className="text-sm text-[#667eea] hover:text-[#764ba2] font-medium"
              >
                View All →
              </button>
            </div>
            {dashboardData.upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.upcomingInterviews.map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/50 to-transparent rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                        {interview.company?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{interview.position || 'Position'}</p>
                        <p className="text-xs text-gray-500">{interview.date} • {interview.time}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                      Scheduled
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming interviews</p>
                <p className="text-xs text-gray-400 mt-2">Interview schedules will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Applications by Type */}
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
                {/* On-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#667eea]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">On-Campus</td>
                  <td className="px-4 py-3 text-[#667eea] font-semibold">{dashboardData.byCategory['On-campus']}</td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">0</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">0</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">0</td>
                </tr>
                {/* Pool-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#f093fb]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">Pool-Campus</td>
                  <td className="px-4 py-3 text-[#f093fb] font-semibold">{dashboardData.byCategory['Pool-campus']}</td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">0</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">0</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">0</td>
                </tr>
                {/* Off-Campus Row */}
                <tr className="hover:bg-gradient-to-r from-[#4facfe]/5 to-transparent">
                  <td className="px-4 py-3 font-medium text-gray-800">Off-Campus</td>
                  <td className="px-4 py-3 text-[#4facfe] font-semibold">{dashboardData.byCategory['Off-campus']}</td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">0</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">0</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">0</td>
                </tr>
                {/* Totals Row */}
                <tr className="hover:bg-gradient-to-r from-gray-100 to-transparent font-semibold bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">Total</td>
                  <td className="px-4 py-3 text-[#667eea]">{dashboardData.stats.Applied}</td>
                  <td className="px-4 py-3 text-yellow-600">{dashboardData.stats.Shortlisted}</td>
                  <td className="px-4 py-3 text-green-600">{dashboardData.stats.Accepted}</td>
                  <td className="px-4 py-3 text-red-600">{dashboardData.stats.Rejected}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Applications are categorized by campus type and status.
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
              onClick={() => navigate('/jobs')}
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
              onClick={() => navigate('/resume')}
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
              onClick={() => navigate('/applications')}
            >
              My Applications
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-[#667eea] text-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white"
              onClick={() => navigate('/interviews')}
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