import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Building2, 
  Users, 
  FileText, 
  Briefcase, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ExternalLink,
  User,
  DollarSign,
  ChevronRight
} from 'lucide-react';

const PoolCampusDetailPage = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMockDriveDetails = async () => {
      try {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 800)); // simulate delay

        setDrive({
          id: driveId,
          institute: 'ABC Institute Of Technology',
          date: 'April 25, 2025',
          location: 'Mumbai, India',
          proposedDates: 'May 13-14, 2025',
          status: 'Upcoming',
          contactPerson: 'Dr. Rajesh Kumar',
          email: 'rajesh.kumar@abc-institute.edu',
          phone: '+91 98765 43210',
          description:
            'Campus recruitment drive for engineering graduates in Computer Science, Electronics and Electrical Engineering.',
          positions: [
            { title: 'Software Engineer', openings: 15, ctc: '8-12 LPA' },
            { title: 'Data Analyst', openings: 8, ctc: '6-9 LPA' },
            { title: 'Product Manager', openings: 3, ctc: '12-16 LPA' }
          ],
          timeline: [
            { event: 'Application Deadline', date: 'April 30, 2025' },
            { event: 'Pre-Placement Talk', date: 'May 13, 2025, 10:00 AM' },
            { event: 'Aptitude Test', date: 'May 13, 2025, 2:00 PM' },
            { event: 'Technical Interviews', date: 'May 14, 2025, 9:00 AM' },
            { event: 'HR Interviews', date: 'May 14, 2025, 2:00 PM' },
            { event: 'Results', date: 'May 20, 2025' }
          ],
          totalApplications: 245,
          shortlisted: 45,
          interviewed: 32,
          offered: 15
        });

        setError(null);
      } catch (err) {
        console.error('Error loading mock drive:', err);
        setError('Failed to load mock drive details.');
      } finally {
        setLoading(false);
      }
    };

    loadMockDriveDetails();
  }, [driveId]);

  const handleBack = () => {
    navigate('/shortlisted/pool-campus-listings');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        <div className="container mx-auto px-4 py-8 pt-22">
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Drives
          </button>
          <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        <div className="container mx-auto px-4 py-8 pt-22">
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Drives
          </button>
          <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Drive Not Found</h3>
                <p className="text-sm text-yellow-700 mt-1">The requested drive could not be found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-22">
        {/* Main Container */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Drives
          </button>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl">
                <Building2 className="h-6 w-6 text-[#667eea]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  {drive.institute}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                    <Calendar className="h-3 w-3 mr-1.5" />
                    {drive.date}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {drive.location}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    drive.status === 'Completed'
                      ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200'
                      : drive.status === 'On-Going'
                      ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200'
                      : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {drive.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{drive.totalApplications}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Shortlisted</p>
                  <p className="text-2xl font-bold text-green-600">{drive.shortlisted}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interviewed</p>
                  <p className="text-2xl font-bold text-yellow-600">{drive.interviewed}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg">
                  <User className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Offers Made</p>
                  <p className="text-2xl font-bold text-purple-600">{drive.offered}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Drive Description */}
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#667eea]" />
                  Drive Overview
                </h3>
                <p className="text-gray-700 leading-relaxed">{drive.description}</p>
              </div>

              {/* Positions */}
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#667eea]" />
                  Open Positions
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Openings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">CTC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {drive.positions.map((position, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{position.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {position.openings}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-lg">
                              <DollarSign className="h-3 w-3" />
                              {position.ctc}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#667eea]" />
                  Drive Timeline
                </h3>
                <div className="relative">
                  {drive.timeline.map((item, index) => (
                    <div key={index} className="mb-8 flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full bg-[#667eea] w-3 h-3"></div>
                        {index < drive.timeline.length - 1 && (
                          <div className="h-full w-0.5 bg-[#667eea]/20"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium text-gray-900">{item.event}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Information */}
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium text-gray-900">{drive.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{drive.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                      <Phone className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{drive.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proposed Dates */}
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Proposed Dates</h3>
                <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Dates</p>
                      <p className="font-medium text-blue-700">{drive.proposedDates}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors font-medium">
                    Edit Drive Details
                    <ExternalLink size={16} />
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-black text-black py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors font-medium">
                    Cancel Drive
                    <XCircle size={16} />
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                    View Applications
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolCampusDetailPage;