//import { useState, useEffect } from 'react';
//import { MoreHorizontal, Calendar, List } from 'lucide-react';
{/*
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

export default function EmployerInterviewScheduler() {
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
    <div className="min-h-screen bg-white">
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Interviews</h1>
        <button 
          className="bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <span>+</span>
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Filters and View Controls */}
      {/*<div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-md"
        />
        
        <select 
          value={jobRoleFilter}
          onChange={(e) => setJobRoleFilter(e.target.value)}
          className="p-2 border rounded-md bg-white"
        >
          {jobRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md bg-white"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        
        <div className="ml-auto flex gap-2">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 border rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`p-2 border rounded-md ${viewMode === 'calendar' ? 'bg-gray-200' : 'bg-white'}`}
          >
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading interviews...</p>
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No interviews scheduled for the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map(interview => (
            <div key={interview.id} className="border rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      src="/api/placeholder/48/48" 
                      alt={interview.candidate.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{interview.candidate.name}</h3>
                    <p className="text-gray-600">{interview.candidate.role}</p>
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">College</div>
                      <div>{interview.candidate.college}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    interview.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {interview.status}
                  </span>
                  <button className="ml-2 text-gray-500">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2">
                <div>
                  <div className="text-sm text-gray-500">Interview Type</div>
                  <div>{interview.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date & Time</div>
                  <div>{interview.date}</div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                  Reschedule
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                  Join Meeting
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}*/}

import { useState, useEffect } from 'react';
import { MoreHorizontal, Calendar, List, Building2 } from 'lucide-react';
import { getCompanyInterviews, getInterviews } from "../../../lib/interview_AxiosClient.js";
import { useAuth } from '@/context/AuthProvider';

export default function EmployerInterviewScheduler() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateSort, setDateSort] = useState("desc"); // default newest first
  
  const role = localStorage.getItem("selectedRole");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await getInterviews();
        setInterviews(res.data.data || []);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();

  }, []);

  const isCollegeView = role === "college";
  const isCompanyOrEmployer = role === "company" || role === "employer";

  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);

    return dateSort === "asc"
      ? dateA - dateB
      : dateB - dateA;
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
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
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8">
        <div className="flex justify-end mb-6">
        <select
          value={dateSort}
          onChange={(e) => setDateSort(e.target.value)}
          className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea]"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
              <p className="mt-4 text-gray-600">Loading interviews...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No interviews scheduled.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedInterviews.map(interview => {
                const formattedDateTime = `${interview.date} ${interview.time}`;
                console.log("Interview companyAuthId:", interview.companyAuthId);

                return (
                  
                  <div
                    key={interview._id}
                    className="border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-[#667eea]">
                            {interview.coordinator?.name?.charAt(0) || "C"}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-xl text-gray-900">
                            {isCompanyOrEmployer
                              ? interview.coordinator?.name
                              : interview.companySnapshot?.scheduledBy?.name}

                          </h3>
                          <p className="text-gray-700 font-medium">
                            {isCompanyOrEmployer
                              ? interview.coordinator?.designation
                              : interview.companySnapshot?.scheduledBy?.designation}
                          </p>
                          <div className="mt-3">
                            <div className="text-sm text-gray-500 font-medium">College</div>
                            <div className="text-gray-800">
                              {isCompanyOrEmployer
                                ? interview.coordinator?.collegeName
                                : interview.companySnapshot?.companyName}
                            </div>
                          </div>
                        </div>
                      </div>

                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {interview.status}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="text-sm text-gray-500 font-medium mb-2">Job Type</div>
                        <div className="text-gray-800 font-medium">
                          {interview.jobType}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="text-sm text-gray-500 font-medium mb-2">Date & Time</div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-gray-800 font-medium">
                            {formattedDateTime}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <a
                        href={interview.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium hover:shadow-lg"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
