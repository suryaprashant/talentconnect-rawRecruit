import { useState, useEffect } from 'react';
import FilterSection from '@/components/company/employerDashboard/FilterSection';
import PoolCollegeCard from '@/components/company/employerDashboard/poolCampus/PoolCollegeCard';
import { getPoolCampusForCompany } from '../../../../lib/College_AxiosIntance';

const PoolEmployeeListing = () => {
    const [postings, setPostings] = useState([]);
    const [filteredPostings, setFilteredPostings] = useState([]);
    const [filters, setFilters] = useState({
        workMode: [],
        degree: [],
        courses: [], 
        location: '',
        college: '', 
        internship: false,
        fullTime: false
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

   
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getPoolCampusForCompany();
                
               
                const fetchedPostings = response.data?.data || [];
                
                setPostings(fetchedPostings);
                setFilteredPostings(fetchedPostings);
            } catch (err) {
                setError('Failed to load postings. Please try again later.');
                console.error("Error fetching pool campus data:", err);
                setPostings([]);
                setFilteredPostings([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
       
        if (!Array.isArray(postings)) {
            setFilteredPostings([]);
            return;
        }

        let result = [...postings];

        
        if (filters.workMode.length > 0) {
            result = result.filter(posting => filters.workMode.includes(posting.workMode));
        }

     
        if (filters.degree.length > 0) {
            result = result.filter(posting =>
                posting.degree && filters.degree.some(deg => posting.degree.includes(deg))
            );
        }

     
        if (filters.courses.length > 0) {
            result = result.filter(posting =>
                posting.studentStreams && filters.courses.some(course => posting.studentStreams.includes(course))
            );
        }

    
        if (filters.internship && !filters.fullTime) {
            result = result.filter(posting => ['Internship', 'Both'].includes(posting.lookingFor));
        }
        if (filters.fullTime && !filters.internship) {
            result = result.filter(posting => ['Job', 'Both'].includes(posting.lookingFor));
        }

        if (filters.location && filters.location !== 'Multi - Select') {
            result = result.filter(posting => posting.location && posting.location.includes(filters.location));
        }

    
        if (filters.college && filters.college.trim() !== '') {
            result = result.filter(posting =>
                posting.collegePosted?.collegeUniversityDetails?.collegeName
                .toLowerCase()
                .includes(filters.college.toLowerCase())
            );
        }

        setFilteredPostings(result);
    }, [filters, postings]);

    
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            if (Array.isArray(prev[filterType])) {
                const newArray = prev[filterType].includes(value) ?
                    prev[filterType].filter(item => item !== value) :
                    [...prev[filterType], value];
                return { ...prev, [filterType]: newArray };
            } else {
                return { ...prev, [filterType]: value };
            }
        });
    };

    const handleToggleFilter = (filterType) => {
        setFilters(prev => ({ ...prev, [filterType]: !prev[filterType] }));
    };
    
    const clearAllFilters = () => {
        setFilters({
            workMode: [], degree: [], courses: [],
            location: '', college: '', internship: false, fullTime: false
        });
    };

    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-center p-4">
                    <p className="text-xl font-semibold">{error}</p>
                    <button
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-2">Colleges Posting for Pool-Campus</h1>
            <p className="text-gray-600 mb-6">Explore pool-campus drives posted by various colleges.</p>

            <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex flex-wrap items-center gap-2">
                    {filters.internship && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                            Internship
                            <button onClick={() => handleToggleFilter('internship')} className="ml-2 text-gray-500">×</button>
                        </span>
                    )}
                    {filters.fullTime && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                            Full-time
                            <button onClick={() => handleToggleFilter('fullTime')} className="ml-2 text-gray-500">×</button>
                        </span>
                    )}
                    {(filters.internship || filters.fullTime) && (
                        <button onClick={clearAllFilters} className="text-sm text-gray-600 ml-2">Clear all</button>
                    )}
                </div>
                <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-4">Showing {filteredPostings.length} of {postings.length} results</span>
                    
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-72 flex-shrink-0">
                    <FilterSection
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilter={(type) => handleFilterChange(type, Array.isArray(filters[type]) ? [] : '')}
                    />
                </div>
                <div className="flex-grow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPostings.map(posting => (
                            <PoolCollegeCard
                                key={posting._id || posting.id}
                                college={posting} 
                            />
                        ))}
                    </div>
                    {filteredPostings.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <button className="border border-gray-300 rounded px-4 py-2 text-sm">View all</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PoolEmployeeListing;