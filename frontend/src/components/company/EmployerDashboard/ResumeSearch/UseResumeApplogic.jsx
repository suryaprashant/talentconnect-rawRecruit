import { useEffect, useState } from 'react';
import { parseResume } from '@/constants/parser';
import { getProfileByResume } from '@/lib/Company_AxiosInstance';

const useResumeAppLogic = () => {
  const [view, setView] = useState('search');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    salary: '',
    search: '',
    jobStatus: {
      active: true,
      expired: true,
    },
    postedBy: {
      me: true,
      user2: false,
      user3: false,
      user4: false,
      user5: false,
    },
  });

   const [candidates, setCandidates] = useState([]);


  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newCandidates = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const parsedData = await parseResume(file);
        newCandidates.push(parsedData);
      } catch (error) {
        console.error('Error parsing resume:', error);
      }
    }

    setCandidates([...candidates, ...newCandidates]);
    setView('applications');
  };

  const handleSearch = async (searchParams) => {
    const results = await getProfileByResume(searchParams);
    setCandidates(results.results);
    setView('applications');
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const shortlistCandidate = (id) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id ? { ...candidate, shortlisted: true } : candidate
      )
    );
  };

  return {
    view,
    setView,
    candidates,
    filters,
    handleFileUpload,
    handleSearch,
    updateFilters,
    shortlistCandidate,
  };
};

export default useResumeAppLogic;
