
import { useState, useEffect, useMemo } from 'react'
import { Search, Calendar, Clock, Bookmark, MessageCircle } from 'lucide-react'
import { getShorlistedCandidateByCompany } from '@/lib/Company_AxiosInstance';

export default function JobListingPage() {
  // State variables
  const [allCandidates, setAllCandidates] = useState([]) // Stores the master list from the API
  const [filteredCandidates, setFilteredCandidates] = useState([]) // Stores the list to be displayed
  const [loading, setLoading] = useState(true) // For loading state
  const [error, setError] = useState(null) // For error handling

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState("")
  const [jobFilter, setJobFilter] = useState("All Job Titles")
  const [collegeFilter, setCollegeFilter] = useState("All Colleges")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [sortBy, setSortBy] = useState("Recent Activity")

  // 1. Fetch data from the API when the component mounts
  useEffect(() => {
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await getShorlistedCandidateByCompany("user", "Job-listing");
      const apiData = response.data?.response || [];

      const processed = apiData.map(item => ({
        _id: item._id,
        name: item.applicant?.name ?? "",
        position: item.jobTitle?.[0] ?? "N/A", 
        status: item.currentStatus,
        university: item.applicant?.university ?? "Unknown",
        gpa: item.applicant?.gpa ?? "N/A",
        lastActive: item.statusHistory?.length ? "recent" : "unknown",
        avatar: "/api/placeholder/60/60",
      }));

      setAllCandidates(processed);
      setFilteredCandidates(processed);
      setError(null);
    } catch (err) {
      setError("Failed to fetch candidates. Please try again later.");
      console.error("API Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchCandidates();
}, []);

  // 2. Derive filter options dynamically from the fetched data
  const jobTitles = useMemo(() => ["All Job Titles", ...new Set(allCandidates.map(c => c.position))], [allCandidates])
  const colleges = useMemo(() => ["All Colleges", ...new Set(allCandidates.map(c => c.university))], [allCandidates])
  // const statuses = useMemo(() => ["All Status", ...new Set(allCandidates.map(c => c.status))], [allCandidates])

  // 3. Filter and sort candidates whenever filters or the master list change
  useEffect(() => {
    let result = [...allCandidates]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(candidate =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply job title filter
    if (jobFilter !== "All Job Titles") {
      result = result.filter(candidate => candidate.position === jobFilter)
    }

    // Apply college filter
    if (collegeFilter !== "All Colleges") {
      result = result.filter(candidate => candidate.university === collegeFilter)
    }

    // Apply status filter
    // if (statusFilter !== "All Status") {
    //   result = result.filter(candidate => candidate.status === statusFilter)
    // }

    // Apply sorting
    if (sortBy === "Recent Activity") {
      result.sort((a, b) => {
        // NOTE: This sorting logic assumes a specific string format. 
        // For production, it's better if the API provides a real timestamp.
        const aTime = a.lastActive.includes("hour") ?
          parseInt(a.lastActive) :
          parseInt(a.lastActive) * 24
        const bTime = b.lastActive.includes("hour") ?
          parseInt(b.lastActive) :
          parseInt(b.lastActive) * 24
        return aTime - bTime
      })
    } else if (sortBy === "GPA") {
      result.sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa))
    }

    setFilteredCandidates(result)
  }, [searchQuery, jobFilter, collegeFilter, statusFilter, sortBy, allCandidates])

  // Action handlers (placeholders for real functionality)
  const handleChat = (candidate) => {
    console.log(`Opening chat with ${candidate.name}`)
  }

  const handleSchedule = (candidate) => {
    console.log(`Scheduling interview with ${candidate.name}`)
  }

  const handleViewResume = (candidate) => {
    console.log(`Viewing resume of ${candidate.name}`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Shortlisted Candidates</h1>
      <p className="text-gray-600 mb-8">
        View and manage your shortlisted candidates for open positions.
      </p>

      {/* Search and filters row */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search candidates..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter dropdowns */}
        <select
          className="border rounded-md px-4 py-2"
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
        >
          {jobTitles.map(job => (
            <option key={job} value={job}>{job}</option>
          ))}
        </select>

        <select
          className="border rounded-md px-4 py-2"
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
        >
          {colleges.map(college => (
            <option key={college} value={college}>{college}</option>
          ))}
        </select>

        {/* <select
          className="border rounded-md px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select> */}

        <select
          className="border rounded-md px-4 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Recent Activity">Sort by: Recent Activity</option>
          <option value="GPA">Sort by: GPA</option>
        </select>
      </div>

      {/* Conditional Rendering for Loading, Error, and Content */}
      {loading ? (
        <div className="text-center py-10">Loading candidates...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          {/* Candidates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map(candidate => (
              <div key={candidate._id} className="border rounded-lg p-6 shadow-sm">
                <div className="flex items-start mb-4">
                  <div className="relative w-16 h-16 mr-4">
                    <img
                      src={candidate.avatar || "/api/placeholder/60/60"}
                      alt={candidate.name}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{candidate.name}</h2>
                    <p className="text-gray-600">{candidate.position}</p>
                    <span className={`
                      text-sm px-2 py-1 rounded-full inline-block mt-1
                      ${candidate.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                        candidate.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'}
                    `}>
                      {candidate.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="flex items-center">
                    <Bookmark size={16} className="mr-1" />
                    {candidate.university} • CGPA: {candidate.gpa}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock size={16} className="mr-1" />
                  Last active: {candidate.lastActive}
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 border border-gray-300 py-2 rounded flex items-center justify-center"
                    onClick={() => handleViewResume(candidate)}
                  >
                    Resume
                  </button>
                  <button
                    className="flex-1 border border-gray-300 py-2 rounded flex items-center justify-center"
                    onClick={() => handleChat(candidate)}
                  >
                    <MessageCircle size={16} className="mr-1" />
                    Chat
                  </button>
                  <button
                    className={`
                      flex-1 py-2 rounded flex items-center justify-center
                      ${candidate.status === 'Interview Scheduled' ? 'bg-gray-800' : 'bg-black'}
                      text-white
                    `}
                    onClick={() => handleSchedule(candidate)}
                  >
                    <Calendar size={16} className="mr-1" />
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredCandidates.length === 0 && (
            <div className="text-center py-10 border rounded-lg mt-6">
              <p className="text-gray-500">No candidates match your current filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}