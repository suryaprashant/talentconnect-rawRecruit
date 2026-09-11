import { createContext, useState, useContext, useEffect } from 'react';
import { getCollegePostedJobs } from '@/lib/College_AxiosIntance'; // Using the generic fetcher

const PoolApplicationContext = createContext();

export const usePoolApplications = () => useContext(PoolApplicationContext);

export const PoolApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'All Companies',
    role: 'All Role',
    searchQuery: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // Fetch Pool Campus applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // ERROR FIX: Explicitly asking for 'Pool-campus' jobs
        const response = await getCollegePostedJobs('Pool-campus');
        
        // Adjusting based on your API response structure (response.data.response or response.data.data)
        const jobsData = response?.data?.response || response?.data?.data || [];
        
        setApplications(jobsData);
        setFilteredApplications(jobsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  // Get current applications for pagination
  const getCurrentApplications = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredApplications?.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getTotalPages = () => Math.ceil(filteredApplications?.length / itemsPerPage);

  const getApplicationById = (id) => {
    return applications.find(app => (app._id || app.id) === id);
  };

  const value = {
    applications,
    filteredApplications,
    loading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    getCurrentApplications,
    getTotalPages,
    getApplicationById,
  };

  return (
    <PoolApplicationContext.Provider value={value}>
      {children}
    </PoolApplicationContext.Provider>
  );
};