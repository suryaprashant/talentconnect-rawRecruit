import { useState, useEffect } from 'react'
import { Search, Calendar, Clock, Bookmark, MessageCircle } from 'lucide-react'
import { getAcceptedOffCampusCandidates } from '@/lib/Company_AxiosInstance'

// Initial candidates data
// const initialCandidates = [
//   {
//     id: 5,
//     name: "Priya Patel",
//     position: "Product Manager",
//     university: "Harvard",
//     gpa: "3.9",
//     status: "Offered",
//     lastActive: "12 hours ago",
//     avatar: "https://placehold.co/60x60",
//   },
// ]
export default function AcceptedOffCampusList() {

  // State variables
  const [candidates, setCandidates] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [jobFilter, setJobFilter] = useState("All Job Titles")
  const [collegeFilter, setCollegeFilter] = useState("All Colleges")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [sortBy, setSortBy] = useState("Recent Activity")
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);

  // Derived data for filters
  const jobTitles = ["All Job Titles", ...new Set(candidates?.map(c => c.job.title))]
  const colleges = ["All Colleges", ...new Set(candidates?.map(c => c.user.collegeName))]
  const statuses = ["All Status", ...new Set(candidates?.map(c => c.currentStatus))]

  const fetchAcceptedCandidates = async () => {
    try {
      setIsLoading(true);
      const details = await getAcceptedOffCampusCandidates("682cca73a402ab1c19d72bc4");
      // console.log(details);
      setCandidates(details.data);

      setError(null);
    } catch (err) {
      setError('Failed to load job details. Please try again later.');
      console.error('Error fetching job details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedCandidates();
  }, []);

  // Filter and sort candidates whenever filters change
  useEffect(() => {
    let filtered = [...candidates]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(candidate =>
        candidate.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.job.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply job title filter
    if (jobFilter !== "All Job Titles") {
      filtered = filtered.filter(candidate => candidate.job.title === jobFilter)
    }

    // Apply college filter
    if (collegeFilter !== "All Colleges") {
      filtered = filtered.filter(candidate => candidate.university === collegeFilter)
    }

    // Apply status filter
    if (statusFilter !== "All Status") {
      filtered = filtered.filter(candidate => candidate.status === statusFilter)
    }

    // Apply sorting
    if (sortBy === "Recent Activity") {
      filtered.sort((a, b) => {
        // Simple sorting by converting time strings to comparable values
        const aTime = a.lastActive.includes("hour") ?
          parseInt(a.lastActive) :
          parseInt(a.lastActive) * 24
        const bTime = b.lastActive.includes("hour") ?
          parseInt(b.lastActive) :
          parseInt(b.lastActive) * 24
        return aTime - bTime
      })
    } else if (sortBy === "GPA") {
      filtered.sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa))
    }

    setCandidates(filtered)
  }, [searchQuery, jobFilter, collegeFilter, statusFilter, sortBy])

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !candidates) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-4">
          <p className="text-xl font-semibold">{error || "Job not found"}</p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => fetchAcceptedCandidates()}
          >
            Try Again!
          </button>
        </div>
      </div>
    );
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

        <select
          className="border rounded-md px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          className="border rounded-md px-4 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Recent Activity">Sort by: Recent Activity</option>
          <option value="GPA">Sort by: GPA</option>
        </select>
      </div>

      {/* Candidates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map(candidate => (
          <div key={candidate._id} className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-start mb-4">
              {/* Avatar */}
              <div className="relative w-16 h-16 mr-4">
                <img
                  src="/api/placeholder/60/60"
                  alt={candidate.user.name}
                  className="rounded-full"
                />
              </div>

              {/* Name and position */}
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{candidate.user.name}</h2>
                <p className="text-gray-600">{candidate.job.title}</p>
                <span className={`
                  text-sm px-2 py-1 rounded-full inline-block mt-1
                  ${candidate.currentStatus === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                    candidate.currentStatus === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'}
                `}>
                  {candidate.currentStatus}
                </span>
              </div>
            </div>

            {/* University and GPA */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <Bookmark size={16} className="mr-1" />
                {candidate.user.collegeName} • CGPA: {candidate.user.cgpa}
              </span>
            </div>

            {/* Last active */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Clock size={16} className="mr-1" />
              Last active: {candidate.lastActive}
            </div>

            {/* Action buttons */}
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
      {candidates.length === 0 && (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">No candidates match your current filters.</p>
        </div>
      )}
    </div>
  )
}