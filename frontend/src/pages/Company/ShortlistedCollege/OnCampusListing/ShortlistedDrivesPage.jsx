import { useState, useEffect } from 'react';
import ShortlistedDrives from '@/components/company/ShortlistedCollege/OnCampusListing/ShortlistedDrives';
import { fetchShortlistedDrives, getMockDrives } from '../../../../constants/shortlist';

const ShortlistedDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 8
  });
  const [filters, setFilters] = useState({
    batchYear: '2025',
    location: 'All Locations',
    searchTerm: ''
  });

  useEffect(() => {
    loadDrives();
  }, [pagination.currentPage, filters]);

  const loadDrives = async () => {
    try {
      setLoading(true);

      let data;
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        data = getMockDrives({
          page: pagination.currentPage,
          batchYear: filters.batchYear,
          location: filters.location,
          search: filters.searchTerm,
          itemsPerPage: pagination.itemsPerPage
        });
      } else {
        data = await fetchShortlistedDrives({
          page: pagination.currentPage,
          batchYear: filters.batchYear,
          location: filters.location,
          search: filters.searchTerm,
          itemsPerPage: pagination.itemsPerPage
        });
      }

      setDrives(data.drives);
      setPagination(prev => ({
        ...prev,
        totalItems: data.totalItems
      }));
      setError(null);
    } catch (err) {
      setError('Failed to load drives. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6">
        <ShortlistedDrives 
          drives={drives}
          loading={loading}
          error={error}
          pagination={pagination}
          filters={filters}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default ShortlistedDrivesPage;
