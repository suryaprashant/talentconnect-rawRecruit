import { useEffect, useState } from 'react';
import { getCompanyCasestudiesWithRegistrations } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import CasestudyApplicantDetails from './CasestudyApplicantDetails';

const CasestudyRegistrations = () => {
  const [casestudies, setCasestudies] = useState([]);
  const [selectedCasestudy, setSelectedCasestudy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCasestudies = async () => {
    setIsLoading(true);
    try {
      const response = await getCompanyCasestudiesWithRegistrations();
      if (response?.data?.success) {
        setCasestudies(response.data.data);
      } else {
        toast.error('Failed to fetch case studies');
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCasestudies();
  }, []);

  const handleViewRegistrations = (casestudy) => {
    setSelectedCasestudy(casestudy);
  };

  const handleBack = () => {
    setSelectedCasestudy(null);
    fetchCasestudies(); // Refresh data when coming back
  };

  if (selectedCasestudy) {
    return (
      <CasestudyApplicantDetails 
        casestudy={selectedCasestudy} 
        onClose={handleBack} 
      />
    );
  }

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Case Study Registrations</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e4ed8]"></div>
          </div>
        ) : casestudies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No case studies found</div>
            <p className="text-gray-400 mt-2">You haven't hosted any case studies yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casestudies.map((casestudy) => (
              <div key={casestudy._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {casestudy.bannerImage && (
                  <img 
                    src={casestudy.bannerImage} 
                    alt={casestudy.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{casestudy.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{casestudy.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {new Date(casestudy.startDate).toLocaleDateString()} - {new Date(casestudy.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {casestudy.location}
                    </div>
                  </div>

                  {/* Registration Statistics */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Registration Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <span className="font-semibold ml-2">{casestudy.registrationCounts?.total || 0}</span>
                      </div>
                      <div>
                        <span className="text-yellow-600">Pending:</span>
                        <span className="font-semibold ml-2">{casestudy.registrationCounts?.pending || 0}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Confirmed:</span>
                        <span className="font-semibold ml-2">{casestudy.registrationCounts?.confirmed || 0}</span>
                      </div>
                      <div>
                        <span className="text-red-600">Rejected:</span>
                        <span className="font-semibold ml-2">{casestudy.registrationCounts?.rejected || 0}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewRegistrations(casestudy)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-[#143694] transition-colors font-medium"
                  >
                    View Registrations
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CasestudyRegistrations;
