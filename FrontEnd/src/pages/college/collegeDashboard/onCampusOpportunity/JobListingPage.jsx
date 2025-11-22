import React, { useState, useEffect } from 'react';
// import { jobs } from '@/constants/collegeDashboard/jobs';
// import { initialFilterCategories } from '@/constants/collegeDashboard/filter';
import JobCard from '@/components/college/collegeDashboard/onCampusOpprtunity/JobCard';
import FilterSection from '@/components/college/collegeDashboard/FilterSection';
import { getCompanyPostingForOncampus } from '@/lib/College_AxiosIntance';
// import Header from '../components/Header';



const JobsListingPage = () => {
  //#region script side
  const [jobPosted, setjobPosted] = useState([]);
  const [filteredjobPosted, setFilteredjobPosted] = useState([]);
  const [filters, setFilters] = useState({
    workMode: [],
    degree: [],
    courses: [],
    employmentType: [],
    location: '',
    jobPosted: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getjobPosted = async () => {
      try {
        setIsLoading(true);
        const response = await getCompanyPostingForOncampus();
        console.log(response.data?.data || []);

        // Ensure we're accessing the correct data structure from the response
        const fetchedjobPosted = response.data?.data || []; // Adjusted to match backend response

        setjobPosted(fetchedjobPosted);
        setFilteredjobPosted(fetchedjobPosted);
      } catch (err) {
        setError('Failed to load jobPosted. Please try again later.');
        console.error('Error fetching jobPosted: ', err);
        setjobPosted([]);
        setFilteredjobPosted([]);
      } finally {
        setIsLoading(false);
      }
    };

    getjobPosted();
  }, []);

  useEffect(() => {
    if (!Array.isArray(jobPosted)) {
      setFilteredjobPosted([]);
      return;
    }

    let result = [...jobPosted];
    console.log(result);
    // Apply work mode filters
    if (filters.workMode.length > 0) {
      result = result.filter(workmode =>
        workmode.workModes && filters.workMode.some(mode => workmode.workModes.includes(mode))
      );
    }

    // Apply degree filters

    if (filters.courses && filters.courses.length > 0) {
      result = result.filter(college => {
        const degreeList = Array.isArray(college.degree)
          ? college.degree
          : college.degree
            ? [college.degree]
            : [];

        return filters.courses.some(course => {
          const normalizedCourse = course?.toLowerCase().replace(/[\s.\-]/g, "").trim();

          return degreeList.some(c => {
            const normalizedC = c?.toLowerCase().replace(/[\s.\-]/g, "").trim();
            return normalizedC === normalizedCourse;
          });
        });
      });
    }


    // Apply course filters
    if (filters.courses && filters.courses.length > 0) {
      result = result.filter(college => {
        const degreeList = Array.isArray(college.degree)
          ? college.degree
          : college.degree
            ? [college.degree]
            : []; // fallback to empty array if undefined

        return filters.courses.some(course => {
          const normalizedCourse = course?.toLowerCase().replace(/[\s.\-]/g, "").trim();

          return degreeList.some(c => {
            const normalizedC = c?.toLowerCase().replace(/[\s.\-]/g, "").trim();
            return normalizedC === normalizedCourse;
          });
        });
      });
    }


    // Apply employment type filter
    if (filters.employmentType && filters.employmentType.length > 0) {
      result = result.filter(emp =>
        emp.employmentType && Array.isArray(emp.employmentType) &&
        filters.employmentType.some(filterValue =>
          emp.employmentType.some(empType =>
            empType.toLowerCase() === filterValue.toLowerCase()
          )
        )
      );
    }

    // Apply location filter
    if (filters.location && filters.location !== 'Multi - Select') {
      result = result.filter(jobloc => {
        return Array.isArray(jobloc.location) &&
          jobloc.location.some(loc => loc.toLowerCase() === filters.location.toLowerCase());
      });
    }


    // Apply college name filter
    if (filters.college && filters.college !== 'Multi - Select') {
      result = result.filter(name => {
        const collegeName = name.collegePosted?.collegeUniversityDetails?.collegeName;
        return collegeName
          ? collegeName.toLowerCase().includes(filters.college.toLowerCase())
          : false;
      });
    }

    setFilteredjobPosted(result);
  }, [filters, jobPosted]);

  // Rest of your handler functions remain the same...
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        if (prev[filterType].includes(value)) {
          return {
            ...prev,
            [filterType]: prev[filterType].filter(item => item !== value)
          };
        } else {
          return {
            ...prev,
            [filterType]: [...prev[filterType], value]
          };
        }
      } else {
        return {
          ...prev,
          [filterType]: value
        };
      }
    });
  };

  const handleToggleFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const clearFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType]) ? [] : ''
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      workMode: [],
      degree: [],
      courses: [],
      location: '',
      college: '',
      employmentType: [],
    });
  };
  //#endregion

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
      <h1 className="text-2xl font-bold mb-2">Companies Posting for On-Campus Opportunities</h1>
      <p className="text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in arcu.</p>

      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* {filters.internship && (
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
          )} */}
        </div>

        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-4">Showing {filteredjobPosted.length} of {jobPosted.length}</span>
          <div className="relative">
            <select className="bg-white border border-gray-300 rounded py-1 px-3 appearance-none pr-8">
              <option>Sort by</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>A-Z</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-72 flex-shrink-0">
          <FilterSection
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilter={clearFilter}
            college={jobPosted}
          />
        </div>

        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredjobPosted.map(jobPosted => (
              <JobCard
                key={jobPosted._id || jobPosted.id}
                job={jobPosted}
              />
            ))}
          </div>

          {filteredjobPosted.length > 0 ? (
            <div className="mt-6 flex justify-center">
              <button className="border border-gray-300 rounded px-4 py-2 text-sm">
                View all
              </button>
            </div>
          ) : (
            <div className="mt-6 text-center text-red-500 font-medium">
              No jobs found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsListingPage;
