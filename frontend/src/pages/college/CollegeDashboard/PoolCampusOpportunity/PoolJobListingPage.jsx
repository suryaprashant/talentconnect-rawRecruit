import React, { useState, useEffect } from 'react';
import JobFilters from '@/components/college/CollegeDashboard/PoolCampusOpportunity/JobFilters';
import JobCard from '@/components/college/CollegeDashboard/PoolCampusOpportunity/JobCard';
import { jobPostings } from '@/constants/collegedashboard/jobData';
import { MapPin } from 'lucide-react';

const PoolJobListingPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    streams: [],
    minPackage: 0,
    locations: [],
    role: '',
    upcomingDrivesOnly: false,
    tags: []
  });

  const [filteredJobs, setFilteredJobs] = useState(jobPostings);
  const [totalJobs, setTotalJobs] = useState(jobPostings.length);
  
  useEffect(() => {
    let result = jobPostings;
    
    if (filters.search) {
      result = result.filter(job => 
        job.companyName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.streams.length > 0) {
      result = result.filter(job => 
        filters.streams.some(stream => job.streams.includes(stream))
      );
    }
    
    if (filters.minPackage > 0) {
      result = result.filter(job => {
        const minPackage = parseFloat(job.package.split('-')[0]);
        return minPackage >= filters.minPackage;
      });
    }
    
    if (filters.locations.length > 0 && filters.locations[0] !== 'All Locations') {
      result = result.filter(job => 
        filters.locations.includes(job.location)
      );
    }
    
    if (filters.role) {
      result = result.filter(job => 
        job.position.toLowerCase().includes(filters.role.toLowerCase())
      );
    }
    
    if (filters.tags.length > 0) {
      result = result.filter(job => 
        filters.tags.some(tag => job.tags.includes(tag))
      );
    }
    
    setFilteredJobs(result);
    setTotalJobs(result.length);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTagFilter = (tag) => {
    if (filters.tags.includes(tag)) {
      handleFilterChange({ tags: filters.tags.filter(t => t !== tag) });
    } else {
      handleFilterChange({ tags: [...filters.tags, tag] });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      streams: [],
      minPackage: 0,
      locations: [],
      role: '',
      upcomingDrivesOnly: false,
      tags: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Companies Posting for Pool Campus Placements</h1>
        <p className="text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
        </p>
        
        <div className="flex gap-8">
          {/* Filters Section - Fixed width and position */}
          <div className="w-72 shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={clearAllFilters}
                  className="text-blue-600 text-sm hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
              
              {filters.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {filters.tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <span className="mr-1">Tag</span>
                      <span>{tag}</span>
                      <button 
                        onClick={() => handleTagFilter(tag)} 
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mb-4">Showing {totalJobs} of {jobPostings.length}</p>
              
              <JobFilters 
                filters={filters} 
                onChange={handleFilterChange} 
              />
            </div>
          </div>
          
          {/* Job Listings - Centered with max-width */}
          <div className="flex-1 max-w-5xl mx-auto">
            <div className="flex justify-end mb-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by</span>
                <select className="border rounded-md py-1 px-2 text-sm">
                  <option>Relevance</option>
                  <option>Date Posted</option>
                  <option>Package (High to Low)</option>
                  <option>Package (Low to High)</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            
            {filteredJobs.length > 0 && (
              <div className="mt-8 text-center">
                <button className="border border-gray-300 px-6 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                  View all
                </button>
              </div>
            )}
            
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolJobListingPage;