import { useState, useEffect } from 'react';
import { MoreHorizontal, Calendar, List, Building2 } from 'lucide-react';

// Sample data - in a real app this would come from an API
const sampleInterviews = [
  {
    id: 1,
    candidate: {
      name: "John Smith",
      avatar: "/api/placeholder/150/150",
      role: "Frontend Developer",
      college: "MIT University"
    },
    type: "Online",
    date: "Apr 20, 2025 10:00 AM",
    status: "Scheduled"
  },
  {
    id: 2,
    candidate: {
      name: "Emily Johnson",
      avatar: "/api/placeholder/150/150",
      role: "UX Designer",
      college: "Stanford University"
    },
    type: "Onsite",
    date: "Apr 22, 2025 2:30 PM",
    status: "Pending"
  },
  {
    id: 3,
    candidate: {
      name: "Michael Chen",
      avatar: "/api/placeholder/150/150",
      role: "Backend Developer",
      college: "UC Berkeley"
    },
    type: "Online",
    date: "Apr 25, 2025 11:15 AM",
    status: "Confirmed"
  },
  {
    id: 4,
    candidate: {
      name: "Sarah Williams",
      avatar: "/api/placeholder/150/150",
      role: "Product Manager",
      college: "Harvard University"
    },
    type: "Online",
    date: "Apr 20, 2025 1:00 PM",
    status: "Scheduled"
  },
  {
    id: 5,
    candidate: {
      name: "David Kim",
      avatar: "/api/placeholder/150/150",
      role: "Frontend Developer",
      college: "Cornell University"
    },
    type: "Onsite",
    date: "Apr 20, 2025 3:30 PM",
    status: "Confirmed"
  }
];

export default function InterviewScheduler() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  // Default to today's date
  const [selectedDate, setSelectedDate] = useState('2025-04-20');
  const [jobRoleFilter, setJobRoleFilter] = useState('All Job Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        // In a real app, this would be a fetch call to your API
        // const response = await fetch('/api/interviews');
        // const data = await response.json();
        
        // Simulating API delay
        // Using the sample data directly for demonstration
        setTimeout(() => {
          console.log("Loading interviews:", sampleInterviews);
          setInterviews(sampleInterviews);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // For demonstration purposes, let's show all interviews by default
  // In a real app, you would implement proper date filtering
  const filteredInterviews = interviews.filter(interview => {
    // For demonstration, just check if the month and day match
    const interviewDate = interview.date.split(',')[0]; // "Apr 20"
    const dateToCheck = selectedDate === '2025-04-20' ? 'Apr 20' : selectedDate;
    
    const matchesDate = interviewDate.includes(dateToCheck) || dateToCheck === 'All Dates';
    const matchesRole = jobRoleFilter === 'All Job Roles' || interview.candidate.role === jobRoleFilter;
    const matchesStatus = statusFilter === 'All Status' || interview.status === statusFilter;
    
    // For demo purposes, show all interviews if we're using our default date
    if (selectedDate === '2025-04-20' && interview.date.includes('Apr 20, 2025')) {
      return matchesRole && matchesStatus;
    }
    
    return matchesDate && matchesRole && matchesStatus;
  });

  // Get unique job roles for filter dropdown
  const jobRoles = ['All Job Roles', ...new Set(interviews.map(interview => interview.candidate.role))];
  
  // Get unique statuses for filter dropdown
  const statuses = ['All Status', ...new Set(interviews.map(interview => interview.status))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section with Theme */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl mr-4">
                <Building2 className="h-6 w-6 text-[#667eea]" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Interview Scheduler
              </h1>
            </div>
            <button 
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Schedule Interview</span>
            </button>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl">
            Manage and schedule interviews with candidates. Filter by date, job role, or status to find specific interviews.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8">
          {/* Filters and View Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
            />
            
            <select 
              value={jobRoleFilter}
              onChange={(e) => setJobRoleFilter(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
            >
              {jobRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <div className="ml-auto flex gap-2">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 border border-gray-200 rounded-lg flex items-center justify-center ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-all duration-200`}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`p-3 border border-gray-200 rounded-lg flex items-center justify-center ${
                  viewMode === 'calendar' 
                    ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-all duration-200`}
              >
                <Calendar size={20} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
              <p className="mt-4 text-gray-600">Loading interviews...</p>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-[#667eea]" />
              </div>
              <p className="text-gray-600 text-lg">No interviews scheduled for the selected filters.</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or schedule a new interview.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredInterviews.map(interview => (
                <div key={interview.id} className="border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-[#667eea]">
                          {interview.candidate.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{interview.candidate.name}</h3>
                        <p className="text-gray-700 font-medium">{interview.candidate.role}</p>
                        <div className="mt-3">
                          <div className="text-sm text-gray-500 font-medium">College</div>
                          <div className="text-gray-800">{interview.candidate.college}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        interview.status === 'Confirmed' ? 'bg-green-100 text-green-800 border border-green-200' :
                        'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {interview.status}
                      </span>
                      <button className="ml-3 text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                        <MoreHorizontal size={24} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-500 font-medium mb-2">Interview Type</div>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
                          interview.type === 'Online' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {interview.type === 'Online' ? 'O' : 'S'}
                        </div>
                        <div className="text-gray-800 font-medium">{interview.type}</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-500 font-medium mb-2">Date & Time</div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-gray-800 font-medium">{interview.date}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                      Reschedule
                    </button>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200">
                      Join Meeting
                    </button>
                    <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}