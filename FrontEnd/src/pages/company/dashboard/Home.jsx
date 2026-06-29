import { useState, useEffect } from 'react'
import { Briefcase, FileText, CheckCircle, Clock, FileCheck2 } from "lucide-react";
import PageHeader from '@/components/dashboard/PageHeader'
import Button from '@/components/ui/Button'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
//import { getCompanyDashboardMetrics, getCompanyServiceRequestStatus, getShortlistedCandidates, getAcceptedCandidates ,getRegisteredColleges  } from '@/lib/Company_AxiosInstance'
import { getCompanyDashboardMetrics, getCompanyServiceRequestStatus, getShortlistedCandidates, getAcceptedCandidates, getRegisteredColleges, getPostedJobs } from '@/lib/Company_AxiosInstance'
import ActivationBlock from '@/components/dashboard/ActivationBlock'
// ADD this line after existing imports
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import axios from '../../../lib/axiosInstance';
import { getPoolCampusForCompany } from '@/lib/College_AxiosIntance';
function Home() {
  const onCampusColleges = [
  { name: 'IIT Delhi',        location: 'Delhi',      students: 200, streams: 'CSE, ECE',          timeline: 'April 2025',     note: 'Looking for top tech companies',       applied: true  },
  { name: 'VIT Vellore',      location: 'Tamil Nadu', students: 500, streams: 'CSE, IT, ECE, Mech', timeline: 'April-May 2025', note: 'Large batch, flexible on requirements', applied: true  },
  { name: 'RVCE Bangalore',   location: 'Bangalore',  students: 250, streams: 'CSE, ISE, ECE',      timeline: 'April 2025',     note: 'Preferred companies with good packages',applied: false },
];

const poolCampusColleges = [
  { name: 'NIT Trichy',       location: 'Tamil Nadu', students: 400, streams: 'CSE, ECE, EEE',      timeline: 'May 2025',       note: 'Strong placement record',              applied: false },
  { name: 'BITS Pilani',      location: 'Rajasthan',  students: 300, streams: 'CS, Mech, Chem',     timeline: 'May-June 2025',  note: 'Top-tier candidates available',        applied: true  },
];

const [collegeRequests, setCollegeRequests] = useState({
    onCampus: [],
    poolCampus: [],
    loading: true
  });
  
  const [appTab, setAppTab] = useState('On-Campus');
const [myApplications, setMyApplications] = useState({
  onCampus: [],
  poolCampus: [],
  loading: true
});

const [jobTab, setJobTab] = useState('On-campus');
const [tabJobs, setTabJobs] = useState({ 'On-campus': [], 'Pool-campus': [], 'Off-campus': [], 'Internship': [] });
const [tabJobsLoading, setTabJobsLoading] = useState(false);
const [company, setCompany] = useState(null);
useEffect(() => {
  const fetchTabJobs = async () => {
    setTabJobsLoading(true);
    try {
      const [onRes, poolRes, offRes, internRes] = await Promise.all([
        getPostedJobs('On-campus',   'Applied').catch(() => ({ data: [] })),
        getPostedJobs('Pool-campus', 'Applied').catch(() => ({ data: [] })),
        getPostedJobs('Off-campus',  'Applied').catch(() => ({ data: [] })),
        getPostedJobs('Internship',  'Applied').catch(() => ({ data: [] })),
      ]);

      // ADD THESE 4 LINES temporarily
      console.log('On-campus raw:', onRes);
      console.log('Pool-campus raw:', poolRes);
      console.log('Off-campus raw:', offRes);
      console.log('Internship raw:', internRes);

      const normalize = (res) =>
        Array.isArray(res?.data) ? res.data : res?.data?.jobs || [];

      setTabJobs({
        'On-campus':   normalize(onRes),
        'Pool-campus': normalize(poolRes),
        'Off-campus':  normalize(offRes),
        'Internship':  normalize(internRes),
      });
    } catch (err) {
      console.error('Failed to fetch tab jobs:', err);
    } finally {
      setTabJobsLoading(false);
    }
  };
  fetchTabJobs();
}, []);

useEffect(() => {
  const fetchCompany = async () => {
    try {
      const backendUrl = import.meta.env.VITE_Backend_URL;
      const userType = "company";
      const response = await axios.get(`${backendUrl}/api/companyDashboard/getInformation`, {
          withCredentials: true,
          headers: userType 
              ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
              : {}
      });
      const data = response.data?.data || response.data;

      setCompany(data);
      console.log('Company information:', data); 
    }catch (error) {
    console.error('Error fetching company information:', error);
  }
  } 
  fetchCompany()
}, [])
useEffect(() => {
  const fetchMyApplications = async () => {
    try {
      setMyApplications(prev => ({ ...prev, loading: true }));

      const [onCampusRes, poolCampusRes] = await Promise.all([
        getUserApplicationStatus("On-campus").catch(() => ({ data: { data: [] } })),
        getUserApplicationStatus("Pool-campus").catch(() => ({ data: { data: [] } }))
      ]);

      const mapJobs = (rawData) =>
        (rawData || [])
          .filter(item => item.jobDetails && item.collegeDetails)
          .map(item => ({
            id: item._id,
            collegeName:
              item.collegeDetails?.collegeUniversityDetails?.collegeName || 'College',
            collegeLogo: item.collegeDetails?.profileImage || null,
            location:
              Array.isArray(item.jobDetails?.location) && item.jobDetails.location.length > 0
                ? item.jobDetails.location[0]
                : item.jobDetails?.venue || 'N/A',
            degree:
              Array.isArray(item.jobDetails?.degree) && item.jobDetails.degree.length > 0
                ? item.jobDetails.degree.join(', ')
                : 'Various Streams',
            status: item.currentStatus || 'Applied',
          }));

      setMyApplications({
        onCampus: mapJobs(onCampusRes.data?.data),
        poolCampus: mapJobs(poolCampusRes.data?.data),
        loading: false
      });

    } catch (error) {
      console.error('Failed to fetch my applications:', error);
      setMyApplications(prev => ({ ...prev, loading: false }));
    }
  };

  fetchMyApplications();
}, []);
  const navigate = useNavigate()
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
  const fetchCollegeRequests = async () => {
    try {
      setCollegeRequests(prev => ({ ...prev, loading: true }));

      const [onCampusRes, poolCampusRes] = await Promise.all([
        getRegisteredColleges().catch(() => ({ data: { data: [] } })),
        getPoolCampusForCompany().catch(() => ({ data: { data: [] } }))
      ]);

      setCollegeRequests({
        onCampus: onCampusRes.data?.data || [],
        poolCampus: poolCampusRes.data?.data || [],
        loading: false
      });

    } catch (error) {
      console.error('Failed to fetch college requests:', error);
      setCollegeRequests(prev => ({ ...prev, loading: false }));
    }
  };

  fetchCollegeRequests();
}, []);
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Add this state at the top of your Home function
const [activeTab, setActiveTab] = useState('On-Campus');

  const fetchDashboardData = async () => {
  try {
    setDashboardData(prev => ({ ...prev, loading: true }))

    // Fetch data in parallel for better performance
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

      // Use the data from dashboard metrics API
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

      // Now fetch recent shortlisted and accepted candidates for display
      // Note: We need to fetch these separately since the dashboard API might not include candidate details
      let recentShortlisted = [];
      let recentAccepted = [];

      try {
        // Fetch shortlisted candidates for all types
        const shortlistedPromises = ['On-campus', 'Pool-campus', 'Off-campus'].map(async (type) => {
          const jobType = type.toLowerCase().replace('-campus', 'campus');
          try {
            const response = await getShorlistedCandidateByCompany('student', jobType);
            if (response.data?.success && Array.isArray(response.data.data)) {
              return response.data.data.map(candidate => ({
                ...candidate,
                jobType: type,
                category: type
              }));
            }
            return [];
          } catch (error) {
            console.warn(`Failed to fetch shortlisted for ${type}:`, error);
            return [];
          }
        });

        // Fetch accepted candidates for all types
        const acceptedPromises = ['On-campus', 'Pool-campus', 'Off-campus'].map(async (type) => {
          const jobType = type.toLowerCase().replace('-campus', 'campus');
          try {
            const response = await getAcceptedCandidateByCompany('student', jobType);
            if (response.data?.success && Array.isArray(response.data.data)) {
              return response.data.data.map(candidate => ({
                ...candidate,
                jobType: type,
                category: type
              }));
            }
            return [];
          } catch (error) {
            console.warn(`Failed to fetch accepted for ${type}:`, error);
            return [];
          }
        });

        // Execute all fetches in parallel
        const [shortlistedOnCampus, shortlistedPoolCampus, shortlistedOffCampus] = await Promise.all(shortlistedPromises);
        const [acceptedOnCampus, acceptedPoolCampus, acceptedOffCampus] = await Promise.all(acceptedPromises);

        // Combine all shortlisted and accepted candidates
        const allShortlisted = [
          ...shortlistedOnCampus,
          ...shortlistedPoolCampus,
          ...shortlistedOffCampus
        ];
        
        const allAccepted = [
          ...acceptedOnCampus,
          ...acceptedPoolCampus,
          ...acceptedOffCampus
        ];

        // Sort by date (assuming there's a createdAt or updatedAt field) and take first 3
        recentShortlisted = allShortlisted
          .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
          .slice(0, 3);

        recentAccepted = allAccepted
          .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
          .slice(0, 3);

      } catch (error) {
        console.warn('Failed to fetch candidate details:', error);
        // Continue without recent candidate data
      }

      // If the dashboard API doesn't provide categorized data, calculate from totals
      // This is a fallback - ideally the API should provide this
      const finalShortlistedByCategory = shortlistedByCategory;
      const finalAcceptedByCategory = acceptedByCategory;
      
      // If all categories are 0 but we have totals, distribute them
      // This is a temporary fix until the API provides proper categorized data
      const totalShortlistedFromCategories = Object.values(shortlistedByCategory).reduce((a, b) => a + b, 0);
      const totalAcceptedFromCategories = Object.values(acceptedByCategory).reduce((a, b) => a + b, 0);
      
      if (totalShortlistedFromCategories === 0 && totalShortlisted > 0) {
        // Distribute shortlisted count evenly (or based on applied distribution)
        const appliedTotal = Object.values(appliedByCategory).reduce((a, b) => a + b, 0);
        if (appliedTotal > 0) {
          Object.keys(finalShortlistedByCategory).forEach(category => {
            const proportion = appliedByCategory[category] / appliedTotal;
            finalShortlistedByCategory[category] = Math.round(totalShortlisted * proportion);
          });
        }
      }
      
      if (totalAcceptedFromCategories === 0 && totalAccepted > 0) {
        // Distribute accepted count evenly (or based on shortlisted distribution)
        const shortlistedTotal = totalShortlistedFromCategories > 0 ? totalShortlistedFromCategories : totalShortlisted;
        if (shortlistedTotal > 0) {
          Object.keys(finalAcceptedByCategory).forEach(category => {
            const proportion = finalShortlistedByCategory[category] / shortlistedTotal;
            finalAcceptedByCategory[category] = Math.round(totalAccepted * proportion);
          });
        }
      }
      const totalActiveJobs = metricsData.totalActiveJobs || 0;
      const totalOffers = metricsData.totalOffers || metricsData.totalAccepted || 0;

      setDashboardData({
        appliedByCategory,
        shortlistedByCategory: finalShortlistedByCategory,
        acceptedByCategory: finalAcceptedByCategory,
        rejectedByCategory,
        statusTotals,
        totalApplied,
        totalShortlisted,
        totalAccepted,
        totalRejected,
        serviceRequests: serviceRequestsData,
        recentShortlisted,
        recentAccepted,
        totalActiveJobs,
        totalOffers,
        interviewsToday: metricsData.interviewsToday || 0,
        totalScheduledInterviews: metricsData.totalScheduledInterviews || 0,
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
      </div>
    )
  }
  const companyName = company?.profile?.companyDetails?.companyName || "Company";
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Page Header with only search box */}
        <div className="mb-8 -mt-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex items-center justify-between py-6 px-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primaryBrand to-[#6C8BFF] bg-clip-text text-transparent">
                  Company Dashboard
                </h1>
              </div>
              <div className="w-full max-w-md">
                <div className="relative">
                </div>
              </div>
            </div>
          </div>
        </div>

       
<ActivationBlock
  greeting="Welcome back !"
  subtitle={companyName}
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
        { label: 'On Campus', path: '/hiring-channels/on-campus-hiring' },
        { label: 'Off Campus', path: '/hiring-channels/off-campus-hiring' },
        { label: 'Pool Campus', path: '/hiring-channels/pool-campus-hiring' },
        { label: 'Internship', path: '/hiring-channels/post-an-internship' }
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
        {false && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 auto-rows-fr gap-3 mb-8">
          {/* On-Campus Applications Card */}
          <div
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full aspect-video"
            onClick={() => navigate('/job-management/On-campus')}
          >
            {/* Bottom accent border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9333ea] to-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#9333ea]/10 via-transparent to-[#7c3aed]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            
            {/* Additional glow border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#9333ea]/20 rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col flex-grow">
              {/* Top row: Icon + Title + Button */}
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

              {/* Number section */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/10 via-transparent to-[#6d28d9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#6d28d9]/10 via-transparent to-[#5b21b6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#5b21b6]/10 via-transparent to-[#4c1d95]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
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

              {/* Status grid */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95]/10 via-transparent to-[#3b0764]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#3b0764]/10 via-transparent to-[#2d044e]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
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
        )}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

          {/* Active Jobs */}
          <div  onClick ={() => navigate('/job-management/On-campus')}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#7765DA]/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-[#7765DA]" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{dashboardData.totalActiveJobs || 0}</p>
                <p className="text-xs text-gray-500">Active Jobs</p>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div onClick ={() => navigate('/job-management/On-campus')}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#5767D0]/10 rounded-lg">
                <FileText className="w-5 h-5 text-[#5767D0]" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{dashboardData.totalApplied || 0}</p>
                <p className="text-xs text-gray-500">Applications</p>
              </div>
            </div>
          </div>

          {/* Shortlisted */}
          <div onClick ={() => navigate('/shortlisted/on-campus-listings')}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#4F0DCE]/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#4F0DCE]" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{dashboardData.totalShortlisted || 0}</p>
                <p className="text-xs text-gray-500">Shortlisted</p>
              </div>
            </div>
          </div>

          {/* Offers */}
          <div onClick ={() => navigate('/accepted/on-campus-listings')} 
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileCheck2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{dashboardData.totalOffers || 0}</p>
                <p className="text-xs text-gray-500">Accepted</p>
              </div>
            </div>
          </div>

          {/* Schedule Interviews */}
          <div className="flex items-center justify-center">
            <div
              onClick={() => navigate('/interviews')}
              className="group w-full h-full flex items-center justify-between
                border border-gray-200 text-[#143694]
                bg-white
                hover:bg-gradient-to-r hover:from-[#143694] hover:to-[#1e4ed8]
                hover:text-white hover:border-transparent
                transition-all duration-300 ease-in-out
                rounded-xl font-semibold tracking-wide
                shadow-sm hover:shadow-md p-4 cursor-pointer relative overflow-hidden"
            >
              {/* Left Content */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#143694]/10 rounded-lg group-hover:bg-white/20">
                  <Clock className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-xl font-bold group-hover:text-white">
                    {dashboardData.totalScheduledInterviews || 0}
                  </p>
                  <p className="text-xs opacity-80 group-hover:text-white">Appointments</p>
                </div>
              </div>

              {/* Hover Tooltip */}
              <div
                className="absolute bottom-0 left-0 right-0 text-center text-xs
                  bg-white text-[#143694]
                  py-1 rounded-t-lg
                  opacity-0 translate-y-full
                  group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-300"
              >
                Today: {dashboardData.interviewsToday || 0}
              </div>
            </div>
          </div>

        </div>

        {/* Rest of the dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         
         {/* College Hiring Requests */}

{/* College Hiring Requests */}
<div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
  {/* Header */}
  <div className="flex items-center gap-3 mb-5">
    <h2 className="text-lg font-semibold text-gray-900">College Hiring Requests</h2>
    <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
      {activeTab === 'On-Campus' ? collegeRequests.onCampus.length : collegeRequests.poolCampus.length}
    </span>
  </div>

  {/* Tabs */}
  <div className="flex gap-2 mb-5">
    {['On-Campus', 'Pool-Campus'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
          activeTab === tab ? 'bg-blue-900 text-white' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Vertical Stack Container */}
  <div className="grid grid-cols-1 gap-4">
    {(activeTab === 'On-Campus' ? collegeRequests.onCampus : collegeRequests.poolCampus)
      .filter((job) => {
              const deadline =
                job.endDate ||
                job.proposedSchedule?.endDate ||
                job.interviewWindow?.end;

              if (!deadline) return true; // keep if no deadline

              const daysLeft = Math.ceil(
                (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
              );

              return daysLeft > 0; //  remove closed jobs
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2) // Limits to 2 jobs
      .map((job, index) => {
        // Data Extraction based on your shared files
        const collegeData = job.collegePosted?.collegeUniversityDetails;
        const collegeName = collegeData?.collegeName || "Unknown Institution";
        const location = Array.isArray(job.location) ? job.location[0] : (job.location || "Location N/A");
        
        // Handling different field names between On-Campus and Pool-Campus files
        const studentCount = job.noOfplacedStudents || 0;
        const streams = activeTab === 'On-Campus' 
          ? (job.degree?.join(', ') || "Multiple Streams") 
          : (job.studentStreams?.join(', ') || "Multiple Streams");

        return (
          <div key={job._id || index} className="border border-gray-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#143694]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{collegeName}</h3>
                  <p className="text-xs text-gray-500">{location}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">
                Active Request
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-bold">{studentCount}</span> Students available
              </p>
              <p className="text-xs text-gray-500 line-clamp-1">
                <span className="font-medium">Streams:</span> {streams}
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  activeTab === 'On-Campus'
                    ? '/company-dashboard/On-campus'
                    : '/company-dashboard/Pool-campus',
                  {
                    state: {
                      openCollege: job,
                    },
                  }
                )
              }
              className="w-full py-2 bg-blue-900 text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition-colors"
            >
              View Details & Apply
            </button>
          </div>
        );
      })}

    {/* Fallback if no data */}
    {(activeTab === 'On-Campus' ? collegeRequests.onCampus : collegeRequests.poolCampus).length === 0 && (
      <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
        <p className="text-sm text-gray-500">No {activeTab} hiring requests available</p>
      </div>
    )}
  </div>

  {/* Footer Button */}
  <div className="mt-4">
    <button
      onClick={() => navigate(activeTab === 'On-Campus' ? '/company-dashboard/On-campus' : '/company-dashboard/Pool-campus')}
      className="w-full py-2.5 border border-[#143694] text-[#143694] text-sm font-semibold rounded-xl hover:bg-[#143694] hover:text-white transition-all"
    >
      See All {activeTab} Requests
    </button>
  </div>
</div>

          
{/* My College Applications */}
<div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
  {/* Header matching College Hiring Requests style */}
  <div className="flex items-center gap-3 mb-5">
    <h2 className="text-lg font-semibold text-gray-900">My Applications</h2>
    <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
      {appTab === 'On-Campus' ? myApplications.onCampus.length : myApplications.poolCampus.length}
    </span>
  </div>

  {/* Tabs matching the navigation style */}
  <div className="flex gap-2 mb-5">
    {['On-Campus', 'Pool-Campus'].map((tab) => (
      <button
        key={tab}
        onClick={() => setAppTab(tab)}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
          appTab === tab ? 'bg-blue-900 text-white' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Vertical Stack Container - Now using the Card layout of Hiring Requests */}
  <div className="grid grid-cols-1 gap-4">
    {myApplications.loading ? (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    ) : (appTab === 'On-Campus' ? myApplications.onCampus : myApplications.poolCampus)
        .slice(0, 2) // Keeping it to 2 items to match the hiring request vertical scale
        .map((job, index) => {
          return (
            <div 
              key={job.id || index} 
              className="border border-gray-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(appTab === 'On-Campus' ? '/company/application-status/oncampus' : '/company/application-status/poolcampus')}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#143694]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{job.collegeName}</h3>
                    <p className="text-xs text-gray-500">{job.location}</p>
                  </div>
                </div>
                {/* Status Badge styled like "Active Request" */}
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                  job.status === 'Accepted' ? 'bg-green-50 text-green-700' :
                  job.status === 'Shortlisted' ? 'bg-amber-50 text-amber-700' :
                  job.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-[#143694]'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-500">Degree:</span> <span className="font-bold">{job.degree}</span>
                </p>
              </div>

              <button
                className="w-full py-2 bg-blue-900 text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition-colors"
              >
                Track Application
              </button>
            </div>
          );
        })}

    {/* Empty state */}
    {!myApplications.loading && (appTab === 'On-Campus' ? myApplications.onCampus : myApplications.poolCampus).length === 0 && (
      <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
        <p className="text-sm text-gray-500">No {appTab} applications yet</p>
      </div>
    )}
  </div>

  {/* Footer Button matching the "See All Requests" style */}
  <div className="mt-4">
    <button
      onClick={() => navigate(appTab === 'On-Campus' ? '/company/application-status/oncampus' : '/company/application-status/poolcampus')}
      className="w-full py-2.5 border border-[#143694] text-[#143694] text-sm font-semibold rounded-xl hover:bg-[#143694] hover:text-white transition-all"
    >
      See All {appTab} Applications
    </button>
  </div>
</div>
        </div>

        
        {/* Rest of the dashboard */}
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
                  <span className="text-sm font-medium text-gray-700">Total Applications</span>
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


{/* Posted Jobs by Type */}
<div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
  {/* Header */}
  <div className="flex items-center justify-between mb-5">
    <h2 className="text-lg font-semibold text-gray-900">Posted Jobs</h2>
    <button
      onClick={() => navigate(
        jobTab === 'On-campus'   ? '/job-management/On-campus'   :
        jobTab === 'Pool-campus' ? '/job-management/Pool-campus' :
        jobTab === 'Off-campus'  ? '/job-management/Off-campus'  :
        '/job-management/Internship'
      )}
      className="text-sm text-[#143694] hover:text-[#1e4ed8] font-medium transition-colors"
    >
      See All →
    </button>
  </div>

  {/* Tab Buttons */}
  <div className="flex flex-wrap gap-2 mb-6">
    {[
      { label: 'On Campus',   value: 'On-campus'   },
      { label: 'Off Campus',  value: 'Off-campus'  },
      { label: 'Pool Campus', value: 'Pool-campus' },
      { label: 'Internship',  value: 'Internship'  },
    ].map(({ label, value }) => (
      <button
        key={value}
        onClick={() => setJobTab(value)}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
          jobTab === value
            ? 'bg-blue-900 text-white'
            : 'text-gray-500 hover:text-gray-700 border border-gray-200'
        }`}
      >
        {label}
        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
          jobTab === value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {tabJobs[value]?.length || 0}
        </span>
      </button>
    ))}
  </div>

  {/* Job Cards */}
  {tabJobsLoading ? (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
    </div>
  ) : tabJobs[jobTab]?.length === 0 ? (
    <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
      <p className="text-sm text-gray-500">No {jobTab} jobs posted yet</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tabJobs[jobTab].slice(0, 2).map((job, index) => {
        const roles = Array.isArray(job.jobRoles)
          ? job.jobRoles.join(', ')
          : job.jobRoles || job.lookingFor || 'N/A';

        const locationArr = Array.isArray(job.location) && job.location.length > 0
          ? job.location
          : Array.isArray(job.workLocation) && job.workLocation.length > 0
            ? job.workLocation
            : null;
        const location = locationArr ? locationArr[0] : 'N/A';

        const endDate = job.endDate
          ? new Date(job.endDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })
          : 'N/A';

        const mgmtPath =
          jobTab === 'On-campus'   ? '/job-management/On-campus'   :
          jobTab === 'Pool-campus' ? '/job-management/Pool-campus' :
          jobTab === 'Off-campus'  ? '/job-management/Off-campus'  :
          '/job-management/Internship';

        return (
          <div
            key={job._id || index}
            onClick={() => navigate(mgmtPath)}
            className="border border-gray-200 rounded-2xl p-5 bg-white hover:shadow-md hover:border-[#143694]/40 transition-all cursor-pointer group"
          >
            {/* Role + Badge */}
            <div className="flex items-start justify-between gap-2 mb-4">
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#143694] transition-colors line-clamp-2">
                {roles}
              </h3>
              <span className="text-[10px] font-bold text-[#143694] bg-[#143694]/10 px-2 py-1 rounded-md uppercase tracking-wider whitespace-nowrap flex-shrink-0">
                {jobTab === 'On-campus'   ? 'On Campus'   :
                 jobTab === 'Pool-campus' ? 'Pool Campus' :
                 jobTab === 'Off-campus'  ? 'Off Campus'  : 'Internship'}
              </span>
            </div>

            {/* Location + End Date */}
            <div className="flex flex-col gap-1.5 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="capitalize truncate">{location}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Closes {endDate}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  )}

  {/* Footer */}
  <div className="mt-5">
    <button
      onClick={() => navigate(
        jobTab === 'On-campus'   ? '/job-management/On-campus'   :
        jobTab === 'Pool-campus' ? '/job-management/Pool-campus' :
        jobTab === 'Off-campus'  ? '/job-management/Off-campus'  :
        '/job-management/Internship'
      )}
      className="w-full py-2.5 border border-[#143694] text-[#143694] text-sm font-semibold rounded-xl hover:bg-[#143694] hover:text-white transition-all"
    >
      See All {
        jobTab === 'On-campus'   ? 'On Campus'   :
        jobTab === 'Pool-campus' ? 'Pool Campus' :
        jobTab === 'Off-campus'  ? 'Off Campus'  : 'Internship'
      } Jobs
    </button>
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
              className="flex items-center justify-center 
           bg-gradient-to-r from-[#143694] to-[#1e4ed8] 
           text-white 
           rounded-xl font-semibold tracking-wide
           shadow-md 
           hover:shadow-lg hover:shadow-[#143694]/30
           hover:from-[#1e4ed8] hover:to-[#143694]
           transition-all duration-300 ease-in-out"
              onClick={() => navigate('/hiring-channels/on-campus-hiring')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Post On-Campus
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center 
           bg-gradient-to-r from-[#143694] to-[#1e4ed8] 
           text-white 
           rounded-xl font-semibold tracking-wide
           shadow-md 
           hover:shadow-lg hover:shadow-[#143694]/30
           hover:from-[#1e4ed8] hover:to-[#143694]
           transition-all duration-300 ease-in-out"
              onClick={() => navigate('/hiring-channels/pool-campus-hiring')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Post Pool-Campus
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-center 
           bg-gradient-to-r from-[#143694] to-[#1e4ed8] 
           text-white 
           rounded-xl font-semibold tracking-wide
           shadow-md 
           hover:shadow-lg hover:shadow-[#143694]/30
           hover:from-[#1e4ed8] hover:to-[#143694]
           transition-all duration-300 ease-in-out"
              onClick={() => navigate('/hiring-channels/off-campus-hiring')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Post Off-Campus
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full h-full flex items-center justify-center
             border-[#143694] text-[#143694]
             bg-[#143694]/5
             hover:bg-gradient-to-r hover:from-[#143694] hover:to-[#1e4ed8]
             hover:text-white hover:border-transparent
             transition-all duration-300 ease-in-out
             rounded-xl font-semibold tracking-wide
             shadow-sm hover:shadow-md"
              onClick={() => navigate('/job-management/On-campus')}
            >
              Manage Applications
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full h-full flex items-center justify-center
             border-[#143694] text-[#143694]
             bg-[#143694]/5
             hover:bg-gradient-to-r hover:from-[#143694] hover:to-[#1e4ed8]
             hover:text-white hover:border-transparent
             transition-all duration-300 ease-in-out
             rounded-xl font-semibold tracking-wide
             shadow-sm hover:shadow-md"
              onClick={() => navigate('/interviews')}
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